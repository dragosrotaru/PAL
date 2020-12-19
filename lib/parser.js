"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
var tokenizer = function (source) { return source.trim().split(/\s+/); };
var ASTBuilder = function (tokens, list) {
    var token = tokens.shift();
    if (!token) {
        var ast = list.pop();
        if (ast)
            return ast;
        throw new Error("Invalid");
    }
    else if (token === "(") {
        var ast = ASTBuilder(tokens, []);
        if (ast)
            list.push(ast);
        return ASTBuilder(tokens, list);
    }
    else if (token === ")") {
        return list;
    }
    else {
        return ASTBuilder(tokens, list.concat(categorize(token)));
    }
};
var categorize = function (token) { return token; };
var parse = function (source) {
    return ASTBuilder(tokenizer(source), []);
};
exports.parse = parse;
//# sourceMappingURL=parser.js.map