import { IPetNameRepository, Name, SymmetricKey } from "../interfaces";
import { ID } from "../id";

export class PetNameRepository implements IPetNameRepository {
  map: Map<Name, ID> = new Map();
  async decrypt(symmetricKey: SymmetricKey) {
    return null;
  }
  async encrypt(symmetricKey: SymmetricKey) {
    return null;
  }
  async persist(name: Name, id: ID) {
    this.map.set(name, id);
    return null;
  }
  async retrieve(name: Name) {
    const id = this.map.get(name);
    if (!id) return null;
    return id;
  }
  async retrieveAllNames() {
    return Array.from(this.map.keys());
  }
  async delete(name: Name | Name[]) {
    if (Array.isArray(name)) {
      name.map((name) => this.map.delete(name));
    } else {
      this.map.delete(name);
    }
    return null;
  }
}
