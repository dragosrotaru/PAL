/**
 * Manages GPT conversation history, persisting it to the env (and thus to disk) via
 * HISTORY_ID. Subscribes to env changes so the history file can be hot-edited externally.
 * @author claude
 */
import type OpenAI from "openai";
import { IEnv } from "../interfaces.js";

type Message = OpenAI.Chat.ChatCompletionMessageParam;

const HISTORY_ID = Symbol.for("src/libraries/gpt/history.json");
const SYSTEM_PROMPT = Symbol.for("pal/src/libraries/system-prompt.md");

/**
 * Stores conversation messages and the system prompt; syncs history to env key
 * `src/libraries/gpt/history.json` so it survives process restarts via filesystem.
 * @author claude
 */
export class GPTMessageHistory {
  systemPrompt: Message = {
    role: "system",
    content: "",
  };
  private _history: Message[] = [];

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
  /** Appends a message to history and persists to env (triggers filesystem write). */
  // todo @claude: append writes to env twice (sets _history then calls env.map.set with concat again); deduplicate
  public append(message: Message) {
    console.log("SETTING", this._history.concat(message));
    this._history = this._history.concat(message);
    this.env.map.set(HISTORY_ID, this._history.concat(message) as any);
  }
}
