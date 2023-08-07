import { type Identifier } from "#src/language/ast.js";
import express from "express";
import open from "open";
import { WebSocketServer } from "ws";
import { type Env } from "../language/environment.js";
import { write } from "../language/parser.js";
import { log } from "../logger.js";
import { IdentifierToURI, port, url, wsPort } from "./common.js";
import { Type, type AST as ASTMSG, type Message } from "./messages.js";

export const rootPath = ".";
let SERVER_STARTED = false;
const app = express();

export const startServer = async (env: Env) => {
  return new Promise((resolve) => {
    // TODO authentication
    app.use("/public/.env", (_, res) => {
      res.status(404).end(); // Not Found
    });
    app.use("/static", express.static(rootPath));

    app.get("*", (_, res) => {
      // TODO pre-render content so it opens the object immediately
      res.send(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <title>Hyper</title>
            <link rel="stylesheet" href="/static/src/gui/style.css" />
            <script type="importmap">
              {
                "imports": {
                  "react": "https://cdn.skypack.dev/react",
                  "react-dom": "https://cdn.skypack.dev/react-dom"
                }
              }
            </script>
        
            <script type="module" src="/static/build/gui/client.js"></script>
            <div id="root"></div>
          </head>
        </html>      
      `);
    });

    const server = app.listen(port, () => {
      SERVER_STARTED = true;
      log("gui", `running on ${url}`);
      const wss = new WebSocketServer({ port: wsPort });

      wss.on("connection", (ws) => {
        log("gui", `clients: ${wss.clients.size} `);
        const openSubs = new Map<Identifier, () => void>();
        const closeAllSubs = () => openSubs.forEach((unsub) => unsub());

        let alive = true;
        const timeout = setTimeout(() => {
          if (alive) {
            ws.ping();
            alive = false;
          } else {
            ws.terminate();
            closeAllSubs();
          }
        }, 5000);
        const keepAlive = () => {
          timeout.refresh();
          alive = true;
        };

        ws.on("ping", keepAlive);
        ws.on("pong", keepAlive);
        ws.on("error", () => {
          log("gui", "ws error");
          keepAlive();
        });
        ws.on("unexpected-response", () => {
          log("gui", "ws unexpected-response");
          keepAlive();
        });
        ws.on("upgrade", () => {
          log("gui", "ws upgrade");
          keepAlive();
        });

        ws.on("close", () => {
          log("gui", "ws close");
          log("gui", `clients: ${wss.clients.size}`);
          clearTimeout(timeout);
          closeAllSubs();
        });

        ws.on("message", (msg) => {
          log("gui", "ws message");
          keepAlive();

          const message: Message = JSON.parse(msg.toString());
          log("gui", "message:", JSON.stringify(message, null, 2));

          if (message.type === Type.Open) {
            const sym = Symbol.for(message.id);
            if (!openSubs.has(sym)) {
              const unsubscribe = env.subscribe(sym, (ast) => {
                console.log("whyyyyyy");
                ws.send(
                  JSON.stringify({ type: Type.AST, ast: write(ast) } as ASTMSG)
                );
              });
              openSubs.set(sym, unsubscribe);
            }
            return;
          }

          if (message.type === Type.Close) {
            const sym = Symbol.for(message.id);
            const unsub = openSubs.get(sym);
            if (unsub) unsub();
          }

          log(
            "gui",
            "client send unsupported message: ",
            JSON.stringify(message, null, 2)
          );
        });
      });

      return resolve({ server, wss });
    });
  });
};

export const openGUI = async (id: Identifier, env: Env) => {
  if (!SERVER_STARTED) await startServer(env);
  await open(IdentifierToURI(id));
};
