import * as apply from "#src/forms/apply.js";
import * as define from "#src/forms/define.js";
import * as envF from "#src/forms/env.js";
import * as evalF from "#src/forms/eval.js";
import * as gui from "#src/forms/gui.js";
import * as lambda from "#src/forms/lambda.js";
import * as procedure from "#src/forms/procedure.js";
import { log } from "../logger.js";
import {
  IsBoolean,
  IsIdentifier,
  IsList,
  IsNull,
  IsNumber,
  IsProcedure,
  IsString,
  IsUndefined,
  type AST,
} from "./ast.js";
import { Env } from "./environment.js";

export const evaluate = (ast: AST, env: Env): AST => {
  log("evaluator", ast);
  // length of 1
  if (IsString(ast)) return ast;
  if (IsProcedure(ast)) return ast;
  if (IsUndefined(ast)) return ast;
  if (IsNull(ast)) return ast;
  if (IsBoolean(ast)) return ast;
  if (IsNumber(ast)) return ast;
  if (envF.Is(ast)) return envF.Apply(env)(ast); // order matters
  if (IsIdentifier(ast)) return evaluate(env.map.get(ast), env); // order matters ^
  // length of 2
  if (procedure.Is(ast)) {
    log("evaluator", "procedure");
    procedure.Apply(env)(ast); // order matters
  }
  if (gui.Is(ast)) return gui.Apply(env)(ast); // order matters
  if (evalF.Is(ast)) return evalF.Apply(env)(ast); // order matters
  if (apply.Is(ast)) {
    log("evaluator", "apply");
    return apply.Apply(env)(ast); // order matters ^
  }
  // length of 3
  if (lambda.Is(ast)) {
    log("evaluator", "lambda");
    return lambda.Apply(env)(ast);
  }
  if (define.Is(ast)) return define.Apply(env)(ast);
  // length of N
  if (IsList(ast)) return ast.map((ast) => evaluate(ast, env)); // order matters
  return undefined;
};
