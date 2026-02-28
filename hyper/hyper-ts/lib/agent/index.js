"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Agent = void 0;
const encryption_1 = require("../encryption");
class Agent {
    name;
    devices = [];
    peers = [];
    preferences = {};
    symmetricKey;
    publicKey;
    constructor(props) {
        if (props.type === "creation") {
            this.name = props.name;
            this.symmetricKey = (0, encryption_1.generateAESKey)();
            this.publicKey = props.publicKey;
            if (props.preferences)
                this.preferences = props.preferences;
        }
        else {
            const symmetricKey = (0, encryption_1.decryptRSA)(props.privateKey, props.encryptedSymmetricKey);
            const agent = JSON.parse((0, encryption_1.decryptAES)(symmetricKey, props.encryptedAgent).toString());
            console.log(agent);
            this.name = agent.name;
            this.symmetricKey = symmetricKey;
            this.publicKey = props.publicKey;
            if (agent.preferences)
                this.preferences = agent.preferences;
        }
    }
    addDevices(...devices) {
        this.devices.push(...devices);
    }
    addPeers(...peers) {
        this.peers.push(...peers);
    }
    get encrypted() {
        return Buffer.from((0, encryption_1.encryptAES)(this.symmetricKey, Buffer.from(JSON.stringify({
            name: this.name,
            devices: this.devices,
            peers: this.peers,
            preferences: this.preferences,
        }))));
    }
    get encryptedSymmetricKey() {
        return (0, encryption_1.encryptRSA)(this.publicKey, this.symmetricKey);
    }
}
exports.Agent = Agent;
//# sourceMappingURL=index.js.map