/**
 * @file HyperGraph — the core data structure of the Hyper sub-system.
 *
 * A `HyperGraph` stores `HyperNode` (data blobs) and `HyperEdge` (typed
 * relationships between nodes) via a `IHyperGraphRepository` (local storage)
 * and a `IPetNameRepository` (human-readable name → ID mapping).
 *
 * The `INetwork` is injected but `traverse()` is a stub — P2P graph traversal
 * is not yet implemented.
 *
 * All storage operations are local-only; network sync is a no-op.
 */
import { IHyperGraph, IHyperGraphRepository, INetwork, HyperGraphPersistOptions, HyperGraphRetrieveOptions, HyperGraphDeleteOptions, HyperGraphTraverseOptions, HyperGraphSearchOptions, Name, IPetNameRepository, IDevice } from "../interfaces";
import { HyperEdge } from "../hyperedge";
import { HyperNode } from "../hypernode";
import { ID } from "../id";
export declare class HyperGraph implements IHyperGraph {
    private graphRepo;
    private nameRepo;
    private net;
    constructor(graphRepo: IHyperGraphRepository, nameRepo: IPetNameRepository, net: INetwork);
    persist(entities: HyperEdge | HyperNode | (HyperEdge | HyperNode)[], options: HyperGraphPersistOptions): Promise<Error | null>;
    retrieve(ids: ID | ID[], options: HyperGraphRetrieveOptions): Promise<(HyperEdge | HyperNode)[] | Error | HyperEdge | HyperNode | null>;
    retrieveDeviceIDs(device: IDevice): Promise<ID[] | Error>;
    delete(ids: ID | ID[], options: HyperGraphDeleteOptions): Promise<Error | null>;
    traverse(options: HyperGraphTraverseOptions): Promise<void>;
    search(name: Name, options: HyperGraphSearchOptions): Promise<Error | ID | null>;
    name(name: Name, id: ID): Promise<Error | null>;
}
//# sourceMappingURL=index.d.ts.map