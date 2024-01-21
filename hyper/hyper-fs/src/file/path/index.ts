export type SerializedFilePath = string;

export class FilePath {
  static DELIMITER = "/" as const;
  readonly value: string;
  constructor(input: string) {
    if (!FilePath.beginsWithForwardSlash(input)) {
      console.error(input);
      throw new Error("filepath must begin with a forward slash");
    }
    this.value = input;
  }
  public move(destination: FilePath): FilePath {
    if (this.equals(destination)) {
      throw new Error(
        "source filepath cannot be the same as destination filepath"
      );
    }
    const sourceSegments = this.segments;
    const destinationSegments = destination.segments;
    let i = 0;
    while (sourceSegments[i] === destinationSegments[i]) {
      i++;
    }
    return new FilePath(
      FilePath.DELIMITER +
        destinationSegments
          .concat(sourceSegments.slice(i))
          .join(FilePath.DELIMITER) +
        (this.isDirectory ? FilePath.DELIMITER : "")
    );
  }
  public static beginsWithForwardSlash(input: string) {
    return /^\//.test(input);
  }
  public static isDirectory(input: string) {
    return /\/$/.test(input);
  }
  public get isDirectory() {
    return FilePath.isDirectory(this.value);
  }
  public get isFile() {
    return !this.isDirectory;
  }
  public get isRoot() {
    return this.value === FilePath.DELIMITER;
  }
  public get parent(): FilePath | null {
    if (this.isRoot) {
      return null;
    } else if (this.segments.length === 1) {
      return new FilePath(FilePath.DELIMITER);
    } else {
      return new FilePath(
        `${FilePath.DELIMITER}${this.segments
          .slice(0, -1)
          .join(FilePath.DELIMITER)}${FilePath.DELIMITER}`
      );
    }
  }
  public get segments() {
    return this.value
      .split(FilePath.DELIMITER)
      .filter((segment) => segment !== "");
  }
  public get lastSegment(): string {
    return this.segments[this.segments.length - 1] as string;
  }
  public equals(filePath: FilePath): boolean {
    return this.value === filePath.value;
  }
  public serialize(): SerializedFilePath {
    return this.value;
  }
  public static deserialize(input: unknown) {
    if (typeof input === "string") {
      return new FilePath(input);
    }
    throw new Error("not a string");
  }
}
