"use strict";

import * as vscode from "vscode";
import { PalFS } from "./fileSystemProvider";

export function activate(context: vscode.ExtensionContext) {
  console.log('PalFS says "Hello"');

  const palfs = new PalFS();
  context.subscriptions.push(
    vscode.workspace.registerFileSystemProvider("palfs", palfs, {
      isCaseSensitive: true,
    })
  );
  let initialized = false;

  context.subscriptions.push(
    vscode.commands.registerCommand("palfs.reset", (_) => {
      for (const [name] of palfs.readDirectory(
        vscode.Uri.parse("palfs:/")
      )) {
        palfs.delete(vscode.Uri.parse(`palfs:/${name}`));
      }
      initialized = false;
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("palfs.addFile", (_) => {
      if (initialized) {
        palfs.writeFile(
          vscode.Uri.parse(`palfs:/file.txt`),
          Buffer.from("foo"),
          { create: true, overwrite: true }
        );
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("palfs.deleteFile", (_) => {
      if (initialized) {
        palfs.delete(vscode.Uri.parse("palfs:/file.txt"));
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("palfs.init", (_) => {
      if (initialized) {
        return;
      }
      initialized = true;

      palfs.writeFile(
        vscode.Uri.parse(`palfs:/file.json`),
        Buffer.from('{ "json": true }'),
        { create: true, overwrite: true }
      );
      // some more files & folders
      palfs.createDirectory(vscode.Uri.parse(`palfs:/folder/`));
      palfs.createDirectory(vscode.Uri.parse(`palfs:/large/`));
      palfs.createDirectory(vscode.Uri.parse(`palfs:/xyz/`));
      palfs.createDirectory(vscode.Uri.parse(`palfs:/xyz/abc`));
      palfs.createDirectory(vscode.Uri.parse(`palfs:/xyz/def`));
      palfs.writeFile(
        vscode.Uri.parse(`palfs:/folder/file.ts`),
        Buffer.from("let a:number = true; console.log(a);"),
        { create: true, overwrite: true }
      );
      palfs.writeFile(
        vscode.Uri.parse(`palfs:/xyz/upper.txt`),
        Buffer.from("upper"),
        { create: true, overwrite: true }
      );
      palfs.writeFile(
        vscode.Uri.parse(`palfs:/xyz/def/foo.md`),
        Buffer.from("*palfs*"),
        { create: true, overwrite: true }
      );
      palfs.writeFile(
        vscode.Uri.parse(`palfs:/xyz/def/foo.bin`),
        Buffer.from([0, 0, 0, 1, 7, 0, 0, 1, 1]),
        { create: true, overwrite: true }
      );
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("palfs.workspaceInit", (_) => {
      vscode.workspace.updateWorkspaceFolders(0, 0, {
        uri: vscode.Uri.parse("palfs:/"),
        name: "palfs - Sample",
      });
    })
  );
}
