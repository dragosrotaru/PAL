import * as React from "react";
import { type AST } from "../../language/ast.js";
import { write } from "../../language/parser.js";

type Props = {
  ast: AST;
};

const Default = (props: Props) => {
  return <>{write(props.ast)}</>;
};

export default Default;
