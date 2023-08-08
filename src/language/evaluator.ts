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
import * as self from "#src/forms/self.js";
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

    // Primitives

    if (IsString(ast)) return ast;
    if (IsProcedure(ast)) return ast;
    if (IsUndefined(ast)) return ast;
    if (IsNull(ast)) return await ast;
    if (IsBoolean(ast)) return await ast;
    if (IsNumber(ast)) return await ast;

    // Special Forms

    if (define.Is(ast)) return await define.Apply(env)(ast);
    if (deleteF.Is(ast)) return await deleteF.Apply(env)(ast);
    if (envF.Is(ast)) return await envF.Apply(env)(ast);
    if (evalF.Is(ast)) return await evalF.Apply(env)(ast);
    if (gpt.Is(ast)) return await gpt.Apply(env)(ast);
    if (gui.Is(ast)) return await gui.Apply(env)(ast);
    if (lambda.Is(ast)) return await lambda.Apply(env)(ast);
    if (parse.Is(ast)) return await parse.Apply(env)(ast);
    if (quote.Is(ast)) return await quote.Apply(env)(ast);
    if (self.Is(ast)) return self.Apply(env)(ast);

    // Generic Forms

    // length of 1
    if (IsIdentifier(ast)) return await evaluate(env)(env.map.get(ast));

    // length of 2
    // todo seems like integrating these two into one makes sense
    if (procedure.Is(ast)) return await procedure.Apply(env)(ast);
    if (apply.Is(ast)) return await apply.Apply(env)(ast);

    // length of N
    if (IsList(ast))
      return await Promise.all(ast.map((ast) => evaluate(env)(ast)));

    return undefined;
  };
