/**
 * @file HyperGraph client — session lifecycle manager.
 *
 * `Client` orchestrates the full session lifecycle for a `HyperGraph` instance:
 * - `createAgent` — register a new agent with a name + public key.
 * - `openSession` — login (decrypt agent blob) → decrypt storage → connect to network → return HyperGraph.
 * - `closeSession` — encrypt storage → persist agent → disconnect.
 *
 * All operations return `Error | null` rather than throwing, following an error-value convention.
 *
 * Known stubs:
 * - `connect()` and `disconnect()` have a ~99.9% no-op pass-through;
 *   actual P2P networking is not implemented.
 */
import { IAgentRepository, INetwork, IHyperGraphRepository, IPetNameRepository, PublicKey, PrivateKey, Name, IHyperGraph } from "../interfaces";
export declare class Client {
    private agentRepo;
    private graphRepo;
    private nameRepo;
    private network;
    private agent?;
    private graph?;
    constructor(agentRepo: IAgentRepository, graphRepo: IHyperGraphRepository, nameRepo: IPetNameRepository, network: INetwork);
    createAgent(name: Name, publicKey: PublicKey): Promise<Error | null>;
    openSession(publicKey: PublicKey, privateKey: PrivateKey): Promise<Error | IHyperGraph>;
    closeSession(): Promise<Error | null>;
    private login;
    private decryptStorage;
    private encryptStorage;
    private connect;
    private disconnect;
    private getGraph;
}
//# sourceMappingURL=index.d.ts.map