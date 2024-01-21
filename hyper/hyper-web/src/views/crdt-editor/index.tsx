import { useEffect, useRef } from "react";
import * as Y from "yjs";
// import { WebrtcProvider } from "y-webrtc";
import { WebsocketProvider } from "y-websocket";
import { IndexeddbPersistence } from "y-indexeddb";
import * as awarenessProtocol from "y-protocols/awareness";
// @ts-ignore
import { MonacoBinding } from "y-monaco";
import * as monaco from "monaco-editor";
import "./style.css"

type Props = {
  namespace: string
}

export const CRDTEditor = ({ namespace }: Props) => {
  const WEBSOCKET_URL = "ws://localhost:7777";
  const ydoc = useRef<Y.Doc>(new Y.Doc());
  const ref = useRef<HTMLDivElement>(null);
  const editor = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  useEffect(() => {
    if (ref.current) {
      const type = ydoc.current.getText("monaco");
      const awareness = new awarenessProtocol.Awareness(ydoc.current);

      /* const webRTCProvider = new WebrtcProvider(namespace, ydoc, {
        signaling: [WEBSOCKET_URL],
        password: "",
        awareness: awareness,
        maxConns: 20 + Math.floor(Math.random() * 15),
        filterBcConns: true,
        peerOpts: {},
      }); */
      const webSocketProvider = new WebsocketProvider(WEBSOCKET_URL, namespace, ydoc.current, {
        awareness: awareness,
      });
      const indexedDBprovider = new IndexeddbPersistence(namespace, ydoc.current);

      /* webRTCProvider.on("status", (event: any) => {
        console.log(event.status);
      }); */

      webSocketProvider.on("status", (event: any) => {
        console.log(event.status);
      });

      indexedDBprovider.on("synced", () => {
        console.log("content from the database is loaded");
      });
      editor.current = monaco.editor.create(ref.current, {
        value: "",
        language: "plaintext",
        lineNumbers: "off",
        roundedSelection: false,
        scrollBeyondLastLine: false,
        fontSize: 16,
        scrollbar: {
          alwaysConsumeMouseWheel: false,
          
        },
        minimap: { enabled: false },
        readOnly: false,
        theme: "vs-dark",
      });
      new MonacoBinding(type, editor.current.getModel(), new Set([editor.current]), awareness);
    }
    return () => {
      editor.current?.dispose();
    };
  }, [ref, namespace]);
  return (
    <div className="crdt-editor-container">
      <div className="crdt-editor-monaco" ref={ref}></div>
    </div>
  );
};
