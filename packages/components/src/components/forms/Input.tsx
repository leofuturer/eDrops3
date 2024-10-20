import { useState } from "react";
import { Hide } from "../icons/Hide";
import { Show } from "../icons/Show";

// Input with associated error message and label
export function Input({ ...props }) {
  // Keep track if dirty to only show invalid if dirty
  const [dirty, setDirty] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);
  return (
    <div className="input">
      <input
        name={props.name}
        {...props}
        className={`field peer ${dirty ? "is-dirty": ""}`}
        onChange={() => setDirty(true)}
        aria-label={props["aria-label"] ?? props.name}
        type={
            props.type != "password" ? props.type : (show ? "text" : "password")
        }
      />
      {/* This label appears when the element is selected */}
      <label htmlFor={props.name} className="input-label">
        {props.placeholder}
      </label>
      {props.type == "password" && (!show ? <Show onClick={() => setShow(true)} className="password-toggle" /> : <Hide onClick={() => setShow(false)} className="password-toggle" />)}
    </div>
  );
}

export default Input;
