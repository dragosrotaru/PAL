"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @file hyper-ts entry point — demo script.
 *
 * Creates an agent, opens a session (login → decrypt storage → connect),
 * then exercises the full HyperGraph API: persist, retrieve, name, search, delete.
 *
 * Requires env vars: `AGENT_NAME`, `PRIVATE_KEY`, `PUBLIC_KEY`.
 *
 * This is a development smoke-test / demo, not a production server.
 * Network `connect`/`disconnect` are stubbed (random 0.1% failure rate, see `client.ts`).
 */
const hyperedge_1 = require("./hyperedge");
const hypernode_1 = require("./hypernode");
const client_1 = require("./client");
const network_1 = require("./network");
const agent_repository_1 = require("./agent-repository");
const petname_repository_1 = require("./petname-repository");
const hypergraph_repository_1 = require("./hypergraph-repository");
const agentname = process.env.AGENT_NAME;
const privateKey = process.env.PRIVATE_KEY;
const publicKey = process.env.PUBLIC_KEY;
if (!agentname || !privateKey || !publicKey)
    throw new Error("Encryption Keys Required - add to .env file");
const client = new client_1.Client(new agent_repository_1.AgentRepository(), new hypergraph_repository_1.HyperGraphRepository(), new petname_repository_1.PetNameRepository(), new network_1.Network());
(async () => {
    client.createAgent(agentname, publicKey);
    const graph = await client.openSession(publicKey, privateKey);
    if (graph instanceof Error) {
        console.log(graph.message);
        return;
    }
    const Encoding = new hypernode_1.HyperNode({
        data: Buffer.from("encoding", "ascii"),
    });
    const HelloWorld = new hypernode_1.HyperNode({
        data: Buffer.from("Hello World", "ascii"),
    });
    const ASCIIEncoding = new hypernode_1.HyperNode({
        data: Buffer.from("ascii", "ascii"),
    });
    const HelloWorldEncoding = new hyperedge_1.HyperEdge({
        data: [Encoding.id, ASCIIEncoding.id, HelloWorld.id],
    });
    graph.persist([Encoding, HelloWorld, ASCIIEncoding, HelloWorldEncoding], {});
    await graph.retrieve([Encoding.id, HelloWorld.id, ASCIIEncoding.id, HelloWorldEncoding.id], {});
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
//# sourceMappingURL=index.js.map