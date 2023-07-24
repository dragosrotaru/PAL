import * as React from "react";
import { IsIdentifier, IsList, IsProcedure, type AST, type List } from "../ast";
import { type Env } from "../environment";
import Default from "./default";
import Identifier from "./identifier";
import Procedure from "./procedure";

type Props = {
  ast: List;
  env: Env;
};

const ListItem = (ast: AST, env: Env) => {
  if (IsList(ast)) return List({ ast, env });
  if (IsIdentifier(ast)) return <li>{Identifier({ ast, env })}</li>;
  if (IsProcedure(ast)) return <li>{Procedure({ ast, env })}</li>;
  return <li>{Default({ ast, env })}</li>;
};

const List = (props: Props) => {
  return <ul>{props.ast.map((value, i) => ListItem(value, props.env))}</ul>;
};

export default List;
