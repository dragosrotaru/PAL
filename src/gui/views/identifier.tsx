import * as React from "react";
import { type Identifier } from "../../language/ast.js";
import { type Env } from "../../language/environment.js";

type Props = {
  ast: Identifier;
  env: Env;
};

const Identifier = (props: Props) => {
  return <a href={props.ast.description}>{props.ast.description}</a>;
};

export default Identifier;
