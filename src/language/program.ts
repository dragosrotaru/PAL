/* 

When I build the program, we parse and map all of our plugins into the environment

This includes:

- gui
- filesystem
- notion
- web
- chatgpt
- ...etc
- publish
- sync

A Plugin can extend the Program in the following ways:
- Parser Extension
- Evaluator Extension
- Environment Extension

Plugins can be loaded from within the language itself as well as from the Program definition


*/

import { Env } from "./environment.js";

export class Program {
  constructor(public env: Env = new Env()) {}
}
