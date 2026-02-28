/**
 * Cross-implementation test harness for the PAL Lisp evaluator.
 *
 * For each test expression, this harness spawns both the TypeScript evaluator
 * (`pal-ts/build/eval-cli.js` via Node.js) and the Rust evaluator
 * (`target/debug/pal-eval`), compares their JSON outputs, and asserts they are
 * deeply equal.
 *
 * Both evaluators must be built before running these tests:
 *   - TypeScript: `pnpm run build` in pal-ts/
 *   - Rust:       `cargo build -p pal-eval` from workspace root
 *
 * @author claude
 */

import { spawnSync } from "child_process";
import { existsSync } from "fs";
import path from "path";
import { describe, expect, it } from "vitest";

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------

const WORKSPACE_ROOT = path.resolve(import.meta.dirname, "../../");
const PAL_TS_ROOT = path.resolve(import.meta.dirname, "../");

/** Compiled TypeScript CLI evaluator. */
const TS_EVAL_BIN = path.join(PAL_TS_ROOT, "build", "eval-cli.js");

/** Rust CLI evaluator (debug build). */
const RS_EVAL_BIN = path.join(WORKSPACE_ROOT, "target", "debug", "pal-eval");

// ---------------------------------------------------------------------------
// Test cases
// ---------------------------------------------------------------------------

interface TestCase {
  description: string;
  expr: string;
  expected: unknown; // JSON-compatible expected value for documentation
}

const TEST_CASES: TestCase[] = [
  // Arithmetic
  { description: "(+ 1 2)",              expr: "(+ 1 2)",              expected: 3 },
  { description: "(* 3 4)",              expr: "(* 3 4)",              expected: 12 },
  { description: "(- 10 3)",             expr: "(- 10 3)",             expected: 7 },
  { description: "(/ 10 2)",             expr: "(/ 10 2)",             expected: 5 },

  // Comparison
  { description: "(= 1 1)",              expr: "(= 1 1)",              expected: true },
  { description: "(= 1 2)",              expr: "(= 1 2)",              expected: false },
  { description: "(< 1 2)",              expr: "(< 1 2)",              expected: true },
  { description: "(> 2 1)",              expr: "(> 2 1)",              expected: true },
  { description: "(> 1 2)",              expr: "(> 1 2)",              expected: false },

  // Conditionals
  { description: "(if true 1 2)",        expr: "(if true 1 2)",        expected: 1 },
  { description: "(if false 1 2)",       expr: "(if false 1 2)",       expected: 2 },

  // let bindings
  { description: "(let ((x 5)) x)",                   expr: "(let ((x 5)) x)",                   expected: 5 },
  { description: "(let ((x 3) (y 4)) (+ x y))",       expr: "(let ((x 3) (y 4)) (+ x y))",       expected: 7 },
  { description: "(let ((x 10)) (let ((y 3)) (- x y)))", expr: "(let ((x 10)) (let ((y 3)) (- x y)))", expected: 7 },

  // List operations
  { description: "(cons 1 (quote (2 3)))",             expr: "(cons 1 (quote (2 3)))",             expected: [1, 2, 3] },
  { description: "(car (quote (1 2 3)))",              expr: "(car (quote (1 2 3)))",              expected: 1 },
  { description: "(cdr (quote (1 2 3)))",              expr: "(cdr (quote (1 2 3)))",              expected: [2, 3] },
  { description: "(length (quote (1 2 3)))",           expr: "(length (quote (1 2 3)))",           expected: 3 },
  { description: "(append (quote (1 2)) (quote (3 4)))", expr: "(append (quote (1 2)) (quote (3 4)))", expected: [1, 2, 3, 4] },
  { description: "(list 1 2 3)",                       expr: "(list 1 2 3)",                       expected: [1, 2, 3] },

  // Boolean ops
  { description: "(and true false)",     expr: "(and true false)",     expected: false },
  { description: "(and true true)",      expr: "(and true true)",      expected: true },
  { description: "(or false true)",      expr: "(or false true)",      expected: true },
  { description: "(or false false)",     expr: "(or false false)",     expected: false },
  { description: "(not false)",          expr: "(not false)",          expected: true },
  { description: "(not true)",           expr: "(not true)",           expected: false },

  // Nested expressions
  { description: "(+ (* 2 3) (- 10 5))", expr: "(+ (* 2 3) (- 10 5))", expected: 11 },
  { description: "(if (= 1 1) (+ 2 3) 0)", expr: "(if (= 1 1) (+ 2 3) 0)", expected: 5 },
  { description: "(length (list 1 2 3 4))", expr: "(length (list 1 2 3 4))", expected: 4 },

  // quote
  { description: "(quote (1 2 3))",      expr: "(quote (1 2 3))",      expected: [1, 2, 3] },
];

// ---------------------------------------------------------------------------
// Spawner utility
// ---------------------------------------------------------------------------

/**
 * Run a binary evaluator with the given expression and return its JSON-parsed stdout.
 * Returns an object with either `ok: value` or `err: message`.
 */
function runEvaluator(
  binary: string,
  expr: string,
  useNode = false,
): { ok: unknown } | { err: string } {
  const cmd = useNode ? "node" : binary;
  const args = useNode ? [binary, expr] : [expr];

  const result = spawnSync(cmd, args, {
    encoding: "utf8",
    timeout: 10_000,
  });

  if (result.error) {
    return { err: `spawn error: ${result.error.message}` };
  }
  if (result.status !== 0) {
    return {
      err: `non-zero exit (${result.status}): ${(result.stderr || "").trim()}`,
    };
  }
  const stdout = (result.stdout || "").trim();
  if (!stdout) {
    return { err: "empty stdout" };
  }
  try {
    return { ok: JSON.parse(stdout) };
  } catch {
    return { err: `invalid JSON output: ${stdout}` };
  }
}

// ---------------------------------------------------------------------------
// Verify binaries exist (skip tests gracefully if not built)
// ---------------------------------------------------------------------------

const tsBinExists = existsSync(TS_EVAL_BIN);
const rsBinExists = existsSync(RS_EVAL_BIN);

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("PAL cross-implementation evaluator", () => {
  it("pal-ts binary exists (run `pnpm run build` in pal-ts/ if this fails)", () => {
    expect(tsBinExists, `Expected ${TS_EVAL_BIN} to exist`).toBe(true);
  });

  it("pal-eval (Rust) binary exists (run `cargo build -p pal-eval` if this fails)", () => {
    expect(rsBinExists, `Expected ${RS_EVAL_BIN} to exist`).toBe(true);
  });

  describe("cross-implementation agreement", () => {
    for (const tc of TEST_CASES) {
      it(tc.description, () => {
        if (!tsBinExists) {
          throw new Error(
            `pal-ts binary not found at ${TS_EVAL_BIN}. Build with: cd pal-ts && pnpm run build`,
          );
        }
        if (!rsBinExists) {
          throw new Error(
            `pal-eval binary not found at ${RS_EVAL_BIN}. Build with: cargo build -p pal-eval`,
          );
        }

        const tsResult = runEvaluator(TS_EVAL_BIN, tc.expr, true /* useNode */);
        const rsResult = runEvaluator(RS_EVAL_BIN, tc.expr, false);

        // Both must succeed
        if ("err" in tsResult) {
          throw new Error(`pal-ts error for "${tc.expr}": ${tsResult.err}`);
        }
        if ("err" in rsResult) {
          throw new Error(`pal-eval (Rust) error for "${tc.expr}": ${rsResult.err}`);
        }

        // Both must agree
        expect(tsResult.ok, `pal-ts vs pal-eval mismatch for: ${tc.expr}`).toEqual(
          rsResult.ok,
        );

        // Both should match the documented expected value
        expect(tsResult.ok, `pal-ts result for "${tc.expr}"`).toEqual(tc.expected);
        expect(rsResult.ok, `pal-eval result for "${tc.expr}"`).toEqual(tc.expected);
      });
    }
  });
});
