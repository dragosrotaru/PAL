import * as ReactDOM from "react-dom";
import { parse } from "../language/parser.js";
import { log } from "../logger.js";
import { WindowURIToIdentifierString, wsUrl } from "./common.js";
import { Type, type Message, type Open } from "./messages.js";
import { View } from "./views/index.js";

const webSocket = new WebSocket(wsUrl);

webSocket.onopen = () => {
  log("gui", "ws open");
  webSocket.send(
    JSON.stringify({
      type: Type.Open,
      id: WindowURIToIdentifierString(),
    } as Open)
  );
};

webSocket.onmessage = (event) => {
  const message: Message = JSON.parse(event.data);
  log("gui", message);

  if (message.type === Type.AST) {
    // TODO implement observables
    // Render the view
    ReactDOM.render(
      View({ ast: parse(message.ast) }),
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
