import { log } from "../logger.js";
import { ASTEquals, type AST, type Identifier } from "./ast.js";

type Observer<V> = (ast: V) => void;
type Unsubscribe = () => void;

// TODO monitor for memory leaks

export function Constructor<K extends Identifier, V extends AST>(
  prevMap?: Map<K, V>
) {
  const map: Map<K, V> = new Map<K, V>(prevMap);
  const observers: Map<K, Observer<V>[]> = new Map<K, Observer<V>[]>();

  const unsubscribe = (key: K, observer: Observer<V>): void => {
    log("env", "unsubscribing", key);
    const observersForKey = observers.get(key);
    if (observersForKey) {
      const filteredObservers = observersForKey.filter(
        (obs) => obs !== observer
      );
      if (filteredObservers.length > 0) {
        observers.set(
          key,
          observersForKey.filter((obs) => obs !== observer)
        );
      } else {
        observers.delete(key);
      }
    }
    log("env", "number of observed keys", observers.size);
  };

  return {
    map: new Proxy(map, {
      get: function (target, prop: string, receiver) {
        const value = Reflect.get(target, prop, receiver);
        if (typeof value === "function") {
          return function (...args: any[]) {
            if (prop === "set") {
              const [key, val] = args;
              const oldValue = target.get(key);
              log("env", "setting key", key);
              log("env", "number keys", map.size);
              log("env", "old", oldValue);
              log("env", "new", val);
              log("env", "compare", ASTEquals(oldValue, val));
              if (!ASTEquals(oldValue, val)) {
                Reflect.apply(value, target, args);
                if (observers.has(key)) {
                  log("env", "dispatching to observers");
                  observers.get(key)?.forEach((observer) => observer(val));
                }
              }
              return;
            } else {
              return Reflect.apply(value, target, args);
            }
          };
        } else {
          return value;
        }
      },
    }),
    getAll: (): Array<[K, V]> => {
      log("env", "getting all");
      const list: Array<[K, V]> = [];
      map.forEach((value, key) => {
        list.push([key, value]);
      });
      return list;
    },
    subscribe: (key: K, observer: Observer<V>): Unsubscribe => {
      log("env", "subscribing", key);
      log("env", "number observed keys", observers.size);
      if (!observers.has(key)) {
        observers.set(key, []);
      }
      observers.get(key)?.push(observer);
      // Return the unsubscribe function for this observer
      return () => unsubscribe(key, observer);
    },
    unsubscribe,
  };
}

export type Env = ReturnType<typeof Constructor>;
