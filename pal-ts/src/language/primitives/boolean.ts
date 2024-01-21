import { Type, UI } from "../typeclasses.js";

// Implementation for Boolean
export class TSBoolean implements Type<boolean>, UI<boolean> {
  is(a: unknown): a is boolean {
    return typeof a === "boolean";
  }
  equals(a: boolean, b: boolean): boolean {
    return a === b;
  }
  write(a: boolean): string {
    return a.toString();
  }
  parse(v: string): boolean {
    return v.toLowerCase() === "true";
  }
  render(a: boolean): Element {
    let el = document.createElement("div");
    el.textContent = a.toString();
    return el;
  }
}
