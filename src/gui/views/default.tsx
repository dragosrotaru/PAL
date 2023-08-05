import * as React from "react";
import { type AST } from "../../language/ast.js";
import { type Env } from "../../language/environment.js";
import { write } from "../../language/parser.js";

type Props = {
  ast: AST;
  env: Env;
};

const Default = (props: Props) => {
  return <>{JSON.stringify(write(props.ast), null, 2)}</>;
};

export default Default;
