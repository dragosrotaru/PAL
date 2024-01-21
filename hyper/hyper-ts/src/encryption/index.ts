import { PublicKey, PrivateKey, SymmetricKey } from "../interfaces";

let encryptRSA: (publicKey: PublicKey, input: Buffer) => Buffer;
let decryptRSA: (privateKey: PrivateKey, input: Buffer) => Buffer;

let encryptAES: (symmetricKey: SymmetricKey, input: Buffer) => Buffer;
let decryptAES: (symmetricKey: SymmetricKey, input: Buffer) => Buffer;

let generateAESKey: () => SymmetricKey;

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

import crypto from "crypto";

encryptRSA = (publicKey, input) => {
  return crypto.publicEncrypt(
    {
      key: publicKey,
      oaepHash: "sha256",
      padding: crypto.constants.RSA_PKCS1_PADDING,
    },
    input
  );
};
decryptRSA = (privateKey, input) => {
  return crypto.privateDecrypt(
    {
      key: privateKey,
      oaepHash: "sha256",
      padding: crypto.constants.RSA_PKCS1_PADDING,
    },
    input
  );
};
encryptAES = (symmetricKey, input) => {
  const iv = crypto.randomBytes(32);
  const cipher = crypto.createCipheriv("aes-256-gcm", symmetricKey, iv);
  return Buffer.concat([iv, cipher.update(input), cipher.final()]);
};
decryptAES = (symmetricKey, input) => {
  const iv = input.slice(0, 32);
  const decipher = crypto.createDecipheriv("aes-256-gcm", symmetricKey, iv);
  return decipher.update(input.slice(32));
};
generateAESKey = () => crypto.randomBytes(32);

export { encryptRSA, decryptRSA, encryptAES, decryptAES, generateAESKey };
