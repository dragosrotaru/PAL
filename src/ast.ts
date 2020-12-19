export type Identifier = string;
export const IsIdentifier = (ast: AST): ast is Identifier =>
  typeof ast === "string";

export type IdentifierList = Identifier[];
export const IsIdentifierList = (ast: AST): ast is Identifier[] =>
  IsList(ast) && ast.every(IsIdentifier);

export type Procedure = (arg: AST) => AST;
export const IsProcedure = (ast: AST): ast is Procedure =>
  ast instanceof Function;

export type Atom = Identifier | Procedure;
export const IsAtom = (ast: AST): ast is Atom =>
  IsIdentifier(ast) || IsProcedure(ast);

export type List = AST[];
//** ( ,x ) */
export const IsList = (ast: AST): ast is List => Array.isArray(ast);

export type AST = Atom | List;

// SPECIAL FORMS

export const LAMBDA_IDENTIFIER = "lambda" as const;
export type LambdaArguments = [Identifier];
export const IsLambdaArguments = (ast: AST): ast is LambdaArguments =>
  IsIdentifierList(ast) && ast.length === 1;
export type LambdaForm = [typeof LAMBDA_IDENTIFIER, LambdaArguments, AST];
//** ( lambda ( ,x ) ,body ) */
export const IsLambdaForm = (ast: AST): ast is LambdaForm =>
  IsList(ast) &&
  ast.length === 3 &&
  ast[0] === LAMBDA_IDENTIFIER &&
  IsLambdaArguments(ast[1]);

export type ApplyForm = [AST, AST];
//** ( ,rator ,rand ) */
export const IsApplyForm = (ast: AST): ast is ApplyForm =>
  IsList(ast) && ast.length === 2;

export type ProcedureForm = [Procedure, AST];
//** ( ,Procedure ( argument ) ) */
export const IsProcedureForm = (ast: AST): ast is ProcedureForm =>
  IsApplyForm(ast) && IsProcedure(ast[0]);
