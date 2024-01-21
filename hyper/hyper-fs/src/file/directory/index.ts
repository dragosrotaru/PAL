import type { FileID } from "../id";
import type { FileName } from "../name";
import type { FilePath } from "../path";

export class FileDirectory {
  public readonly path: FilePath;
  private readonly fileMap: Map<string, FileID> = new Map();
  private readonly directoryMap: Map<string, FileDirectory> = new Map();
  constructor(path: FilePath) {
    this.path = path;
  }
  addFile(name: FileName, id: FileID) {
    if (this.fileMap.has(name.value)) {
      throw new Error("file already exists");
    } else {
      this.fileMap.set(name.value, id);
    }
  }
  removeFile(name: FileName) {
    this.fileMap.delete(name.value);
  }
}
