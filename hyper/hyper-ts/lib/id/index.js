"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ID = exports.parseID = void 0;
const crypto_1 = __importDefault(require("crypto"));
const varint_1 = __importDefault(require("varint"));
const multihash = require("multihashes");
const parseID = (bytes) => {
    if (!(bytes instanceof Uint8Array)) {
        throw new Error("multihash must be a Uint8Array");
    }
    if (bytes.length < 2) {
        throw new Error("multihash too short. must be > 2 bytes.");
    }
    // Get MultiHash Code
    const code = varint_1.default.decode(bytes);
    if (!exports.isValidCode(code)) {
        throw new Error(`multihash unknown function code: 0x${code.toString(16)}`);
    }
    // Get Multihash Length
    bytes = bytes.slice(varint_1.default.decode.bytes);
    const digestLength = varint_1.default.decode(bytes);
    if (digestLength < 0) {
        throw new Error(`multihash invalid length: ${digestLength}`);
    }
    // Get Multihash Digest
    bytes = bytes.slice(varint_1.default.decode.bytes);
    const digest = bytes.slice(0, digestLength);
    if (digest.length !== digestLength) {
        throw new Error("multihash length inconsistent");
    }
    // Get Data Length
    const dataLength = varint_1.default.decode(bytes.slice(digestLength));
    const mHash = multihash.encode(digest, code, digestLength);
    return { leftOver: bytes, dataLength, multiHash: mHash };
};
exports.parseID = parseID;
class ID {
    _HASHING_ALGORITHM = "sha256";
    _HASHING_ALGORITHM_MULTIHASH = "sha2-256";
    multiHash;
    bytes;
    constructor(from) {
        if ("data" in from) {
            const hash = crypto_1.default.createHash(this._HASHING_ALGORITHM);
            hash.update(from.data);
            this.multiHash = multihash.encode(hash.digest(), this._HASHING_ALGORITHM_MULTIHASH);
            this.bytes = from.data.byteLength;
        }
        else {
            let bytes = from.serialized;
            const { leftOver, dataLength, multiHash } = (0, exports.parseID)(bytes);
            this.bytes = dataLength;
            this.multiHash = multiHash;
            if (leftOver.byteLength !== 0) {
                throw new Error("ID length inconsistent");
            }
        }
    }
    get serialized() {
        return Buffer.concat([
            this.multiHash,
            varint_1.default.encode(this.bytes, Buffer.from([])),
        ]);
    }
}
exports.ID = ID;
//# sourceMappingURL=index.js.map