import {
    workspace,
    EventEmitter,
    ExtensionContext,
    window,
    Range,
    TextDocumentChangeEvent,
    commands,
    Selection,
    Uri,
  } from "vscode";
  
  import {
    Disposable,
    LanguageClient,
    LanguageClientOptions,
    ServerOptions,
  } from "vscode-languageclient/node";
  
  let client: LanguageClient;
  // type a = Parameters<>;
  
  export async function activate(context: ExtensionContext) {
    let disposable = commands.registerCommand("helloworld.helloWorld", async uri => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      const url = Uri.parse('/User/megacuck/projects/pal/pal-lsp/test.pretty')
      let document = await workspace.openTextDocument(uri);
      await window.showTextDocument(document);
      
      // console.log(uri)
      window.activeTextEditor.document
      let editor = window.activeTextEditor;
      let range = new Range(1, 1, 1, 1)
      editor.selection = new Selection(range.start, range.end);
    });
  
    context.subscriptions.push(disposable);
  
    const traceOutputChannel = window.createOutputChannel("Pal Language Server trace");
    const command = process.env.SERVER_PATH || "pal-lsp";
    const serverOptions: ServerOptions = {
      command,
      options: {
        env: {
          ...process.env,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          RUST_LOG: "debug",
        },
      },
    };
    // If the extension is launched in debug mode then the debug server options are used
    // Otherwise the run options are used
    // Options to control the language client
    let clientOptions: LanguageClientOptions = {
      // Register the server for plain text documents
      documentSelector: [{ scheme: "file", language: "pretty", pattern: "**/*.pretty" }, { scheme: "file", language: "pal", pattern: "**/*.pal" }],
      synchronize: {
        // Notify the server about file changes to '.clientrc files contained in the workspace
        fileEvents: workspace.createFileSystemWatcher("**/.clientrc"),
      },
      traceOutputChannel,
    };
  
    // Create the language client and start the client.
    client = new LanguageClient("pal-lsp", "pal language server", serverOptions, clientOptions);
    // activateInlayHints(context);
    client.start();
  }
  
  export function deactivate(): Thenable<void> | undefined {
    if (!client) {
      return undefined;
    }
    return client.stop();
  }
  
  export function activateInlayHints(ctx: ExtensionContext) {
    const maybeUpdater = {
      hintsProvider: null as Disposable | null,
      updateHintsEventEmitter: new EventEmitter<void>(),
  
      async onConfigChange() {
        this.dispose();
  
        const event = this.updateHintsEventEmitter.event;
        // this.hintsProvider = languages.registerInlayHintsProvider(
        //   { scheme: "file", language: "pal", pattern: "**/*.pal" },
        //   // new (class implements InlayHintsProvider {
        //   //   onDidChangeInlayHints = event;
        //   //   resolveInlayHint(hint: InlayHint, token: CancellationToken): ProviderResult<InlayHint> {
        //   //     const ret = {
        //   //       label: hint.label,
        //   //       ...hint,
        //   //     };
        //   //     return ret;
        //   //   }
        //   //   async provideInlayHints(
        //   //     document: TextDocument,
        //   //     range: Range,
        //   //     token: CancellationToken
        //   //   ): Promise<InlayHint[]> {
        //   //     const hints = (await client
        //   //       .sendRequest("custom/inlay_hint", { path: document.uri.toString() })
        //   //       .catch(err => null)) as [number, number, string][];
        //   //     if (hints == null) {
        //   //       return [];
        //   //     } else {
        //   //       return hints.map(item => {
        //   //         const [start, end, label] = item;
        //   //         let startPosition = document.positionAt(start);
        //   //         let endPosition = document.positionAt(end);
        //   //         return {
        //   //           position: endPosition,
        //   //           paddingLeft: true,
        //   //           label: [
        //   //             {
        //   //               value: `${label}`,
        //   //               // location: {
        //   //               //   uri: document.uri,
        //   //               //   range: new Range(1, 0, 1, 0)
        //   //               // }
        //   //               command: {
        //   //                 title: "hello world",
        //   //                 command: "helloworld.helloWorld",
        //   //                 arguments: [document.uri],
        //   //               },
        //   //             },
        //   //           ],
        //   //         };
        //   //       });
        //   //     }
        //   //   }
        //   // })()
        // );
      },
  
      onDidChangeTextDocument({ contentChanges, document }: TextDocumentChangeEvent) {
        // debugger
        // this.updateHintsEventEmitter.fire();
      },
  
      dispose() {
        this.hintsProvider?.dispose();
        this.hintsProvider = null;
        this.updateHintsEventEmitter.dispose();
      },
    };
  
    workspace.onDidChangeConfiguration(maybeUpdater.onConfigChange, maybeUpdater, ctx.subscriptions);
    workspace.onDidChangeTextDocument(maybeUpdater.onDidChangeTextDocument, maybeUpdater, ctx.subscriptions);
  
    maybeUpdater.onConfigChange().catch(console.error);
  }