import type { IEnv, IObserver, IUnsubscribe } from "../interfaces.js";
import type { Lang } from "../language/ast.js";
import { type TypeSystem } from "../language/typesystem.js";
import { log } from "../libraries/logger/index.js";

export const NEW_ID = Symbol.for("env/new");
export type NewObservableForm = [Lang.ID, Lang.AST];

export const SET_ID = Symbol.for("env/set");
export type SetForm = [typeof SET_ID, Lang.ID, Lang.AST];

export const DELETE_ID = Symbol.for("env/del");
export type DeleteForm = [typeof DELETE_ID, Lang.ID];

export const SUBSCRIBE_ID = Symbol.for("env/sub");
export type SubscribeForm = [typeof SUBSCRIBE_ID, Lang.ID, IObserver<Lang.AST>];

export const UNSUBSCRIBE_ID = Symbol.for("env/unsub");
export type UnubscribeForm = [
  typeof UNSUBSCRIBE_ID,
  Lang.ID,
  IObserver<Lang.AST>
];

export const GETALL_ID = Symbol.for("env");
export type GetAllForm = typeof GETALL_ID;

// TODO monitor for memory leaks

export class Env implements IEnv {
  public map: Map<Lang.ID, Lang.AST>;
  private observers = new Map<Lang.ID, IObserver<any>[]>();

  constructor(public ts: TypeSystem, prevMap?: Map<Lang.ID, Lang.AST>) {
    const map = new Map<Lang.ID, Lang.AST>(prevMap);
    this.map = new Proxy(map, {
      get: this.proxyGet,
    });
    // this.bootstrap();
  }

  private proxyGet = (
    target: Map<Lang.ID, Lang.AST>,
    prop: string,
    receiver: any
  ) => {
    const value = Reflect.get(target, prop, receiver);
    if (typeof value === "function") {
      return (...args: any[]) => {
        if (prop === "set") {
          const [key, val] = args;

          // notify subscribers to env/new
          if (!target.has(key)) {
            this.observers
              .get(NEW_ID)
              ?.forEach((observer) => observer([key, val]));
          }

          // notify subscribers to env/set
          this.observers
            .get(SET_ID)
            ?.forEach((observer) => observer([key, val]));

          const oldValue = target.get(key);

          log("env", "setting key", key);
          log("env", "old", oldValue);
          log("env", "new", val);
          log("env", "compare", this.ts.valueEquals(oldValue, val));

          if (!this.ts.valueEquals(oldValue, val)) {
            Reflect.apply(value, target, args);
            if (this.observers.has(key)) {
              log("env", "dispatching to observers");
              this.observers.get(key)?.forEach((observer) => observer(val));
            }
          }
          return;
        }
        if (prop === "delete") {
          // notify subscribers to env/del
          this.observers.get(DELETE_ID)?.forEach((observer) => observer(key));

          const [key] = args;
          log("env", "deleting key", key);
          Reflect.apply(value, target, args);
          if (this.observers.has(key)) {
            log("env", "dispatching to observers");
            this.observers.get(key)?.forEach((observer) => observer(undefined));
          }
          return;
        }
        return Reflect.apply(value, target, args);
      };
    } else {
      return value;
    }
  };

  /* private bootstrap = () => {
    type SetForm = [typeof SET_ID, Lang.ID, Lang.AST];
    const set = (ast: SetForm) => {
      this.map.set(ast[1], ast[2]);
      return undefined;
    };
    const IsSet = (ast: Lang.AST): ast is SetForm =>
      STATIC.IsList(ast) &&
      ast.length === 3 &&
      STATIC.IsID(ast[0]) &&
      ast[0] === SET_ID &&
      STATIC.IsID(ast[1]);

    type DeleteForm = [typeof DELETE_ID, Lang.ID];

    const IsDelete = (ast: Lang.AST): ast is DeleteForm =>
      STATIC.IsIDList(ast) && ast.length === 2 && ast[0] === DELETE_ID;

    // add checking somewhere
    this.map.set(NEW_ID, set);
    this.map.set(SET_ID, set);
    this.map.set(DELETE_ID, (ast: [typeof DELETE_ID, Lang.ID]) =>
      this.map.delete(ast[1])
    );
    this.map.set(GETALL_ID, (ast: typeof GETALL_ID) => this.getAll());
  };
 */
  public new = (id: Lang.ID, value: Lang.AST) => {
    this.map.set(id, value);
  };
  public get = (id: Lang.ID): Lang.AST => {
    return this.map.get(id);
  };
  public set = (id: Lang.ID, value: Lang.AST): true => {
    this.map.set(id, value);
    return true;
  };
  public has = (id: Lang.ID): boolean => {
    return this.map.has(id);
  };

  public getAll = (): Array<[Lang.ID, Lang.AST]> => {
    log("env", "getting all");
    const list: Array<[Lang.ID, Lang.AST]> = [];
    this.map.forEach((value, key) => list.push([key, value]));

    // notify subscribers to env/getAll
    this.observers.get(GETALL_ID)?.forEach((obs) => obs(list));
    return list;
  };

  public subscribe = <V extends Lang.AST>(
    key: Lang.ID,
    observer: IObserver<V>
  ): IUnsubscribe => {
    log("env", "subscribing", key);

    // notify subscribers to env/sub
    this.observers.get(SUBSCRIBE_ID)?.forEach((obs) => obs([key, observer]));

    if (!this.observers.has(key)) this.observers.set(key, []);
    log("env", "number observed keys", this.observers.size);

    this.observers.get(key)?.push(observer);

    // Return the unsubscribe function for this observer
    return () => this.unsubscribe(key, observer);
  };

  public unsubscribe = <V extends Lang.AST>(
    key: Lang.ID,
    observer: IObserver<V>
  ): undefined => {
    log("env", "unsubscribing", key);

    // notify subscribers to env/unsub
    this.observers.get(UNSUBSCRIBE_ID)?.forEach((obs) => obs([key, observer]));

    const observersForKey = this.observers.get(key);

    if (observersForKey) {
      const filteredObservers = observersForKey.filter(
        (obs) => obs !== observer
      );
      if (filteredObservers.length > 0) {
        this.observers.set(
          key,
          observersForKey.filter((obs) => obs !== observer)
        );
      } else {
        this.observers.delete(key);
      }
    }

    log("env", "number of observed keys", this.observers.size);

    return undefined;
  };

  extend = (): IEnv => {
    return new Env(this.ts, this.map);
  };
}
