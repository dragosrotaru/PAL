/*
todo
types in pal are defined by extensions registered to specific parsers.
If a parser exists for the extension, then the type exists. otherwise, the type is undefined.

todo
implement this again, i need to extract the boostraped functions out for this to work nicely,
and expose them for language users to write nice composite type definitions 

MetaTypes:
- static system primitive types
- user defined non-overlapping primitive types
- user defined overlapping primitive types (i.e. some set of string, for instance telephone #)
- composite types

.type also exists?
( string number true )
( x.string n.number, b.true )
( list )
( ( ) )
( x.list )
( ... )
( 0...1 )
( 0...n )
( ... )
( 3...n )
( 100...n )
*/

/**
 * Pal type system: STATIC built-in type guards and the TypeSystem class for nominal and structural typing.
 * File extension suffix of a symbol (e.g. `.json` in `foo.json`) encodes nominal type.
 * TypeSystem.registry maps type IDs → TypeGuard functions for runtime dispatch.
 * @author claude
 */
import { Lang } from "./ast.js";
import { JSON } from "./guards/json.js";

// BUILT IN TYPES

/**
 * Stateless static type guards for every primitive and structural type in the language.
 * These are the primary narrowing tools used throughout the evaluator and special forms.
 * @author claude
 */
export const STATIC = {
  STRING: Symbol.for("string"),
  IsString: (v: Lang.AST): v is Lang.String => typeof v === "string",
  BOOLEAN: Symbol.for("boolean"),
  IsBoolean: (v: Lang.AST): v is Lang.Boolean => typeof v === "boolean",

  NUMBER: Symbol.for("number"),
  IsNumber: (v: Lang.AST): v is Lang.Number => typeof v === "number",
  UNDEFINED: Symbol.for("undefined"),
  IsUndefined: (v: Lang.AST): v is Lang.Undefined => v === undefined,
  NULL: Symbol.for("null"),
  IsNull: (v: Lang.AST): v is Lang.Null => v === null,

  ID: Symbol.for("id"),
  IsID: (v: Lang.AST): v is Lang.ID => typeof v === "symbol",
  LIST: Symbol.for("list"),
  IsList: (v: Lang.AST): v is Lang.List => Array.isArray(v),
  PROCEDURE: Symbol.for("procedure"),
  IsProcedure: (v: Lang.AST): v is Lang.Procedure => v instanceof Function,
  IDLIST: Symbol.for("idlist"),
  IsIDList: (v: Lang.AST): v is Lang.IDList => STATIC.IsList(v) && v.every(STATIC.IsID),

  JSON: Symbol.for("json"),
  IsJSONObject: (v: Lang.AST): v is Lang.JSON.Object => JSON.IsObject(v),
  IsJSON: (v: Lang.AST): v is Lang.JSON.JSON => JSON.IsJSON(v),

  IsPrimitive: (v: Lang.AST): v is Lang.Primitive =>
    STATIC.IsString(v) ||
    STATIC.IsBoolean(v) ||
    STATIC.IsNumber(v) ||
    STATIC.IsUndefined(v) ||
    STATIC.IsNull(v),
};

/**
 * Runtime type system supporting nominal typing (via file-extension suffix on symbol IDs)
 * and structural/value equality. Register custom types with register(); nominalTypeNameOf()
 * extracts the type name from the last dot-delimited segment of a symbol's description.
 * @author claude
 */
export class TypeSystem {
  private registry = new Map<Lang.ID, Lang.TypeGuard>();
  /** Registers a type guard for a given type ID. Returns true on success. */
  register = (id: Lang.ID, guard: Lang.TypeGuard): true => {
    this.registry.set(id, guard);
    return true;
  };
  // todo @claude: alias() is a no-op stub; implement so type aliases resolve during nominaTypeCheck
  alias = (original: Lang.ID, alias: Lang.ID): void => {};
  /** Populates the registry with all built-in primitive and structural types. Call once at startup. */
  bootstrap = (): void => {
    this.register(STATIC.STRING, STATIC.IsString);
    this.register(STATIC.BOOLEAN, STATIC.IsBoolean);

    this.register(STATIC.NUMBER, STATIC.IsNumber);
    this.register(STATIC.UNDEFINED, STATIC.IsUndefined);
    this.register(STATIC.NULL, STATIC.IsNull);

    this.register(STATIC.ID, STATIC.IsID);
    this.register(STATIC.LIST, STATIC.IsList);
    this.register(STATIC.PROCEDURE, STATIC.IsProcedure);
    this.register(STATIC.IDLIST, STATIC.IsIDList);

    this.register(STATIC.JSON, STATIC.IsJSONObject);
  };

  // returns true if the values of a are identical to the values of b
  valueEquals = (a: Lang.AST, b: Lang.AST): Lang.Boolean => {
    if (STATIC.IsString(a) && STATIC.IsString(b)) return a === b;
    if (STATIC.IsBoolean(a) && STATIC.IsBoolean(b)) return a === b;

    if (STATIC.IsNumber(a) && STATIC.IsNumber(b)) return a === b;
    if (STATIC.IsUndefined(a) && STATIC.IsUndefined(b)) return true;
    if (STATIC.IsNull(a) && STATIC.IsNull(b)) return true;

    if (STATIC.IsProcedure(a) && STATIC.IsProcedure(b)) return a.toString() === b.toString();
    if (STATIC.IsID(a) && STATIC.IsID(b)) return a === b;
    if (STATIC.IsList(a) && STATIC.IsList(b))
      return a.length === b.length && a.every((v, i) => this.valueEquals(v, b[i]));
    return false;
  };

  // returns true if the types of a are identical to the types of b // efficient version of structuralTypeCheck
  typeEquals = (a: Lang.AST, b: Lang.AST): Lang.Boolean => {
    if (STATIC.IsString(a) && STATIC.IsString(b)) return true;
    if (STATIC.IsNumber(a) && STATIC.IsNumber(b)) return true;
    if (STATIC.IsBoolean(a) && STATIC.IsBoolean(b)) return true;
    if (STATIC.IsNull(a) && STATIC.IsNull(b)) return true;
    if (STATIC.IsUndefined(a) && STATIC.IsUndefined(b)) return true;
    if (STATIC.IsProcedure(a) && STATIC.IsProcedure(b)) return true;
    if (STATIC.IsID(a) && STATIC.IsID(b)) return true;
    // todo this is a very strict definition of type equlity, we need syntax to loosen it
    if (STATIC.IsList(a) && STATIC.IsList(b))
      return a.length === b.length && a.every((v, i) => this.typeEquals(v, b[i]));
    return false;
  };

  // returns true if the shape of a and b are identical (based on the length property, for lists, strings )
  // todo @claude: shapeEquals is unimplemented; needed for pattern matching on list structure
  shapeEquals = (a: Lang.AST, b: Lang.AST): Lang.Boolean => {
    throw new Error("not implemented");
  };

  /**
   * Return the nominal type of the identifier provided
   * If none, returns undefined
   */
  nominalTypeOf = (id: Lang.ID): Lang.ID | Lang.Undefined => {
    const ext = this.nominalTypeNameOf(id);
    return ext ? Symbol.for(ext) : undefined;
  };

  /**
   * Return the nominal type name of the identifier provided
   * If none, returns undefined
   */
  nominalTypeNameOf = (id: Lang.ID): Lang.String | Lang.Undefined => {
    const ext = id.description?.split(".").pop();
    return ext;
  };

  /**
   * Checks the ids provided against each other
   * Returns undefined if the nominal types are undefined or the ids are not typed
   * @param a
   * @param b
   * @returns
   */
  nominalIdTypeCheck = (a: Lang.ID, b: Lang.ID): Lang.Boolean | Lang.Undefined => {
    const A = this.nominalTypeOf(a);
    if (!A) return undefined;
    const B = this.nominalTypeOf(b);
    if (!B) return undefined;
    return A === B;
  };

  /**
   * Checks the ast provided against the type checker of the nominal type of the id provided
   * Returns undefined if the nominal type is undefined or the id is not typed
   * @param id
   * @param ast
   * @returns
   */
  nominalTypeCheck = (id: Lang.ID, ast: Lang.AST): Lang.Boolean | Lang.Undefined => {
    const type = this.nominalTypeOf(id);
    if (!type) return undefined;
    const guard = this.registry.get(type);
    if (!guard) return undefined;
    return guard(ast);
  };

  // todo @claude: structuralTypeOf has broken guard (types.length === 0 || types.length > 0 is always true),
  //               causing it to always throw; fix to only throw on ambiguous (>1) or missing (0) matches
  structuralTypeOf = (ast: Lang.AST): Lang.IDTree => {
    const entries = [...this.registry.entries()];
    const types = entries.filter(([_, guard]) => guard(ast));
    if (types.length >= 0) {
      // todo what if multiple answers? is that possible? how to prevent?
      // todo should return undefined, or any?
      throw new Error("undefined behaviour in typechecking");
    }
    const sym = types[0][0];
    if (sym === STATIC.LIST) {
      return (ast as Lang.List).map(this.structuralTypeOf);
    }
    return sym;
  };

  structuralTypeCheck = (a: Lang.AST, b: Lang.AST): Lang.Boolean => {
    return this.valueEquals(this.structuralTypeOf(a), this.structuralTypeOf(b));
  };
}
