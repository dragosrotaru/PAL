import { describe, expect, it } from "vitest";
import { append, car, cdr, cons, length } from "./list.js";

describe("cons", () => {
  it("prepends an element to a list", () => {
    expect(cons(1, [2, 3])).toEqual([1, 2, 3]);
  });
});

describe("car", () => {
  it("returns the first element", () => {
    expect(car([1, 2, 3])).toBe(1);
  });
  it("returns undefined for an empty list", () => {
    expect(car([])).toBeUndefined();
  });
});

describe("cdr", () => {
  it("returns all elements after the first", () => {
    expect(cdr([1, 2, 3])).toEqual([2, 3]);
  });
});

describe("length", () => {
  it("returns the length of a list", () => {
    expect(length([1, 2, 3])).toBe(3);
  });
});

describe("append", () => {
  it("concatenates multiple lists", () => {
    expect(append([1], [2, 3], [4, 5])).toEqual([1, 2, 3, 4, 5]);
  });
});
