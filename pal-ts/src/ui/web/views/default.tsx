import * as React from "react";
import { writer } from "../../../language/parser/index.js";
import type { DefaultProps } from "./interface.js";

const Default = (props: DefaultProps) => {
  return <>{writer(props.ast)}</>;
};

export default Default;
