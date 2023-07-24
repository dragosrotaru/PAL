import {
  AST,
  IsApplyForm,
  IsBoolean,
  IsDefineForm,
  IsEnvForm,
  IsGUIForm,
  IsIdentifier,
  IsLambdaForm,
  IsList,
  IsNull,
  IsNumber,
  IsProcedure,
  IsProcedureForm,
  IsString,
} from "./ast";
import { Env } from "./environment";
import { openGUI } from "./gui";

export const evaluate = (ast: AST, env: Env): AST => {
  console.log(ast);

  if (IsEnvForm(ast)) {
    return env.getAll();
  }

  if (IsString(ast)) {
    console.log("pattern: string");
    return ast;
  }

  if (IsBoolean(ast)) {
    console.log("pattern: boolean");
    return ast;
  }

  if (IsNumber(ast)) {
    console.log("pattern: number");
    return ast;
  }

  if (IsNull(ast)) {
    console.log("pattern: null");
    return ast;
  }

  if (IsProcedure(ast)) {
    console.log("pattern: procedure");
    return ast;
  }

  if (IsIdentifier(ast)) {
    console.log("pattern: identifier");
    const value = env.get(ast);
    if (value === undefined) throw new Error(`${ast.toString()} not defined`);
    return evaluate(value, env);
  }

  if (IsProcedureForm(ast)) {
    console.log("pattern: procedure form");
    if (IsList(ast[1])) {
      return evaluate(ast[0](...ast[1]), env);
    }
    return evaluate(ast[0](ast[1]), env);
  }

  if (IsGUIForm(ast)) {
    console.log("pattern: gui form");
    openGUI(ast[1], env);
    return true;
  }

  if (IsApplyForm(ast)) {
    console.log("pattern: apply form");
    const rator = evaluate(ast[0], env);
    const rand = evaluate(ast[1], env);
    return evaluate([rator, rand], env);
  }

  if (IsLambdaForm(ast)) {
    console.log("pattern: lambda form");
    const argsIdentifiers = ast[1];
    const body = ast[2];
    return (...values: AST[]) => {
      const cenv = new Env(env);
      argsIdentifiers.forEach((identifier, i) =>
        cenv.set(identifier, values[i])
      );
      return evaluate(body, cenv);
    };
  }

  if (IsDefineForm(ast)) {
    console.log("pattern: define form");
    env.set(ast[1], ast[2]);
    return `${ast[1].toString()} defined`;
  }

  if (IsList(ast)) {
    console.log("pattern: list");
    return ast.map((ast) => evaluate(ast, env));
  }

  throw new Error("invalid expression");
};
