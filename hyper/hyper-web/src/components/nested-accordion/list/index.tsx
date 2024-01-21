import { ExpandBehaviour, NestedData } from "../shared";
import { NestedAccordionListItem } from "../list-item";
import "./style.css";

type Props = {
  data: NestedData[];
  expand?: boolean;
  expandBehaviour?: ExpandBehaviour;
};

export const NestedAccordionList = ({
  data,
  expand = true,
  expandBehaviour = ExpandBehaviour.EXPAND_SELF_ONLY,
}: Props) => {
  return (
    <ul className="nested-accordion-list-container">
      {data.map((entry, index) => (
        <NestedAccordionListItem key={index} data={entry} expand={expand} expandBehaviour={expandBehaviour} />
      ))}
    </ul>
  );
};
