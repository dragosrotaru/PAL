import { Lang } from "../ast.js";

/**
 * Returns the sum of two numbers.
 * @param a - The first number.
 * @param b - The second number.
 * @returns The sum of a and b.
 */
export function add(a: Lang.Number, b: Lang.Number): Lang.Number {
  return a + b;
}

/**
 * Returns the difference of two numbers.
 * @param a - The first number.
 * @param b - The second number.
 * @returns The difference of a and b.
 */
export function subtract(a: Lang.Number, b: Lang.Number): Lang.Number {
  return a - b;
}

/**
 * Checks if the first number is greater than the second.
 * @param a - The first number.
 * @param b - The second number.
 * @returns True if a is greater than b, false otherwise.
 */
export function gt(a: Lang.Number, b: Lang.Number): Lang.Boolean {
  return a > b;
}

/**
 * Checks if the first number is less than the second.
 * @param a - The first number.
 * @param b - The second number.
 * @returns True if a is less than b, false otherwise.
 */
export function lt(a: Lang.Number, b: Lang.Number): Lang.Boolean {
  return a < b;
}

/**
 * Returns the product of two numbers.
 * @param a - The first number.
 * @param b - The second number.
 * @returns The product of a and b.
 */
export function multiply(a: Lang.Number, b: Lang.Number): Lang.Number {
  return a * b;
}

/**
 * Divides the first number by the second.
 * @param a - The first number.
 * @param b - The second number.
 * @returns The result of dividing a by b.
 */
export function divide(
  a: Lang.Number,
  b: Lang.Number
): Lang.Number | Lang.Undefined {
  if (b === 0) return undefined;
  return a / b;
}
