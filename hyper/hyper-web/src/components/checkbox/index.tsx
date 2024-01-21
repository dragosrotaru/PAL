import React, { useState } from "react";
import "./style.css";

type Props = {
  title: string;
  checked?: boolean;
  onChecked?: () => void;
  onUnchecked?: () => void;
  onToggled?: () => void;
  onLabelClick?: React.MouseEventHandler<HTMLLabelElement>;
};

export const CheckBox = (props: Props) => {
  const [checked, setChecked] = useState(props.checked ?? false);
  const toggleChecked = () => setChecked(!checked);
  const onChange = () => {
    if (checked) props.onUnchecked?.();
    else props.onChecked?.();
    props.onToggled?.();
    toggleChecked();
  };

  return (
    <div className="checkbox-container">
      <input type="checkbox" checked={checked} onChange={onChange}></input>
      <label onClick={props.onLabelClick}>{props.title}</label>
    </div>
  );
};

const D: any = {};

const typeGuard = (i: unknown): i is typeof CheckBox => true;

export default typeGuard(D) ? <D title={""}></D> : <CheckBox title={""} />;
