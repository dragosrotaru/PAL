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
    retrieve(ids: ID | ID[], options: HyperGraphRetrieveOptions): Promise<Error | HyperEdge | HyperNode | (HyperEdge | HyperNode)[] | null>;
    retrieveDeviceIDs(device: IDevice): Promise<Error | ID[]>;
    delete(ids: ID | ID[], options: HyperGraphDeleteOptions): Promise<Error | null>;
    traverse(options: HyperGraphTraverseOptions): Promise<void>;
    search(name: Name, options: HyperGraphSearchOptions): Promise<Error | ID | null>;
    name(name: Name, id: ID): Promise<Error | null>;
}
//# sourceMappingURL=index.d.ts.map