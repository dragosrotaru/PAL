import { IHyperGraphRepository, SymmetricKey } from "../interfaces";
import { HyperEdge } from "../hyperedge";
import { HyperNode } from "../hypernode";
import { ID } from "../id";

export class HyperGraphRepository implements IHyperGraphRepository {
  map: Map<ID, HyperEdge | HyperNode> = new Map();
  async decrypt(symmetricKey: SymmetricKey) {
    return null;
  }
  async encrypt(symmetricKey: SymmetricKey) {
    return null;
  }
  async persist(entities: HyperEdge | HyperNode | (HyperEdge | HyperNode)[]) {
    if (Array.isArray(entities)) {
      entities.map((entity) => this.map.set(entity.id, entity));
    } else {
      this.map.set(entities.id, entities);
    }
    return null;
  }
  async retrieve(ids: ID | ID[]) {
    if (Array.isArray(ids)) {
      const entities = ids
        .map((id) => this.map.get(id))
        .filter((entity) => entity !== undefined);
      if (entities.length === 0) return null;
      return entities as (HyperEdge | HyperNode)[];
    } else {
      const entity = this.map.get(ids);
      if (!entity) return null;
      return entity;
    }
  }
  async retrieveAllIDs() {
    return Array.from(this.map.keys());
  }
  async delete(ids: ID | ID[]) {
    if (Array.isArray(ids)) {
      ids.map((id) => this.map.delete(id));
    } else {
      this.map.delete(ids);
    }
    return null;
  }
}
