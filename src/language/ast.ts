import { IEnv } from "../interfaces.js";

export namespace Lang {
  const identity = <V>(i: V): V => i;
  export namespace String {
    export const parse = identity;
    export const write = identity;
  }

  export type ID = symbol;
  export type Boolean = boolean;
  export type Number = number;
  export type String = string;
  export type Null = null;
  export type Undefined = undefined;

  export type Primitive = ID | Boolean | Number | String | Null | Undefined;

  export type SyncProcedure = (env: IEnv) => (...ast: PAL[]) => PAL;
  export type AsyncProcedure = (env: IEnv) => (...ast: PAL[]) => Promise<PAL>;
  export type Procedure = SyncProcedure | AsyncProcedure;

  export type List = PAL[];
  export type PAL = Primitive | List | Procedure;

  // Specialized Types

  export type CSV = CSV.Row[];

  export namespace CSV {
    export type Atom = String | Number | Boolean;
    export type Row = Atom[];
  }

  export type IDList = Lang.ID[];
  export type IDTree = ID | IDList | IDTree[];

  export type TypeGuard = (input: Lang.AST) => boolean;

  export type AST = CSV | PAL;
}
