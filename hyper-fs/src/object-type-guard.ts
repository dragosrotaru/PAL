/**
 * Returns true if `input` is a non-null object (not an array).
 * After this guard, `input` is typed as `Record<string, unknown>` so
 * property accesses are safe.
 */
export function isUnknownObject(input: unknown): input is Record<string, unknown> {
  return typeof input === "object" && input !== null && !Array.isArray(input);
}
