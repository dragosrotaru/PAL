import * as React from "react";
import { type Procedure } from "../../language/ast.js";

type Props = {
  ast: Procedure;
};

const Procedure = (props: Props) => {
  return <>{props.ast.toString()}</>;
};

export default Procedure;
