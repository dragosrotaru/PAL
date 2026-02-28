"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HyperGraph = void 0;
class HyperGraph {
    graphRepo;
    nameRepo;
    net;
    constructor(graphRepo, nameRepo, net) {
        this.graphRepo = graphRepo;
        this.nameRepo = nameRepo;
        this.net = net;
    }
    async persist(entities, options) {
        const persistLocally = this.graphRepo.persist(entities);
        return persistLocally;
    }
    async retrieve(ids, options) {
        const localEntities = this.graphRepo.retrieve(ids);
        return localEntities;
    }
    async retrieveDeviceIDs(device) {
        const localIDs = this.graphRepo.retrieveAllIDs();
        return localIDs;
    }
    async delete(ids, options) {
        const deleteLocally = this.graphRepo.delete(ids);
        return deleteLocally;
    }
    async traverse(options) {
        console.log(this.net);
    }
    async search(name, options) {
        const localNames = this.nameRepo.retrieve(name);
        return localNames;
    }
    async name(name, id) {
        return this.nameRepo.persist(name, id);
    }
}
exports.HyperGraph = HyperGraph;
//# sourceMappingURL=index.js.map