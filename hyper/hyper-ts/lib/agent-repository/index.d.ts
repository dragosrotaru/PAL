/// <reference types="node" />
import { IAgentRepository, PublicKey, SymmetricKey } from "../interfaces";
export declare class AgentRepository implements IAgentRepository {
    private encryptedSymmetricKeyMap;
    private encryptedAgentMap;
    persistAgent(publicKey: PublicKey, encryptedAgent: Buffer, encryptedSymmetricKey: SymmetricKey): Promise<null>;
    retrieveEncryptedAgent(publicKey: PublicKey): Promise<Error | Buffer>;
    retrieveEncryptedSymmetricKey(publicKey: PublicKey): Promise<Error | Buffer>;
    retrieveAgentPublicKeys(): Promise<string[]>;
}
//# sourceMappingURL=index.d.ts.map