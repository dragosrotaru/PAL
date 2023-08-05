import { openGUI } from "../gui/server.js";
import { log } from "../logger.js";
import {
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
  IsUndefined,
  type AST,
} from "./ast.js";
import { Env } from "./environment.js";

export const evaluate = (ast: AST, env: Env): AST => {
  log("evaluator", ast);

  if (IsEnvForm(ast)) {
    log("evaluator", "pattern: env");
    return env.getAll();
  }

  if (IsString(ast)) {
    log("evaluator", "pattern: string");
    return ast;
  }

  if (IsBoolean(ast)) {
    log("evaluator", "pattern: boolean");
    return ast;
  }

  if (IsNumber(ast)) {
    log("evaluator", "pattern: number");
    return ast;
  }

  if (IsNull(ast)) {
    log("evaluator", "pattern: null");
    return ast;
  }

  if (IsUndefined(ast)) {
    log("evaluator", "pattern: undefined");
    return ast;
  }

  if (IsProcedure(ast)) {
    log("evaluator", "pattern: procedure");
    return ast;
  }

  if (IsIdentifier(ast)) {
    log("evaluator", "pattern: identifier");
    const value = env.map.get(ast);
    return evaluate(value, env);
  }

  if (IsProcedureForm(ast)) {
    log("evaluator", "pattern: procedure form");
    if (IsList(ast[1])) {
      return evaluate(ast[0](...ast[1]), env);
    }
    return evaluate(ast[0](ast[1]), env);
  }

  if (IsGUIForm(ast)) {
    log("evaluator", "pattern: gui form");
    openGUI(ast[1], env);
    return true;
  }

  if (IsApplyForm(ast)) {
    log("evaluator", "pattern: apply form");
    const rator = evaluate(ast[0], env);
    const rand = evaluate(ast[1], env);
    return evaluate([rator, rand], env);
  }

  if (IsLambdaForm(ast)) {
    log("evaluator", "pattern: lambda form");
    const argsIdentifiers = ast[1];
    const body = ast[2];
    return (...values: AST[]) => {
      argsIdentifiers.forEach((identifier, i) =>
        env.map.set(identifier, values[i])
      );
      return evaluate(body, env);
    };
  }

  if (IsDefineForm(ast)) {
    log("evaluator", "pattern: define form");
    env.map.set(ast[1], ast[2]);
    return `${ast[1].toString()} defined`;
  }

  if (IsList(ast)) {
    log("evaluator", "pattern: list");
    return ast.map((ast) => evaluate(ast, env));
  }

  throw new Error("invalid expression");
};
