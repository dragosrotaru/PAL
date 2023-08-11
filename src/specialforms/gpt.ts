import type { IContext } from "../interfaces.js";
import type { Lang } from "../language/ast.js";
import { parser, writer } from "../language/parser/index.js";
import { STATIC } from "../language/typesystem.js";
import { extractFirstCodeBlock, openai } from "../libraries/gpt/index.js";
import { log } from "../libraries/logger/index.js";

const callGPT = (ctx: IContext) => async (text?: string) => {
  if (text) {
    ctx.gpt.append({
      role: "user",
      content: text,
    });
  }

  // call api
  return openai.createChatCompletion({
    model: "gpt-3.5-turbo-16k-0613", // "gpt-4-0613", //
    messages: ctx.gpt.messages,
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

export type Form = [typeof Identifier, Lang.AST];

export const Identifier = Symbol.for("gpt");

export const Is = (ast: Lang.AST): ast is Form =>
  STATIC.IsList(ast) && ast[0] === Identifier && ast.length === 2;

export const Apply =
  (ctx: IContext) =>
  async (ast: Form): Promise<Lang.AST> => {
    try {
      // GPT Call 1
      const { data } = await callGPT(ctx)(writer(ast[1]));
      let content = data.choices[0]?.message?.content?.toString();
      log("gpt", "content returned", content);
      if (content) ctx.gpt.append({ role: "assistant", content });

      // call the function IF PROVIDED
      const function_call = data.choices[0]?.message?.function_call;
      if (function_call) {
        const name = function_call.name;
        let result: Lang.AST;

        if (name === "eval") {
          const expr = JSON.parse(function_call.arguments || "").expr;
          log("gpt", "function called", name, expr);
          result = await ctx.eval(ctx)(parser(expr));
        }

        if (name === "envget") {
          const key = JSON.parse(function_call.arguments || "").key;
          log("gpt", "function called", name, key);
          result = key ? ctx.env.map.get(Symbol.for(key)) : ctx.env.getAll();
        }

        log("gpt", "function result", result);
        ctx.gpt.append({
          role: "function",
          name: name,
          content: writer(result),
        });

        return await Apply(ctx)(ast);
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
