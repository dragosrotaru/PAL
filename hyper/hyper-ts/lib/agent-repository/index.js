"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentRepository = void 0;
class AgentRepository {
    encryptedSymmetricKeyMap = new Map();
    encryptedAgentMap = new Map();
    async persistAgent(publicKey, encryptedAgent, encryptedSymmetricKey) {
        this.encryptedSymmetricKeyMap.set(publicKey, encryptedSymmetricKey);
        this.encryptedAgentMap.set(publicKey, encryptedAgent);
        return null;
    }
    async retrieveEncryptedAgent(publicKey) {
        const encryptedAgent = this.encryptedAgentMap.get(publicKey);
        if (!encryptedAgent)
            return new Error(`agent with publicKey ${publicKey.slice(0, 100)} not found`);
        return encryptedAgent;
    }
    async retrieveEncryptedSymmetricKey(publicKey) {
        const encryptedSymmetricKey = this.encryptedSymmetricKeyMap.get(publicKey);
        if (!encryptedSymmetricKey)
            return new Error(`symmetric key for publicKey ${publicKey.slice(0, 100)} not found`);
        return encryptedSymmetricKey;
    }
    async retrieveAgentPublicKeys() {
        return Array.from(this.encryptedAgentMap.keys());
    }
}
exports.AgentRepository = AgentRepository;
//# sourceMappingURL=index.js.map