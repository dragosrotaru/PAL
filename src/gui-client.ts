import * as ReactDOM from "react-dom";
import { wsUrl } from "./gui";
import { getView } from "./views";

const webSocket = new WebSocket(wsUrl);
webSocket.onopen = () => {
  console.log("ws open");
  if (window.location.pathname === "/login") {
    const id = new URLSearchParams(window.location.search).get("id");
    webSocket.send(JSON.stringify({ type: "login", id }));
  }
};
webSocket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if ((data.type = "view")) {
    // Render the view
    ReactDOM.render(
      getView({ ast: data.ast, env: data.env }),
      document.getElementById("root")
    );
  }
};
