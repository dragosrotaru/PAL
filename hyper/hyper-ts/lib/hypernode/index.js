"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HyperNode = void 0;
var id_1 = require("../id");
var HyperNode = (function () {
    function HyperNode(from) {
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
    Object.defineProperty(HyperNode.prototype, "serialized", {
        get: function () {
            return Buffer.concat([HyperNode.type, this.data]);
        },
        enumerable: false,
        configurable: true
    });
    HyperNode.type = Buffer.from("0", "binary");
    return HyperNode;
}());
exports.HyperNode = HyperNode;
//# sourceMappingURL=index.js.map