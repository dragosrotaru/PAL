"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
var agent_1 = require("../agent");
var hypergraph_1 = require("../hypergraph");
var Client = (function () {
    function Client(agentRepo, graphRepo, nameRepo, network) {
        this.agentRepo = agentRepo;
        this.graphRepo = graphRepo;
        this.nameRepo = nameRepo;
        this.network = network;
    }
    Client.prototype.createAgent = function (name, publicKey) {
        return __awaiter(this, void 0, void 0, function () {
            var agent;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        agent = new agent_1.Agent({ type: "creation", name: name, publicKey: publicKey });
                        return [4, this.agentRepo.persistAgent(publicKey, agent.encrypted, agent.encryptedSymmetricKey)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    Client.prototype.openSession = function (publicKey, privateKey) {
        return __awaiter(this, void 0, void 0, function () {
            var errorMaybe;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.login(publicKey, privateKey)];
                    case 1:
                        errorMaybe = _a.sent();
                        if (errorMaybe instanceof Error)
                            return [2, errorMaybe];
                        return [4, this.decryptStorage()];
                    case 2:
                        errorMaybe = _a.sent();
                        if (errorMaybe instanceof Error)
                            return [2, errorMaybe];
                        return [4, this.connect()];
                    case 3:
                        errorMaybe = _a.sent();
                        if (errorMaybe instanceof Error)
                            return [2, errorMaybe];
                        return [4, this.getGraph()];
                    case 4: return [2, _a.sent()];
                }
            });
        });
    };
    Client.prototype.closeSession = function () {
        return __awaiter(this, void 0, void 0, function () {
            var errorMaybe;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.agent)
                            return [2, new Error("session not initialized")];
                        return [4, this.agentRepo.persistAgent(this.agent.publicKey, this.agent.encrypted, this.agent.encryptedSymmetricKey)];
                    case 1:
                        _a.sent();
                        return [4, this.encryptStorage()];
                    case 2:
                        errorMaybe = _a.sent();
                        if (errorMaybe instanceof Error)
                            return [2, errorMaybe];
                        return [4, this.disconnect()];
                    case 3:
                        errorMaybe = _a.sent();
                        return [2, errorMaybe];
                }
            });
        });
    };
    Client.prototype.login = function (publicKey, privateKey) {
        return __awaiter(this, void 0, void 0, function () {
            var encryptedAgent, encryptedSymmetricKey, decryptedagent;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.agentRepo.retrieveEncryptedAgent(publicKey)];
                    case 1:
                        encryptedAgent = _a.sent();
                        if (encryptedAgent instanceof Error)
                            return [2, encryptedAgent];
                        return [4, this.agentRepo.retrieveEncryptedSymmetricKey(publicKey)];
                    case 2:
                        encryptedSymmetricKey = _a.sent();
                        if (encryptedSymmetricKey instanceof Error)
                            return [2, encryptedSymmetricKey];
                        decryptedagent = new agent_1.Agent({
                            type: "decryption",
                            encryptedAgent: encryptedAgent,
                            encryptedSymmetricKey: encryptedSymmetricKey,
                            privateKey: privateKey,
                            publicKey: publicKey,
                        });
                        if (decryptedagent instanceof Error)
                            return [2, decryptedagent];
                        this.agent = decryptedagent;
                        return [2, null];
                }
            });
        });
    };
    Client.prototype.decryptStorage = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!this.agent)
                    return [2, new Error("agent private key required")];
                this.nameRepo.decrypt(this.agent.symmetricKey);
                this.graphRepo.decrypt(this.agent.symmetricKey);
                return [2, null];
            });
        });
    };
    Client.prototype.encryptStorage = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!this.agent)
                    return [2, new Error("agent private key required")];
                this.nameRepo.encrypt(this.agent.symmetricKey);
                this.graphRepo.encrypt(this.agent.symmetricKey);
                return [2, null];
            });
        });
    };
    Client.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (Math.random() > 0.001)
                    return [2, null];
                return [2, new Error("not implemented yet")];
            });
        });
    };
    Client.prototype.disconnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (Math.random() > 0.001)
                    return [2, null];
                return [2, new Error("not implemented yet")];
            });
        });
    };
    Client.prototype.getGraph = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.graph = new hypergraph_1.HyperGraph(this.graphRepo, this.nameRepo, this.network);
                return [2, this.graph];
            });
        });
    };
    return Client;
}());
exports.Client = Client;
//# sourceMappingURL=index.js.map