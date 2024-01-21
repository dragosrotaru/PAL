import { Order, Type, UI } from "../typeclasses.js";

// Implementation for String
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
