const domparser = new DOMParser();
const webSocket = new WebSocket("wss://changetheweb.xyz");
webSocket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(data);
  if (data.name === "index.html") {
    const newDom = domparser.parseFromString(data.serialized, "text/html");
    // TODO diff DOM
    location.reload();
    return;
  }
  if (data.name === "client.js") {
    location.reload();
  }
};
