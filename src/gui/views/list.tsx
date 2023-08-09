import * as React from "react";
import { type List } from "../../languages/pal/ast.js";
import { View } from "./index.js";

type Props = {
  ast: List;
};

const List = (props: Props) => {
  return (
    <ul>
      {props.ast.map((value, i) => (
        <li>{View({ ast: value })}</li>
      ))}
    </ul>
  );
};

export default List;
