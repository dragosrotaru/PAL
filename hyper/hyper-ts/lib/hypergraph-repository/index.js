"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HyperGraphRepository = void 0;
class HyperGraphRepository {
    map = new Map();
    async decrypt(symmetricKey) {
        return null;
    }
    async encrypt(symmetricKey) {
        return null;
    }
    async persist(entities) {
        if (Array.isArray(entities)) {
            entities.map((entity) => this.map.set(entity.id, entity));
        }
        else {
            this.map.set(entities.id, entities);
        }
        return null;
    }
    async retrieve(ids) {
        if (Array.isArray(ids)) {
            const entities = ids
                .map((id) => this.map.get(id))
                .filter((entity) => entity !== undefined);
            if (entities.length === 0)
                return null;
            return entities;
        }
        else {
            const entity = this.map.get(ids);
            if (!entity)
                return null;
            return entity;
        }
    }
    async retrieveAllIDs() {
        return Array.from(this.map.keys());
    }
    async delete(ids) {
        if (Array.isArray(ids)) {
            ids.map((id) => this.map.delete(id));
        }
        else {
            this.map.delete(ids);
        }
        return null;
    }
}
exports.HyperGraphRepository = HyperGraphRepository;
//# sourceMappingURL=index.js.map