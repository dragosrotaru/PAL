import * as apply from "#src/forms/apply.js";
import * as define from "#src/forms/define.js";
import * as deleteF from "#src/forms/env/delete.js";
import * as envF from "#src/forms/env/index.js";
import * as evalF from "#src/forms/eval.js";
import * as gpt from "#src/forms/gpt.js";
import * as gui from "#src/forms/gui.js";
import * as lambda from "#src/forms/lambda.js";
import * as parse from "#src/forms/parse.js";
import * as procedure from "#src/forms/procedure.js";
import * as quote from "#src/forms/quote.js";
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

export const evaluate =
  (env: Env) =>
  async (ast: AST): Promise<AST> => {
    log("evaluator", ast);

    // length 1 or 2
    if (gui.Is(ast)) return gui.Apply(env)(ast); // order matters
    // length of 1
    if (IsString(ast)) return ast;
    if (IsProcedure(ast)) return ast;
    if (IsUndefined(ast)) return ast;
    if (IsNull(ast)) return ast;
    if (IsBoolean(ast)) return ast;
    if (IsNumber(ast)) return ast;
    if (envF.Is(ast)) return envF.Apply(env)(ast); // order matters
    if (IsIdentifier(ast)) return evaluate(env)(env.map.get(ast)); // order matters ^
    // length of 2
    if (procedure.Is(ast)) return procedure.Apply(env)(ast); // order matters
    if (deleteF.Is(ast)) return deleteF.Apply(env)(ast); // order matters
    if (gpt.Is(ast)) return gpt.Apply(env)(ast); // order matters
    if (parse.Is(ast)) return parse.Apply(env)(ast); // order matters
    if (evalF.Is(ast)) return evalF.Apply(env)(ast); // order matters
    if (quote.Is(ast)) return quote.Apply(env)(ast); // order matters
    if (apply.Is(ast)) return apply.Apply(env)(ast); // order matters ^

    // length of 3
    if (lambda.Is(ast)) return lambda.Apply(env)(ast);
    if (define.Is(ast)) return define.Apply(env)(ast);
    // length of N
    if (IsList(ast)) return Promise.all(ast.map((ast) => evaluate(env)(ast))); // order matters
    return undefined;
  };
