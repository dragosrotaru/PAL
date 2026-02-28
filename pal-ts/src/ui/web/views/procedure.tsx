/**
 * Renders a Lang.Procedure as its source string (via .toString()).
 * Displays raw function source — useful for debugging but not user-facing.
 * @author claude
 */
import * as React from "react";
import type { Lang } from "../../../language/ast.js";

type Props = {
  ast: Lang.Procedure;
};

const Procedure = (props: Props) => {
  return <>{props.ast.toString()}</>;
};

export default Procedure;
