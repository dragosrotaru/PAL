import * as React from "react";
import { type Identifier } from "../../language/ast.js";

type Props = {
  ast: Identifier;
};

const Identifier = (props: Props) => {
  return <a href={props.ast.description}>{props.ast.description}</a>;
};

export default Identifier;
