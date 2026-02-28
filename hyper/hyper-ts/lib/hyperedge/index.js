"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HyperEdge = void 0;
const varint_1 = __importDefault(require("varint"));
const id_1 = require("../id");
class HyperEdge {
    static type = Buffer.from("1", "binary");
    id;
    data;
    constructor(from) {
        if ("data" in from) {
            this.data = from.data;
        }
        else {
            if (Buffer.compare(from.serialized.slice(0, 1), HyperEdge.type) !== 0) {
                throw new Error("serialized data is not a HyperEdge");
            }
            let bytes = from.serialized;
            this.data = [];
            let incomplete = true;
            while (incomplete) {
                const { leftOver, dataLength, multiHash } = (0, id_1.parseID)(bytes);
                const serializedID = Buffer.concat([
                    multiHash,
                    varint_1.default.encode(dataLength, Buffer.from([])),
                ]);
                const id = new id_1.ID({ serialized: serializedID });
                this.data.push(id);
                bytes = leftOver;
                if (leftOver.length === 0) {
                    incomplete = false;
                }
            }
        }
        this.id = new id_1.ID({ data: this.serialized });
    }
    get serialized() {
        return Buffer.concat([
            HyperEdge.type,
            ...this.data.map((id) => id.serialized),
        ]);
    }
}
exports.HyperEdge = HyperEdge;
//# sourceMappingURL=index.js.map