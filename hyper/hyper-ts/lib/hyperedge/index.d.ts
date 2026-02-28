import { ID } from "../id";
interface FromData {
    data: ID[];
}
interface FromSerialized {
    serialized: Buffer;
}
type From = FromData | FromSerialized;
export declare class HyperEdge {
    static readonly type: Buffer;
    readonly id: ID;
    readonly data: ID[];
    constructor(from: From);
    get serialized(): Buffer;
}
export {};
//# sourceMappingURL=index.d.ts.map