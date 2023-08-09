import { type Env } from "../core/environment.js";
import { requestCode } from "../gpt/index.js";
import { IsList, type PAL } from "../languages/pal/ast.js";
import { parser, writer } from "../languages/parser.js";

export type Form = [typeof Identifier, PAL];

export const Identifier = Symbol.for("gpt");

export const Is = (ast: PAL): ast is Form =>
  IsList(ast) && ast.length === 2 && ast[0] === Identifier;

export const Apply = (env: Env) => async (ast: Form) => {
  const result = await requestPal(writer(ast[1]));
  return result.code
    ? parser(result.code, result.language as any)
    : result.content;
};

export const requestPal = async (prompt: string) => {
  const systemPrompt = `

    Your job it to act as a programming buddy, providing concise code with limited or no prose. 

    When possible and appropriate return a response in pal, my custom programming language described below.

    You MUST wrap your pal code in block notation \`\`\`pal <your response goes here> \`\`\`.

    You CANNOT include more than one code block in your response, because the pal intepreter wont interpret your subsequent blocks.

    You MAY return a response in other languages or formats such as CSV, but ALWAYS wrap them in a code block.

    language grammar:

    \`\`\`bnf
      <program> ::= <exp> | <program> <exp>
      <exp> ::= <symbol> | <boolean> | <number> | <special> | <list> | <string>
      <symbol> ::= { a-z | A-Z } <symbol> | ""
      <boolean> ::= "true" | "false"
      <number> ::= "#" { digit } <number> | ""
      <special> ::= "null" | "undefined"
      <list> ::= "(" <program> ")"
      <string> ::= '"' { any character except '"' or '\' or '(', ')' unless a '\' preceeds it } '"'
    \`\`\`

    special forms you are allowed to use:

      - (,rator ,rand) - apply
      - (lambda (,x) ,x) - lambda
      - (eval ,x) - evaluates the expression (uses existing env)
      - (gpt ,x) - passes input back into GPT
      - (gui ,x) - opens the expression in the web gui
      - (parse s) - parses a string
      - (quote ,x) - quotes an expression
      - (env/set i ,x) - sets an env symbol
      - (env/del i ,x) - deletes an env symbol
      - env - returns contents of environment in the form ((id1 expr1) (id2 expr2))
      
    evaluator function:

    \`\`\`typescript
    export const evaluate = (env: Env) => async (ast: PAL): Promise<PAL> => {
      // Primitives
      if (IsBoolean(ast)) return await ast;
      if (IsString(ast)) return ast;
      if (IsProcedure(ast)) return ast;
      if (IsUndefined(ast)) return ast;
      if (IsNull(ast)) return await ast;
      if (IsNumber(ast)) return await ast;

      // Special Forms
      if (envF.Is(ast)) return await envF.Apply(env)(ast);
      if (set.Is(ast)) return await set.Apply(env)(ast);
      if (del.Is(ast)) return await del.Apply(env)(ast);
      if (evalF.Is(ast)) return await evalF.Apply(env)(ast);
      if (exit.Is(ast)) return await exit.Apply(env)(ast);
      if (gpt.Is(ast)) return await gpt.Apply(env)(ast);
      if (gui.Is(ast)) return await gui.Apply(env)(ast);
      if (lambda.Is(ast)) return await lambda.Apply(env)(ast);
      if (parse.Is(ast)) return await parse.Apply(env)(ast);
      if (quote.Is(ast)) return await quote.Apply(env)(ast);
      if (quit.Is(ast)) return await quit.Apply(env)(ast);
      if (self.Is(ast)) return self.Apply(env)(ast);

      // Generic Forms
      if (IsIdentifier(ast)) return await evaluate(env)(env.map.get(ast));      
      // todo seems like integrating these two into one makes sense
      if (procedure.Is(ast)) return await procedure.Apply(env)(ast);
      if (apply.Is(ast)) return await apply.Apply(env)(ast);
      if (IsList(ast)) return await Promise.all(ast.map((ast) => evaluate(env)(ast)));
      return undefined;
    };
    \`\`\`

        `;

  return requestCode(
    ["pal", "csv", "txt", "json", "js", "ts", "tsx"],
    systemPrompt
  )(prompt);
};
