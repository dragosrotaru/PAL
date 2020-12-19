"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsProcedureForm = exports.IsApplyForm = exports.IsLambdaForm = exports.IsLambdaArguments = exports.LAMBDA_IDENTIFIER = exports.IsList = exports.IsAtom = exports.IsProcedure = exports.IsIdentifierList = exports.IsIdentifier = void 0;
var IsIdentifier = function (ast) {
    return typeof ast === "string";
};
exports.IsIdentifier = IsIdentifier;
var IsIdentifierList = function (ast) {
    return exports.IsList(ast) && ast.every(exports.IsIdentifier);
};
exports.IsIdentifierList = IsIdentifierList;
var IsProcedure = function (ast) {
    return ast instanceof Function;
};
exports.IsProcedure = IsProcedure;
var IsAtom = function (ast) {
    return exports.IsIdentifier(ast) || exports.IsProcedure(ast);
};
exports.IsAtom = IsAtom;
var IsList = function (ast) { return Array.isArray(ast); };
exports.IsList = IsList;
exports.LAMBDA_IDENTIFIER = "lambda";
var IsLambdaArguments = function (ast) {
    return exports.IsIdentifierList(ast) && ast.length === 1;
};
exports.IsLambdaArguments = IsLambdaArguments;
var IsLambdaForm = function (ast) {
    return exports.IsList(ast) &&
        ast.length === 3 &&
        ast[0] === exports.LAMBDA_IDENTIFIER &&
        exports.IsLambdaArguments(ast[1]);
};
exports.IsLambdaForm = IsLambdaForm;
var IsApplyForm = function (ast) {
    return exports.IsList(ast) && ast.length === 2;
};
exports.IsApplyForm = IsApplyForm;
var IsProcedureForm = function (ast) {
    return exports.IsApplyForm(ast) && exports.IsProcedure(ast[0]);
};
exports.IsProcedureForm = IsProcedureForm;
//# sourceMappingURL=ast.js.map