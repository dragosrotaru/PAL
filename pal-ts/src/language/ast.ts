/* 

Below are the Abtract Syntax Tree Types of the language.

You can think of the language as a sandwitch 

- At the bottom you've got the core language. that is, the 
  fundamental primitives and the PAL language which fully supports
  these primitives.

- In the middle you have language extensions. Not all language extension additions
  are supported by PAL, and not all extensions support the fundamental primitives. 

- However it is in your interest to write ASTs for extensions which match the core language
  as closely as possible for maximum compatibility with existing functionality.

- At the top you have the all encompasing AST and AST-related types.
  These carefully combine the extensions in the system while maintainng
  separation between them, in the sense that a PAL List is not the same as
  a JSON Array, even though a particular instance of a JSON array might look identical 
  to a PAL List.


Extending the language, you have to be careful with a few things:

1. typechecking and evaluation model need to be updated, namely valueEquals, STATIC.ISPrimitive, and so on
2. parsing had to be restructured
3. 

*/

export namespace Lang {
  /*  CORE */

  // Primitives
  export type ID = symbol;
  export type Boolean = boolean;
  export type Number = number;
  export type String = string;
  export type Null = null;
  export type Undefined = undefined;

  export type Primitive = ID | Boolean | Number | String | Null | Undefined;

  export type IDList = Lang.ID[];
  export type IDTree = ID | IDList | IDTree[];

  // PAL (pal assistant language)

  export type PAL = Lang.Primitive | PAL.List | PAL.Procedure;
  export namespace PAL {
    export type SyncProcedure = (...ast: PAL[]) => PAL;
    export type AsyncProcedure = (...ast: PAL[]) => Promise<PAL>;
    export type Procedure = SyncProcedure | AsyncProcedure;
    export type List = PAL[];
  }

  /* Extensions */

  // CSV (comma separated values)

  export type CSV = CSV.Row[];
  export namespace CSV {
    export type Atom = Lang.String | Lang.Number | Lang.Boolean;
    export type Row = Atom[];
  }

  // JSON (javascript object notation)

  export type JSON = JSON.JSON;
  export namespace JSON {
    export type JSON = JSON.Primitive | JSON.Object | JSON.Array;
    export type Primitive =
      | Lang.Boolean
      | Lang.Number
      | Lang.String
      | Lang.Null;
    export type Object = { [member: Lang.String]: JSON };
    export type Array = JSON[];
  }

  /* Composite */

  export type TypeGuard = (input: Lang.AST) => Lang.Boolean;
  export type SyncProcedure = (...ast: AST[]) => AST;
  export type AsyncProcedure = (...ast: AST[]) => Promise<AST>;
  export type Procedure = SyncProcedure | AsyncProcedure;
  export type List = AST[];

  export type AST = Primitive | List | Procedure | CSV | PAL | JSON;
}
