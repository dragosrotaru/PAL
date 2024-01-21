import type { Lang } from "../ast.js";

export namespace JSON {
  export const IsPrimitive = (input: unknown): input is Lang.JSON.Primitive =>
    typeof input === "boolean" ||
    typeof input === "number" ||
    typeof input === "string" ||
    input === null;

  export const IsArray = (input: unknown): input is Lang.JSON.Array =>
    Array.isArray(input) && input.every(IsJSON);

  export const IsObject = (input: unknown): input is Lang.JSON.Object =>
    typeof input === "object" &&
    !Array.isArray(input) &&
    input !== null &&
    Object.entries(input).every((elem) => IsJSON(elem[1]));

  export const IsJSON = (input: unknown): input is Lang.JSON =>
    IsPrimitive(input) || IsObject(input) || IsArray(input);
}
