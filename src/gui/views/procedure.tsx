import * as React from "react";
import { Procedure } from "../../language/ast.js";
import { Env } from "../../language/environment.js";

type Props = {
  ast: Procedure;
  env: Env;
};

const Procedure = (props: Props) => {
  return <>{props.ast.toString()}</>;
};

export default Procedure;
