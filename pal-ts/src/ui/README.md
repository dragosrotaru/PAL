# ui/

Two UI surfaces: a Node.js REPL and a browser-based GUI served via Express+WebSocket.

## Components

| File | Purpose |
|------|---------|
| `repl.ts` | Starts the Node.js REPL; lines beginning with "ai" are auto-wrapped as `(gpt "...")`. |
| `web/server.ts` | Express serves the React app on port 3000; WebSocket on port 3001 handles Open/Close/Exec/AST messages. Lazy-starts on first `(ui ...)` call. |
| `web/client.tsx` | Browser WebSocket client; renders the React view tree on each AST push from the server. |
| `web/messages.ts` | Message type discriminated union: Open, Close, Exec, AST. |
| `web/common.ts` | Shared constants: ports, URLs, IdentifierToURI/CurrentIDToString. |
| `web/views/index.tsx` | Root view dispatcher: routes AST type to Identifier/Procedure/List/Default view. |
| `web/views/interface.ts` | Shared prop types: DefaultProps and ExecProps. |
| `web/views/identifier.tsx` | Renders ID as an anchor link. |
| `web/views/list.tsx` | Renders List as a `<ul>` of recursively rendered items. |
| `web/views/procedure.tsx` | Renders Procedure as its source string. |
| `web/views/default.tsx` | Fallback: serializes any AST with the PAL writer. |
| `web/views/delete.tsx` | Sidebar action button that sends `(env/delete <id>)` via WebSocket. |

## Protocol

```
Client → Server: { type: "Open", id: string }       // subscribe to env key
Client → Server: { type: "Close", id: string }      // unsubscribe
Client → Server: { type: "Exec", code: string }     // evaluate PAL code
Server → Client: { type: "AST", ast: string }       // serialized env value
```

## Missing Pieces

- No authentication — any client can execute arbitrary PAL code via Exec.
- Client uses deprecated `ReactDOM.render` (React 17 API, broken in React 18+).
- No observable state management on the client (no hooks or signals).
- `<li>` elements in List view lack React `key` props.
- Server has no pre-rendering; first load requires a round-trip WebSocket message.

@author claude
