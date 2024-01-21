/* 
This file, called watcher.js, is a program written in the language JavaScript, written specifically to run on the NodeJS runtime.
Runtime is the time when the code is actually executed, in other words when its doing what it says. There is also design-time,
which is when you are writing the code, and compile-time, Which is when the program is converted from the language its written into
a lower language that the machine is able to understand. JavaScript is a dynamic language, which means that it is compiled Just-In-Time (JIT),
in other words as its needed, during the run-time, as opposed to a static language, where the Language is compiled between design-time and run-time.
So when I say this code is specifically for NodeJS, I mean that while its written in a language that is understood in other contexts, namely a web
browser, the code includes some statements that make use of features specific to the NodeJS runtime. These features are modules of code that expose
some capabilities provided from the operating system, like accessing the file system. The Browser runtime cannot allow JavaScript the same
capabilities because that would be very insecure. Imagine any website editing your files. NodeJS, by the way, is written in C and C++.
So NodeJS is a program written in C/C++ that when executed, lets you execute another program written in JavaScript.
*/

// Here we are loading a bunch of differnt modules using the require() function.

// fs is a NodeJS module that allows you to work with computer file system. We are loading this module to use later in the code.
const fs = require("fs");

// crypto is a NodeJS module that allows you to work with cryptographic algorithms without having to write them yourself, which would be
// a really bad idea because its really hard not to screw it up.
const crypto = require("crypto");

// child_process is a NodeJS module enables your code to execute other code.
const child_process = require("child_process");

/* 
ws is a third party module, made available 
WebSockets is a full-duplex communication protocol built on top of TCP/IP.
It allows two parties to communicate with each other in real-time. 
One party is the Server and the other is the Client. This program is the client.
WebSockets are nice because they are built in to the Web platform as a standard feature
Of browsers available to JavaScript code found on websites. Unfortunately, This WebSockets
require a Server/Client relationship, it is not a decentralized Peer 2 Peer protocol. An Alternative
is WebRTC (Web Real Time Communication), which is P2P and available in Browsers as well. We may switch to that
in the future.
*/
const WebSocket = require("ws");

/* JavaScript Parser to know when the changes made to Watcher.JS should be ignored */
const Parser = require("acorn");

/* 
the secret is a long, random and unique string of characters
that is only known to me and gives me control over capabilities in the code.
we are loading this secret from the environment variable called secret.
An environment variable is a variable made available by the runtime.
*/
const secretSerialized = process.env.SECRET;
// If the secret is not here, then the program should stop running immediately
if (!secretSerialized) throw new Error("secret missing");
const secret = Buffer.from(secretSerialized, "binary");

// Names of folder and file locations on my personal computer
const sourcePath = "./source/";
const metaPath = "./source/meta.json";
const filePath = "./file/";
const informationPath = "./information/";
const logPath = "./log/watcher.log";

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

/* 
wss:// is like https://, where the "s" stands for secure.
This line of code is where the connection to the other pary is officially being made.
*/
const ws = new WebSocket("wss://changetheweb.xyz");

/*
Normally when a websocket closes, the connection is closed gracefully,
Meaning the other party is notified the conversation is over. But sometimes,
this does not happen because it is suddenly interrupted (like if you pull the plug on a computer).
So we will keep track if the connection is alive with something called a heartbeat. If more than 5000 miliseconds
pass, Both sides of the conversation know to ask each other "Hey, you still there?" and the other side says "yep, still here!"
And the timer, called a timeout, is reset. 
*/
let alive = false;

/* 
NodeJS is an event-driven architecture. What this means is that this "ws" object, for instance, can be listened to for events happening
using the on() function. "open" is the event to listen to be notified when the websocket connection is made.
() => {} is called an arrow function.
*/
ws.on("open", () => {
  // print to the command line interface.
  console.log("open");
  // when a connection is made set alive to true.
  alive = true;

  // The Heartbeat Timer
  const timeout = setTimeout(() => {
    // if the timeout reaches 5000 miliseconds, ask the server "you there?" and set alive to false until they respond
    // if they havent responded since, alive would still be false, so now we terminate the connection
    if (alive) {
      ws.ping();
      alive = false;
    } else {
      ws.terminate();
    }
  }, 5000);

  // Read the meta from disk as a UTF-8 String
  const metaSerialized = fs.readFileSync(metaPath, {
    encoding: "utf8",
  });
  const meta = JSON.parse(metaSerialized);
  // Send Meta to sync with server.js
  ws.send(
    JSON.stringify({
      type: "sync",
      secret: secretSerialized,
      meta,
    })
  );

  // After a connection has been opened, start listening to all of these different events

  ws.on("error", () => {
    console.log("error");
    timeout.refresh();
    alive = true;
  });
  ws.on("message", (message) => {
    console.log("message");
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
    if (data.type === "sync") {
      const serverMeta = data.meta;
      const serverMetaSerialized = JSON.stringify(data.meta, null, 2);
      const serverMetaDigest = sha256Digest(serverMetaSerialized);
      const watcherMetaSerialized = fs.readFileSync(metaPath, {
        encoding: "utf8",
      });
      const watcherMeta = JSON.parse(watcherMetaSerialized);
      const watcherMetaDigest = sha256Digest(watcherMetaSerialized);

      /* 
      basically, all nodes should be allowed to have their own
      conflicting versions of reality. The acknowledgement
      of sameness is useless because it cannot be verified or acted on.
      A node can lie about having the same version of reality as another node.
      Is there a value to acknowledging a difference? Certainly, the node
      may want to request the information it is missing, or provide the information
      it wants to share. The system should not depend on any nodes to act in accordance to
      a set of rules. It should rely on human trust networks.
      */
      if (serverMetaDigest !== watcherMetaDigest) {
        // TODO ask for info and send missing info
      }
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
    console.log("unexpected-response");
    timeout.refresh();
    alive = true;
  });
  ws.on("upgrade", () => {
    console.log("upgrade");
    timeout.refresh();
    alive = true;
  });
  ws.on("close", () => {
    console.log("closed");
    clearTimeout(timeout);
    // TODO does terminate() trigger this event?
    // TODO try to reconnect every 5 seconds.
  });
});

// Watch the "source" folder for changes to the files
// Assumes no sub-folders and that files don't change names
// when sourcePath is changed this function is triggered.
// It is an asynchronous function, that accepts the event (normally this is just the string "change")
// and the name of the file
// asynchronous vs synchronous is a hard concept to explain, I think I'll skip it for now.
fs.watch(sourcePath, async (event, name) => {
  // later on, this function does stuff to meta.json.
  // if we update meta.json everytime meta.json is updated we would get an infinite loop and the program would crash
  if (name === "meta.json") {
    return;
  }

  // Read the meta from disk as a UTF-8 String
  let metaSerialized = fs.readFileSync(metaPath, {
    encoding: "utf8",
  });

  /* 
  This file is JSON (JavaScript Object Notation) data format for ease of use and human readability. JSON itself is encoded and stored in UTF-8, as we see above.
  Thats what "serialized" means. Its just a meaningless string, until we "parse" it. Meaning, until we read that meaningless string and turn it into an JavaScript object.
  */
  const meta = JSON.parse(metaSerialized);

  // Again, getting file, this time we are getting the file that was changed.
  const serialized = fs.readFileSync(sourcePath + name, {
    encoding: "utf8",
  });
  // get the cryptographic hash digest using the function defined before
  const digest = sha256Digest(serialized);

  // If new name, initialize it in the meta first.
  if (meta[name] === undefined) meta[name] = [];

  // If the digest didn't change ignore it.
  if (
    meta[name][meta[name].length - 1] &&
    meta[name][meta[name].length - 1].digest === digest
  )
    return;

  // Add the change to the meta
  meta[name].push({
    digest,
    timestamp: Date.now().toString(),
  });

  // Save the meta to storage
  metaSerialized = JSON.stringify(meta, null, 2);
  const metaDigest = sha256Digest(metaSerialized);
  meta["meta.json"].push({
    digest: metaDigest,
    timestamp: Date.now().toString(),
  });
  metaSerialized = JSON.stringify(meta, null, 2);
  fs.writeFileSync(metaPath, metaSerialized);

  // Save history
  fs.writeFileSync(
    informationPath + digest,
    JSON.stringify(serialized, null, 2)
  );
  fs.writeFileSync(
    informationPath + metaDigest,
    JSON.stringify(metaSerialized, null, 2)
  );

  // TODO catch errors
  if (alive) {
    // Send a JavaScript object, encoded in JSON Notation, serialized into a UTF-8 string.
    ws.send(
      JSON.stringify({
        type: "update",
        meta,
        name,
        serialized,
        secret: secretSerialized, // DO NOT LEAK API KEY
      })
    );
  }

  // If file is watcher.js, restart script (assumes no other local module dependencies for watcher.js)
  if (name === "watcher.js") {
    // TODO implement failure-proof transfer of control.
    // the original parent must know it is such, the program initialization executes differently.
    // 1 is new file parsable? if not then throw error (abort change of control)
    // 2. spawn child (throws error). child executes initialization phase. on error and on success, signal parent and await go-ahead. use timeout in parent to default to assumed error, kill child and abort change of control. use timeout in child to kill itself.
    // 3. on child error, parent aborts change of control. on child success, continues execution.
    // 4. turn off file watch and signal child to go ahead. again, timer assumes child is corrupt, and aborts.
    // 5. child receives go-ahead. turns on file watch, ack.
    // 6. parent turn off web connectivity
    // 7. child turn on. again, ack, timer, message on success and fail
    try {
      const ast = acorn.parse(serialized);
      console.log("restarting");
      // TODO do we need to pass file log? cant we just pass it from parent?
      const out = fs.openSync(logPath, "a");
      const err = fs.openSync(logPath, "a");
      child_process
        .spawn("npm", ["run", "watcher"], {
          detached: true,
          stdio: ["ignore", out, err],
        })
        .unref();
      process.exit();
    } catch (error) {
      console.log(error.message);
    }
  }
});
