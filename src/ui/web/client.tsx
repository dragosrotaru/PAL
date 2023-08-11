import * as React from "react";
import * as ReactDOM from "react-dom";
import { parser } from "../../language/parser/index.js";
import { log } from "../../libraries/logger/index.js";
import { CurrentIDToString, wsUrl } from "./common.js";
import { Type, type Exec, type Message, type Open } from "./messages.js";
import { Template } from "./views/index.js";

const webSocket = new WebSocket(wsUrl);

webSocket.onopen = () => {
  log("gui", "ws open");
  webSocket.send(
    JSON.stringify({
      type: Type.Open,
      id: CurrentIDToString(),
    } as Open)
  );
};

const exec = async (code: string) => {
  webSocket.send(
    JSON.stringify({
      type: Type.Exec,
      code,
    } as Exec)
  );
};

webSocket.onmessage = (event) => {
  const message: Message = JSON.parse(event.data);
  log("gui", message);

  if (message.type === Type.AST) {
    const ast = parser(message.ast);
    // TODO implement observables
    // Render the view
    ReactDOM.render(
      <Template ast={ast} exec={exec}></Template>,
      document.getElementById("root")
    );
    return;
  }

  log(
    "gui",
    "server sent unsupported message",
    JSON.stringify(message, null, 2)
  );
};
