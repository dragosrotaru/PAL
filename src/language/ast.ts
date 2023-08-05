// Native Types

//** "string" */
export const IsString = (ast: AST): ast is string => typeof ast === "string";
export const IsNumber = (ast: AST): ast is number => typeof ast === "number";
export const IsBoolean = (ast: AST): ast is boolean => typeof ast === "boolean";
export const IsNull = (ast: AST): ast is null => ast === null;
export const IsUndefined = (ast: AST): ast is undefined => ast === undefined;

//** Function */
export type Procedure = (...ast: AST[]) => AST;
export const IsProcedure = (ast: AST): ast is Procedure =>
  ast instanceof Function;

// Basic Types

//** ( ...x ) */
export type List = AST[];
export const IsList = (ast: AST): ast is List => Array.isArray(ast);

//** i */
export type Identifier = symbol;
export const IsIdentifier = (ast: AST): ast is Identifier =>
  typeof ast === "symbol";

//** ( ...i ) */
export type IdentifierList = Identifier[];
export const IsIdentifierList = (ast: AST): ast is Identifier[] =>
  IsList(ast) && ast.every(IsIdentifier);

/* Special Forms */

//** ( Function x ) */
export type ProcedureForm = [Procedure, AST];
export const IsProcedureForm = (ast: AST): ast is ProcedureForm =>
  IsList(ast) && ast.length === 2 && IsProcedure(ast[0]);

//** ( rator rand ) */
export type ApplyForm = [ProcedureForm | Identifier | LambdaForm, AST];
export const IsApplyForm = (ast: AST): ast is ApplyForm =>
  IsList(ast) &&
  ast.length === 2 &&
  (IsProcedure(ast[0]) || IsIdentifier(ast[0]) || IsLambdaForm(ast[0]));

//** ( lambda ( ...i ) x ) */
export const LAMBDA_IDENTIFIER = Symbol.for("lambda");
export type LambdaForm = [typeof LAMBDA_IDENTIFIER, IdentifierList, AST];
export const IsLambdaForm = (ast: AST): ast is LambdaForm =>
  IsList(ast) &&
  ast.length === 3 &&
  IsIdentifier(ast[0]) &&
  ast[0] === LAMBDA_IDENTIFIER &&
  IsIdentifierList(ast[1]);

//** ( define i x ) */
export const DEFINE_IDENTIFIER = Symbol.for("define");
export type DefineForm = [typeof DEFINE_IDENTIFIER, Identifier, AST];
export const IsDefineForm = (ast: AST): ast is DefineForm =>
  IsList(ast) &&
  ast.length === 3 &&
  IsIdentifier(ast[0]) &&
  ast[0] === DEFINE_IDENTIFIER &&
  IsIdentifier(ast[1]);

//** ( gui x ) */
export const GUI_IDENTIFIER = Symbol.for("gui");
export type GUIForm = [typeof GUI_IDENTIFIER, AST];
export const IsGUIForm = (ast: AST): ast is GUIForm =>
  IsList(ast) &&
  ast.length === 2 &&
  IsIdentifier(ast[0]) &&
  ast[0] === GUI_IDENTIFIER;

//** env */
export const ENV_IDENTIFIER = Symbol.for("env");
export type EnvForm = typeof ENV_IDENTIFIER;
export const IsEnvForm = (ast: AST): ast is EnvForm =>
  IsIdentifier(ast) && ast === ENV_IDENTIFIER;

export type AST =
  | Identifier
  | Procedure
  | List
  | string
  | number
  | boolean
  | null
  | undefined;

export function compareAST(a: AST, b: AST): boolean {
  if (IsString(a) && IsString(b)) {
    return a === b;
  }
  if (IsNumber(a) && IsNumber(b)) {
    return a === b;
  }
  if (IsBoolean(a) && IsBoolean(b)) {
    return a === b;
  }
  if (IsNull(a) && IsNull(b)) {
    return true;
  }
  if (IsUndefined(a) && IsUndefined(b)) {
    return true;
  }
  if (IsProcedure(a) && IsProcedure(b)) {
    return a.toString() === b.toString();
  }
  if (IsList(a) && IsList(b)) {
    return a.length === b.length && a.every((v, i) => compareAST(v, b[i]));
  }
  if (IsIdentifier(a) && IsIdentifier(b)) {
    return a === b;
  }

  return false;
}
