import { IDevice, IPeer, Name } from "./other";

/**
 * RSA 4096 Private Key
 */
export type PrivateKey = string;

/**
 * RSA 4096 Public Key
 */
export type PublicKey = string;

/**
 * AES256 Symmetric Key
 */
export type SymmetricKey = Buffer;

/**
 * AES256 Symmetric Key encrypted with PrivateKey
 */
export type EncryptedSymmetricKey = Buffer;

/**
 * encrypted with AES256 Symmetric Key
 */
export type EncryptedAgent = Buffer;

export type AgentPreferences = {};

// Encrypted With SymmetricKey
export interface IAgent {
  // Non Unique Name
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
  persistAgent: (
    publicKey: PublicKey,
    encryptedAgent: EncryptedAgent,
    encryptedSymmetricKey: EncryptedSymmetricKey
  ) => Promise<Error | null>;
  retrieveEncryptedAgent: (
    publicKey: PublicKey
  ) => Promise<Error | EncryptedAgent>;
  retrieveEncryptedSymmetricKey: (
    publicKey: PublicKey
  ) => Promise<Error | EncryptedSymmetricKey>;
  retrieveAgentPublicKeys: () => Promise<Error | Name[]>;
}
