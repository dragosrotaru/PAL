/**
 * Concrete implementation of Type<string>, UI<string>, and Order<string> for the type class system.
 * write() and parse() are identity functions; compare() uses localeCompare for proper ordering.
 * @author claude
 */
import { Order, Type, UI } from "../typeclasses.js";

/** String type class implementation — not yet registered in TypeSystem.registry. */
export class TSString implements Type<string>, UI<string>, Order<string> {
  is(a: unknown): a is string {
    return typeof a === "string";
  }
  equals(a: string, b: string): boolean {
    return a === b;
  }

  write(a: string): string {
    return a;
  }

  parse(v: string): string {
    return v;
  }

  render(a: string): Element {
    let el = document.createElement("div");
    el.textContent = a;
    return el;
  }

  compare(a: string, b: string): number {
    return a.localeCompare(b);
  }
}
