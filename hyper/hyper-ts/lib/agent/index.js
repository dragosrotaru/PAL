"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Agent = void 0;
var encryption_1 = require("../encryption");
var Agent = (function () {
    function Agent(props) {
        this.devices = [];
        this.peers = [];
        this.preferences = {};
        if (props.type === "creation") {
            this.name = props.name;
            this.symmetricKey = encryption_1.generateAESKey();
            this.publicKey = props.publicKey;
            if (props.preferences)
                this.preferences = props.preferences;
        }
        else {
            var symmetricKey = encryption_1.decryptRSA(props.privateKey, props.encryptedSymmetricKey);
            var agent = JSON.parse(encryption_1.decryptAES(symmetricKey, props.encryptedAgent).toString());
            console.log(agent);
            this.name = agent.name;
            this.symmetricKey = symmetricKey;
            this.publicKey = props.publicKey;
            if (agent.preferences)
                this.preferences = agent.preferences;
        }
    }
    Agent.prototype.addDevices = function () {
        var _a;
        var devices = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            devices[_i] = arguments[_i];
        }
        (_a = this.devices).push.apply(_a, devices);
    };
    Agent.prototype.addPeers = function () {
        var _a;
        var peers = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            peers[_i] = arguments[_i];
        }
        (_a = this.peers).push.apply(_a, peers);
    };
    Object.defineProperty(Agent.prototype, "encrypted", {
        get: function () {
            return Buffer.from(encryption_1.encryptAES(this.symmetricKey, Buffer.from(JSON.stringify({
                name: this.name,
                devices: this.devices,
                peers: this.peers,
                preferences: this.preferences,
            }))));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Agent.prototype, "encryptedSymmetricKey", {
        get: function () {
            return encryption_1.encryptRSA(this.publicKey, this.symmetricKey);
        },
        enumerable: false,
        configurable: true
    });
    return Agent;
}());
exports.Agent = Agent;
//# sourceMappingURL=index.js.map