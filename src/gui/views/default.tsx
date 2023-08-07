import * as React from "react";
import { write } from "../../language/parser.js";
import { DefaultProps } from "./interface.js";

const Default = (props: DefaultProps) => {
  return <>{write(props.ast)}</>;
};

export default Default;
