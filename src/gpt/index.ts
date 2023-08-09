import dotenv from "dotenv";
import GPT3Tokenizer from "gpt3-tokenizer";
import { Configuration, OpenAIApi } from "openai";
import { JSONType } from "./jsonTypes.js";

dotenv.config();
if (!process.env["OPENAI"]) {
  throw new Error("OPENAI environment variable not set");
}
const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env["OPENAI"],
  })
);

const tokenizer = new GPT3Tokenizer.default({ type: "gpt3" });

const codeBlockRegex = (language: string) =>
  new RegExp(`\`\`\`${language}([\\s\\S]+?)\`\`\``);

const matchRegex = (regex: RegExp, string: string) => {
  const match = string.match(regex);
  if (match && match.length > 1) {
    // match[0] includes the code block itsel
    return match[1];
  }
  return null;
};

export const extractFirstCodeBlock = (input: string, language: string[]) => {
  for (const lang of language) {
    const code = matchRegex(codeBlockRegex(lang), input);
    if (code) {
      return { code, language: lang };
    }
  }
  return { code: input, language: null };
};

export const requestGPT = (system: string) => async (prompt: string) => {
  const { data, statusText, status } = await openai.createChatCompletion({
    model: "gpt-4", // "gpt-3.5-turbo-16k-0613",
    messages: [
      {
        role: "system",
        content: system,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });
  const content = data.choices[0]?.message?.content;
  return { content, data, status, statusText };
};

export const requestCode =
  (language: string[], system: string) => async (prompt: string) => {
    const response = await requestGPT(system)(prompt);
    const extract = response.content
      ? extractFirstCodeBlock(response.content, language)
      : null;
    return {
      ...response,
      code: extract?.code,
      language: extract?.language,
      parameters: {
        sysPrompt: system,
        sysPromptLength: system.length,
        sysPromptTokens: countTokens(system),
        promptLength: prompt.length,
        promptTokens: countTokens(prompt),
      },
    };
  };

export const countTokens = (input: string) =>
  tokenizer.encode(input).bpe.length;

export const requestJavascript = async (prompt: string) => {
  const systemPrompt = `return only one correct modern javascript function exported with module.exports.default.
    do not include comments, do not leave anything to be filled in by the user, do not include prose,
    do not include examples, do not execute the function.`;
  return requestCode(["javascript", "js"], systemPrompt)(prompt);
};

export const requestJSON = async (prompt: string) => {
  const systemPrompt =
    "return only a valid json object inside a ```json <json_code> ``` code block and no prose";
  const result = await requestCode(["json"], systemPrompt)(prompt);
  return {
    ...result,
    code: result.code ? (JSON.parse(result.code) as JSONType) : null,
  };
};
