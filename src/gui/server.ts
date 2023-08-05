import express from "express";
import open from "open";
import WebSocket, { WebSocketServer } from "ws";
import { rootPath } from "../filesystem/index.js";
import { type AST } from "../language/ast.js";
import { type Env } from "../language/environment.js";
import { write } from "../language/parser.js";
import { log } from "../logger.js";
import { port, url, wsPort } from "./common.js";

let SERVER_STARTED = false;
const app = express();

const continuations = new Map<string, (ws: WebSocket) => void>();

export const startServer = async (env: Env) => {
  SERVER_STARTED = true;
  app.use(express.static(rootPath));

  const server = app.listen(port, () => {
    log("gui", `running on ${url}`);
  });

  const wss = new WebSocketServer({ port: wsPort });

  wss.on("connection", (ws) => {
    log("gui", `clients: ${wss.clients.size} `);
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
      log("gui", "ws error");
      timeout.refresh();
      alive = true;
    });
    ws.on("message", (message) => {
      log("gui", "ws message");
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
      log("gui", "ws unexpected-response");
      timeout.refresh();
      alive = true;
    });
    ws.on("upgrade", () => {
      log("gui", "ws upgrade");
      timeout.refresh();
      alive = true;
    });
    ws.on("close", () => {
      log("gui", `clients: ${wss.clients.size} `);
      log("gui", "ws close");
      clearTimeout(timeout);
    });
  });

  return { server, wss };
};

export const openGUI = async (ast: AST, env: Env) => {
  if (!SERVER_STARTED) await startServer(env);
  const id = crypto.randomUUID();
  await open(url + `/src/gui/index.html?gui-id=${id}`);
  continuations.set(id, (ws) => {
    ws.send(
      JSON.stringify({ type: "view", ast: write(ast), env: env.getAll() })
    );
  });
};
