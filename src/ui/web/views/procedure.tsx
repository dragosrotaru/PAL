import * as React from "react";
import type { Lang } from "../../../language/ast.js";

type Props = {
  ast: Lang.Procedure;
};

const Procedure = (props: Props) => {
  return <>{props.ast.toString()}</>;
};

export default Procedure;
