import { PAL } from "../../languages/pal/ast.js";

export type DefaultProps = {
  ast: PAL;
};

export type ExecProps = {
  ast: PAL;
  exec: (code: string) => void;
};
