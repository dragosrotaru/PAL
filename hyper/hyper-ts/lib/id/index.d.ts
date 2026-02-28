/// <reference types="node" />
interface FromData {
    data: Buffer;
}
interface FromSerialized {
    serialized: Buffer;
}
declare type From = FromData | FromSerialized;
export declare const parseID: (bytes: Buffer) => {
    leftOver: Buffer;
    dataLength: number;
    multiHash: Buffer;
};
export declare class ID {
    readonly _HASHING_ALGORITHM = "sha256";
    readonly _HASHING_ALGORITHM_MULTIHASH = "sha2-256";
    readonly multiHash: Buffer;
    readonly bytes: number;
    constructor(from: From);
    get serialized(): Buffer;
}
export {};
//# sourceMappingURL=index.d.ts.map