import { AST } from "../../languages/ast.js";

export type DefaultProps = {
  ast: AST;
};

export type ExecProps = {
  ast: AST;
  exec: (code: string) => void;
};
