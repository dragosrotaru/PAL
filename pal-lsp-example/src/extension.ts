/**
 * @file pal-lsp-example VS Code client extension (minimal skeleton).
 *
 * A stripped-down LSP client extension that registers for `.pretty` files
 * and starts a language server. The `serverOptions.command` is intentionally
 * left as an empty string — this is a template to be filled in.
 *
 * Prefer `pal-lsp/client/src/extension.ts` for the real implementation.
 * // todo @claude: fill in `serverOptions.command` with the actual pal-lsp binary path
 */
import * as path from "path";
import { ExtensionContext } from "vscode";

import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
} from "vscode-languageclient/node";

let client: LanguageClient;

export function activate(context: ExtensionContext) {
  const serverOptions: ServerOptions = {
    command: "",
    transport: TransportKind.stdio,
    options: {},
  };

  const clientOptions: LanguageClientOptions = {
    documentSelector: [{ scheme: "file", language: "pretty", pattern: "**/*.pretty" }],
  };

  client = new LanguageClient("pal", "Pal", serverOptions, clientOptions);

  client.start();
}

export function deactivate(): Thenable<void> | undefined {
  if (!client) {
    return undefined;
  }
  return client.stop();
}
