import { ChatCompletionRequestMessage } from "openai";
import { type Env } from "../core/environment.js";
import { evaluate } from "../core/evaluator.js";
import { extractFirstCodeBlock, openai } from "../gpt/index.js";
import { IsList, type PAL } from "../languages/pal/ast.js";
import { parser, writer } from "../languages/parser.js";
import { log } from "../logger.js";

const systemPrompt = `
you are a component of PAL, an AI OS extension which is built around a unique programming language and environmnent (env).
the purpose of PAL is to be a unified environment for developers and power users with a notion.so inspired gui, REPL, filesystem, CLI and more.
the env is an observable map kept in sync with the filesystem, so changes to the file or env via gui/cli are mirrored.
the gui is a websocket system that updates whenever the env is changed.
The env is essentially a unified namespace where every file is parsed based on its extension into the env as an AST.
Not everything in the env is a file, but every file is in the env.
forward slash is therefore both a delimiter for the file hierarchy and a concept hierarchy.
The language (pal) is a lexically scoped, env passing, normal order evaluated interpreted rudimentary lisp built on typescript.
The parser actually parses text files, csvs and .pal files, and eventually any other file format imaginable.
formats/languages are parsed into the universal AST, or kept as a string atom if not supported. the default is the string.
Unexpected behaviour is represented in undefined.
The syntax is very simple: paranthesis (), quotes "", backward slash escapes any special characters \\ such as ()" and whitespace.
Any token starting with # is parsed as a float. null, undefined, true and false are available.
You DO NOT need to put a single symbol in quotes, for example \`env\` will return the environmnent values

Here is the AST:
\`\`\`typescript
export type Identifier = symbol;
export type Procedure = SyncProcedure | AsyncProcedure;
export type SyncProcedure = (env: Env) => (...ast: AST[]) => AST;
export type AsyncProcedure = (env: Env) => (...ast: AST[]) => Promise<AST>;
export type List = AST[];
export type AST = Identifier | Procedure | List | string | number | boolean | null | undefined;
\`\`\`

Most of the methods you would expect to be implemented in a lisp language are not yet implemented.
If you know that an answer is not possible because a special form or feature is missing, then just reply with a typescript code block.

Here are the special forms defined in the system (note macroprogramming /templating is not implemented):
(env/set id expr) - define identifier as expression
(env/get id) - return identifier
env - returns all
(eval expr) - evaluates the expression
(quote expr) - quotes the expression
(lambda (...args) body) - lambda accepting multiple args
(parse string) - parses string into ast
(rator rand) - application
(...x) - list is eagerly evaluated, if no other special forms were matched

Here is how a special form is defined in the system (the one below is lambda):

\`\`\`typescript
export const Identifier = Symbol.for("lambda");
export type Form = [typeof Identifier, IdentifierList, AST];
export const Is = (ast: AST): ast is Form =>
  IsList(ast) &&
  ast.length === 3 &&
  IsIdentifier(ast[0]) &&
  ast[0] === Identifier &&
  IsIdentifierList(ast[1]);
export const Apply =
  (env: Env) =>
  (ast: Form): AsyncProcedure => {
    const argsIdentifiers = ast[1];
    const body = ast[2];
    return (prenv: Env) =>
      (...values: AST[]) => {
        const env = Constructor(prenv.map);
        argsIdentifiers.forEach((identifier, i) =>
          env.map.set(identifier, values[i])
        );
        return evaluate(env)(body);
      };
  };
\`\`\`

Your role as an AI is to be helpful and assist the user in developing this system, to make it as powerful and expressive as possible.

If the input you receive from the user is an expression in pal, then try to evaluate it as if you are a more advanced version of the pal
intepreter that can already perfom that task.

If the input you receive starts with "env?", then treat it as a natural language question where you answer it by querying the env.
If the input you receive start with "define", then treat it as a natural language request to instantiate an implementation in the env.
If the input you receive starts with "help", then treat it as a request to apply your knowledge for how to further develop the system.

you must provide concise answers or code with limited or no prose.
wrap all code responses in block notation \`\`\`lang <your response goes here> \`\`\`.
do not respond with more than one codeblock, the user will ignore subsequent codeblocks.
`;

const history: ChatCompletionRequestMessage[] = [
  {
    role: "system",
    content: systemPrompt,
  },
];

const callGPT = (env: Env) => async (text?: string) => {
  if (text) {
    history.push({
      role: "system",
      content: `current env:

        ${writer(env.getAll())}
      `,
    });
    history.push({
      role: "user",
      content: text,
    });
  }

  // call api
  return openai.createChatCompletion({
    model: "gpt-3.5-turbo-16k-0613", // "gpt-4-0613", //
    messages: history,
    functions: [
      {
        name: "eval",
        description: "evaluates your expression",
        parameters: {
          type: "object",
          properties: {
            expr: {
              type: "string",
              description: "expression in the language pal",
            },
          },
          required: ["expr"],
        },
      },
      {
        name: "envget",
        description:
          "returns a value from the env by key (symbol), or returns all if not provided",
        parameters: {
          type: "object",
          properties: {
            key: {
              type: "string",
              description: "key/symbol/uri/name/filepath/url etc",
            },
          },
        },
      },
      {
        name: "envset",
        description: "sets a value by key to the env",
        parameters: {
          type: "object",
          properties: {
            key: {
              type: "string",
              description: "key/symbol/uri/name/filepath/url etc",
            },
            value: {
              type: "string",
              description: "any AST value (will be parsed before added to env)",
            },
          },
          required: ["key", "value"],
        },
      },
    ],
  });
};

export type Form = [typeof Identifier, PAL];

export const Identifier = Symbol.for("gpt");

export const Is = (ast: PAL): ast is Form =>
  IsList(ast) && ast[0] === Identifier && ast.length === 2;

export const Apply =
  (env: Env) =>
  async (ast: Form): Promise<PAL> => {
    try {
      // GPT Call 1
      const { data } = await callGPT(env)(writer(ast[1]));
      let content = data.choices[0]?.message?.content?.toString();
      log("gpt", "content returned", content);
      if (content) history.push({ role: "assistant", content });

      // call the function IF PROVIDED
      const function_call = data.choices[0]?.message?.function_call;
      if (function_call) {
        const name = function_call.name;
        let result: PAL;

        if (name === "eval") {
          const expr = JSON.parse(function_call.arguments || "").expr;
          log("gpt", "function called", name, expr);
          result = await evaluate(env)(parser(expr));
        }

        if (name === "envget") {
          const key = JSON.parse(function_call.arguments || "").key;
          log("gpt", "function called", name, key);
          result = key ? env.map.get(Symbol.for(key)) : env.getAll();
        }

        log("gpt", "function result", result);
        history.push({
          role: "function",
          name: name,
          content: writer(result),
        });

        return await Apply(env)(ast);
      }

      // Extract The First Code Block
      const languages = ["pal", "csv", "txt", "json", "js", "ts", "tsx"];
      const extract = content
        ? extractFirstCodeBlock(content, languages)
        : null;
      log("gpt", "code extracted", extract);

      // parse the output
      const out = extract?.code
        ? parser(extract?.code, extract.language as any)
        : content;

      return out;
    } catch (error: any) {
      log("gpt", "error", error.message);
      return undefined;
    }
  };
