import type { File } from "..";
import { FileDirectory } from "../directory";
import { FilePath } from "../path";

export class FileSystem {
  private readonly root: FileDirectory = new FileDirectory(new FilePath("/"));
  constructor() {}

  get(path: FilePath): File {
    throw new Error("not implemented yet");
  }
  getDirectory(path: FilePath) {
    if (!path.isDirectory) {
      throw new Error("not a valid directory filepath");
    }
  }
  exists(path: FilePath): boolean {
    throw new Error("not implemented yet");
  }

  set(path: FilePath, file: File) {
    throw new Error("not implemented yet");
  }
}
