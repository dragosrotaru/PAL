import { useEffect, useRef } from "react";
import * as monaco from "monaco-editor";
import * as ts from "typescript";
import "./style.css";

// validation settings
monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
  noSemanticValidation: false,
  noSyntaxValidation: false,
});

// compiler options
monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
  target: monaco.languages.typescript.ScriptTarget.Latest,
  allowNonTsExtensions: true,
});

type Props = {
  sourceCode: string;
};

export const Editor = ({ sourceCode }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const editor = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  useEffect(() => {
    if (ref.current)
      editor.current = monaco.editor.create(ref.current, {
        value: sourceCode,
        language: "typescript",
        lineNumbers: "on",
        roundedSelection: false,
        scrollBeyondLastLine: false,
        fontSize: 16,
        scrollbar: {
          alwaysConsumeMouseWheel: false,
        },
        minimap: { enabled: false },
        readOnly: false,
        theme: "vs-dark",
      });
    return () => {
      editor.current?.dispose();
    };
  }, [ref, sourceCode]);

  const getSourceCode = () => editor.current?.getValue();

  const getErrors = () => {
    const model = editor.current?.getModel();
    if (!model) return null;
    const owner = model.getModeId();
    const markers = monaco.editor.getModelMarkers({ owner });
    const errors = markers.filter((m) => m.severity === monaco.MarkerSeverity.Error);
    return errors.length === 0 ? null : errors;
  };
  const hasErrors = () => getErrors() !== null;

  const onSave = () => {
    if (hasErrors()) {
      alert("errors present, cannot save");
      return;
    }

    console.log(getSourceCode());
  };

  const onRun = () => {
    const sourceCode = getSourceCode();
    if (!sourceCode) {
      alert("no source code");
      return;
    }

    if (hasErrors()) {
      alert("errors present, cannot save");
      return;
    }

    console.log("SOURCE CODE:");
    console.log(sourceCode);

    const transpiledCode = ts.transpileModule(sourceCode, { compilerOptions: { module: ts.ModuleKind.CommonJS } });
    console.log("TRANSPILED CODE:");
    console.log(transpiledCode.outputText);

    try {
      const func = new Function(["exports = {};", transpiledCode.outputText, "return exports;"].join("\n")); // eslint-disable-line no-new-func
      const result = func();
      console.log("EVALUATION RESULT:");
      alert(result.default);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="editor-container">
      <div className="editor-monaco" ref={ref}></div>
      <div className="editor-fab">
        <div className="editor-fab-button" id="editor-save" onClick={onSave}>
          save
        </div>
        <div className="editor-fab-button" id="editor-run" onClick={onRun}>
          run
        </div>
      </div>
    </div>
  );
};
