/**
 * Renders a Lang.List as an unordered HTML list, recursively dispatching each element
 * through the View component for type-appropriate rendering.
 * @author claude
 */
import * as React from "react";
import type { Lang } from "../../../language/ast.js";
import { View } from "./index.js";

type Props = {
  ast: Lang.List;
};

const List = (props: Props) => {
  return (
    <ul>
      {/* todo @claude: missing key prop on <li>; causes React reconciliation warnings */}
      {props.ast.map((value, i) => (
        <li key={i}>{View({ ast: value })}</li>
      ))}
    </ul>
  );
};

export default List;
