import { Type, UI } from "../typeclasses.js";

export class TSUndefined implements Type<undefined>, UI<undefined> {
  is(a: unknown): a is undefined {
    return a === undefined;
  }

  equals(a: undefined, b: undefined): boolean {
    return true; // undefined is always equal to undefined
  }

  write(_a: undefined): string {
    return "undefined";
  }

  parse(v: string): undefined {
    return undefined;
  }

  render(_a: undefined): Element {
    let el = document.createElement("div");
    el.textContent = "undefined";
    return el;
  }
}
