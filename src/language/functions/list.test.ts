import { IContext } from "../../interfaces.js";
import { Lang } from "../ast.js";
import { append, car, cdr, cons, length } from "./list.js";

export const test = async (ctx: IContext) => {
  const failures: any[] = [];
  async function testFunction(
    fn: Function,
    rand: Lang.AST,
    expect: Lang.AST,
    desc?: string
  ) {
    const sym = Symbol.for(fn.name);
    ctx.env.map.set(sym, fn as Lang.SyncProcedure);
    const result = await ctx.eval(ctx)([sym, rand]);
    if (!ctx.ts.valueEquals(result, expect)) {
      failures.push({
        name: fn.name,
        desc,
        result,
        expect,
      });
    }
  }

  await testFunction(cons, [1, [2, 3]], [1, 2, 3]);
  await testFunction(car, [[1, 2, 3]], 1);
  await testFunction(cdr, [[1, 2, 3]], [2, 3]);
  await testFunction(length, [[1, 2, 3]], 3);
  await testFunction(append, [[1], [2, 3], [4, 5]], [1, 2, 3, 4, 5]);
  await testFunction(car, [[]], undefined);
  console.log("FAILED TESTS:", failures);
};
