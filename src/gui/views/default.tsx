import * as React from "react";
import { writer } from "../../languages/parser.js";
import { DefaultProps } from "./interface.js";

const Default = (props: DefaultProps) => {
  return <>{writer(props.ast)}</>;
};

export default Default;
