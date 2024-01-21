const fs = require("fs");
const crypto = require("crypto");
const WebSocket = require("ws");
const express = require("express");
const https = require("https");

// TLS Encryption
const credentials = {
  key: fs.readFileSync(
    "/etc/letsencrypt/live/changetheweb.xyz/privkey.pem",
    "utf8"
  ),
  cert: fs.readFileSync(
    "/etc/letsencrypt/live/changetheweb.xyz/fullchain.pem",
    "utf8"
  ),
};

const secretSerialized = process.env.SECRET;
// If the secret is not here, then the program should stop running immediately
if (!secretSerialized) throw new Error("secret missing");
const secret = Buffer.from(secretSerialized, "binary");

// Names of folder and file locations on my personal computer
const sourcePath = "./source/";
const metaPath = "./source/meta.json";
const informationPath = "./information/";
const filePath = "./file/";
const logPath = "./logs/server.log";

/**
 *
 * @param {string} fileName
 * @returns last fileExtension (string)
 */
const fileExtension = (fileName) => fileName.split(".").pop();

/**
 *
 * @param {*} data any data
 * @returns Digest in the form of a hexidecimal string
 * sha256Digest takes any binary data (1s and 0s) as input, runs the SHA256 hashing algorithm on it
 * and returns the result of that algorithm. The result is called a digest. The digest is also raw binary data,
 * but we want to store the data in JSON which is UTF encoded and doesn't support binary,
 * so next we encode the digest in hexidecimal and return it.
 * (binary is base 2, decimal is base 10, hexidecimal is base 16).
 */
const sha256Digest = (data) => {
  const hash = crypto.createHash("sha256");
  hash.update(data);
  return hash.digest().toString("hex");
};

const app = express();
app.use(express.static(sourcePath));
app.use("/file", express.static(filePath));
app.use("/info", express.static(informationPath));

const server = https.createServer(credentials, app);
const wss = new WebSocket.Server({ server });

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

  // Read the meta from disk as a UTF-8 String
  const metaSerialized = fs.readFileSync(metaPath, {
    encoding: "utf8",
  });
  const meta = JSON.parse(metaSerialized);
  // Send Meta to sync with server.js
  ws.send(
    JSON.stringify({
      meta,
    })
  );

  ws.on("error", () => {
    console.log("ws error");
    timeout.refresh();
    alive = true;
  });
  ws.on("message", (message) => {
    console.log("ws message");
    timeout.refresh();
    alive = true;
    const data = JSON.parse(message);
    console.log(data);
    // If message is from the watcher
    if (typeof data.secret !== "string") {
      return;
    }
    const messageSecret = Buffer.from(data.secret, "binary");
    if (!crypto.timingSafeEqual(secret, messageSecret)) {
      return;
    }
    if (data.type === "update") {
      // Meta Not really needed because we can do a sync on connection and send only name + serialized + digest
      // Update Source Meta
      fs.writeFileSync(sourcePath + "meta.json", JSON.stringify(data.meta));

      // Add Information Meta
      const newMetaSerialized = JSON.stringify(meta, null, 2);
      fs.writeFileSync(
        informationPath + sha256Digest(newMetaSerialized),
        newMetaSerialized
      );
      // Update Source Name
      fs.writeFileSync(sourcePath + data.name, data.serialized);

      // Add Information Name
      fs.writeFileSync(
        informationPath + sha256Digest(data.serialized),
        data.serialized
      );
      // Broadcast to everyone else
      data.secret = undefined; // DONT LEAK SECRET
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data));
        }
      });
      if (data.name === "server.js") {
        // TODO Mutate Server
      }
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

//start our server
server.listen(443, () => {
  console.log(`server started on port ${server.address().port}`);
});
