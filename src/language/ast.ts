// Native Types

export type AST =
  | AsyncList
  | AsyncProcedure
  | Identifier
  | Procedure
  | List
  | string
  | number
  | boolean
  | null
  | undefined;
export type List = AST[];
export type AsyncList = Promise<AST[]>;
export type Identifier = symbol;
export type Procedure = (...ast: AST[]) => AST;
export type AsyncProcedure = (...ast: AST[]) => Promise<AST>;

export const IsString = (ast: AST): ast is string => typeof ast === "string";
export const IsIdentifier = (ast: AST): ast is Identifier =>
  typeof ast === "symbol";
export const IsList = (ast: AST): ast is List => Array.isArray(ast);

export const IsUndefined = (ast: AST): ast is undefined => ast === undefined;
export const IsProcedure = (ast: AST): ast is Procedure =>
  ast instanceof Function;

// Extra Native Types
export const IsNull = (ast: AST): ast is null => ast === null;
export const IsBoolean = (ast: AST): ast is boolean => typeof ast === "boolean";
export const IsNumber = (ast: AST): ast is number => typeof ast === "number";

// Handy Types
export type IdentifierList = Identifier[];
export const IsIdentifierList = (ast: AST): ast is Identifier[] =>
  IsList(ast) && ast.every(IsIdentifier);

export function compareAST(a: AST, b: AST): boolean {
  if (IsString(a) && IsString(b)) return a === b;
  if (IsNumber(a) && IsNumber(b)) return a === b;
  if (IsBoolean(a) && IsBoolean(b)) return a === b;
  if (IsNull(a) && IsNull(b)) return true;
  if (IsUndefined(a) && IsUndefined(b)) return true;
  if (IsProcedure(a) && IsProcedure(b)) return a.toString() === b.toString();
  if (IsIdentifier(a) && IsIdentifier(b)) return a === b;
  if (IsList(a) && IsList(b))
    return a.length === b.length && a.every((v, i) => compareAST(v, b[i]));
  return false;
}
