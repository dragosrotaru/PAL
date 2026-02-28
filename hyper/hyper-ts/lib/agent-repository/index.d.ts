import { IAgentRepository, PublicKey, SymmetricKey } from "../interfaces";
export declare class AgentRepository implements IAgentRepository {
    private encryptedSymmetricKeyMap;
    private encryptedAgentMap;
    persistAgent(publicKey: PublicKey, encryptedAgent: Buffer, encryptedSymmetricKey: SymmetricKey): Promise<null>;
    retrieveEncryptedAgent(publicKey: PublicKey): Promise<Buffer<ArrayBufferLike> | Error>;
    retrieveEncryptedSymmetricKey(publicKey: PublicKey): Promise<Error | SymmetricKey>;
    retrieveAgentPublicKeys(): Promise<string[]>;
}
//# sourceMappingURL=index.d.ts.map