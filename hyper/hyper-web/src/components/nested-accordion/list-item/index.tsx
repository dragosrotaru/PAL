import { useEffect, useState } from "react";
import { NestedAccordionList } from "../list";
import { ExpandBehaviour, NestedData } from "../shared";
import "./style.css";

type Props = {
  data: NestedData;
  expand: boolean;
  expandBehaviour?: ExpandBehaviour;
};

export const NestedAccordionListItem = ({
  data,
  expand = true,
  expandBehaviour = ExpandBehaviour.EXPAND_SELF_ONLY,
}: Props) => {
  const [expanded, setExpanded] = useState(expand);
  const toggleExpand = () => setExpanded(!expanded);
  useEffect(() => {
    setExpanded(expand);
  }, [expand]);

  const { NestedDataContent, children } = data;

  let bullet: string = "●";
  const className = () => {
    const classes = ["nested-accordion-list-item-container"];
    if (Array.isArray(children) && children.length > 0) {
      classes.push("has-children");
      bullet = expanded ? "▼" : "▶";
    }
    return classes.join(" ");
  };

  return (
    <li className={className()}>
      <span
        className="bullet"
        onClick={(evt) => {
          evt.stopPropagation();
          toggleExpand();
        }}
      >
        {bullet}
      </span>
      <div>
        <NestedDataContent
          toggleExpand={(evt) => {
            evt.stopPropagation();
            toggleExpand();
          }}
        >
          {Array.isArray(children) && children.length > 0 && expanded ? (
            <NestedAccordionList
              data={children}
              expand={expandBehaviour === ExpandBehaviour.PROPAGATE_TO_DESCENDANTS}
              expandBehaviour={expandBehaviour}
            />
          ) : undefined}
        </NestedDataContent>
      </div>
    </li>
  );
};
