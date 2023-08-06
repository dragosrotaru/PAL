export type JSONPrimitive = boolean | number | string | null;
export type JSONType = JSONPrimitive | JSONObject | JSONArray;
export type JSONObject = { [member: string]: JSONType };
export type JSONArray = Array<JSONType>;

export const isJSONPrimitive = (input: unknown): input is JSONPrimitive =>
    typeof input === "boolean" ||
    typeof input === "number" ||
    typeof input === "string" ||
    input === null;

export const isJSONArray = (input: unknown): input is JSONArray =>
    Array.isArray(input) && input.every(isJSON);

export const isJSONObject = (input: unknown): input is JSONObject =>
    typeof input === "object" &&
    !Array.isArray(input) &&
    input !== null &&
    Object.entries(input).every((elem) => isJSON(elem[1]));

export const isJSON = (input: unknown): input is JSONType =>
    isJSONPrimitive(input) || isJSONObject(input) || isJSONArray(input);
