import * as React from "react";
import { type AST } from "../ast";
import { Env } from "../environment";

type Props = {
  ast: AST;
  env: Env;
};

const Default = (props: Props) => {
  return <>{JSON.stringify(props.ast, null, 2)}</>;
};

export default Default;
