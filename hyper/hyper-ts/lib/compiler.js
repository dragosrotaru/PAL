"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserInterface = exports.Compiler = void 0;
var ASTEdge = (function () {
    function ASTEdge() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.content = args;
    }
    return ASTEdge;
}());
var Sym = (function () {
    function Sym(id) {
        this.id = id;
    }
    return Sym;
}());
var Atom = (function () {
    function Atom(content) {
        this.content = content;
    }
    return Atom;
}());
var Edge = (function () {
    function Edge() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.content = args.map(function (arg) { return arg.id; });
    }
    return Edge;
}());
var TYPE = new Sym('type');
var Compiler = (function () {
    function Compiler() {
        this.TYPE = TYPE;
        this.data = new Map();
        this.extensions = new Map();
    }
    Compiler.prototype.addToMap = function (node) {
        if (!this.data.has(node.id)) {
            this.data.set(node.id, node);
        }
    };
    Compiler.prototype.addExtension = function (type, code) {
        var extension = this.extensions.get(type.id);
        if (!extension) {
            this.extensions.set(type.id, new Function(code));
        }
    };
    Compiler.prototype.addType = function (content) {
        var type = content[1];
        var code = content[2];
        if (type instanceof Sym && code instanceof Atom) {
            this.addExtension(type, code.content);
        }
        else {
            throw new Error("Invalid type definition");
        }
    };
    Compiler.prototype.resolveExtension = function (node) {
        var extension = this.extensions.get(node.id);
        if (!extension) {
            throw new Error("Extension Not Found");
        }
        return extension;
    };
    Compiler.prototype.resolveEdgeContent = function (node) {
        var _this = this;
        return node.content.map(function (childID) {
            var child = _this.data.get(childID);
            if (!child) {
                throw new Error("Could Not Resolve Edge Gild");
            }
            return child;
        });
    };
    Compiler.prototype.loadProgram = function () {
    };
    Compiler.prototype.parse = function (node) {
        var _this = this;
        return new (ASTEdge.bind.apply(ASTEdge, __spreadArrays([void 0], node.content.map(function (id) {
            var child = _this.data.get(id);
            if (!child) {
                throw new Error("Could Not Resolve Child");
            }
            else if (child instanceof Sym) {
                return child;
            }
            else if (child instanceof Atom) {
                return child;
            }
            else if (child instanceof Edge) {
                return _this.parse(child);
            }
            else {
                throw new Error("Unknown child type");
            }
        }))))();
    };
    Compiler.prototype.compile = function (node) {
        if (node instanceof ASTEdge) {
            var content = node.content;
            var first = content[0];
            if (!(first instanceof Sym)) {
                throw new Error("Unknown Edge");
            }
            if (first.id === this.TYPE.id) {
                this.addType(content);
                return node;
            }
            try {
                var extension = this.resolveExtension(first);
                return extension.apply({ context: this, node: node });
            }
            catch (error) {
                throw new Error('Unknown Type');
            }
        }
        return node;
    };
    return Compiler;
}());
exports.Compiler = Compiler;
function String() {
    var content = this.node.content;
    if (content.length !== 2) {
        throw new Error("Invalid String Edge");
    }
    var value = content[1];
    if (!(value instanceof Atom)) {
        throw new Error("Invalid String Edge");
    }
    return value.content;
}
;
var StringType = new ASTEdge(TYPE, new Sym('String'), new Atom(String.toString()));
function Property() {
    var _a = this, content = _a.node.content, context = _a.context;
    if (content.length !== 3) {
        throw new Error("Invalid Property Edge");
    }
    var name = content[1];
    var value = content[3];
    if (!(name instanceof Atom && value instanceof ASTEdge)) {
        throw new Error("Invalid Property Edge");
    }
    return { name: name, value: context.compile(value) };
}
var PropertyType = new ASTEdge(TYPE, new Sym('Property'), new Atom(Property.toString()));
function Object() {
    var _a = this, content = _a.node.content, context = _a.context;
    if (content.length < 2) {
        throw new Error("Invalid Object Edge: Must Have a Type");
    }
    var type = content[1];
    if (!(type instanceof Sym)) {
        throw new Error("Invalid Object Edge: Must Have a Type");
    }
    var obj = {};
    var properties = content.slice(2);
    properties.forEach(function (property) {
        if (property instanceof ASTEdge) {
            var _a = context.compile(property), name_1 = _a.name, value = _a.value;
            obj[name_1] = value;
        }
    });
    return { type: type, properties: content.slice(2) };
}
var ObjectType = new ASTEdge(TYPE, new Sym('Object'), new Atom(Object.toString()));
var Task = new ASTEdge(ObjectType, new Sym("Task"), new ASTEdge(PropertyType, new Atom("name"), new ASTEdge(StringType, new Atom("write a compiler"))), new ASTEdge(PropertyType, new Atom("status"), new ASTEdge(StringType, new Atom("in progress"))));
var compiler = new Compiler();
compiler.compile(Task);
var Obj = (function () {
    function Obj() {
    }
    return Obj;
}());
var Type = (function (_super) {
    __extends(Type, _super);
    function Type(id) {
        var _this = _super.call(this) || this;
        _this.meta = {
            id: id,
            defaultInterface: "typeInterface",
            type: "type"
        };
        return _this;
    }
    return Type;
}(Obj));
var Interface = (function (_super) {
    __extends(Interface, _super);
    function Interface(id) {
        var _this = _super.call(this) || this;
        _this.meta = {
            id: id,
            defaultInterface: "typeInterface",
            type: "type"
        };
        return _this;
    }
    return Interface;
}(Obj));
var Schema = (function () {
    function Schema() {
    }
    return Schema;
}());
var UserInterface = (function () {
    function UserInterface() {
        this.interfaces = new Map();
        this.schemas = new Map();
        this.types = new Map();
        this.objects = new Map();
    }
    UserInterface.prototype.selectInterface = function (obj) {
        var objDefaultInterface = this.interfaces.get(obj.meta.defaultInterface);
        if (objDefaultInterface)
            return objDefaultInterface;
        var type = this.types.get(obj.meta.type);
        if (!type)
            throw new Error("Type not found");
        var typeDefaultInterface = this.interfaces.get(type.data.defaultInterface);
        if (typeDefaultInterface)
            return typeDefaultInterface;
        var firstknownInterface = this.interfaces.get(type.data.knownInterfaces[0]);
        if (firstknownInterface)
            return firstknownInterface;
        throw new Error("No interface found");
    };
    UserInterface.prototype.render = function (obj) {
        throw new Error("Not Implemented");
    };
    return UserInterface;
}());
exports.UserInterface = UserInterface;
//# sourceMappingURL=compiler.js.map