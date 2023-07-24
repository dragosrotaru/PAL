import express from "express";
import open from "open";
import WebSocket from "ws";
import { AST } from "./ast";
import { Env, rootPath } from "./environment";

const serverStarted = false;
const app = express();
const port = 3000; // Change this to your desired port number
const wsPort = 3001; // Change this to your desired port number
const url = `http://localhost:${port}`;
export const wsUrl = `ws://localhost:${wsPort}`;

const clients = new Map<string, WebSocket>();

export const startServer = async () => {
  app.use(express.static(rootPath));

  const server = app.listen(port, () => {
    console.log(`Local server is running on ${url}`);
  });

  const wss = new WebSocket.Server({ port: wsPort });

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
      console.log(data);

      if (data.type === "login") {
        const id = data.id;
        clients.set(id, ws);
      }
    });
    ws.on("ping", () => {
      console.log("ws ping");
      timeout.refresh();
      alive = true;
    });
    ws.on("pong", () => {
      console.log("ws pong");
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
  if (!serverStarted) await startServer();
  const id = crypto.randomUUID();
  await open(url + `/login?id=${id}`);
  setTimeout(() => {
    const ws = clients.get(id);
    if (!ws) throw new Error("ws not found");
    // TODO serverside rendering
    ws.send(JSON.stringify({ type: "view", ast, env }));
  }, 3000);
};
