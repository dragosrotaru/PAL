/**
 * @file hyper-server entry point — Express + WebSocket + Yjs CRDT server.
 *
 * Serves two things:
 * 1. **Static files** at `/files/` from `../data/` (relative to dist/).
 * 2. **Y-WebSocket** — each WebSocket connection is forwarded to `y-websocket`'s
 *    `setupWSConnection`, enabling Yjs CRDT document synchronization between clients.
 *
 * Default port: `7777` (override with `PORT` env var).
 * CORS: only allows `http://localhost:3000` (hyper-web dev server).
 *
 * Used by `hyper-web`'s `CRDTEditor` view for collaborative editing.
 */
import { createServer } from "http";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import path from "path";
import morgan from "morgan";
// @ts-ignore
import { setupWSConnection } from "y-websocket/bin/utils.js";
import WebSocket from "ws";

// Server Setup
const PORT = process.env.PORT || 7777;
const app = express().set("json spaces", 2);
const server = createServer(app);
const wss = new WebSocket.Server({ server });

// Compression
app.use(compression());

// Logging
app.use(morgan("dev"));

// Security
app.use(helmet());

// CORS
app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, origin === "http://localhost:3000");
    },
    credentials: true,
  }),
);

// Encodings
app.use(
  express.json({
    limit: "10mb",
  }),
);
app.use(express.urlencoded({ extended: false }));
app.use(express.query({}));
app.use(express.raw({}));
app.use(express.text({}));

// Routes

app.use("/files", express.static(path.join(__dirname, "../data")));

// Web Socket

wss.on("connection", setupWSConnection);

wss.on("upgrade", (request, socket, head) => {
  // You may check auth of request here..
  /**
   * @param {any} ws
   */
  const handleAuth = (ws: any) => {
    wss.emit("connection", ws, request);
  };
  wss.handleUpgrade(request, socket, head, handleAuth);
});

// Start Server

server.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
