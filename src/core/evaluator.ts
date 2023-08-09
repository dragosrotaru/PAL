import * as apply from "../forms/apply.js";
import * as del from "../forms/env/del.js";
import * as envF from "../forms/env/index.js";
import * as set from "../forms/env/set.js";
import * as evalF from "../forms/eval.js";
import * as exit from "../forms/exit.js";
import * as gpt from "../forms/gpt.js";
import * as gui from "../forms/gui.js";
import * as lambda from "../forms/lambda.js";
import * as parse from "../forms/parse.js";
import * as procedure from "../forms/procedure.js";
import * as quit from "../forms/quit.js";
import * as quote from "../forms/quote.js";

import * as self from "../forms/self.js";

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
  type PAL,
} from "../languages/pal/ast.js";

import { Env } from "./environment.js";

/* 
The core of evaluation is the eval apply recursion

const eval = env => ast => IsApplyForm(ast) ? eval(env)(ast[0])(eval(env)(ast[1])) : undefined;

Basis for turing complete lisps:

- combinatory logic - SK, SKI, iota and jot
- lambda calculus
- original implementation: assoc label t eval cadr car cdr cons ...
- macro based

expose the following faculties withn the lang:
- eval, apply and pattern matching / Is "checking"
- string, parse, unparse, quote
- env, define, delete
- lambda, recursion


can we define a set of constructs that lets us "reach out" and replace the evaluator itself?
Can we merge the evaluator and environment somehow?


ocaml attaching "processor" to quote .. like parser?

*/

export const evaluate =
  (env: Env) =>
  async (ast: PAL): Promise<PAL> => {
    log("evaluator", ast);

    // Primitives

    if (IsBoolean(ast)) return await ast;
    if (IsString(ast)) return ast;
    if (IsProcedure(ast)) return ast;
    if (IsUndefined(ast)) return ast;
    if (IsNull(ast)) return await ast;
    if (IsNumber(ast)) return await ast;

    // Special Forms

    if (envF.Is(ast)) return await envF.Apply(env)(ast);
    if (set.Is(ast)) return await set.Apply(env)(ast);
    if (del.Is(ast)) return await del.Apply(env)(ast);

    if (evalF.Is(ast)) return await evalF.Apply(env)(ast);
    if (exit.Is(ast)) return await exit.Apply(env)(ast);
    if (gpt.Is(ast)) return await gpt.Apply(env)(ast);
    if (gui.Is(ast)) return await gui.Apply(env)(ast);
    if (lambda.Is(ast)) return await lambda.Apply(env)(ast);
    if (parse.Is(ast)) return await parse.Apply(env)(ast);
    if (quote.Is(ast)) return await quote.Apply(env)(ast);
    if (quit.Is(ast)) return await quit.Apply(env)(ast);
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
