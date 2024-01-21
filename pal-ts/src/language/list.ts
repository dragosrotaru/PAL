import { Lang } from "./ast.js";
import { Type, UI } from "./typeclasses.js";

// Implementing List
class TSList implements Type<Lang.PAL.List>, UI<Lang.PAL.List> {
  is(a: unknown): a is Lang.PAL.List {
    return Array.isArray(a);
  }
  write(a: Lang.PAL.List): string {
    throw new Error("Method not implemented.");
  }
  parse(v: string): Lang.PAL.List  {
    throw new Error("Method not implemented.");
  }

  equals(a: Lang.PAL.List, b: Lang.PAL.List): boolean {
    return JSON.stringify(a) === JSON.stringify(b);
  }

  show(a: Lang.PAL.List): string {
    return JSON.stringify(a);
  }

  render(a: Lang.PAL.List): Element {
    let el = document.createElement("div");
    el.textContent = this.show(a);
    return el;
  }
}
