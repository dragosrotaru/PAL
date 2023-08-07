export enum Type {
  Open = "Open",
  Close = "Close",
  AST = "AST",
}

export interface Generic<T extends Type> {
  type: T;
}

export interface Open extends Generic<Type.Open> {
  id: string;
}

export interface Close extends Generic<Type.Close> {
  id: string;
}

export interface AST extends Generic<Type.AST> {
  ast: string;
}

export type Message = Open | Close | AST;
