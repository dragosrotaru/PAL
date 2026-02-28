/// <reference types="node" />
import { IDevice, IPeer, Name } from "./other";
export declare type PrivateKey = string;
export declare type PublicKey = string;
export declare type SymmetricKey = Buffer;
export declare type EncryptedSymmetricKey = Buffer;
export declare type EncryptedAgent = Buffer;
export declare type AgentPreferences = {};
export interface IAgent {
    name: Name;
    devices: IDevice[];
    peers: IPeer[];
    preferences: AgentPreferences;
    symmetricKey: SymmetricKey;
    publicKey: PublicKey;
    addDevices: (...devices: IDevice[]) => void;
    addPeers: (...peers: IPeer[]) => void;
    encrypted: EncryptedAgent;
    encryptedSymmetricKey: EncryptedSymmetricKey;
}
export interface IAgentRepository {
    persistAgent: (publicKey: PublicKey, encryptedAgent: EncryptedAgent, encryptedSymmetricKey: EncryptedSymmetricKey) => Promise<Error | null>;
    retrieveEncryptedAgent: (publicKey: PublicKey) => Promise<Error | EncryptedAgent>;
    retrieveEncryptedSymmetricKey: (publicKey: PublicKey) => Promise<Error | EncryptedSymmetricKey>;
    retrieveAgentPublicKeys: () => Promise<Error | Name[]>;
}
//# sourceMappingURL=agent.d.ts.map