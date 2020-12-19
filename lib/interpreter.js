"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evalo = void 0;
var ast_1 = require("./ast");
var Env = function (parent) { return function (x, arg) {
    console.log("environment created", x, arg);
    return function (y) {
        console.log("environment accessed", y, x, arg);
        if (y === x)
            return arg;
        return parent(x);
    };
}; };
var evalexpr = function (ast, env) {
    console.log("evaluating", ast);
    if (ast_1.IsIdentifier(ast)) {
        console.log("pattern: identifier", ast);
        return env(ast);
    }
    else if (ast_1.IsProcedure(ast)) {
        console.log("pattern: procedure", ast);
        return ast;
    }
    else if (ast_1.IsLambdaForm(ast)) {
        var args = ast[1];
        var body_1 = ast[2];
        console.log("pattern: lambda", args, body_1);
        var firstArg_1 = args[0];
        var proc = function (argument) {
            console.log("procedure called");
            return evalexpr(body_1, Env(env)(firstArg_1, argument));
        };
        return proc;
    }
    else if (ast_1.IsApplyForm(ast)) {
        var applied = ast.map(function (a) { return evalexpr(a, env); });
        var rator = applied[0];
        var rand = applied[1];
        console.log("pattern: apply", rator, rand);
        if (ast_1.IsProcedure(rator)) {
            console.log("rator applied to rand");
            return rator(rand);
        }
        return applied;
    }
    else {
        throw new Error("invalid expression");
    }
};
var evalo = function (ast) {
    var env = function (id) {
        if (id === "a")
            return "hello world";
        throw new Error("unbound identifier " + id);
    };
    return evalexpr(ast, env);
};
exports.evalo = evalo;
//# sourceMappingURL=interpreter.js.map