import {
  IHyperGraph,
  IHyperGraphRepository,
  INetwork,
  HyperGraphPersistOptions,
  HyperGraphRetrieveOptions,
  HyperGraphDeleteOptions,
  HyperGraphTraverseOptions,
  HyperGraphSearchOptions,
  Name,
  IPetNameRepository,
  IDevice,
} from "../interfaces";
import { HyperEdge } from "../hyperedge";
import { HyperNode } from "../hypernode";
import { ID } from "../id";

export class HyperGraph implements IHyperGraph {
  constructor(
    private graphRepo: IHyperGraphRepository,
    private nameRepo: IPetNameRepository,
    private net: INetwork
  ) {}
  async persist(
    entities: HyperEdge | HyperNode | (HyperEdge | HyperNode)[],
    options: HyperGraphPersistOptions
  ) {
    const persistLocally = this.graphRepo.persist(entities);
    return persistLocally;
  }
  async retrieve(ids: ID | ID[], options: HyperGraphRetrieveOptions) {
    const localEntities = this.graphRepo.retrieve(ids);
    return localEntities;
  }
  async retrieveDeviceIDs(device: IDevice) {
    const localIDs = this.graphRepo.retrieveAllIDs();
    return localIDs;
  }
  async delete(ids: ID | ID[], options: HyperGraphDeleteOptions) {
    const deleteLocally = this.graphRepo.delete(ids);
    return deleteLocally;
  }
  async traverse(options: HyperGraphTraverseOptions) {
    console.log(this.net);
  }
  async search(name: Name, options: HyperGraphSearchOptions) {
    const localNames = this.nameRepo.retrieve(name);
    return localNames;
  }
  async name(name: Name, id: ID) {
    return this.nameRepo.persist(name, id);
  }
}
