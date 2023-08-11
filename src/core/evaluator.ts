import type { IEnv } from "../interfaces.js";
import type { Lang } from "../language/ast.js";

import * as apply from "../specialforms/apply.js";
import * as del from "../specialforms/env/del.js";
import * as envF from "../specialforms/env/index.js";
import * as set from "../specialforms/env/set.js";
import * as evalF from "../specialforms/eval.js";
import * as exit from "../specialforms/exit.js";
import * as gpt from "../specialforms/gpt.js";
import * as lambda from "../specialforms/lambda.js";
import * as macro from "../specialforms/macro.js";
import * as parse from "../specialforms/parse.js";
import * as procedure from "../specialforms/procedure.js";
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
  (env: IEnv) =>
  async (ast: Lang.AST): Promise<Lang.AST> => {
    log("evaluator", ast);

    // Macros
    ast = macro.Expand(env)(ast);

    if (macro.Is(ast)) return macro.Define(env)(ast);

    // Primitives

    if (STATIC.IsBoolean(ast)) return await ast;
    if (STATIC.IsString(ast)) return ast;
    if (STATIC.IsProcedure(ast)) return ast;
    if (STATIC.IsUndefined(ast)) return ast;
    if (STATIC.IsNull(ast)) return await ast;
    if (STATIC.IsNumber(ast)) return await ast;

    // Special Forms

    if (envF.Is(ast)) return await envF.Apply(env)(ast);
    if (set.Is(ast)) return await set.Apply(env)(ast);
    if (del.Is(ast)) return await del.Apply(env)(ast);

    if (evalF.Is(ast)) return await evalF.Apply(env)(ast);
    if (exit.Is(ast)) return await exit.Apply(env)(ast);
    if (gpt.Is(ast)) return await gpt.Apply(env)(ast);
    if (ui.Is(ast)) return await ui.Apply(env)(ast);
    if (lambda.Is(ast)) return await lambda.Apply(env)(ast);
    if (parse.Is(ast)) return await parse.Apply(env)(ast);
    if (quote.Is(ast)) return await quote.Apply(env)(ast);
    if (quit.Is(ast)) return await quit.Apply(env)(ast);
    if (self.Is(ast)) return self.Apply(env)(ast);

    // Generic Forms

    // length of 1
    if (STATIC.IsID(ast)) return await evaluate(env)(env.map.get(ast));

    // length of 2
    // todo seems like integrating these two into one makes sense
    if (procedure.Is(ast)) return await procedure.Apply(env)(ast);
    if (apply.Is(ast)) return await apply.Apply(env)(ast);

    // length of N
    if (STATIC.IsList(ast))
      return await Promise.all(ast.map((ast) => evaluate(env)(ast)));

    return undefined;
  };
