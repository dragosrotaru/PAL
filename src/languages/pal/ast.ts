// Native Types

import { type Env } from "../../core/environment.js";

export type PAL =
  | Identifier
  | List
  | Procedure
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

export type IDAST = Identifier | IdentifierList | IDAST[];

export const TypeOfIdentifier = (id: Identifier): Identifier => {
  const ext = id.description?.split(".").pop() || "pal"; // non-specified types are equivalent to "any" in typescript
  return Symbol.for(ext);
};

// todo types in pal are defined by extensions registered to specific parsers. If a parser exists for the extension, then the type exists. otherwise, the type is undefined.

/* 

types are defined in multiple ways:

- atomic primitive types like number, string or boolean, etc.
- structural types like list
- any arbitrary parsed types (for example .js)

( string number true )
( x.string n.number, b.true )
( list )
( ( ) )
( x.list )
( ... )
( 0...1 )
( 0...n )
( ... )
( 3...n )
( 100...n )

.type also exists?

todo add type Symbols to env


*/

export const TypeOf = (a: PAL): IDAST => {
  if (IsString(a)) return Symbol.for("string");
  if (IsNumber(a)) return Symbol.for("number");
  if (IsBoolean(a)) return Symbol.for("boolean");
  if (IsNull(a)) return Symbol.for("null");
  if (IsUndefined(a)) return Symbol.for("undefined");
  if (IsProcedure(a)) return Symbol.for("procedure");
  if (IsIdentifier(a)) return Symbol.for("identifier");
  if (IsList(a)) return a.map(TypeOf);
  throw new Error("undefined type");
};

// strict value equals
export const ASTEquals = (a: PAL, b: PAL): boolean => {
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
};

// type equals
export const ASTEqualsType = (a: PAL, b: PAL): boolean => {
  if (IsString(a) && IsString(b)) return true;
  if (IsNumber(a) && IsNumber(b)) return true;
  if (IsBoolean(a) && IsBoolean(b)) return true;
  if (IsNull(a) && IsNull(b)) return true;
  if (IsUndefined(a) && IsUndefined(b)) return true;
  if (IsProcedure(a) && IsProcedure(b)) return true;
  if (IsIdentifier(a) && IsIdentifier(b)) return true;
  // todo this is a very strict definition of type equlity, we need syntax to loosen it
  if (IsList(a) && IsList(b))
    return a.length === b.length && a.every((v, i) => ASTEqualsType(v, b[i]));
  return false;
};

export const ASTEqualsStruct = (a: PAL, b: PAL): boolean => {
  if (IsList(a) && IsList(b))
    return a.length === b.length && a.every((v, i) => ASTEqualsStruct(v, b[i]));
  return true;
};

export const ASTEqualsTypeOf = (a: PAL, b: PAL): boolean => {
  // todo match the .pal type to anything
  return ASTEquals(TypeOf(a), TypeOf(b));
};

export const ASTEqualsIdentifierType = (ast: PAL, id: Identifier) => {
  const idType = TypeOfIdentifier(id);
  const astType = TypeOf(ast);
  // todo will not equal for lists except the empty list, any wont deal with .pal correctly
  return ASTEquals(idType, astType);
};
