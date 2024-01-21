import * as React from "react";
import type { Lang } from "../../../language/ast.js";

type Props = {
  ast: Lang.ID;
};

const Identifier = (props: Props) => {
  return <a href={props.ast.description}>{props.ast.description}</a>;
};

export default Identifier;
