import { IEnv, IUnsubscribe } from "#src/interfaces.js";
import { ChatCompletionRequestMessage } from "openai";

const HistoryID = Symbol.for("gpt/history.json");
const SystemPromptID = Symbol.for("gpt/system-prompt.md");

export class GPTMessageHistory {
  systemPrompt: ChatCompletionRequestMessage = {
    role: "system",
    content: "",
  };
  private _history: ChatCompletionRequestMessage[] = [];

  private unsub: IUnsubscribe;

  constructor(private env: IEnv) {
    this.unsub = this.subscribe();
    this.env.subscribe(SystemPromptID, (ast: string) => {
      this.systemPrompt.content = ast;
    });
  }

  private subscribe = () => {
    this.unsub = this.env.subscribe(HistoryID, (ast: string) => {
      this._history = JSON.parse(ast);
    });
    return this.unsub;
  };

  public get messages() {
    return [this.systemPrompt].concat(this._history);
  }
  public append(message: ChatCompletionRequestMessage) {
    this.env.map.set(
      HistoryID,
      JSON.stringify(this._history.concat([message]), null, 2)
    );
  }
}
