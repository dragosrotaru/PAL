import { ChatCompletionRequestMessage } from "openai";
import { evaluate } from "../core/evaluator.js";
import { extractFirstCodeBlock, openai } from "../gpt/index.js";
import { env } from "../index.js";
import { IUnsubscribe, type IEnv } from "../interfaces.js";
import { type AST } from "../languages/ast.js";
import { IsList } from "../languages/pal/ast.js";
import { parser, writer } from "../languages/parser.js";
import { log } from "../logger/index.js";

const HistoryID = Symbol.for("gpt/history.json");
const SystemPromptID = Symbol.for("gpt/system-prompt.md");

class MessageHistory {
  systemPrompt: ChatCompletionRequestMessage = {
    role: "system",
    content: "",
  };
  private _history: ChatCompletionRequestMessage[] = [];

  private unsub: IUnsubscribe;

  constructor() {
    this.unsub = this.subscribe();
    env.subscribe(SystemPromptID, (ast: string) => {
      this.systemPrompt.content = ast;
    });
  }

  private subscribe = () => {
    this.unsub = env.subscribe(HistoryID, (ast: string) => {
      this._history = JSON.parse(ast);
    });
    return this.unsub;
  };

  public get messages() {
    return [this.systemPrompt].concat(this._history);
  }
  public append(message: ChatCompletionRequestMessage) {
    env.map.set(
      HistoryID,
      JSON.stringify(this._history.concat([message]), null, 2)
    );
  }
}

const history = new MessageHistory();

const callGPT = (env: IEnv) => async (text?: string) => {
  if (text) {
    history.append({
      role: "user",
      content: text,
    });
  }

  // call api
  return openai.createChatCompletion({
    model: "gpt-3.5-turbo-16k-0613", // "gpt-4-0613", //
    messages: history.messages,
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

export type Form = [typeof Identifier, AST];

export const Identifier = Symbol.for("gpt");

export const Is = (ast: AST): ast is Form =>
  IsList(ast) && ast[0] === Identifier && ast.length === 2;

export const Apply =
  (env: IEnv) =>
  async (ast: Form): Promise<AST> => {
    try {
      // GPT Call 1
      const { data } = await callGPT(env)(writer(ast[1]));
      let content = data.choices[0]?.message?.content?.toString();
      log("gpt", "content returned", content);
      if (content) history.append({ role: "assistant", content });

      // call the function IF PROVIDED
      const function_call = data.choices[0]?.message?.function_call;
      if (function_call) {
        const name = function_call.name;
        let result: AST;

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
        history.append({
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
