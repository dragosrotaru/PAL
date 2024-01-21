class ASTEdge {
    public id: string;
    public content: (AST)[];
    constructor(
        ...args: (AST)[]
    ) {
        this.content = args;
    }
}
class Sym {
    constructor(public id: string) {}
}

class Atom {
    public id: string
    constructor(public content: string) {}
}

class Edge {
    public id: string;
    public content: string[];
    constructor(
        ...args: (Sym|Edge|Atom)[]
    ) {
        this.content = args.map((arg) => arg.id);
    }
}

type AST = ASTEdge | Sym | Atom;

const TYPE = new Sym('type');

export class Compiler {
    TYPE = TYPE;
    data = new Map<string, Sym | Atom | Edge>();
    extensions = new Map<string, Function>();

    addToMap(node: Sym | Atom | Edge) {
        if (!this.data.has(node.id)) {
            this.data.set(node.id, node);
        }
    }

    addExtension (type: Sym, code: string) {
        const extension = this.extensions.get(type.id);
        if (!extension) {
            // TODO validate code
            this.extensions.set(type.id , new Function (code));
        }
    }

    addType(content: (Sym|Atom|Edge)[]): void {
        const type = content[1];
        const code = content[2];
        if (type instanceof Sym && code instanceof Atom) {
            this.addExtension(type, code.content);
        } else {
            throw new Error("Invalid type definition");
        }
    }

    resolveExtension(node: Sym): Function {
        const extension = this.extensions.get(node.id);
        if (!extension) {
            // TODO add network resolver
            throw new Error("Extension Not Found");
        }
        return extension;
    }

    resolveEdgeContent(node: Edge): (Sym|Atom|Edge)[] {
        return node.content.map(childID => {
            const child = this.data.get(childID);
            if (!child) {
                throw new Error("Could Not Resolve Edge Gild");
            }
            return child;
        })
    }

    loadProgram() {
        // TODO given a list of nodes, add them to the map

    }
    
    parse(node: Edge): AST {
        return new ASTEdge(...node.content.map((id) => {
            const child = this.data.get(id);
            if (!child) {
                // TODO add network resolver
                throw new Error("Could Not Resolve Child");
            } else if (child instanceof Sym) {
                return child;
            } else if (child instanceof Atom) {
                return child;
            } else if (child instanceof Edge) {
                return this.parse(child);
            }
        }));
    }

    compile(node: AST) {
        if (node instanceof ASTEdge) {
            const { content } = node;
            const first = content[0];
           
            if (!(first instanceof Sym)) {
                throw new Error("Unknown Edge");
            }
           
            if (first.id === this.TYPE.id) {
                this.addType(content);
                return node;
            } 
            
            try {
                const extension = this.resolveExtension(first);
                // TODO block access to global scope
                return extension.apply({ context: this, node });
            } catch (error) {
                throw new Error('Unknown Type');
            }
        }
        return node; 
    }
}


/* COMPILER EXTENSIONS */

type ExtensionScope = {
    context: Compiler;
    node: ASTEdge;
};

/**
* Type:String Atom:Value
*/
function String() {
    const { node: { content } } = this as ExtensionScope;
    if (content.length !== 2) {
        throw new Error("Invalid String Edge");
    }

    const value = content[1];
    if (!(value instanceof Atom)) {
        throw new Error("Invalid String Edge");
    }

    return value.content;
};

const StringType = new ASTEdge(TYPE, new Sym('String'), new Atom(String.toString()));


/**
 * Type:Property Atom:Name Atom:Value
 */
function Property() {
    const { node: { content }, context } = this as ExtensionScope;
    if (content.length !== 3) {
        throw new Error("Invalid Property Edge");
    }
    const name = content[1];
    const value = content[3];
    if (!(name instanceof Atom && value instanceof ASTEdge)) {
        throw new Error("Invalid Property Edge");
    }
    return { name, value: context.compile(value) }
}

const PropertyType = new ASTEdge(TYPE, new Sym('Property'), new Atom(Property.toString()));


/**
 * Type:Object Edge:Property Edge:Property
 */
function Object() {
    const { node: { content }, context } = this as ExtensionScope;
    if (content.length < 2) {
        throw new Error("Invalid Object Edge: Must Have a Type");
    }
    const type = content[1];
    if (!(type instanceof Sym)) {
        throw new Error("Invalid Object Edge: Must Have a Type");
    }
    const obj = {};
    const properties = content.slice(2);
    properties.forEach(property => {
        if (property instanceof ASTEdge) {
            const { name, value } = context.compile(property);
            obj[name] = value;
        }
        
    })
    return { type, properties: content.slice(2) }
}


const ObjectType = new ASTEdge(TYPE, new Sym('Object'), new Atom(Object.toString()));


/* USER DEFINED TYPES */


const Task = new ASTEdge(
    ObjectType,
    new Sym("Task"),
    new ASTEdge(PropertyType, new Atom("name"), new ASTEdge(StringType, new Atom("write a compiler"))),
    new ASTEdge(PropertyType, new Atom("status"), new ASTEdge(StringType, new Atom("in progress")))
);

// TODO implement Classes, or Object Templates / Projections
/* 
const Task = new Edge(
    TaskType,
    new Atom("status"),
    new Atom("in progress")
); */

const compiler = new Compiler();
compiler.compile(Task);



class Obj {
    data: object;
    meta: {
        id: string;
        defaultInterface: string;
        type: string;
    }
}

class Type extends Obj {
    data: {
        name: string;
        defaultInterface: string;
        knownInterfaces: string[];
        schema: string;
    }
    constructor(id: string) {
        super();
        this.meta = {
            id,
            defaultInterface: "typeInterface",
            type: "type"
        }
    }
}

class Interface  extends Obj {
    data: {
        name: string;
        defaultType: string;
        knownTypes: string[];
        schema: string;
    }
    constructor(id: string) {
        super();
        this.meta = {
            id,
            defaultInterface: "typeInterface",
            type: "type"
        }
    }
}

class Schema {
    meta: {
        id: string;
    }
}


export class UserInterface {
    interfaces = new Map<string, Interface>();
    schemas = new Map<string, Schema>();
    types = new Map<string, Type>();
    objects = new Map<string, Obj>();

    selectInterface(obj: Obj) {        
        const objDefaultInterface = this.interfaces.get(obj.meta.defaultInterface);
        if (objDefaultInterface) return objDefaultInterface;
        
        const type = this.types.get(obj.meta.type);
        const typeDefaultInterface = this.interfaces.get(type.data.defaultInterface);
        if (typeDefaultInterface) return typeDefaultInterface;

        const firstknownInterface = this.interfaces.get(type.data.knownInterfaces[0]);
        if (firstknownInterface) return firstknownInterface;

        throw new Error("No interface found");
    }

    render(obj: Obj) {
        throw new Error("Not Implemented");
    }
}