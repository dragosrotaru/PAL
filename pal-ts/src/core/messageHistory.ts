import { ChatCompletionRequestMessage } from "openai";
import { IEnv } from "../interfaces.js";

const HISTORY_ID = Symbol.for("src/libraries/gpt/history.json");
const SYSTEM_PROMPT = Symbol.for("pal/src/libraries/system-prompt.md");

export class GPTMessageHistory {
  systemPrompt: ChatCompletionRequestMessage = {
    role: "system",
    content: "",
  };
  private _history: ChatCompletionRequestMessage[] = [];

  constructor(private env: IEnv) {
    this.env.subscribe(HISTORY_ID, (ast: any) => {
      this._history = ast;
      console.log(ast);
    });
    this.env.subscribe(SYSTEM_PROMPT, (ast: string) => {
      this.systemPrompt.content = ast;
    });
  }

  public get messages() {
    console.log("GETTING", this.systemPrompt, this._history);
    return [this.systemPrompt].concat(this._history);
  }
  public append(message: ChatCompletionRequestMessage) {
    console.log("SETTING", this._history.concat(message));
    this._history = this._history.concat(message);
    this.env.map.set(HISTORY_ID, this._history.concat(message) as any);
  }
}
