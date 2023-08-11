import { type AST } from "./languages/ast.js";
import { type Identifier } from "./languages/pal/ast.js";

export type IObserver<V> = (v: V) => undefined;
export type IUnsubscribe = () => undefined;

export interface IEnv {
  map: Map<Identifier, AST>;
  getAll: () => [Identifier, AST][];
  subscribe: <V extends AST>(
    id: Identifier,
    observer: IObserver<V>
  ) => IUnsubscribe;
  unsubscribe: (id: Identifier, observer: IObserver<AST>) => undefined;
  extend: () => IEnv;
}

export interface INameSpace {}

export interface IPermanenceProvider {}

export interface ILanguage<AST> {
  parse: (input: string) => AST;
  write: (ast: AST) => string;
}

export type ILogger = (...args: any) => void;
