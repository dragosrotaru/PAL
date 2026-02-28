import { IPetNameRepository, Name, SymmetricKey } from "../interfaces";
import { ID } from "../id";
export declare class PetNameRepository implements IPetNameRepository {
    map: Map<Name, ID>;
    decrypt(symmetricKey: SymmetricKey): Promise<null>;
    encrypt(symmetricKey: SymmetricKey): Promise<null>;
    persist(name: Name, id: ID): Promise<null>;
    retrieve(name: Name): Promise<ID | null>;
    retrieveAllNames(): Promise<string[]>;
    delete(name: Name | Name[]): Promise<null>;
}
//# sourceMappingURL=index.d.ts.map