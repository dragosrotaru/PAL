"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HyperEdge = void 0;
var varint_1 = __importDefault(require("varint"));
var id_1 = require("../id");
var HyperEdge = (function () {
    function HyperEdge(from) {
        if ("data" in from) {
            this.data = from.data;
        }
        else {
            if (Buffer.compare(from.serialized.slice(0, 1), HyperEdge.type) !== 0) {
                throw new Error("serialized data is not a HyperEdge");
            }
            var bytes = from.serialized;
            this.data = [];
            var incomplete = true;
            while (incomplete) {
                var _a = id_1.parseID(bytes), leftOver = _a.leftOver, dataLength = _a.dataLength, multiHash = _a.multiHash;
                var serializedID = Buffer.concat([
                    multiHash,
                    varint_1.default.encode(dataLength, Buffer.from([])),
                ]);
                var id = new id_1.ID({ serialized: serializedID });
                this.data.push(id);
                bytes = leftOver;
                if (leftOver.length === 0) {
                    incomplete = false;
                }
            }
        }
        this.id = new id_1.ID({ data: this.serialized });
    }
    Object.defineProperty(HyperEdge.prototype, "serialized", {
        get: function () {
            return Buffer.concat(__spreadArrays([
                HyperEdge.type
            ], this.data.map(function (id) { return id.serialized; })));
        },
        enumerable: false,
        configurable: true
    });
    HyperEdge.type = Buffer.from("1", "binary");
    return HyperEdge;
}());
exports.HyperEdge = HyperEdge;
//# sourceMappingURL=index.js.map