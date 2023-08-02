import * as React from "react";
import { type List } from "../../language/ast.js";
import { type Env } from "../../language/environment.js";
import { View } from "./index.js";

type Props = {
  ast: List;
  env: Env;
};

const List = (props: Props) => {
  return (
    <ul>
      {props.ast.map((value, i) => (
        <li>{View({ ast: value, env: props.env })}</li>
      ))}
    </ul>
  );
};

export default List;
