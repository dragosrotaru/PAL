"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ID = exports.parseID = void 0;
var crypto_1 = __importDefault(require("crypto"));
var varint_1 = __importDefault(require("varint"));
var multihash = require("multihashes");
exports.parseID = function (bytes) {
    if (!(bytes instanceof Uint8Array)) {
        throw new Error("multihash must be a Uint8Array");
    }
    if (bytes.length < 2) {
        throw new Error("multihash too short. must be > 2 bytes.");
    }
    var code = varint_1.default.decode(bytes);
    if (!exports.isValidCode(code)) {
        throw new Error("multihash unknown function code: 0x" + code.toString(16));
    }
    bytes = bytes.slice(varint_1.default.decode.bytes);
    var digestLength = varint_1.default.decode(bytes);
    if (digestLength < 0) {
        throw new Error("multihash invalid length: " + digestLength);
    }
    bytes = bytes.slice(varint_1.default.decode.bytes);
    var digest = bytes.slice(0, digestLength);
    if (digest.length !== digestLength) {
        throw new Error("multihash length inconsistent");
    }
    var dataLength = varint_1.default.decode(bytes.slice(digestLength));
    var mHash = multihash.encode(digest, code, digestLength);
    return { leftOver: bytes, dataLength: dataLength, multiHash: mHash };
};
var ID = (function () {
    function ID(from) {
        this._HASHING_ALGORITHM = "sha256";
        this._HASHING_ALGORITHM_MULTIHASH = "sha2-256";
        if ("data" in from) {
            var hash = crypto_1.default.createHash(this._HASHING_ALGORITHM);
            hash.update(from.data);
            this.multiHash = multihash.encode(hash.digest(), this._HASHING_ALGORITHM_MULTIHASH);
            this.bytes = from.data.byteLength;
        }
        else {
            var bytes = from.serialized;
            var _a = exports.parseID(bytes), leftOver = _a.leftOver, dataLength = _a.dataLength, multiHash = _a.multiHash;
            this.bytes = dataLength;
            this.multiHash = multiHash;
            if (leftOver.byteLength !== 0) {
                throw new Error("ID length inconsistent");
            }
        }
    }
    Object.defineProperty(ID.prototype, "serialized", {
        get: function () {
            return Buffer.concat([
                this.multiHash,
                varint_1.default.encode(this.bytes, Buffer.from([])),
            ]);
        },
        enumerable: false,
        configurable: true
    });
    return ID;
}());
exports.ID = ID;
//# sourceMappingURL=index.js.map