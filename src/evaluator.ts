import {
  AST,
  Identifier,
  IsIdentifier,
  Procedure,
  IsProcedure,
  IsApplyForm,
  IsLambdaForm,
} from "./ast";

type Env = (id: Identifier) => AST;

const Env = (parent: Env) => (x: Identifier, arg: AST) => {
  console.log(`environment created`, x, arg);
  return (y: Identifier): AST => {
    console.log("environment accessed", y, x, arg);
    if (y === x) return arg;
    return parent(x);
  };
};

const evaluate = (ast: AST, env: Env): AST => {
  console.log("evaluating", ast);
  if (IsIdentifier(ast)) {
    console.log("pattern: identifier", ast);
    return env(ast);
  } else if (IsProcedure(ast)) {
    console.log("pattern: procedure", ast);
    return ast;
  } else if (IsLambdaForm(ast)) {
    const args = ast[1];
    const body = ast[2];
    console.log("pattern: lambda", args, body);
    const firstArg = args[0];
    const proc: Procedure = (argument: AST) => {
      console.log("procedure called");
      return evaluate(body, Env(env)(firstArg, argument));
    };
    return proc;
  } else if (IsApplyForm(ast)) {
    const applied = ast.map((a) => evaluate(a, env)); // Normal Order Evaluation
    const rator = applied[0];
    const rand = applied[1];
    console.log("pattern: apply", rator, rand);
    if (IsProcedure(rator)) {
      console.log("rator procedure applied to rand");
      return rator(rand);
    }
    return applied;
  } else {
    throw new Error("invalid expression");
  }
};

export const evaluator = (ast: AST): AST => {
  const env = (id: Identifier) => {
    if (id === "a") return "hello world";
    throw new Error(`unbound identifier ${id}`);
  };
  return evaluate(ast, env);
};
