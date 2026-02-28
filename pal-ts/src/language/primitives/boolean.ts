/**
 * Concrete implementation of Type<boolean> and UI<boolean> for the Pal type class system.
 * parse() treats "true" (case-insensitive) as true, everything else as false.
 * @author claude
 */
import { Type, UI } from "../typeclasses.js";

/** Boolean type class implementation — not yet registered in TypeSystem.registry. */
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
