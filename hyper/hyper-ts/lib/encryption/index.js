"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAESKey = exports.decryptAES = exports.encryptAES = exports.decryptRSA = exports.encryptRSA = void 0;
let encryptRSA;
let decryptRSA;
let encryptAES;
let decryptAES;
let generateAESKey;
/* if (typeof window !== "undefined") {
  const JSEncrypt = require("jsencrypt/bin/jsencrypt.js");
  encryptRSA = (publicKey, input) => {
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(publicKey);
    return encrypt.encrypt(input);
  };

  decryptRSA = (privateKey, input) => {
    const decrypt = new JSEncrypt();
    decrypt.setPrivateKey(privateKey);
    return decrypt.decrypt(input);
  };
} else {} */
const crypto_1 = __importDefault(require("crypto"));
exports.encryptRSA = encryptRSA = (publicKey, input) => {
    return crypto_1.default.publicEncrypt({
        key: publicKey,
        oaepHash: "sha256",
        padding: crypto_1.default.constants.RSA_PKCS1_PADDING,
    }, input);
};
exports.decryptRSA = decryptRSA = (privateKey, input) => {
    return crypto_1.default.privateDecrypt({
        key: privateKey,
        oaepHash: "sha256",
        padding: crypto_1.default.constants.RSA_PKCS1_PADDING,
    }, input);
};
exports.encryptAES = encryptAES = (symmetricKey, input) => {
    const iv = crypto_1.default.randomBytes(32);
    const cipher = crypto_1.default.createCipheriv("aes-256-gcm", symmetricKey, iv);
    return Buffer.concat([iv, cipher.update(input), cipher.final()]);
};
exports.decryptAES = decryptAES = (symmetricKey, input) => {
    const iv = input.slice(0, 32);
    const decipher = crypto_1.default.createDecipheriv("aes-256-gcm", symmetricKey, iv);
    return decipher.update(input.slice(32));
};
exports.generateAESKey = generateAESKey = () => crypto_1.default.randomBytes(32);
//# sourceMappingURL=index.js.map