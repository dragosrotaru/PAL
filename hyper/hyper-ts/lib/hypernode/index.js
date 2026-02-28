"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HyperNode = void 0;
const id_1 = require("../id");
class HyperNode {
    static type = Buffer.from("0", "binary");
    id;
    data;
    constructor(from) {
        if ("data" in from) {
            this.data = from.data;
        }
        else {
            if (Buffer.compare(from.serialized.slice(0, 1), HyperNode.type) !== 0) {
                throw new Error("serialized data is not a HyperNode");
            }
            this.data = from.serialized.slice(1);
        }
        this.id = new id_1.ID({ data: this.serialized });
    }
    get serialized() {
        return Buffer.concat([HyperNode.type, this.data]);
    }
}
exports.HyperNode = HyperNode;
//# sourceMappingURL=index.js.map