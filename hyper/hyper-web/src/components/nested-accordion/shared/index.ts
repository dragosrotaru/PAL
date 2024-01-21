import React from "react";

export type NestedData = {
  children?: NestedData[];
  NestedDataContent(props: {
    toggleExpand: (event: React.SyntheticEvent) => void;
    children?: JSX.Element;
  }): JSX.Element;
};

export enum ExpandBehaviour {
  PROPAGATE_TO_DESCENDANTS,
  EXPAND_SELF_ONLY,
}
