import { Fractional, Numeric, Order, Type, UI } from "../typeclasses.js";
// Implementation for Number
export class TSNumber
  implements
    Type<number>,
    UI<number>,
    Order<number>,
    Numeric<number>,
    Fractional<number>
{
  is(a: unknown): a is number {
    return typeof a === "number";
  }
  equals(a: number, b: number): boolean {
    return a === b;
  }

  write(a: number): string {
    return a.toString();
  }

  parse(v: string): number {
    return parseFloat(v);
  }

  render(a: number): Element {
    let el = document.createElement("div");
    el.textContent = a.toString();
    return el;
  }

  compare(a: number, b: number): number {
    return a - b;
  }

  add(a: number, b: number): number {
    return a + b;
  }

  subtract(a: number, b: number): number {
    return a - b;
  }

  multiply(a: number, b: number): number {
    return a * b;
  }

  divide(a: number, b: number): number {
    return a / b;
  }
}
