import { type Identifier } from "../languages/pal/ast.js";

export const port = 3000; // Change this to your desired port number
export const wsPort = 3001; // Change this to your desired port number
export const url = `http://localhost:${port}`;
export const wsUrl = `ws://localhost:${wsPort}`;

export const IdentifierToURI = (id: Identifier) =>
  url + `/${encodeURI(id.description || "")}`;
export const CurrentIDToString = () =>
  decodeURI(window.location.pathname).slice(1);
