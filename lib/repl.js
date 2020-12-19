"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var repl_1 = __importDefault(require("repl"));
var parser_1 = require("./parser");
var interpreter_1 = require("./interpreter");
repl_1.default.start({
    prompt: "lisp.ts > ",
    eval: function (cmd, context, filename, callback) {
        callback(null, interpreter_1.evalo(parser_1.parse(cmd)));
    },
});
//# sourceMappingURL=repl.js.map