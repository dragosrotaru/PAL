// Native Types

//** "string" */
export const IsString = (ast: AST): ast is string =>
  typeof ast === "string" && ast.startsWith('"') && ast.endsWith('"');

//** number */
export const IsNumber = (ast: AST): ast is number => typeof ast === "number";

//** boolean */
export const IsBoolean = (ast: AST): ast is boolean => typeof ast === "boolean";

//** null */
export const IsNull = (ast: AST): ast is null => ast === null;

//** undefined */
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
export const CompareId = (a: Identifier, b: Identifier): boolean =>
  a.toString() === b.toString();

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
export const LAMBDA_IDENTIFIER = Symbol("lambda");
export type LambdaForm = [typeof LAMBDA_IDENTIFIER, IdentifierList, AST];
export const IsLambdaForm = (ast: AST): ast is LambdaForm =>
  IsList(ast) &&
  ast.length === 3 &&
  IsIdentifier(ast[0]) &&
  CompareId(ast[0], LAMBDA_IDENTIFIER) &&
  IsIdentifierList(ast[1]);

//** ( define i x ) */
export const DEFINE_IDENTIFIER = Symbol("define");
export type DefineForm = [typeof DEFINE_IDENTIFIER, Identifier, AST];
export const IsDefineForm = (ast: AST): ast is DefineForm =>
  IsList(ast) &&
  ast.length === 3 &&
  IsIdentifier(ast[0]) &&
  CompareId(ast[0], DEFINE_IDENTIFIER) &&
  IsIdentifier(ast[1]);

//** ( gui x ) */
export const GUI_IDENTIFIER = Symbol("gui");
export type GUIForm = [typeof GUI_IDENTIFIER, AST];
export const IsGUIForm = (ast: AST): ast is GUIForm =>
  IsList(ast) &&
  ast.length === 2 &&
  IsIdentifier(ast[0]) &&
  CompareId(ast[0], GUI_IDENTIFIER);

//** env */
export const ENV_IDENTIFIER = Symbol("env");
export type EnvForm = typeof ENV_IDENTIFIER;
export const IsEnvForm = (ast: AST): ast is EnvForm =>
  IsIdentifier(ast) && CompareId(ast, ENV_IDENTIFIER);

export type AST =
  | Identifier
  | Procedure
  | List
  | string
  | number
  | boolean
  | null
  | undefined;

export const Serialize = (ast: AST): any => {
  if (IsString(ast)) return `"${ast}"`;
  if (IsNumber(ast)) return ast;
  if (IsBoolean(ast)) return ast;
  if (IsNull(ast)) return ast;
  if (IsUndefined(ast)) return ast;
  if (IsProcedure(ast)) return ast.toString(); // TODO serialize procedure
  if (IsList(ast)) return ast.map(Serialize);
  if (IsIdentifier(ast)) return `@${ast.description}`;
};

export const Deserialize = (ast: any): AST => {
  if (Array.isArray(ast)) return ast.map(Deserialize);
  if (typeof ast === "string") {
    if (ast.startsWith('"') && ast.endsWith('"')) return ast.slice(1, -1);
    if (ast.startsWith("@")) return Symbol(ast.slice(1));
  }
  if (typeof ast === "number") return ast;
  if (typeof ast === "boolean") return ast;
  if (ast === null) return ast;
  if (ast === undefined) return ast;
  throw new Error(`Cannot deserialize ${ast}`);
};
