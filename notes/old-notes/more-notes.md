# More Notes

- Add a command to EditCreateView
- How do we render a view?

```jsx
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
	7: (0, 18,(SelectedIndex, Selected, List) => {
		// Referencing by SelectedIndex resolves via Names -> Graphs in the Interpreter
		// The SelectedIndex Node has a Type, which must be compatible
		// within the expression, this is a job for an Interpreter
		// native values and control structures exist, these are hardcoded into the
		// Interpreter.
		if (SelectedIndex != 0) {
			// Mutating State creates a new node in the graph and updates the Name
			Selected = List[SelectedIndex - 1]; // 
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

The CLI Parser should work like
parse mygraph.hg myview.jsx => success / errors

*/

```

The Global Interpreter Namespace is a NameSpace in a specific format published on the Graph. The digest of the GIN is signed by the HyperGraph Foundation Root Agent. The Agent publishes new GINs every time there is an update.

You can do a search in the official search engine for GIN and it should resolve to the HyperGraph Foundation as the top result. 

The HyperGraph Foundation may also provide a paid service to monetize the Root Agent as a source for Authority.

The Interpreter has:

- A way to store and retrieve a graph from persistent memory.
- A way to receive a seed hash from user input and render something to console.
- A way to render a WebView.
- A way to parse a JS file into a graph and persist it.
- A way to store a stack of views in memory.
- A way to render a Code Editor view.
- A way to parse a JS Node into a graph and persist it.
- An event-driven pattern-matching system for listeners (used for User Input or other events).

The Client Has:

- A way to store a root ID (latest ID of GIN)
- A way to connect to public peers
- A way to download graph data
- A way to pull up the GINView
- A way to search by host platform in the GINView
- A way to execute a downloaded Interpreter

Not all data has a Type attached, meaning if you were to pass a Tagless data structure to the interpreter without Context (i.e. without Linkage) it could detect it or simply fail, up to the Interpreter implementation.

A Type is a boundary containing the finite, expected structure for that type. This allows the client to pull just enough data from the graph to be able to parse it. A Type could also have an infinite boundary, i.e.  a data stream.

A tag embedded in the data allows someone to hide the data format before it arrives. A Tag is a suggestion for how to interpret a piece of data. If you have Tagless data, its up to you. If a Tag is in the ID, you are informed ahead of time what the Data Type Is, However the data may be a different format than the tag suggests. Although the same can be said about the tag being in the data. 

Therfore, A tag should go in the ID.

Tag = Type

So far, we have:

1. A Context with an Event-Driven Pattern-matching system for User Input
2. A ViewStack which, when pushed to:
    1. subscibes command handlers
    2. renders the view

    and when popped:

    1. unsubscribes command handlers
    2. un-renders the view
3. On Render:
    1. Loaded to DOM

Context

- Commands

    ESCAPE – Escape – pop ViewInFocus

    HELP – Command + H – push HelpView to ViewStack

    CREATE – Command + N – push CreateView to ViewStack

- State

    ViewStack: View[]

    ReservedEvents: Event[] (Command, Escape)

    ViewRegistry: HashMap<Hash, View>

ListView

- Commands

    NAVIGATE - Arrow Keys - mutate Selected

    CHOOSE - Enter - push Selected to ViewStack

    SEARCH - Any Other Character - push SearchView to ViewStack

- State

    Selected: Hash

    ViewList: (Index, Name, Hash)[]

    Names: (Name, Hash)[]

    Graph: (Hash, Data)[] 

SearchView

- Commands

    TYPE

    SEARCH

State

String: UTF8String