import { AST, compareAST } from "./ast.js";

type Observer<V> = (value: V) => void;
type Unsubscribe = () => void;

export function Constructor<K extends symbol, V extends AST>() {
  const map: Map<K, V> = new Map<K, V>();
  const observers: Map<K, Observer<V>[]> = new Map<K, Observer<V>[]>();

  const unsubscribe = (key: K, observer: Observer<V>): void => {
    const observersForKey = observers.get(key);
    if (observersForKey) {
      observers.set(
        key,
        observersForKey.filter((obs) => obs !== observer)
      );
    }
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
              console.log("Old Value", oldValue);
              console.log("Value", val);
              console.log("compare", oldValue !== val);
              if (!compareAST(oldValue, val)) {
                Reflect.apply(value, target, args);
                if (observers.has(key)) {
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
      const list: Array<[K, V]> = [];
      map.forEach((value, key) => {
        list.push([key, value]);
      });
      return list;
    },
    subscribe: (key: K, observer: Observer<V>): Unsubscribe => {
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
