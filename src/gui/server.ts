import express from "express";
import open from "open";
import WebSocket, { WebSocketServer } from "ws";
import { rootPath } from "../filesystem/index.js";
import { Serialize, type AST } from "../language/ast.js";
import { type Env } from "../language/environment.js";
import { port, url, wsPort } from "./common.js";

let SERVER_STARTED = false;
const app = express();

const continuations = new Map<string, (ws: WebSocket) => void>();

export const startServer = async () => {
  SERVER_STARTED = true;
  app.use(express.static(rootPath));

  const server = app.listen(port, () => {
    console.log(`running on ${url}`);
  });

  const wss = new WebSocketServer({ port: wsPort });

  wss.on("connection", (ws) => {
    console.log(`clients: ${wss.clients.size} `);
    let alive = true;
    const timeout = setTimeout(() => {
      if (alive) {
        ws.ping();
        alive = false;
      } else {
        ws.terminate();
      }
    }, 5000 + 1000);

    ws.on("error", () => {
      console.log("ws error");
      timeout.refresh();
      alive = true;
    });
    ws.on("message", (message) => {
      console.log("ws message");
      timeout.refresh();
      alive = true;
      const data = JSON.parse(message.toString());

      if (data.type === "remote-initialization") {
        const id = data.id;
        const callback = continuations.get(id);
        if (callback) callback(ws);
      }
    });
    ws.on("ping", () => {
      timeout.refresh();
      alive = true;
    });
    ws.on("pong", () => {
      timeout.refresh();
      alive = true;
    });
    ws.on("unexpected-response", () => {
      console.log("ws unexpected-response");
      timeout.refresh();
      alive = true;
    });
    ws.on("upgrade", () => {
      console.log("ws upgrade");
      timeout.refresh();
      alive = true;
    });
    ws.on("close", () => {
      console.log(`clients: ${wss.clients.size} `);
      console.log("ws close");
      clearTimeout(timeout);
    });
  });

  return { server, wss };
};

export const openGUI = async (ast: AST, env: Env) => {
  if (!SERVER_STARTED) await startServer();
  const id = crypto.randomUUID();
  await open(url + `/src/gui/index.html?gui-id=${id}`);
  continuations.set(id, (ws) => {
    ws.send(
      JSON.stringify({ type: "view", ast: Serialize(ast), env: env.getAll() })
    );
  });
};
