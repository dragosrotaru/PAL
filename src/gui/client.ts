import * as ReactDOM from "react-dom";
import { parse } from "../language/parser.js";
import { log } from "../logger.js";
import { wsUrl } from "./common.js";
import { View } from "./views/index.js";

const webSocket = new WebSocket(wsUrl);
webSocket.onopen = () => {
  log("gui", "ws open");
  const id = new URLSearchParams(window.location.search).get("gui-id");
  if (id) {
    webSocket.send(JSON.stringify({ type: "remote-initialization", id }));
  }
};
webSocket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  log(data);
  if ((data.type = "view")) {
    // Render the view
    ReactDOM.render(
      View({ ast: parse(data.ast), env: data.env }),
      document.getElementById("root")
    );
  }
};
