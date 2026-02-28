"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAESKey = exports.decryptAES = exports.encryptAES = exports.decryptRSA = exports.encryptRSA = void 0;
var encryptRSA;
exports.encryptRSA = encryptRSA;
var decryptRSA;
exports.decryptRSA = decryptRSA;
var encryptAES;
exports.encryptAES = encryptAES;
var decryptAES;
exports.decryptAES = decryptAES;
var generateAESKey;
exports.generateAESKey = generateAESKey;
var crypto_1 = __importDefault(require("crypto"));
exports.encryptRSA = encryptRSA = function (publicKey, input) {
    return crypto_1.default.publicEncrypt({
        key: publicKey,
        oaepHash: "sha256",
        padding: crypto_1.default.constants.RSA_PKCS1_PADDING,
    }, input);
};
exports.decryptRSA = decryptRSA = function (privateKey, input) {
    return crypto_1.default.privateDecrypt({
        key: privateKey,
        oaepHash: "sha256",
        padding: crypto_1.default.constants.RSA_PKCS1_PADDING,
    }, input);
};
exports.encryptAES = encryptAES = function (symmetricKey, input) {
    var iv = crypto_1.default.randomBytes(32);
    var cipher = crypto_1.default.createCipheriv("aes-256-gcm", symmetricKey, iv);
    return Buffer.concat([iv, cipher.update(input), cipher.final()]);
};
exports.decryptAES = decryptAES = function (symmetricKey, input) {
    var iv = input.slice(0, 32);
    var decipher = crypto_1.default.createDecipheriv("aes-256-gcm", symmetricKey, iv);
    return decipher.update(input.slice(32));
};
exports.generateAESKey = generateAESKey = function () { return crypto_1.default.randomBytes(32); };
//# sourceMappingURL=index.js.map