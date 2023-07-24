import { IsIdentifier, IsList, IsProcedure, type AST } from "../ast";
import { type Env } from "../environment";
import Default from "./default";
import Identifier from "./identifier";
import List from "./list";
import Procedure from "./procedure";

type Props = { ast: AST; env: Env };

export const getView = (props: Props): React.ReactElement => {
  const { ast } = props;
  if (IsIdentifier(ast)) return Identifier({ ...props, ast });
  if (IsProcedure(ast)) return Procedure({ ...props, ast });
  if (IsList(ast)) return List({ ...props, ast });
  return Default({ ...props, ast });
};
