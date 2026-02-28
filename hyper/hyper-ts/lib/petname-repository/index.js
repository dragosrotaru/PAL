"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PetNameRepository = void 0;
class PetNameRepository {
    map = new Map();
    async decrypt(symmetricKey) {
        return null;
    }
    async encrypt(symmetricKey) {
        return null;
    }
    async persist(name, id) {
        this.map.set(name, id);
        return null;
    }
    async retrieve(name) {
        const id = this.map.get(name);
        if (!id)
            return null;
        return id;
    }
    async retrieveAllNames() {
        return Array.from(this.map.keys());
    }
    async delete(name) {
        if (Array.isArray(name)) {
            name.map((name) => this.map.delete(name));
        }
        else {
            this.map.delete(name);
        }
        return null;
    }
}
exports.PetNameRepository = PetNameRepository;
//# sourceMappingURL=index.js.map