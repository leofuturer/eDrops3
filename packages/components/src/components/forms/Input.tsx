import { useState } from "react";

// Input with associated error message and label
export function Input({ ...props }) {
    // Keep track if dirty to only show invalid if dirty
  const [dirty, setDirty] = useState<boolean>(false);
  return (
    <div className="input relative flex justify-center w-full">
      <input name={props.name} {...props} className={`field peer ${dirty && "is-dirty"}`} onChange={() => setDirty(true)}/>
      {/* This label appears when the element is selected */}
      <label htmlFor={props.name} className="input-label">{props.placeholder}</label>
    </div>
  );
}

export default Input;
