import express from "express";
import open from "open";
import { WebSocketServer } from "ws";
import type { IContext } from "../../interfaces.js";
import type { Lang } from "../../language/ast.js";
import { parser, writer } from "../../language/parser/index.js";
import { log } from "../../libraries/logger/index.js";
import { IdentifierToURI, port, url, wsPort } from "./common.js";
import { Type, type AST as ASTMSG, type Message } from "./messages.js";

export const rootPath = ".";
let SERVER_STARTED = false;
const app = express();

export const startServer = async (ctx: IContext) => {
  return new Promise((resolve) => {
    // TODO authentication
    app.use("/public/.env", (_, res) => {
      res.status(404).end(); // Not Found
    });
    app.use("/static", express.static(rootPath));

    app.get("*", (_, res) => {
      // TODO pre-render content so it opens the object immediately, no need for first time websocket send
      res.send(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <title>Pal</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css" integrity="sha512-NhSC1YmyruXifcj/KFRWoC561YpHpc5Jtzgvbuzx5VozKpWvQ+4nXhPdFgmx8xqexRcpAglTj9sIBWINXa8x5w==" crossorigin="anonymous" referrerpolicy="no-referrer" />
            <link rel="stylesheet" href="/static/src/ui/web/style.css" />
            <script type="importmap">
              {
                "imports": {
                  "react": "https://cdn.skypack.dev/react",
                  "react-dom": "https://cdn.skypack.dev/react-dom"
                }
              }
            </script>
        
            <script type="module" src="/static/build/ui/web/client.js"></script>
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
        const openSubs = new Map<Lang.ID, () => void>();
        const closeAllSubs = () => openSubs.forEach((unsub) => unsub());

        /* Server Side Messaging Protocol with the client */

        ws.on("message", (msg) => {
          log("gui", "ws message");
          keepAlive();

          const message: Message = JSON.parse(msg.toString());
          log("gui", "message:", JSON.stringify(message, null, 2));

          if (message.type === Type.Open) {
            const sym = Symbol.for(message.id);

            // Subscribe iff no subscription for this object for this websocket client exists
            if (!openSubs.has(sym)) {
              log("gui", "subscribing to", sym);
              const unsubscribe = ctx.env.subscribe(sym, (ast) => {
                ws.send(
                  writer(
                    { type: Type.AST, ast: writer(ast) } satisfies ASTMSG,
                    "json"
                  )
                );
              });
              openSubs.set(sym, unsubscribe);
            }

            // First time send
            const ast = ctx.env.map.get(sym);
            ws.send(
              writer(
                { type: Type.AST, ast: writer(ast) } satisfies ASTMSG,
                "json"
              )
            );

            return;
          }

          if (message.type === Type.Close) {
            const sym = Symbol.for(message.id);
            log("gui", "unsubscribing to", sym);
            const unsub = openSubs.get(sym);
            if (unsub) unsub();
            return;
          }

          if (message.type === Type.Exec) {
            const ast = parser(message.code);
            ctx.eval(ctx)(ast);
            return;
          }

          log(
            "gui",
            "client sent unsupported message: ",
            writer(message, "json")
          );
        });

        /* Keep alive Logic and error/closing conditions */

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
      });

      return resolve({ server, wss });
    });
  });
};

export const openGUI = async (id: Lang.ID, ctx: IContext) => {
  if (!SERVER_STARTED) await startServer(ctx);
  await open(IdentifierToURI(id));
};
