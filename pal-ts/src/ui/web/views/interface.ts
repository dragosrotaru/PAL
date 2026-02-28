/**
 * Shared prop type contracts for the Pal web UI view components.
 * DefaultProps: read-only AST display. ExecProps: adds exec callback for Pal code execution.
 * @author claude
 */
import type { Lang } from "../../../language/ast.js";

export type DefaultProps = {
  ast: Lang.AST;
};

export type ExecProps = {
  ast: Lang.AST;
  exec: (code: string) => void;
};
