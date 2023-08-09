import { ASTEquals, type Identifier, type PAL } from "../languages/pal/ast.js";
import { log } from "../logger.js";

type Observer<V> = (ast: V) => void;
type Unsubscribe = () => void;

// TODO monitor for memory leaks

export function Constructor(prevMap?: Map<Identifier, PAL>) {
  const map: Map<Identifier, PAL> = new Map<Identifier, PAL>(prevMap);
  const observers: Map<Identifier, Observer<PAL>[]> = new Map<
    Identifier,
    Observer<PAL>[]
  >();

  const unsubscribe = (key: Identifier, observer: Observer<PAL>): void => {
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
            }
            if (prop === "delete") {
              const [key] = args;
              log("env", "deleting key", key);
              Reflect.apply(value, target, args);
              if (observers.has(key)) {
                log("env", "dispatching to observers");
                observers.get(key)?.forEach((observer) => observer(undefined));
              }
              return;
            }

            return Reflect.apply(value, target, args);
          };
        } else {
          return value;
        }
      },
    }),
    getAll: (): Array<[Identifier, PAL]> => {
      log("env", "getting all");
      const list: Array<[Identifier, PAL]> = [];
      map.forEach((value, key) => {
        list.push([key, value]);
      });
      return list;
    },
    subscribe: (key: Identifier, observer: Observer<PAL>): Unsubscribe => {
      log("env", "subscribing", key);
      if (!observers.has(key)) {
        observers.set(key, []);
      }
      log("env", "number observed keys", observers.size);
      observers.get(key)?.push(observer);
      // Return the unsubscribe function for this observer
      return () => unsubscribe(key, observer);
    },
    unsubscribe,
  };
}

export type Env = ReturnType<typeof Constructor>;
