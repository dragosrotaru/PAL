import {
  IsIdentifier,
  IsList,
  IsProcedure,
  type AST,
} from "../../language/ast.js";
import Default from "./default.js";
import Identifier from "./identifier.js";
import List from "./list.js";
import Procedure from "./procedure.js";

type Props = { ast: AST };

export const View = (props: Props): React.ReactElement => {
  const { ast } = props;
  if (IsIdentifier(ast)) return Identifier({ ...props, ast });
  if (IsProcedure(ast)) return Procedure({ ...props, ast });
  if (IsList(ast)) return List({ ...props, ast });
  return Default({ ...props, ast });
};
