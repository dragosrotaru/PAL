import {
  IAgentRepository,
  INetwork,
  IAgent,
  IHyperGraphRepository,
  IPetNameRepository,
  PublicKey,
  PrivateKey,
  Name,
  IHyperGraph,
} from "../interfaces";
import { Agent } from "../agent";
import { HyperGraph } from "../hypergraph";

export class Client {
  private agent?: IAgent;
  private graph?: IHyperGraph;
  constructor(
    private agentRepo: IAgentRepository,
    private graphRepo: IHyperGraphRepository,
    private nameRepo: IPetNameRepository,
    private network: INetwork
  ) {}
  async createAgent(name: Name, publicKey: PublicKey) {
    const agent = new Agent({ type: "creation", name, publicKey });
    return await this.agentRepo.persistAgent(
      publicKey,
      agent.encrypted,
      agent.encryptedSymmetricKey
    );
  }
  async openSession(publicKey: PublicKey, privateKey: PrivateKey) {
    let errorMaybe = await this.login(publicKey, privateKey);
    if (errorMaybe instanceof Error) return errorMaybe;
    errorMaybe = await this.decryptStorage();
    if (errorMaybe instanceof Error) return errorMaybe;
    errorMaybe = await this.connect();
    if (errorMaybe instanceof Error) return errorMaybe;
    return await this.getGraph();
  }
  async closeSession() {
    if (!this.agent) return new Error("session not initialized");
    await this.agentRepo.persistAgent(
      this.agent.publicKey,
      this.agent.encrypted,
      this.agent.encryptedSymmetricKey
    );
    let errorMaybe = await this.encryptStorage();
    if (errorMaybe instanceof Error) return errorMaybe;
    errorMaybe = await this.disconnect();
    return errorMaybe;
  }
  private async login(publicKey: PublicKey, privateKey: PrivateKey) {
    const encryptedAgent = await this.agentRepo.retrieveEncryptedAgent(
      publicKey
    );
    if (encryptedAgent instanceof Error) return encryptedAgent;
    const encryptedSymmetricKey = await this.agentRepo.retrieveEncryptedSymmetricKey(
      publicKey
    );
    if (encryptedSymmetricKey instanceof Error) return encryptedSymmetricKey;
    const decryptedagent = new Agent({
      type: "decryption",
      encryptedAgent,
      encryptedSymmetricKey,
      privateKey,
      publicKey,
    });
    if (decryptedagent instanceof Error) return decryptedagent;
    this.agent = decryptedagent;
    return null;
  }
  private async decryptStorage() {
    if (!this.agent) return new Error("agent private key required");
    this.nameRepo.decrypt(this.agent.symmetricKey);
    this.graphRepo.decrypt(this.agent.symmetricKey);
    return null;
  }
  private async encryptStorage() {
    if (!this.agent) return new Error("agent private key required");
    this.nameRepo.encrypt(this.agent.symmetricKey);
    this.graphRepo.encrypt(this.agent.symmetricKey);
    return null;
  }
  private async connect() {
    if (Math.random() > 0.001) return null;
    return new Error("not implemented yet");
  }
  private async disconnect() {
    if (Math.random() > 0.001) return null;
    return new Error("not implemented yet");
  }
  private async getGraph() {
    this.graph = new HyperGraph(this.graphRepo, this.nameRepo, this.network);
    return this.graph;
  }
}
