import { useState } from "react";
import { NestedAccordionList } from "../../components/nested-accordion/list";
import { ExpandBehaviour, NestedData } from "../../components/nested-accordion/shared";
import { IFrame } from "../../iframe";
import { NAMESPACE, NameSpace } from "../../models/namespace";
import "./style.css";

const toNestedAccordionListData = (nodes: NameSpace[]): NestedData[] =>
  nodes.map((node) => ({
    children: node.children ? toNestedAccordionListData(node.children) : undefined,
    NestedDataContent: ({ children, toggleExpand }) => (
      <>
        <label onClick={toggleExpand}>{node.name}</label>
        {children}
      </>
    ),
  }));

type Atom = {
  src: string,
  title: string,
}

export const WildCards = () => {
  const [atom, setAtom] = useState<Atom | null>(null);
  return (
  <div className="wildcards-container">
    <div className="wildcards-left-panel">
      <div>
        <h3>namespace</h3>
        <NestedAccordionList
          data={toNestedAccordionListData(NAMESPACE)}
          expandBehaviour={ExpandBehaviour.EXPAND_SELF_ONLY}
        ></NestedAccordionList>
      </div>
    </div>
    <div className="wildcards-right-panel">
      { atom ? 
      <IFrame src={atom.src} name={atom.src} title={atom.title}  />
      : "no atom picked" }
    </div>
  </div>
)
};
