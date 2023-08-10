import { compile } from "../filesystem/index.js";
import { ASTEquals, type Identifier, type PAL } from "../languages/pal/ast.js";
import { log } from "../logger.js";

type Observer<V extends PAL> = (ast: V) => undefined;
export type Unsubscribe = () => undefined;

export const NewID = Symbol.for("env/new");
export type NewObservableForm = [Identifier, PAL];

export const SetID = Symbol.for("env/set");
export type SetForm = [typeof SetID, Identifier, PAL];

export const DeleteID = Symbol.for("env/del");
export type DeleteForm = [typeof DeleteID, Identifier];

export const SubscribeID = Symbol.for("env/sub");
export type SubscribeForm = [typeof SubscribeID, Identifier, Observer<PAL>];

export const UnsubscribeID = Symbol.for("env/unsub");
export type UnubscribeForm = [typeof UnsubscribeID, Identifier, Observer<PAL>];

export const GetAllID = Symbol.for("env");
export type GetAllForm = typeof GetAllID;

// TODO monitor for memory leaks

export class Env {
  public map: Map<Identifier, PAL>;
  private observers = new Map<Identifier, Observer<any>[]>();

  constructor(prevMap?: Map<Identifier, PAL>) {
    const map = new Map<Identifier, PAL>(prevMap);
    this.map = new Proxy(map, {
      get: this.proxyGet,
    });
  }

  private proxyGet = (
    target: Map<Identifier, PAL>,
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
              .get(NewID)
              ?.forEach((observer) => observer([key, val]));
          }

          // notify subscribers to env/set
          this.observers
            .get(SetID)
            ?.forEach((observer) => observer([key, val]));

          const oldValue = target.get(key);

          log("env", "setting key", key);
          log("env", "old", oldValue);
          log("env", "new", val);
          log("env", "compare", ASTEquals(oldValue, val));

          if (!ASTEquals(oldValue, val)) {
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
          this.observers.get(DeleteID)?.forEach((observer) => observer(key));

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
  /* 
  private bootstrap = () => {
    const set = (env: Env) => (ast: SetForm) => {
      env.map.set(ast[1], ast[2]);
      return undefined;
    };
    this.map.set(NewID, set);
    this.map.set(SetID, set);
    this.map.set(
      DeleteID,
      (env: Env) => (ast: DeleteForm) => env.map.delete(ast[1])
    );
    this.map.set(GetAllID, (env: Env) => (ast: PAL) => this.getAll());
  }; */

  public getAll = (): Array<[Identifier, PAL]> => {
    log("env", "getting all");
    const list: Array<[Identifier, PAL]> = [];
    this.map.forEach((value, key) => list.push([key, value]));

    // notify subscribers to env/getAll
    this.observers.get(GetAllID)?.forEach((obs) => obs(list));
    return list;
  };

  public subscribe = <V extends PAL>(
    key: Identifier,
    observer: Observer<V>
  ): Unsubscribe => {
    log("env", "subscribing", key);

    // notify subscribers to env/sub
    this.observers
      .get(SubscribeID)
      ?.forEach((obs) => obs([key, (env: Env) => observer]));

    if (!this.observers.has(key)) this.observers.set(key, []);
    log("env", "number observed keys", this.observers.size);

    this.observers.get(key)?.push(observer);

    // Return the unsubscribe function for this observer
    return () => this.unsubscribe(key, observer);
  };

  public unsubscribe = <V extends PAL>(
    key: Identifier,
    observer: Observer<V>
  ): undefined => {
    log("env", "unsubscribing", key);

    // notify subscribers to env/unsub
    this.observers
      .get(UnsubscribeID)
      ?.forEach((obs) => obs([key, (env: Env) => observer]));

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
}

export const env = compile();
