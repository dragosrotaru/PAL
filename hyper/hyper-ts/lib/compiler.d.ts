declare class ASTEdge {
    id: string;
    content: (AST)[];
    constructor(...args: (AST)[]);
}
declare class Sym {
    id: string;
    constructor(id: string);
}
declare class Atom {
    content: string;
    id: string;
    constructor(content: string);
}
declare class Edge {
    id: string;
    content: string[];
    constructor(...args: (Sym | Edge | Atom)[]);
}
type AST = ASTEdge | Sym | Atom;
export declare class Compiler {
    TYPE: Sym;
    data: Map<string, Atom | Edge | Sym>;
    extensions: Map<string, Function>;
    addToMap(node: Sym | Atom | Edge): void;
    addExtension(type: Sym, code: string): void;
    addType(content: (Sym | Atom | Edge)[]): void;
    resolveExtension(node: Sym): Function;
    resolveEdgeContent(node: Edge): (Sym | Atom | Edge)[];
    loadProgram(): void;
    parse(node: Edge): AST;
    compile(node: AST): any;
}
declare class Obj {
    data: object;
    meta: {
        id: string;
        defaultInterface: string;
        type: string;
    };
}
declare class Type extends Obj {
    data: {
        name: string;
        defaultInterface: string;
        knownInterfaces: string[];
        schema: string;
    };
    constructor(id: string);
}
declare class Interface extends Obj {
    data: {
        name: string;
        defaultType: string;
        knownTypes: string[];
        schema: string;
    };
    constructor(id: string);
}
declare class Schema {
    meta: {
        id: string;
    };
}
export declare class UserInterface {
    interfaces: Map<string, Interface>;
    schemas: Map<string, Schema>;
    types: Map<string, Type>;
    objects: Map<string, Obj>;
    selectInterface(obj: Obj): Interface;
    render(obj: Obj): void;
}
export {};
//# sourceMappingURL=compiler.d.ts.map