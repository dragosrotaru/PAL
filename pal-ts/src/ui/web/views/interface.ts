import type { Lang } from "../../../language/ast.js";

export type DefaultProps = {
  ast: Lang.AST;
};

export type ExecProps = {
  ast: Lang.AST;
  exec: (code: string) => void;
};
