import { useState } from "react";
import { CheckBox } from "../../components/checkbox";
import { NestedAccordionList } from "../../components/nested-accordion/list";
import { NestedData, ExpandBehaviour } from "../../components/nested-accordion/shared"; 
import { download, Task } from "../../models/task";
import "./style.css";
import { useAPI } from "../../api";

export const toNestedAccordionListData = (tasks: Task[]): NestedData[] =>
  tasks.map((task) => ({
    children: toNestedAccordionListData(task.prerequisites),
    NestedDataContent: ({ children }) => (
      <>
        <CheckBox title={task.name} checked={task.completed} />
        {children}
      </>
    ),
  }));

export const Tasks = () => {
  const [state] = useAPI<Task[] | undefined>(download)
  const [expand, setExpand] = useState(true);
  const toggleShowAll = () => setExpand(!expand);
    if (state.isLoading) {
    return <div>loading...</div>;
  } else if (state.isError) {
    return <div>error: {state.error}</div>;
  } else if (state.data) {
      return (
    <>
      <div className="task-container">
        <h2>Tasks</h2>
        <button onClick={toggleShowAll}>collapse/open all</button>
        <NestedAccordionList
          data={toNestedAccordionListData(state.data)}
          expand={expand}
          expandBehaviour={ExpandBehaviour.EXPAND_SELF_ONLY}
        ></NestedAccordionList>
      </div>

    </>
  );
  } else {
    return <div>idle</div>
  }
};
