import { ChatCompletionRequestMessage } from "openai";
import { IEnv, IUnsubscribe } from "../interfaces.js";

const HISTORY_ID = Symbol.for("gpt/history.json");
const SYSTEM_PROMPT = Symbol.for("gpt/system-prompt.md");

export class GPTMessageHistory {
  systemPrompt: ChatCompletionRequestMessage = {
    role: "system",
    content: "",
  };
  private _history: ChatCompletionRequestMessage[] = [];

  private unsub: IUnsubscribe;

  constructor(private env: IEnv) {
    this.unsub = this.subscribe();
    this.env.subscribe(SYSTEM_PROMPT, (ast: string) => {
      this.systemPrompt.content = ast;
    });
  }

  private subscribe = () => {
    this.unsub = this.env.subscribe(HISTORY_ID, (ast: string) => {
      this._history = JSON.parse(ast);
    });
    return this.unsub;
  };

  public get messages() {
    return [this.systemPrompt].concat(this._history);
  }
  public append(message: ChatCompletionRequestMessage) {
    this.env.map.set(
      HISTORY_ID,
      JSON.stringify(this._history.concat([message]), null, 2)
    );
  }
}
