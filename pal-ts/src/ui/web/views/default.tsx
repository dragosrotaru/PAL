/**
 * Fallback view for any AST value not matched by more specific views.
 * Serializes the value with the PAL writer and renders as a text fragment.
 * @author claude
 */
import * as React from "react";
import { writer } from "../../../language/parser/index.js";
import type { DefaultProps } from "./interface.js";

const Default = (props: DefaultProps) => {
  return <>{writer(props.ast)}</>;
};

export default Default;
