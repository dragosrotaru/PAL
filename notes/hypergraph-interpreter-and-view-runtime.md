---
date: 2024-01-21
tags: [hypergraph, interpreter, view, runtime, fsm, command-pattern, hyper-ts]
summary: Runtime design for a HyperGraph-driven UI — ViewStack with push/pop subscribe/unsubscribe semantics, event-driven command pattern, Global Interpreter Namespace (GIN) signed by a root agent. The tag-in-ID design (type encoded in hash ID, not in data) is particularly interesting as it allows the client to pull just enough data to parse a node before receiving it in full.
---

# HyperGraph interpreter and view runtime

Open questions that motivated this design:
- Add a command to EditCreateView
- How do we render a view?

## View architecture

**Context** — top-level state:
- `ViewStack: View[]`
- `ReservedEvents: Event[]` (Command, Escape)
- `ViewRegistry: HashMap<Hash, View>`
- Commands: `ESCAPE` (pop ViewInFocus), `HELP` (push HelpView), `CREATE` (push CreateView)

**ViewStack semantics** — on push: subscribe command handlers + render. On pop: unsubscribe command handlers + un-render.

**ListView** — state: `Selected: Hash`, `ViewList: (Index, Name, Hash)[]`, `Names: (Name, Hash)[]`, `Graph: (Hash, Data)[]`
- Commands: `NAVIGATE` (Arrow Keys → mutate Selected), `CHOOSE` (Enter → push Selected to ViewStack), `SEARCH` (any character → push SearchView)

**SearchView** — state: `String: UTF8String`
- Commands: `TYPE`, `SEARCH`

## JavaScript sketch

```js
const Graph = {
	-1: Symbol("Type"),
	0: (0, 20, Symbol("Render")),
	// These Are Other Views
	1: (0, 14, ...),
	2: (0, 14, ...),
	3: (0, 14, ...),
	// ListView Begins Here
	4: (0, 15, 1, 2, 3), // PointerOrderedList
	5: (0, 16, 1), // Pointer (Selected)
	6: (0, 17, "1"), // Integer
	// Command Handlers
	7: (0, 18, (SelectedIndex, Selected, List) => {
		// Referencing by SelectedIndex resolves via Names -> Graphs in the Interpreter
		// The SelectedIndex Node has a Type, which must be compatible
		// within the expression, this is a job for an Interpreter
		// native values and control structures exist, these are hardcoded into the Interpreter.
		if (SelectedIndex != 0) {
			// Mutating State creates a new node in the graph and updates the Name
			Selected = List[SelectedIndex - 1];
			SelectedIndex++;
		}
	}),
	8: (0, 18, (ViewStack, Selected) => {
		ViewStack.push(Selected);
	}),
	// Command Handler Collection
	9: (0, 15, 7, 8),
	// Names
	10: (0, 19, {
		"Markdown": 1,
		"TypeScript": 2,
		"URL": 3,
		"List": 4,
		"Selected": 5,
		"SelectedIndex": 6,
		// Commands
		"MOVE_DOWN": 7,
		"SELECT": 8
	}),
	// Register
	11: (0, 19, {
		"Key Down": "MOVE_DOWN",
		"Enter": "SELECT",
	}),
	12: (0, 20, () => {

	}),
	// ListView
	13: (0, 14, 9, 10, 11, 12),
	// Types, which define how to parse and render protocol representations of Elements
	14: Symbol("View"),
	15: Symbol("PointerOrderedList"),
	16: Symbol("Pointer"),
	17: Symbol("Integer"),
	18: Symbol("Function"),
	19: Symbol("UTF8Map"),
	20: Symbol("Renderer"),
};

/*

We need a way for Graph Data to refer to Type, the easiest way is to
create a special Root Type which is called Type, which is an edge (Type, Element)
that consists of a Node designated as a Type and an Element (Node, Edge) designated
as the data of that Type.

We need a startup Pointer for the HyperGraph to be executed by the interpreter.

We need a special "Render Renderer".

The CLI Renderer should work like:
render mygraph.hg a0x393894 => <html></html>;

The CLI Parser should work like:
parse mygraph.hg myview.jsx => success / errors

*/
```

## Interpreter requirements

- Store and retrieve a graph from persistent memory
- Receive a seed hash from user input and render to console or WebView
- Parse a JS file or JS node into a graph and persist it
- Store a stack of views in memory; render a Code Editor view
- Event-driven pattern-matching system for listeners (user input or other events)

## Client requirements

- Store a root ID (latest GIN hash)
- Connect to public peers and download graph data
- Pull up the GINView; search by host platform
- Execute a downloaded Interpreter

## Global Interpreter Namespace (GIN)

The GIN is a NameSpace in a specific format published on the graph. Its digest is signed by the HyperGraph Foundation Root Agent. New GINs are published on each update.

Discovery: search the official search engine for GIN — the HyperGraph Foundation should be the top result.

The HyperGraph Foundation may also provide a paid service to monetize the Root Agent as a source for Authority.

## Tagless data

Not all data has a Type attached. If you pass a tagless data structure to the interpreter without Context (i.e. without Linkage), it could detect it or simply fail — up to the Interpreter implementation.

## Tag-in-ID design

A Type is a boundary containing the finite expected structure for that type — allows the client to pull just enough data to parse it before receiving it fully. A Type could also have an infinite boundary (a data stream).

A tag embedded in the data allows someone to hide the data format before it arrives. A tag is a suggestion for how to interpret a piece of data. If a tag is in the ID, you are informed ahead of time what the data type is — however the data may be a different format than the tag suggests. The same can be said about a tag in the data.

**Tags should go in the ID, not in the data.** ID-tagging is preferable because the client can make routing/fetching decisions before downloading content.

`Tag = Type`

## Summary: what we have so far

1. A Context with an event-driven pattern-matching system for User Input
2. A ViewStack which, when pushed to:
   1. Subscribes command handlers
   2. Renders the view

   and when popped:
   1. Unsubscribes command handlers
   2. Un-renders the view

3. On Render:
   1. Loaded to DOM

Context:
- Commands: `ESCAPE` – Escape – pop ViewInFocus | `HELP` – Command+H – push HelpView | `CREATE` – Command+N – push CreateView
- State: `ViewStack: View[]`, `ReservedEvents: Event[]` (Command, Escape), `ViewRegistry: HashMap<Hash, View>`

ListView:
- Commands: `NAVIGATE` – Arrow Keys – mutate Selected | `CHOOSE` – Enter – push Selected to ViewStack | `SEARCH` – Any Other Character – push SearchView
- State: `Selected: Hash`, `ViewList: (Index, Name, Hash)[]`, `Names: (Name, Hash)[]`, `Graph: (Hash, Data)[]`

SearchView:
- Commands: `TYPE`, `SEARCH`
- State: `String: UTF8String`
