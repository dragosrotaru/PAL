import { IAgentRepository, PublicKey, SymmetricKey } from "../interfaces";

export class AgentRepository implements IAgentRepository {
  private encryptedSymmetricKeyMap: Map<PublicKey, SymmetricKey> = new Map();
  private encryptedAgentMap: Map<PublicKey, Buffer> = new Map();
  async persistAgent(
    publicKey: PublicKey,
    encryptedAgent: Buffer,
    encryptedSymmetricKey: SymmetricKey
  ) {
    this.encryptedSymmetricKeyMap.set(publicKey, encryptedSymmetricKey);
    this.encryptedAgentMap.set(publicKey, encryptedAgent);
    return null;
  }
  async retrieveEncryptedAgent(publicKey: PublicKey) {
    const encryptedAgent = this.encryptedAgentMap.get(publicKey);
    if (!encryptedAgent)
      return new Error(
        `agent with publicKey ${publicKey.slice(0, 100)} not found`
      );
    return encryptedAgent;
  }
  async retrieveEncryptedSymmetricKey(publicKey: PublicKey) {
    const encryptedSymmetricKey = this.encryptedSymmetricKeyMap.get(publicKey);
    if (!encryptedSymmetricKey)
      return new Error(
        `symmetric key for publicKey ${publicKey.slice(0, 100)} not found`
      );
    return encryptedSymmetricKey;
  }
  async retrieveAgentPublicKeys() {
    return Array.from(this.encryptedAgentMap.keys());
  }
}
