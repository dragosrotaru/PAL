import { Type, UI } from "../typeclasses.js";

export class TSNull implements Type<null>, UI<null> {
  is(a: unknown): a is null {
    return a === null;
  }
  equals(_a: null, _b: null): boolean {
    return true;
  }
  write(_a: null): string {
    return "null";
  }
  parse(_v: string): null {
    return null;
  }
  render(_a: null): Element {
    let el = document.createElement("div");
    el.textContent = "null";
    return el;
  }
}
