import type { IContext } from "../interfaces.js";
import type { Lang } from "../language/ast.js";

import * as apply from "../specialforms/apply.js";
import * as del from "../specialforms/env/del.js";
import * as envGetAll from "../specialforms/env/index.js";
import * as set from "../specialforms/env/set.js";
import * as evalF from "../specialforms/eval.js";
import * as exit from "../specialforms/exit.js";
import * as gpt from "../specialforms/gpt.js";
import * as lambda from "../specialforms/lambda.js";
import * as macro from "../specialforms/macro.js";
import * as parse from "../specialforms/parse.js";
import * as quit from "../specialforms/quit.js";
import * as quote from "../specialforms/quote.js";
import * as self from "../specialforms/self.js";
import * as ui from "../specialforms/ui.js";

import { STATIC } from "../language/typesystem.js";
import { log } from "../libraries/logger/index.js";

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
  (ctx: IContext) =>
  async (ast: Lang.AST): Promise<Lang.AST> => {
    const { env } = ctx;
    // Return Primitives
    if (STATIC.IsPrimitive(ast)) return ast;

    if (STATIC.IsJSONObject(ast)) return ast;

    log("evaluator", ast);

    // Expand Macros
    ast = macro.Expand(ctx)(ast);

    // Apply Special Forms
    if (self.Is(ast)) return self.Apply(ast);
    if (quote.Is(ast)) return await quote.Apply(ast);
    if (macro.Is(ast)) return macro.Define(ctx)(ast);
    if (lambda.Is(ast)) return await lambda.Apply(ctx)(ast);

    // Might not need to be special forms
    if (evalF.Is(ast)) return await evalF.Apply(ctx)(ast);
    if (gpt.Is(ast)) return await gpt.Apply(ctx)(ast);
    if (ui.Is(ast)) return await ui.Apply(ctx)(ast);

    // Definitely dont need to be special forms
    if (envGetAll.Is(ast)) return await envGetAll.Apply(env);
    if (set.Is(ast)) return await set.Apply(env)(ast);
    if (del.Is(ast)) return await del.Apply(env)(ast);
    if (parse.Is(ast)) return await parse.Apply(ast);
    if (exit.Is(ast)) return await exit.Apply();
    if (quit.Is(ast)) return await quit.Apply();

    // Procedure Application
    if (apply.Is(ast)) return await apply.Apply(ctx)(ast);

    // Resolve Identifier
    if (STATIC.IsID(ast)) return await ctx.eval(ctx)(env.map.get(ast));
    ast;

    // Evaluate List (No order)
    if (STATIC.IsList(ast)) {
      const next = await Promise.all(ast.map((a) => ctx.eval(ctx)(a)));
      if (ctx.ts.valueEquals(ast, next)) {
        return next;
      }
      return ctx.eval(ctx)(next);
    }

    return ast;
  };
