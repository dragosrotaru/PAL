import * as React from "react";
import { IsIdentifier, IsList, IsProcedure } from "../../language/ast.js";
import Default from "./default.js";
import Delete from "./delete.js";
import Identifier from "./identifier.js";
import { DefaultProps, ExecProps } from "./interface.js";
import List from "./list.js";
import Procedure from "./procedure.js";

export const View = (props: DefaultProps): React.ReactElement => {
  const { ast } = props;
  if (IsIdentifier(ast)) return Identifier({ ...props, ast });
  if (IsProcedure(ast)) return Procedure({ ...props, ast });
  if (IsList(ast)) return List({ ...props, ast });
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
