import { IHyperGraphRepository, SymmetricKey } from "../interfaces";
import { HyperEdge } from "../hyperedge";
import { HyperNode } from "../hypernode";
import { ID } from "../id";
export declare class HyperGraphRepository implements IHyperGraphRepository {
    map: Map<ID, HyperEdge | HyperNode>;
    decrypt(symmetricKey: SymmetricKey): Promise<null>;
    encrypt(symmetricKey: SymmetricKey): Promise<null>;
    persist(entities: HyperEdge | HyperNode | (HyperEdge | HyperNode)[]): Promise<null>;
    retrieve(ids: ID | ID[]): Promise<HyperEdge | HyperNode | (HyperEdge | HyperNode)[] | null>;
    retrieveAllIDs(): Promise<ID[]>;
    delete(ids: ID | ID[]): Promise<null>;
}
//# sourceMappingURL=index.d.ts.map