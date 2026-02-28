/**
 * WebSocket message protocol between server and browser client.
 * Open/Close subscribe/unsubscribe to an env key by ID string.
 * Exec sends PAL code to be evaluated server-side. AST carries the serialized AST string.
 * @author claude
 */
export type Message = Open | Close | Exec | AST;

export enum Type {
  Open = "Open",
  Close = "Close",
  Exec = "Exec",
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

export interface Exec extends Generic<Type.Exec> {
  code: string;
}

export interface AST extends Generic<Type.AST> {
  ast: string;
}
