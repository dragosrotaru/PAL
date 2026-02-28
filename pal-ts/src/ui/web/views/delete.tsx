/**
 * Executable sidebar action: renders a "delete" button that sends `(env/delete <id>)` to the server,
 * removing the currently viewed env entry from the environment (and thus from the filesystem).
 * @author claude
 */
import * as React from "react";
import { CurrentIDToString } from "../common.js";
import type { ExecProps } from "./interface.js";

export default (props: ExecProps) => (
  <button onClick={() => props.exec(`(env/delete ${CurrentIDToString()})`)}>delete</button>
);
