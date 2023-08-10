export type IObserver<V> = (v: V) => undefined;
export type IUnsubscribe = () => undefined;

export interface IEnv<Identifier, Value> {
  map: Map<Identifier, Value>;
  getAll: () => [Identifier, Value][];
  subscribe: <V extends Value>(
    id: Identifier,
    observer: IObserver<V>
  ) => IUnsubscribe;
  unsubscribe: (id: Identifier, observer: IObserver<Value>) => undefined;
}

export interface INameSpace {}

export interface IPermanenceProvider {}

export interface ILanguage<AST> {
  parse: (input: string) => AST;
  write: (ast: AST) => string;
}

export type ILogger = (...args: any) => void;
