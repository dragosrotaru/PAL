import { HyperEdge } from "../hyperedge";
import { HyperNode } from "../hypernode";
import { ID } from "../id";
import { SymmetricKey } from "./agent";

export interface Traversal {}
export type Name = string;
export type TimeStamp = string;

export interface IDevice {
  public: boolean;
  lastOnline: TimeStamp;
}

export interface IPeer {
  retrieveDevices: () => Promise<Error | IDevice[]>;
  retrievePeers: () => Promise<Error | IPeer[]>;
}

export interface INetwork {}

/* 
- Allow for granular control over where to persist/retrieve/delete/search from (local/devices/peers/peers-of-peers-depth)
- Allow for optimistic retrieval and caching of graph elements frequently requested together
*/
export type HyperGraphPersistOptions = {};
export type HyperGraphRetrieveOptions = {};
export type HyperGraphDeleteOptions = {};
export type HyperGraphTraverseOptions = {};
export type HyperGraphSearchOptions = {};

export interface IHyperGraph {
  persist: (
    entities: HyperEdge | HyperNode | (HyperEdge | HyperNode)[],
    options: HyperGraphPersistOptions
  ) => Promise<Error | null>;
  retrieve: (
    ids: ID | ID[],
    options: HyperGraphRetrieveOptions
  ) => Promise<
    Error | null | HyperEdge | HyperNode | (HyperEdge | HyperNode)[]
  >;
  retrieveDeviceIDs: (device: IDevice) => Promise<Error | ID[]>;
  delete: (
    ids: ID | ID[],
    options: HyperGraphDeleteOptions
  ) => Promise<Error | null>;
  traverse: (options: HyperGraphTraverseOptions) => Traversal;
  search: (
    name: Name,
    options: HyperGraphSearchOptions
  ) => Promise<Error | null | ID>;
  name: (name: Name, id: ID) => Promise<Error | null>;
}

export interface IHyperGraphRepository {
  decrypt: (symmetricKey: SymmetricKey) => Promise<Error | null>;
  encrypt: (symmetricKey: SymmetricKey) => Promise<Error | null>;
  persist: (
    entities: HyperEdge | HyperNode | (HyperEdge | HyperNode)[]
  ) => Promise<Error | null>;
  retrieve: (
    ids: ID | ID[]
  ) => Promise<
    Error | null | HyperEdge | HyperNode | (HyperEdge | HyperNode)[]
  >;
  retrieveAllIDs: () => Promise<Error | ID[]>;
  delete: (ids: ID | ID[]) => Promise<Error | null>;
}

export interface IPetNameRepository {
  decrypt: (symmetricKey: SymmetricKey) => Promise<Error | null>;
  encrypt: (symmetricKey: SymmetricKey) => Promise<Error | null>;
  persist: (name: Name, id: ID) => Promise<Error | null>;
  retrieve: (name: Name) => Promise<Error | null | ID>;
  retrieveAllNames: () => Promise<Error | Name[]>;
  delete: (name: Name | Name[]) => Promise<Error | null>;
}
