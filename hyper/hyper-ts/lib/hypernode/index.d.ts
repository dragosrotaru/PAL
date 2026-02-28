/// <reference types="node" />
import { ID } from "../id";
interface FromData {
    data: Buffer;
}
interface FromSerialized {
    serialized: Buffer;
}
declare type From = FromData | FromSerialized;
export declare class HyperNode {
    static readonly type: Buffer;
    readonly id: ID;
    readonly data: Buffer;
    constructor(from: From);
    get serialized(): Buffer;
}
export {};
//# sourceMappingURL=index.d.ts.map