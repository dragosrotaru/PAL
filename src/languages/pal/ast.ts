// Native Types

import { type Env } from "../../language-core/environment.js";

export type PAL =
  | Identifier
  | Procedure
  | List
  | string
  | number
  | boolean
  | null
  | undefined;
export type List = PAL[];
export type Identifier = symbol;

export type SyncProcedure = (env: Env) => (...ast: PAL[]) => PAL;
export type AsyncProcedure = (env: Env) => (...ast: PAL[]) => Promise<PAL>;
export type Procedure = SyncProcedure | AsyncProcedure;

export const IsString = (ast: PAL): ast is string => typeof ast === "string";
export const IsIdentifier = (ast: PAL): ast is Identifier =>
  typeof ast === "symbol";
export const IsList = (ast: PAL): ast is List => Array.isArray(ast);

export const IsUndefined = (ast: PAL): ast is undefined => ast === undefined;
export const IsProcedure = (ast: PAL): ast is Procedure =>
  ast instanceof Function;

// Extra Native Types
export const IsNull = (ast: PAL): ast is null => ast === null;
export const IsBoolean = (ast: PAL): ast is boolean => typeof ast === "boolean";
export const IsNumber = (ast: PAL): ast is number => typeof ast === "number";

// Handy Types
export type IdentifierList = Identifier[];
export const IsIdentifierList = (ast: PAL): ast is Identifier[] =>
  IsList(ast) && ast.every(IsIdentifier);

export function ASTEquals(a: PAL, b: PAL): boolean {
  if (IsString(a) && IsString(b)) return a === b;
  if (IsNumber(a) && IsNumber(b)) return a === b;
  if (IsBoolean(a) && IsBoolean(b)) return a === b;
  if (IsNull(a) && IsNull(b)) return true;
  if (IsUndefined(a) && IsUndefined(b)) return true;
  if (IsProcedure(a) && IsProcedure(b)) return a.toString() === b.toString();
  if (IsIdentifier(a) && IsIdentifier(b)) return a === b;
  if (IsList(a) && IsList(b))
    return a.length === b.length && a.every((v, i) => ASTEquals(v, b[i]));
  return false;
}
