interface FromData {
    data: Buffer;
}
interface FromSerialized {
    serialized: Buffer;
}
type From = FromData | FromSerialized;
export declare const parseID: (bytes: Buffer<ArrayBufferLike>) => {
    leftOver: Buffer<ArrayBufferLike>;
    dataLength: number;
    multiHash: Buffer<ArrayBufferLike>;
};
export declare class ID {
    readonly _HASHING_ALGORITHM = "sha256";
    readonly _HASHING_ALGORITHM_MULTIHASH = "sha2-256";
    readonly multiHash: Buffer;
    readonly bytes: number;
    constructor(from: From);
    get serialized(): Buffer<ArrayBuffer>;
}
export {};
//# sourceMappingURL=index.d.ts.map