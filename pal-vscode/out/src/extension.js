"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
/**
 * @file pal-vscode VS Code extension — entry point.
 *
 * Registers the `PalFS` in-memory virtual filesystem under the `palfs://` URI scheme
 * and exposes five commands to drive it:
 *
 * | Command | Effect |
 * |---------|--------|
 * | `palfs.init` | Seed the filesystem with sample files/folders |
 * | `palfs.reset` | Delete all entries and mark uninitialized |
 * | `palfs.addFile` | Write `palfs:/file.txt` (only if initialized) |
 * | `palfs.deleteFile` | Delete `palfs:/file.txt` (only if initialized) |
 * | `palfs.workspaceInit` | Add `palfs:/` as a VS Code workspace folder |
 *
 * This is a standalone VS Code extension separate from `pal-lsp`. It provides the
 * virtual filesystem view of the Pal environment inside VS Code, complementing the
 * LSP extension (which provides language intelligence).
 */
const vscode = __importStar(require("vscode"));
const fileSystemProvider_1 = require("./fileSystemProvider");
/**
 * Extension activation: registers the `palfs` filesystem provider and all commands.
 * Called once by VS Code when the extension activates.
 */
function activate(context) {
    console.log('PalFS says "Hello"');
    const palfs = new fileSystemProvider_1.PalFS();
    context.subscriptions.push(vscode.workspace.registerFileSystemProvider("palfs", palfs, {
        isCaseSensitive: true,
    }));
    let initialized = false;
    context.subscriptions.push(vscode.commands.registerCommand("palfs.reset", (_) => {
        for (const [name] of palfs.readDirectory(vscode.Uri.parse("palfs:/"))) {
            palfs.delete(vscode.Uri.parse(`palfs:/${name}`));
        }
        initialized = false;
    }));
    context.subscriptions.push(vscode.commands.registerCommand("palfs.addFile", (_) => {
        if (initialized) {
            palfs.writeFile(vscode.Uri.parse(`palfs:/file.txt`), Buffer.from("foo"), { create: true, overwrite: true });
        }
    }));
    context.subscriptions.push(vscode.commands.registerCommand("palfs.deleteFile", (_) => {
        if (initialized) {
            palfs.delete(vscode.Uri.parse("palfs:/file.txt"));
        }
    }));
    context.subscriptions.push(vscode.commands.registerCommand("palfs.init", (_) => {
        if (initialized) {
            return;
        }
        initialized = true;
        palfs.writeFile(vscode.Uri.parse(`palfs:/file.json`), Buffer.from('{ "json": true }'), { create: true, overwrite: true });
        // some more files & folders
        palfs.createDirectory(vscode.Uri.parse(`palfs:/folder/`));
        palfs.createDirectory(vscode.Uri.parse(`palfs:/large/`));
        palfs.createDirectory(vscode.Uri.parse(`palfs:/xyz/`));
        palfs.createDirectory(vscode.Uri.parse(`palfs:/xyz/abc`));
        palfs.createDirectory(vscode.Uri.parse(`palfs:/xyz/def`));
        palfs.writeFile(vscode.Uri.parse(`palfs:/folder/file.ts`), Buffer.from("let a:number = true; console.log(a);"), { create: true, overwrite: true });
        palfs.writeFile(vscode.Uri.parse(`palfs:/xyz/upper.txt`), Buffer.from("upper"), { create: true, overwrite: true });
        palfs.writeFile(vscode.Uri.parse(`palfs:/xyz/def/foo.md`), Buffer.from("*palfs*"), { create: true, overwrite: true });
        palfs.writeFile(vscode.Uri.parse(`palfs:/xyz/def/foo.bin`), Buffer.from([0, 0, 0, 1, 7, 0, 0, 1, 1]), { create: true, overwrite: true });
    }));
    context.subscriptions.push(vscode.commands.registerCommand("palfs.workspaceInit", (_) => {
        vscode.workspace.updateWorkspaceFolders(0, 0, {
            uri: vscode.Uri.parse("palfs:/"),
            name: "palfs - Sample",
        });
    }));
}
//# sourceMappingURL=extension.js.map