import ts from "typescript";

const compilerOptions: ts.CompilerOptions = {
  allowJs: false,
  allowSyntheticDefaultImports: false,
  allowUmdGlobalAccess: undefined, // unsure
  allowUnreachableCode: false,
  allowUnusedLabels: false,
  alwaysStrict: true,
  assumeChangesOnlyAffectDirectDependencies: false,
  baseUrl: "src",
  charset: undefined,
  checkJs: false,
  composite: undefined, // unsure
  declaration: true,
  declarationDir: undefined,
  declarationMap: true, // unsure
  disableReferencedProjectLoad: false, // unsure
  disableSizeLimit: false,
  disableSolutionSearching: false,
  disableSourceOfProjectReferenceRedirect: false,
  downlevelIteration: true,
  emitBOM: false,
  emitDeclarationOnly: false,
  emitDecoratorMetadata: false,
  esModuleInterop: true, // unsure
  experimentalDecorators: false,
  forceConsistentCasingInFileNames: true,
  importHelpers: true, // install tslib
  importsNotUsedAsValues: ts.ImportsNotUsedAsValues.Error,
  incremental: false,
  inlineSourceMap: false,
  inlineSources: undefined,
  isolatedModules: true,
  jsx: ts.JsxEmit.React,
  jsxFactory: undefined,
  jsxFragmentFactory: undefined,
  jsxImportSource: undefined,
  keyofStringsOnly: undefined,
  lib: ["ESNext", "DOM"], // "WebWorker" ?
  locale: undefined, // not documented ?
  mapRoot: undefined,
  maxNodeModuleJsDepth: undefined,
  module: ts.ModuleKind.ES2015,
  moduleResolution: ts.ModuleResolutionKind.NodeJs,
  newLine: ts.NewLineKind.LineFeed,
  noEmit: false,
  noEmitHelpers: false,
  noEmitOnError: false,
  noErrorTruncation: true,
  noFallthroughCasesInSwitch: true,
  noImplicitAny: true,
  noImplicitReturns: true,
  noImplicitThis: true,
  noImplicitUseStrict: false,
  noLib: false,
  noPropertyAccessFromIndexSignature: false, // unsure
  noResolve: false,
  noStrictGenericChecks: false,
  noUncheckedIndexedAccess: true,
  noUnusedLocals: true,
  noUnusedParameters: false,
  out: undefined,
  outDir: undefined, // unsure
  outFile: undefined, // maybe useful
  paths: undefined, // maybe useful
  preserveConstEnums: true,
  preserveSymlinks: true,
  project: undefined, // undocumented
  reactNamespace: undefined,
  removeComments: true,
  resolveJsonModule: false, // unsure
  rootDir: "./src",
  rootDirs: undefined,
  skipDefaultLibCheck: false,
  skipLibCheck: true, // unsure
  sourceMap: true,
  sourceRoot: undefined,
  strict: true,
  strictBindCallApply: undefined,
  strictFunctionTypes: undefined,
  strictNullChecks: undefined,
  strictPropertyInitialization: undefined,
  stripInternal: undefined,
  suppressExcessPropertyErrors: false,
  suppressImplicitAnyIndexErrors: false,
  target: ts.ScriptTarget.ES2015,
  traceResolution: false,
  tsBuildInfoFile: undefined,
  typeRoots: undefined,
  types: undefined, // unsure
  useDefineForClassFields: undefined,
};

// @ts-ignore
class CustomCompilerHost implements ts.CompilerHost {
  getSourceFile(
    fileName: string,
    languageVersion: ts.ScriptTarget,
    onError?: (message: string) => void,
    shouldCreateNewSourceFile?: boolean
  ): ts.SourceFile | undefined {
    throw new Error("not implemented yet");
  }
  getSourceFileByPath?(
    fileName: string,
    path: ts.Path,
    languageVersion: ts.ScriptTarget,
    onError?: (message: string) => void,
    shouldCreateNewSourceFile?: boolean
  ): ts.SourceFile | undefined {
    throw new Error("not implemented yet");
  }
  getCancellationToken(): ts.CancellationToken {
    throw new Error("not implemented yet");
  }
  getDefaultLibFileName(options: ts.CompilerOptions): string {
    throw new Error("not implemented yet");
  }
  getDefaultLibLocation(): string {
    throw new Error("not implemented yet");
  }
  writeFile(
    fileName: string,
    data: string,
    writeByteOrderMark: boolean,
    onError?: (message: string) => void,
    sourceFiles?: readonly ts.SourceFile[]
  ): void {
    throw new Error("not implemented yet");
  }
  getCurrentDirectory(): string {
    throw new Error("not implemented yet");
  }
  getCanonicalFileName(fileName: string): string {
    throw new Error("not implemented yet");
  }
  useCaseSensitiveFileNames(): boolean {
    throw new Error("not implemented yet");
  }
  getNewLine(): string {
    throw new Error("not implemented yet");
  }
  readDirectory(
    rootDir: string,
    extensions: readonly string[],
    excludes: readonly string[] | undefined,
    includes: readonly string[],
    depth?: number
  ): string[] {
    throw new Error("not implemented yet");
  }
  resolveModuleNames(
    moduleNames: string[],
    containingFile: string,
    reusedNames: string[] | undefined,
    redirectedReference: ts.ResolvedProjectReference | undefined,
    options: ts.CompilerOptions
  ): (ts.ResolvedModule | undefined)[] {
    throw new Error("not implemented yet");
  }
  resolveTypeReferenceDirectives(
    typeReferenceDirectiveNames: string[],
    containingFile: string,
    redirectedReference: ts.ResolvedProjectReference | undefined,
    options: ts.CompilerOptions
  ): (ts.ResolvedTypeReferenceDirective | undefined)[] {
    throw new Error("not implemented yet");
  }
  getEnvironmentVariable(name: string): string | undefined {
    throw new Error("not implemented yet");
  }
  createHash(data: string): string {
    throw new Error("not implemented yet");
  }
  getParsedCommandLine(fileName: string): ts.ParsedCommandLine | undefined {
    throw new Error("not implemented yet");
  }
  fileExists(fileName: string): boolean {
    throw new Error("not implemented yet");
  }
  readFile(fileName: string): string | undefined {
    throw new Error("not implemented yet");
  }
  trace(s: string): void {
    throw new Error("not implemented yet");
  }
  directoryExists(directoryName: string): boolean {
    throw new Error("not implemented yet");
  }
  realpath(path: string): string {
    throw new Error("not implemented yet");
  }
  getDirectories(path: string): string[] {
    throw new Error("not implemented yet");
  }
}

const compile = () => {
  const program = ts.createProgram({
    rootNames: ["src/**/*"],
    options: compilerOptions,
    // host: new CustomCompilerHost(),
  });
  const emitResult = program.emit();
  const allDiagnostics = ts
    .getPreEmitDiagnostics(program)
    .concat(emitResult.diagnostics);
  allDiagnostics.forEach((diagnostic) => {
    if (diagnostic.file) {
      let { line, character } = ts.getLineAndCharacterOfPosition(
        diagnostic.file,
        diagnostic.start!
      );
      let message = ts.flattenDiagnosticMessageText(
        diagnostic.messageText,
        "\n"
      );
      console.log(
        `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`
      );
    } else {
      console.log(
        ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")
      );
    }
  });
  const sourceFile = program
    .getSourceFiles()
    .filter((s) => s.fileName === "src/a.ts")[0] as ts.SourceFile;
  const printer: ts.Printer = ts.createPrinter();

  const transformResult: ts.TransformationResult<ts.SourceFile> =
    ts.transform<ts.SourceFile>(sourceFile, [transformer]);
  const transformedSourceFile: ts.SourceFile = transformResult
    .transformed[0] as ts.SourceFile;
  const newContent = printer.printFile(transformedSourceFile);
  console.log(newContent);
  transformResult.dispose();

  const exitCode = emitResult.emitSkipped ? 1 : 0;
  console.log(`exiting with code '${exitCode}'.`);
};

compile();

const transformer =
  <T extends ts.Node>(context: ts.TransformationContext) =>
  (rootNode: T) => {
    function visit(node: ts.Node): ts.Node {
      node = ts.visitEachChild(node, visit, context);
      // in a property access expression like "foo.bar" "foo" is the expression and "bar" is the name :
      // we replace the whole expression with just node.expression in the case name is "accessorToBeRemoved"
      if (
        ts.isVariableDeclaration(node) &&
        node.name &&
        node.name.getText() === "myConstant"
      ) {
        console.log(node);
      }
      return node;
    }
    return ts.visitNode(rootNode, visit);
  };
