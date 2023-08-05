import * as ReactDOM from "react-dom";
import { parse } from "../language/parser.js";
import { wsUrl } from "./common.js";
import { View } from "./views/index.js";

const webSocket = new WebSocket(wsUrl);
webSocket.onopen = () => {
  console.log("ws open");
  const id = new URLSearchParams(window.location.search).get("gui-id");
  if (id) {
    webSocket.send(JSON.stringify({ type: "remote-initialization", id }));
  }
};
webSocket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(data);
  if ((data.type = "view")) {
    // Render the view
    ReactDOM.render(
      View({ ast: parse(data.ast), env: data.env }),
      document.getElementById("root")
    );
  }
};
