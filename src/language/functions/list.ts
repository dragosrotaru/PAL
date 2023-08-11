import { Lang } from "../ast.js";

/**
 * Constructs a new list by prepending an element to an existing list.
 * @param elem - The element to prepend.
 * @param list - The existing list.
 * @returns A new list.
 */
export function cons(elem: Lang.AST, list: Lang.List): Lang.List {
  return [elem, ...list];
}

/**
 * Returns the first element of a list.
 * @param list - The input list.
 * @returns The first element of the list.
 */
export function car(list: Lang.List): Lang.AST {
  return list[0];
}

/**
 * Returns a new list that contains all the elements of the input list except the first.
 * @param list - The input list.
 * @returns A new list without the first element.
 */
export function cdr(list: Lang.List): Lang.List {
  console.log(list);
  return list.slice(1);
}

/**
 * Returns the length of a list.
 * @param list - The input list.
 * @returns The length of the list.
 * @throws Error if the input is not a list.
 */
export function length(list: Lang.List): Lang.Number {
  if (!Array.isArray(list)) {
    throw new Error("Input is not a valid list.");
  }
  return list.length;
}

/**
 * Returns a list with all elements appended together.
 * @param lists - Multiple lists to be appended.
 * @returns A single list with all elements.
 */
export function append(...lists: Lang.List[]): Lang.List {
  return lists.flat();
}
