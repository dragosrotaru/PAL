import { HyperEdge } from "./hyperedge";
import { HyperNode } from "./hypernode";
import { Client } from "./client";
import { Network } from "./network";
import { AgentRepository } from "./agent-repository";
import { PetNameRepository } from "./petname-repository";
import { HyperGraphRepository } from "./hypergraph-repository";

const agentname = process.env.AGENT_NAME;
const privateKey = process.env.PRIVATE_KEY;
const publicKey = process.env.PUBLIC_KEY;

if (!agentname || !privateKey || !publicKey)
  throw new Error("Encryption Keys Required - add to .env file");

const client = new Client(
  new AgentRepository(),
  new HyperGraphRepository(),
  new PetNameRepository(),
  new Network()
);

(async () => {
  client.createAgent(agentname, publicKey);
  const graph = await client.openSession(publicKey, privateKey);
  if (graph instanceof Error) {
    console.log(graph.message);
    return;
  }

  const Encoding = new HyperNode({
    data: Buffer.from("encoding", "ascii"),
  });
  const HelloWorld = new HyperNode({
    data: Buffer.from("Hello World", "ascii"),
  });
  const ASCIIEncoding = new HyperNode({
    data: Buffer.from("ascii", "ascii"),
  });
  const HelloWorldEncoding = new HyperEdge({
    data: [Encoding.id, ASCIIEncoding.id, HelloWorld.id],
  });
  graph.persist([Encoding, HelloWorld, ASCIIEncoding, HelloWorldEncoding], {});
  await graph.retrieve(
    [Encoding.id, HelloWorld.id, ASCIIEncoding.id, HelloWorldEncoding.id],
    {}
  );
  await graph.name("favourite encoding", ASCIIEncoding.id);
  let res = await graph.search("favourite encoding", {});
  console.log("search", res);
  res = await graph.delete([HelloWorld.id, ASCIIEncoding.id], {});
  console.log("delete", res);
  res = await graph.search("favourite encoding", {});
  console.log("search", res);
  await client.closeSession();
  console.log("search", res);
  console.log("Yas Queen!");
})();
