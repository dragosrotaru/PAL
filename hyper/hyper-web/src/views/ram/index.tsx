import { useAPI } from "../../api";
import { CheckBox } from "../../components/checkbox";
import { NestedAccordionList } from "../../components/nested-accordion/list";
import { morning, work, lunch, night } from "../../models/routines";
import { dueNow, download } from "../../models/task";
import { CRDTEditor } from "../crdt-editor";
import { toNestedAccordionListData } from "../tasks";
import "./style.css";


const DoToday = () => {
     const [state] = useAPI(download)
    if (state.isLoading) {
    return <div>loading...</div>;
  } else if (state.isError) {
    return <div>error: {state.error}</div>;
  } else if (state.data) {
      return (<NestedAccordionList data={toNestedAccordionListData(dueNow(state.data))} />);
  } else {
    return <div>idle</div>
  }
}

export const RAM = () => (
  <div className="ram-container">
    <div>
      <div>
        <div>
          <h2>Do Today</h2>
          <DoToday />
        </div>
        <div>
          <h2>Scratchpad</h2>
          <CRDTEditor namespace="scratchpad"></CRDTEditor>
        </div>
      </div>
      <div>
        <h2>Rituals and Habits</h2>
        <h3>Morning</h3>
        <ul>
          {morning.map((ritual, index) => (
            <li key={index}>
              <CheckBox title={ritual.title} />
            </li>
          ))}
        </ul>
        <h3>Work</h3>
        <ul>
          {work.map((ritual, index) => (
            <li key={index}>
              <CheckBox title={ritual.title} />
            </li>
          ))}
        </ul>
        <h3>Lunch</h3>
        <ul>
          {lunch.map((ritual, index) => (
            <li key={index}>
              <CheckBox title={ritual.title} />
            </li>
          ))}
        </ul>
        <h3>Night</h3>
        <ul>
          {night.map((ritual, index) => (
            <li key={index}>
              <CheckBox title={ritual.title} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);
