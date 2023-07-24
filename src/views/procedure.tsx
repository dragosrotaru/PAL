import * as React from "react";
import { Procedure } from "../ast";
import { Env } from "../environment";

type Props = {
  ast: Procedure;
  env: Env;
};

const Procedure = (props: Props) => {
  return <>{props.ast.toString()}</>;
};

export default Procedure;
