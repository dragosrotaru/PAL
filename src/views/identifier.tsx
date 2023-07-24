import * as React from "react";
import { type Identifier } from "../ast";
import { Env } from "../environment";

type Props = {
  ast: Identifier;
  env: Env;
};

const Identifier = (props: Props) => {
  return <a href={props.ast.description}>{props.ast.description}</a>;
};

export default Identifier;
