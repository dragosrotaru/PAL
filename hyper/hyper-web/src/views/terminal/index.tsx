import { useEffect, useRef } from "react";
import { Terminal as XTerm } from "xterm";
import { WebLinksAddon } from "xterm-addon-web-links";
import "./style.css";

export const Terminal = () => {
  const ref = useRef<HTMLDivElement>(null);
  const terminal = useRef<XTerm | null>(null);
  useEffect(() => {
    if (ref.current) {
      terminal.current = new XTerm();
      terminal.current.loadAddon(new WebLinksAddon());
      terminal.current.open(ref.current);
    }
    return () => {
      terminal.current?.dispose();
    };
  }, [ref, terminal]);

  return (
    <div className="terminal-container">
      <div className="terminal-xterm" ref={ref}></div>
    </div>
  );
};
