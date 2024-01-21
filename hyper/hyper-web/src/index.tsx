import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import "./index.css";

// Views
import { Terminal } from "./views/terminal";
import { Editor } from "./views/editor";
import { Tasks } from "./views/tasks";
import { RAM } from "./views/ram";
import { WildCards } from "./views/wildcards";
import { CRDTEditor } from "./views/crdt-editor";

const code = `// Hello There 👋 
export const helloWorld = "hello world";
`;

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Route path={"/scratchpad"} exact >
          <CRDTEditor namespace="scratchpad"></CRDTEditor>
        </Route>
        <Route path={"/tasks"} component={Tasks} exact />
        <Route path={"/ram"} component={RAM} exact />
        <Route path={"/wildcards"} component={WildCards} exact />
        <Route path={"/terminal"} component={Terminal} exact />
        <Route path={"/editor"} exact>
          <Editor sourceCode={code} />
        </Route>
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById("root"),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
