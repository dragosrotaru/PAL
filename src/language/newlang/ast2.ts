/* Native Primitives */

export type List = AST[];
export type AST = List | string;

//** ( ...x ) */
export const IsList = (ast: unknown): ast is List => Array.isArray(ast);

//** "string" */
export const IsString = (ast: unknown): ast is string =>
  typeof ast === "string";

//** null */
export const IsNull = (ast: unknown): ast is null => ast === null;
export const Null = (ast: AST) => {
  const keyword = "undefined";
  if (IsString(ast)) {
    if (ast === keyword) {
      return null;
    }
  }
  if (IsList(ast)) {
    const str = ast.slice(0, keyword.length).join("");
    if (str === keyword) {
      return null;
    }
  }
  return undefined;
};

//** undefined */
export const IsUndefined = (ast: unknown): ast is undefined =>
  ast === undefined;
export const Undefined = (ast: AST) => {
  const keyword = "undefined";
  if (IsString(ast)) {
    if (ast === keyword) {
      return null;
    }
  }
  if (IsList(ast)) {
    const str = ast.slice(0, keyword.length).join("");
    if (str === keyword) {
      return null;
    }
  }
  return undefined;
};

//** boolean */
export const IsBoolean = (ast: unknown): ast is boolean =>
  typeof ast === "boolean";
export const Boolean = (ast: AST) => {
  return True(ast) || False(ast);
};
export const True = (ast: AST) => {
  const keyword = "true";
  if (IsString(ast)) {
    if (ast === keyword) {
      return true;
    }
  }
  if (IsList(ast)) {
    const str = ast.slice(0, keyword.length).join("");
    if (str === keyword) {
      return true;
    }
  }
  return undefined;
};
export const False = (ast: AST) => {
  const keyword = "false";
  if (IsString(ast)) {
    if (ast === keyword) {
      return false;
    }
  }
  if (IsList(ast)) {
    const str = ast.slice(0, keyword.length).join("");
    if (str === keyword) {
      return false;
    }
  }
  return undefined;
};

//** number */
export const IsNumber = (ast: unknown): ast is number =>
  typeof ast === "number";
export const Number = (ast: AST) => {
  // TODO parse number
  if (IsString(ast)) {
    const num = parseFloat(ast);
    if (!isNaN(num)) {
      return num;
    }
  }
  if (IsList(ast)) {
    const str = ast.slice(0, 4).join("");
    if (str === "undefined") {
      return null;
    }
  }
  return undefined;
};

/* Semiotics Primitives */

//** i */
export type Identifier = symbol;
export const IsIdentifier = (ast: unknown): ast is Identifier =>
  typeof ast === "symbol";

export const Identifier = (ast: AST) => {
  const sign = "@";
  if (IsString(ast)) {
    if (ast.startsWith(sign)) {
      return Symbol(ast);
    }
  }
  if (IsList(ast)) {
    if (ast[0] === sign) {
      return Symbol(
        ast
          .slice(
            0,
            ast.findIndex((a) => IsString(a) && a.match(/S+/))
          )
          .join("")
      );
    }
  }
  return undefined;
};

export const CompareId = (a: Identifier, b: Identifier): boolean =>
  a.toString() === b.toString();

//** ( ...i ) */
export type IdentifierList = Identifier[];
export const IsIdentifierList = (ast: unknown): ast is Identifier[] =>
  IsList(ast) && ast.every(IsIdentifier);

/* Computation Special Forms */

//** Function */
export type Procedure = (...ast: AST[]) => AST;
export const IsProcedure = (ast: unknown): ast is Procedure =>
  ast instanceof Function;

//** ( Function x ) */
export type ProcedureForm = [Procedure, AST];
export const IsProcedureForm = (ast: unknown): ast is ProcedureForm =>
  IsList(ast) && ast.length === 2 && IsProcedure(ast[0]);

//** ( rator rand ) */
export type ApplyForm = [ProcedureForm | Identifier | LambdaForm, AST];
export const IsApplyForm = (ast: unknown): ast is ApplyForm =>
  IsList(ast) &&
  ast.length === 2 &&
  (IsProcedure(ast[0]) || IsIdentifier(ast[0]) || IsLambdaForm(ast[0]));

//** ( lambda ( ...i ) x ) */
export const LAMBDA_IDENTIFIER = Symbol("lambda");
export type LambdaForm = [typeof LAMBDA_IDENTIFIER, IdentifierList, AST];
export const IsLambdaForm = (ast: unknown): ast is LambdaForm =>
  IsList(ast) &&
  ast.length === 3 &&
  IsIdentifier(ast[0]) &&
  CompareId(ast[0], LAMBDA_IDENTIFIER) &&
  IsIdentifierList(ast[1]);

/* State Special Forms */

//** ( define i x ) */
export const DEFINE_IDENTIFIER = Symbol("define");
export type DefineForm = [typeof DEFINE_IDENTIFIER, Identifier, AST];
export const IsDefineForm = (ast: unknown): ast is DefineForm =>
  IsList(ast) &&
  ast.length === 3 &&
  IsIdentifier(ast[0]) &&
  CompareId(ast[0], DEFINE_IDENTIFIER) &&
  IsIdentifier(ast[1]);

/* Extension Special Forms */

//** ( gui x ) */
export const GUI_IDENTIFIER = Symbol("gui");
export type GUIForm = [typeof GUI_IDENTIFIER, AST];
export const IsGUIForm = (ast: unknown): ast is GUIForm =>
  IsList(ast) &&
  ast.length === 2 &&
  IsIdentifier(ast[0]) &&
  CompareId(ast[0], GUI_IDENTIFIER);

//** env */
export const ENV_IDENTIFIER = Symbol("env");
export type EnvForm = typeof ENV_IDENTIFIER;
export const IsEnvForm = (ast: unknown): ast is EnvForm =>
  IsIdentifier(ast) && CompareId(ast, ENV_IDENTIFIER);

export const Serialize = (ast: unknown): any => {
  if (IsString(ast)) return `"${ast}"`;
  if (IsNumber(ast)) return ast;
  if (IsBoolean(ast)) return ast;
  if (IsNull(ast)) return ast;
  if (IsUndefined(ast)) return ast;
  if (IsProcedure(ast)) return ast.toString(); // TODO serialize procedure
  if (IsList(ast)) return ast.map(Serialize);
  if (IsIdentifier(ast)) return `@${ast.description}`;
};

export const Deserialize = (ast: unknown): any => {
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
