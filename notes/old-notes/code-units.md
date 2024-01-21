# Code Units

```tsx
// 000 (Name)
import NameSpaceCaseStringType from "some-hash";
export default "value:country" as NameSpaceCaseStringType;
// 001 (Countries)
export default {
	CA: null,
	US: null,
};
// 010 (Default)
export default "CA";
// 011 (Codec)
import * as iots from "io-ts";
import Name from "000";
import Countries from "001";
export default iots.keyof(Countries, Name);
// 100 (Type)
import * as iots from "io-ts";
import Codec from "011";
export default iots.TypeOf(Codec); // export iots.TypeOf<typeof Codec>;
// 101 (Constructor)
import Type from "011";
import Default from "100";
export default (value?: Type): Type => (value ? value : Default);
// 110 (Is)
import Codec from "010";
export default Codec.is;
// 111 (Country)
import Name from "000";
import Countries from "001";
import Default from "010";
import Codec from "011";
import Type from "100";
import Constructor from "101";
import Is from "110";
export default {
	Name,
	Countries,
	Default,
	Codec,
	Type,
	Constructor,
	Is,
};
// 1000 (Some Country Dependant)
import Country from "@dynamic/111";
const myCountry = Country.Constructor("US");
if (Country.Is(myCountry)) console.log("hurrah");
// 1001 (Some Other Country Dependant)
import Country from "@static/111";
// @stable
export default (data: any) => {
	const decodedMaybe = Country.Codec.decode(data);
	// do something
	return "Wrong Country";
}
```

## Basic Definitions

### Unit

- A **Unit** is a piece of code that:

    a ) has exactly one export;

    b ) has any number of imports;

    c ) has any number of internal, non-exported elements;

- A well designed Unit should not have any extraneous imports or unused code. It should be kept as simple and reusable as possible.

### DependencyGraph

- A set of Units with import and export statements form a **DependencyGraph**. If Unit A is imported by Unit B, we say Unit is A is a **Dependency** of Unit B and Unit B is a **Dependant** of Unit A.
- Units are Nodes and dependency relationships are Directed Edges.
- External Imports are ignored.

### MutationGraph

- Units also form a **MutationGraph** - a graph of encoding the changes to Unit Code over time. If Unit A is mutated to become Unit B, we say Unit A is the **Predecessor** of Unit B, and Unit B is the **Successor** of Unit A.
- Units are Nodes and **Mutations** are Directed Edges.

### UnitGraph

- The **UnitGraph** is the composite graph of the DependencyGraph ****and the MutationGraph.

### EditorContext

- A stateful environment in which all of the use cases and behaviours outlined in this document are made possible. Editor**Context will very likely be redefined to redistribute responsabilities to multiple contexts in the near future.**

### Edit

- An **Edit** is a reversible set of **AtomicActions**. Conceptually, Edits are events that have already occured. Every Edit is unique even if it contains the same set of actions as another Edit.

### EditHistory

- **EditHistory** is a Directed Acyclical Graph of Edits and EditLinks.
- There is a **Cursor** pointing to the last Edit made.
- Edits are Nodes and EditLinks are DirectedEdges.
- EditHistory exists only inside the EditorContext.

### WorkSpace

- TODO refactor this section

- WorkSpaceChange = Add/ Remove UnitID, UnitTransitionID // A set of Unit + UnitTransition additions / removals

- WorkSpacehistory = Edge(WorkSpaceChanges) // A Directed Edge / branch. could also be a Linked List like Git

- WorkSpace = Set of tagged WorkSpacehistories

### ID

- For most entities described in this document, their **ID** is obtained from a special one-way function.

## Behaviours

### Mutation Propagation

- On Mutation from Unit A to Unit B,  Dependants of A are updated according to **MutationPropagationRules.**
- These rules exist at multiple levels - the EditorContext, the WorkSpace and the Unit.
- The keywords **static and dynamic** are used to annotate import statements.
- The keyword **stable might be** used to annotate exports and provide insight into the intention of the Unit maintainer. This idea still needs to be explored.

### Saving

- In User Interfaces, the commonly expected behaviour of "save" is: persist the desired state of the artifact to local non-volatile memory. Usually the artifact is implied by the Interface, i.e.  "the artifact" really means "the artifact currently in focus in the UI".
- As tech advances we see increasingly complicated behaviours overloading the concept of save. Executing the save command in any modern code editor is likely to trigger a whole gamut of complex behaviours - auto-linting and hot module replacement for instance. In business software, see behaviours like collaborative editing (Google Docs), automatic publishing (WordPress) and automatic cloud backups (Dropbox). Even if an artifact hasn't been saved, The user often expects their work to be recoverable under most conditions short of an act of god (and sometimes even then!).
- In the software community we use words like commit, push, merge, deploy, sync, persist, publish. We combine various tools and techniques to get a variety of desired outcomes that are disconnected from our intentions. When we say "git commit", What we are really saying is "please set a checkpoint for my progress". When we say "git push", What we are really saying is "please backup my progress and share it with my peers".
- Going down this type of thinking, I've identified 3 core intentions to any save-like functionality:
    - preserve progress
    - get feedback
    - distribute to consumers
- 2 axes to persistance mediums
    - Local/Remote
    - Volatile / Non-Volatile
- Save Strategies
    - instantanous on input
    - every x seconds
    - after x seconds of no input
    - on user input
- Common Actions
    - apply autocorrect (i.e. lint)
    - apply autocomplete
    - run Automated Static Analyses
    - run Automated Runtime Analyses
    - persist Unit Edit History
    - create a new Unit (with comments/tags optional)
    - propagate a new Unit to Dependants
    - persist new Units in a shared WorkSpace (with comments/tags optional)
    - deploy to an environment

## Example Workflow

- User opens Unit in Editor.
- Editor loads Unit runtime.
- Editor runs static and runtime analysis.
- On User Input:
    - Immediately, Edit and EditLink are added to the EditGraph in RAM.
    - If a non-special token is being typed, autocomplete is applied and a dropdown appears with contextualized information.
    - If there is a change to dependencies, The editor resolves the dependency and modifies the runtime.
    - If there is a pause of 200 ms without input static analysis is run. If the static analysis completes successfully, the runtime analysis is run.
    - If there is a pause of 2 sec without input the EditGraph is persisted to Disk.
    - Every 1 min the EditGraph is saved to a remote backup disk.
- On Save Command:
    - EditGraph is persited to disk.
    - autocorrect is applied.
    - static analysis and runtime analysis is run.
    - If both are successful then the new Unit + Mutation is added to the local UnitGraph.
    - Static and Runtime Analysis is run on Dependant Units.
    - Dependency Graph is displayed, enabling Dev to see which Dependant Units, if any, throw errors/warnings.
    - Dev can click through the graph to open another Unit in the Editor.
    - Analysis deeper down the Dependency graph for children of Dependant Units without errors to correct can be run.
    - Dev can revert Dependant Unit updates in part or in whole for the entire graph.
    - The workspace can be configured to require comments per every new Unit.
    - Dev can revert Mutation.
- Dev can revert Edits by going backwards through the EditHistory.
- With a command, the additions to UnitGraph are persisted to the global UnitGraph and WorkSpaceChanges in WorkSpaceHistory. A Comment/tag may be added. Merging is the process of rebuilding the UnitGraph for each WorkSpaceHistory

### Reusing Code, Grouping, Naming and Views

## Concrete Data Structures

UnitGraph is persisted both locally and globally.

Theoretically all data can be stored to a generalized Hash Table.

Like IPFS, DHTs can be used and Units are only guaranteed to be persisted if you store them yourself.

Units exist globally but can be constrained by an AccessPolicy

## To Explore

- reuse of code like 100 (Type) or 110 (Is)
- naming, hash autocomplete and views
- implementation in TypeScript / JavaScript
- generalization
- local vs shared context - collaborative editing vs spectating, access vs control vs decentralization