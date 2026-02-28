import { IAgent, Name, AgentPreferences, IDevice, IPeer, EncryptedAgent, SymmetricKey, PublicKey, PrivateKey, EncryptedSymmetricKey } from "../interfaces";
interface CreationProps {
    type: "creation";
    name: Name;
    publicKey: PublicKey;
    preferences?: AgentPreferences;
}
interface DecryptionProps {
    type: "decryption";
    encryptedAgent: EncryptedAgent;
    encryptedSymmetricKey: EncryptedSymmetricKey;
    privateKey: PrivateKey;
    publicKey: PrivateKey;
}
type Props = DecryptionProps | CreationProps;
export declare class Agent implements IAgent {
    name: Name;
    devices: IDevice[];
    peers: IPeer[];
    preferences: AgentPreferences;
    symmetricKey: SymmetricKey;
    publicKey: PublicKey;
    constructor(props: Props);
    addDevices(...devices: IDevice[]): void;
    addPeers(...peers: IPeer[]): void;
    get encrypted(): EncryptedAgent;
    get encryptedSymmetricKey(): Buffer<ArrayBufferLike>;
}
export {};
//# sourceMappingURL=index.d.ts.map