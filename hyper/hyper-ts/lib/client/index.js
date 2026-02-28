"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const agent_1 = require("../agent");
const hypergraph_1 = require("../hypergraph");
class Client {
    agentRepo;
    graphRepo;
    nameRepo;
    network;
    agent;
    graph;
    constructor(agentRepo, graphRepo, nameRepo, network) {
        this.agentRepo = agentRepo;
        this.graphRepo = graphRepo;
        this.nameRepo = nameRepo;
        this.network = network;
    }
    async createAgent(name, publicKey) {
        const agent = new agent_1.Agent({ type: "creation", name, publicKey });
        return await this.agentRepo.persistAgent(publicKey, agent.encrypted, agent.encryptedSymmetricKey);
    }
    async openSession(publicKey, privateKey) {
        let errorMaybe = await this.login(publicKey, privateKey);
        if (errorMaybe instanceof Error)
            return errorMaybe;
        errorMaybe = await this.decryptStorage();
        if (errorMaybe instanceof Error)
            return errorMaybe;
        errorMaybe = await this.connect();
        if (errorMaybe instanceof Error)
            return errorMaybe;
        return await this.getGraph();
    }
    async closeSession() {
        if (!this.agent)
            return new Error("session not initialized");
        await this.agentRepo.persistAgent(this.agent.publicKey, this.agent.encrypted, this.agent.encryptedSymmetricKey);
        let errorMaybe = await this.encryptStorage();
        if (errorMaybe instanceof Error)
            return errorMaybe;
        errorMaybe = await this.disconnect();
        return errorMaybe;
    }
    async login(publicKey, privateKey) {
        const encryptedAgent = await this.agentRepo.retrieveEncryptedAgent(publicKey);
        if (encryptedAgent instanceof Error)
            return encryptedAgent;
        const encryptedSymmetricKey = await this.agentRepo.retrieveEncryptedSymmetricKey(publicKey);
        if (encryptedSymmetricKey instanceof Error)
            return encryptedSymmetricKey;
        const decryptedagent = new agent_1.Agent({
            type: "decryption",
            encryptedAgent,
            encryptedSymmetricKey,
            privateKey,
            publicKey,
        });
        if (decryptedagent instanceof Error)
            return decryptedagent;
        this.agent = decryptedagent;
        return null;
    }
    async decryptStorage() {
        if (!this.agent)
            return new Error("agent private key required");
        this.nameRepo.decrypt(this.agent.symmetricKey);
        this.graphRepo.decrypt(this.agent.symmetricKey);
        return null;
    }
    async encryptStorage() {
        if (!this.agent)
            return new Error("agent private key required");
        this.nameRepo.encrypt(this.agent.symmetricKey);
        this.graphRepo.encrypt(this.agent.symmetricKey);
        return null;
    }
    async connect() {
        if (Math.random() > 0.001)
            return null;
        return new Error("not implemented yet");
    }
    async disconnect() {
        if (Math.random() > 0.001)
            return null;
        return new Error("not implemented yet");
    }
    async getGraph() {
        this.graph = new hypergraph_1.HyperGraph(this.graphRepo, this.nameRepo, this.network);
        return this.graph;
    }
}
exports.Client = Client;
//# sourceMappingURL=index.js.map