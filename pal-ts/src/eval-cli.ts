/**
 * Standalone PAL Lisp evaluator CLI entry point.
 *
 * Accepts a single PAL S-expression as the first CLI argument (or via stdin if
 * no argument is given), evaluates it, and prints the result as JSON to stdout.
 *
 * This module is intentionally self-contained — it does not depend on the REPL,
 * chokidar filesystem watcher, GPT client, or any other side-effectful runtime
 * infrastructure. It implements its own parser (supporting bare integer literals
 * without the pal-ts `#` prefix) and a minimal evaluator with a bootstrapped
 * environment containing the standard arithmetic, comparison, boolean, and list
 * primitive procedures.
 *
 * Supported forms:
 *   - Integer and boolean literals (1, 2, true, false)
 *   - null
 *   - Arithmetic: +, -, *, /
 *   - Comparison: =, <, >
 *   - Boolean ops: and, or, not
 *   - List ops: cons, car, cdr, length, append, list
 *   - let: (let ((x 1) (y 2)) (+ x y))
 *   - if:  (if condition then else)
 *   - quote: (quote (1 2 3))
 *
 * Output format: JSON (number, boolean, null, array, string).
 *
 * @author claude
 */

import { createInterface } from "readline";

// ---------------------------------------------------------------------------
// Value types
// ---------------------------------------------------------------------------

type PalVal =
  | { tag: "int"; val: number }
  | { tag: "bool"; val: boolean }
  | { tag: "null" }
  | { tag: "list"; val: PalVal[] }
  | { tag: "str"; val: string }
  | { tag: "builtin"; name: string; fn: (...args: PalVal[]) => PalVal };

// ---------------------------------------------------------------------------
// JSON serializer
// ---------------------------------------------------------------------------

function toJson(v: PalVal): string {
  switch (v.tag) {
    case "int":
      return String(v.val);
    case "bool":
      return String(v.val);
    case "null":
      return "null";
    case "str":
      return JSON.stringify(v.val);
    case "list":
      return "[" + v.val.map(toJson).join(",") + "]";
    case "builtin":
      return JSON.stringify(`<builtin:${v.name}>`);
  }
}

// ---------------------------------------------------------------------------
// S-expression parser  (supports bare integers, no # prefix needed)
// ---------------------------------------------------------------------------

type Token =
  | { kind: "lparen" }
  | { kind: "rparen" }
  | { kind: "atom"; val: string }
  | { kind: "str"; val: string };

function tokenize(src: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (c === "(") {
      tokens.push({ kind: "lparen" });
      i++;
      continue;
    }
    if (c === ")") {
      tokens.push({ kind: "rparen" });
      i++;
      continue;
    }
    if (c === '"') {
      // String literal
      i++;
      let s = "";
      while (i < src.length && src[i] !== '"') {
        if (src[i] === "\\" && i + 1 < src.length) {
          i++;
          s += src[i];
        } else {
          s += src[i];
        }
        i++;
      }
      if (i >= src.length) throw new Error("Unterminated string literal");
      i++; // consume closing '"'
      tokens.push({ kind: "str", val: s });
      continue;
    }
    if (/\s/.test(c ?? "")) {
      i++;
      continue;
    }
    // Atom
    let atom = "";
    while (i < src.length && !/[\s()"]/.test(src[i] ?? "")) {
      atom += src[i];
      i++;
    }
    tokens.push({ kind: "atom", val: atom });
  }
  return tokens;
}

type Expr =
  | { tag: "int"; val: number }
  | { tag: "bool"; val: boolean }
  | { tag: "null" }
  | { tag: "str"; val: string }
  | { tag: "sym"; val: string }
  | { tag: "list"; val: Expr[] };

function parseExpr(tokens: Token[], pos: { i: number }): Expr {
  if (pos.i >= tokens.length) throw new Error("Unexpected end of input");
  const tok = tokens[pos.i];
  if (!tok) throw new Error("Unexpected end of input");
  if (tok.kind === "rparen") throw new Error(`Unexpected ')' at position ${pos.i}`);
  if (tok.kind === "lparen") {
    pos.i++;
    const items: Expr[] = [];
    while (pos.i < tokens.length && tokens[pos.i]?.kind !== "rparen") {
      items.push(parseExpr(tokens, pos));
    }
    if (pos.i >= tokens.length) throw new Error("Missing closing ')'");
    pos.i++; // consume ')'
    return { tag: "list", val: items };
  }
  if (tok.kind === "str") {
    pos.i++;
    return { tag: "str", val: tok.val };
  }
  // atom
  pos.i++;
  const a = tok.val;
  if (a === "true") return { tag: "bool", val: true };
  if (a === "false") return { tag: "bool", val: false };
  if (a === "null") return { tag: "null" };
  const n = Number(a);
  if (!Number.isNaN(n) && a !== "") return { tag: "int", val: n };
  return { tag: "sym", val: a };
}

function parse(src: string): Expr {
  const tokens = tokenize(src);
  const pos = { i: 0 };
  const expr = parseExpr(tokens, pos);
  return expr;
}

// ---------------------------------------------------------------------------
// Environment
// ---------------------------------------------------------------------------

type Env = Map<string, PalVal>;

function makeInt(n: number): PalVal {
  return { tag: "int", val: n };
}
function makeBool(b: boolean): PalVal {
  return { tag: "bool", val: b };
}
function makeList(items: PalVal[]): PalVal {
  return { tag: "list", val: items };
}

function asInt(name: string, v: PalVal): number {
  if (v.tag !== "int") throw new Error(`${name}: expected integer, got ${toJson(v)}`);
  return v.val;
}
function asBool(name: string, v: PalVal): boolean {
  if (v.tag !== "bool") throw new Error(`${name}: expected boolean, got ${toJson(v)}`);
  return v.val;
}
function asList(name: string, v: PalVal): PalVal[] {
  if (v.tag !== "list") throw new Error(`${name}: expected list, got ${toJson(v)}`);
  return v.val;
}
function checkArgc(name: string, args: PalVal[], expected: number): void {
  if (args.length !== expected)
    throw new Error(`${name} expects ${expected} argument(s), got ${args.length}`);
}

function makeBuiltin(name: string, fn: (...args: PalVal[]) => PalVal): PalVal {
  return { tag: "builtin", name, fn };
}

function makeGlobalEnv(): Env {
  const env: Env = new Map();

  // Arithmetic
  env.set(
    "+",
    makeBuiltin("+", (...args) => {
      checkArgc("+", args, 2);
      return makeInt(asInt("+", args[0]!) + asInt("+", args[1]!));
    }),
  );
  env.set(
    "-",
    makeBuiltin("-", (...args) => {
      checkArgc("-", args, 2);
      return makeInt(asInt("-", args[0]!) - asInt("-", args[1]!));
    }),
  );
  env.set(
    "*",
    makeBuiltin("*", (...args) => {
      checkArgc("*", args, 2);
      return makeInt(asInt("*", args[0]!) * asInt("*", args[1]!));
    }),
  );
  env.set(
    "/",
    makeBuiltin("/", (...args) => {
      checkArgc("/", args, 2);
      const b = asInt("/", args[1]!);
      if (b === 0) throw new Error("Division by zero");
      return makeInt(Math.trunc(asInt("/", args[0]!) / b));
    }),
  );

  // Comparison
  env.set(
    "=",
    makeBuiltin("=", (...args) => {
      checkArgc("=", args, 2);
      return makeBool(asInt("=", args[0]!) === asInt("=", args[1]!));
    }),
  );
  env.set(
    "<",
    makeBuiltin("<", (...args) => {
      checkArgc("<", args, 2);
      return makeBool(asInt("<", args[0]!) < asInt("<", args[1]!));
    }),
  );
  env.set(
    ">",
    makeBuiltin(">", (...args) => {
      checkArgc(">", args, 2);
      return makeBool(asInt(">", args[0]!) > asInt(">", args[1]!));
    }),
  );

  // Boolean ops
  env.set(
    "and",
    makeBuiltin("and", (...args) => {
      checkArgc("and", args, 2);
      return makeBool(asBool("and", args[0]!) && asBool("and", args[1]!));
    }),
  );
  env.set(
    "or",
    makeBuiltin("or", (...args) => {
      checkArgc("or", args, 2);
      return makeBool(asBool("or", args[0]!) || asBool("or", args[1]!));
    }),
  );
  env.set(
    "not",
    makeBuiltin("not", (...args) => {
      checkArgc("not", args, 1);
      return makeBool(!asBool("not", args[0]!));
    }),
  );

  // List operations
  env.set(
    "cons",
    makeBuiltin("cons", (...args) => {
      checkArgc("cons", args, 2);
      const lst = asList("cons", args[1]!);
      return makeList([args[0]!, ...lst]);
    }),
  );
  env.set(
    "car",
    makeBuiltin("car", (...args) => {
      checkArgc("car", args, 1);
      const lst = asList("car", args[0]!);
      if (lst.length === 0) throw new Error("car: empty list");
      return lst[0]!;
    }),
  );
  env.set(
    "cdr",
    makeBuiltin("cdr", (...args) => {
      checkArgc("cdr", args, 1);
      const lst = asList("cdr", args[0]!);
      if (lst.length === 0) throw new Error("cdr: empty list");
      return makeList(lst.slice(1));
    }),
  );
  env.set(
    "length",
    makeBuiltin("length", (...args) => {
      checkArgc("length", args, 1);
      const lst = asList("length", args[0]!);
      return makeInt(lst.length);
    }),
  );
  env.set(
    "append",
    makeBuiltin("append", (...args) => {
      const result: PalVal[] = [];
      for (const arg of args) {
        result.push(...asList("append", arg!));
      }
      return makeList(result);
    }),
  );
  env.set(
    "list",
    makeBuiltin("list", (...args) => makeList(args)),
  );

  return env;
}

// ---------------------------------------------------------------------------
// Evaluator
// ---------------------------------------------------------------------------

function evalExpr(expr: Expr, env: Env): PalVal {
  switch (expr.tag) {
    case "int":
      return makeInt(expr.val);
    case "bool":
      return makeBool(expr.val);
    case "null":
      return { tag: "null" };
    case "str":
      return { tag: "str", val: expr.val };

    case "sym": {
      const val = env.get(expr.val);
      if (val === undefined) throw new Error(`Unbound symbol: '${expr.val}'`);
      return val;
    }

    case "list": {
      if (expr.val.length === 0) return makeList([]);

      const head = expr.val[0];

      // Special form: quote
      if (head?.tag === "sym" && head?.val === "quote") {
        if (expr.val.length !== 2) throw new Error("quote expects exactly one argument");
        return quoteExpr(expr.val[1]!);
      }

      // Special form: if
      if (head?.tag === "sym" && head?.val === "if") {
        if (expr.val.length !== 4)
          throw new Error("if expects exactly 3 arguments: (if cond then else)");
        const cond = evalExpr(expr.val[1]!, env);
        if (cond.tag !== "bool")
          throw new Error(`if condition must be a boolean, got ${toJson(cond)}`);
        return cond.val ? evalExpr(expr.val[2]!, env) : evalExpr(expr.val[3]!, env);
      }

      // Special form: let
      if (head?.tag === "sym" && head?.val === "let") {
        if (expr.val.length !== 3)
          throw new Error("let expects exactly 2 arguments: (let ((x v)...) body)");
        return evalLet(expr.val[1]!, expr.val[2]!, env);
      }

      // Procedure application: evaluate head, then apply
      const headVal = evalExpr(head!, env);
      if (headVal.tag !== "builtin") {
        throw new Error(`Cannot apply non-procedure value: ${toJson(headVal)}`);
      }
      const args = expr.val.slice(1).map((a) => evalExpr(a, env));
      return headVal.fn(...args);
    }
  }
}

/** Evaluate a let-binding form. Uses parallel semantics (all bindings evaluated in parent env). */
function evalLet(bindingsExpr: Expr, body: Expr, env: Env): PalVal {
  if (bindingsExpr.tag !== "list") {
    throw new Error("let bindings must be a list of (name value) pairs");
  }
  const newEnv = new Map(env);
  for (const pair of bindingsExpr.val) {
    if (pair.tag !== "list" || pair.val.length !== 2) {
      throw new Error("each let binding must be a (name value) pair");
    }
    const name = pair.val[0]!;
    if (name.tag !== "sym") throw new Error("let binding name must be a symbol");
    const val = evalExpr(pair.val[1]!, env); // evaluate in original env (parallel let)
    newEnv.set(name.val, val);
  }
  return evalExpr(body, newEnv);
}

/** Quote an expression without evaluating it — converts to PalVal directly. */
function quoteExpr(expr: Expr): PalVal {
  switch (expr.tag) {
    case "int":
      return makeInt(expr.val);
    case "bool":
      return makeBool(expr.val);
    case "null":
      return { tag: "null" };
    case "str":
      return { tag: "str", val: expr.val };
    case "sym":
      return { tag: "str", val: expr.val };
    case "list":
      return makeList(expr.val.map(quoteExpr));
  }
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  let src: string;

  if (process.argv[2] !== undefined) {
    src = process.argv[2];
  } else {
    // Read from stdin if no CLI argument
    const rl = createInterface({ input: process.stdin });
    const lines: string[] = [];
    for await (const line of rl) {
      lines.push(line);
    }
    src = lines.join("\n");
  }

  src = src.trim();
  if (src.length === 0) {
    process.stderr.write("Error: no expression provided\n");
    process.exit(1);
  }

  try {
    const expr = parse(src);
    const env = makeGlobalEnv();
    const result = evalExpr(expr, env);
    process.stdout.write(toJson(result) + "\n");
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    process.stderr.write(`Error: ${msg}\n`);
    process.exit(1);
  }
}

main().catch((err) => {
  process.stderr.write(`Fatal: ${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
});
