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