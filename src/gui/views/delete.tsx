import * as React from "react";
import { CurrentIDToString } from "../common.js";
import { ExecProps } from "./interface.js";

export default (props: ExecProps) => (
  <button onClick={() => props.exec(`(env/delete ${CurrentIDToString()})`)}>
    delete
  </button>
);
