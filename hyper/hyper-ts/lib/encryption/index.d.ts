/// <reference types="node" />
import { PublicKey, PrivateKey, SymmetricKey } from "../interfaces";
declare let encryptRSA: (publicKey: PublicKey, input: Buffer) => Buffer;
declare let decryptRSA: (privateKey: PrivateKey, input: Buffer) => Buffer;
declare let encryptAES: (symmetricKey: SymmetricKey, input: Buffer) => Buffer;
declare let decryptAES: (symmetricKey: SymmetricKey, input: Buffer) => Buffer;
declare let generateAESKey: () => SymmetricKey;
export { encryptRSA, decryptRSA, encryptAES, decryptAES, generateAESKey };
//# sourceMappingURL=index.d.ts.map