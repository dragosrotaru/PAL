import * as React from "react";
import { STATIC } from "../../../language/typesystem.js";
import type { DefaultProps, ExecProps } from "./interface.js";

// Views
import Default from "./default.js";
import Delete from "./delete.js";
import Identifier from "./identifier.js";
import List from "./list.js";
import Procedure from "./procedure.js";

export const View = (props: DefaultProps): React.ReactElement => {
  const { ast } = props;
  if (STATIC.IsID(ast)) return Identifier({ ...props, ast });
  if (STATIC.IsProcedure(ast)) return Procedure({ ...props, ast });
  if (STATIC.IsList(ast)) return List({ ...props, ast });
  return Default({ ...props, ast });
};

export const Executables = (props: ExecProps): React.ReactElement => {
  return Delete(props);
};

export const Template = (props: ExecProps) => (
  <>
    <main>
      <View {...props}></View>
    </main>
    <aside>
      <Executables {...props}></Executables>
    </aside>
  </>
);
