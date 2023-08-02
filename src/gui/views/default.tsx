import * as React from "react";
import { Serialize, type AST } from "../../language/ast.js";
import { type Env } from "../../language/environment.js";

type Props = {
  ast: AST;
  env: Env;
};

const Default = (props: Props) => {
  return <>{JSON.stringify(Serialize(props.ast), null, 2)}</>;
};

export default Default;
