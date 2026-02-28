---
date: 2024-01-21
tags: [code-graph, code-units, dependency-graph, mutation-graph, edit-history, content-addressing]
summary: A model for treating code as a content-addressed data structure. Each Unit has exactly one export and a hash ID. Units form a DependencyGraph and a MutationGraph over time. EditHistory is a DAG. Save semantics are decomposed into three intentions. Direct intellectual ancestor of the swm CodeGraph/code_unit architecture.
---

# Content-addressed code unit model

## Core definitions

**Unit** — a piece of code that:
- has exactly one export
- has any number of imports
- has any number of internal, non-exported elements

A well-designed Unit should have no extraneous imports or unused code. Simple and reusable.

**DependencyGraph** — units with import/export relationships. If Unit A is imported by Unit B, A is a *Dependency* of B and B is a *Dependant* of A. Units are nodes, dependency relationships are directed edges. External imports ignored.

**MutationGraph** — units over time. If Unit A mutates into Unit B, A is the *Predecessor* and B is the *Successor*. Units are nodes, mutations are directed edges.

**UnitGraph** — the composite of DependencyGraph and MutationGraph.

**EditorContext** — a stateful environment in which all of the use cases and behaviours outlined in this document are made possible. Will very likely be redefined to redistribute responsibilities to multiple contexts in the near future.

**Edit** — a reversible set of AtomicActions. Every Edit is unique even if it contains the same actions as another.

**EditHistory** — a DAG of Edits and EditLinks. A Cursor points to the last Edit. Lives inside EditorContext only.

**WorkSpace** — a set of tagged WorkSpaceHistories.
- `WorkSpaceChange` = Add/Remove UnitID, UnitTransitionID — a set of Unit + UnitTransition additions/removals
- `WorkSpaceHistory` = Edge(WorkSpaceChanges) — a directed edge/branch (could also be a linked list like git)
- `WorkSpace` = Set of tagged WorkSpaceHistories

**ID** — for most entities described here, the ID is obtained from a special one-way function.

## TypeScript example — country type

Eight units composing a complete typed country value. The imports reference other units by their hash ID — this is the core mechanism of content-addressed code composition:

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
// 111 (Country) — composite
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
```

Consumer units referencing the composite:
```tsx
// 1000 (Some Country Dependant) — @dynamic resolved at runtime
import Country from "@dynamic/111";
const myCountry = Country.Constructor("US");
if (Country.Is(myCountry)) console.log("hurrah");

// 1001 (Some Other Country Dependant) — @static resolved at build time
import Country from "@static/111";
// @stable
export default (data: any) => {
  const decodedMaybe = Country.Codec.decode(data);
  // do something
  return "Wrong Country";
};
```

## Save semantics

Three core intentions behind any save-like operation:
1. **Preserve progress** — checkpoint
2. **Get feedback** — lint, static analysis, runtime analysis
3. **Distribute to consumers** — push, deploy, publish

Two axes for persistence mediums: Local/Remote × Volatile/Non-volatile.

Save strategies: instantaneous on input / every X seconds / after X seconds of no input / on explicit user command.

Common actions triggered during save flows:
- Apply autocorrect (lint)
- Apply autocomplete
- Run automated static analyses
- Run automated runtime analyses
- Persist Unit Edit History
- Create a new Unit (with comments/tags optional)
- Propagate a new Unit to Dependants
- Persist new Units in a shared WorkSpace (with comments/tags optional)
- Deploy to an environment

## Mutation propagation

On mutation from Unit A to Unit B, dependants of A are updated according to `MutationPropagationRules` defined at the EditorContext, WorkSpace, and Unit levels.

Import annotations:
- `static` — resolved at build time
- `dynamic` — resolved at runtime
- `stable` — export signals stability to downstream consumers

## Example workflow

1. User opens Unit in Editor. Editor loads unit runtime, runs static + runtime analysis.
2. On user input:
   - Edit + EditLink added to EditGraph in RAM immediately
   - Non-special token → autocomplete dropdown
   - Dependency change → editor resolves and modifies runtime
   - 200ms pause → static analysis; if passes, runtime analysis
   - 2s pause → EditGraph persisted to disk
   - 1min → EditGraph backed up to remote
3. On save command:
   - Autocorrect applied
   - Static + runtime analysis run
   - If both pass → new Unit + Mutation added to local UnitGraph
   - Analysis run on all Dependant Units
   - Dependency Graph displayed showing which dependants have errors
   - Dev can traverse graph, open dependants in Editor
   - Analysis can run deeper down the dependency graph for children of clean dependants
   - Dev can revert dependant unit updates in part or in whole
   - Workspace can be configured to require comments per every new Unit
   - Dev can revert Mutation
4. Dev can revert Edits by going backwards through EditHistory.
5. With a command, additions to UnitGraph are persisted to the global UnitGraph and WorkSpaceChanges in WorkSpaceHistory (a comment/tag may be added). Merging is the process of rebuilding the UnitGraph for each WorkSpaceHistory.

## Concrete storage

- UnitGraph persisted locally and globally
- All data storable in a generalized hash table (like IPFS/DHT)
- Units are globally addressable, constrained by AccessPolicy

## Open questions

- Reuse patterns for units like `Type` or `Is` across many composites
- Naming, hash autocomplete, and views
- Local vs shared context — collaborative editing vs spectating, access vs control vs decentralization
