import React, { useState, cloneElement } from "react";
import "./FloatingLabelWrapper.css";

const FloatingLabelWrapper = ({ id, label, value, children }) => {
  const [focused, setFocused] = useState(false);

  // Use child's value if wrapper value not provided
  const childValue = value ?? children.props.value;

  const child = cloneElement(children, {
    id,
    onFocus: (e) => {
      setFocused(true);
      if (children.props.onFocus) children.props.onFocus(e);
    },
    onBlur: (e) => {
      setFocused(false);
      if (children.props.onBlur) children.props.onBlur(e);
    }
  });

  // check validity
  const isInvalid = children.props.valid === false;

  // 👇 check if input has "real" value (not null/empty/undefined)
  const hasValue =
    childValue !== null &&
    childValue !== undefined &&
    String(childValue).trim() !== "";

  return (
    <div
      className={`floating-input 
        ${focused || hasValue ? "filled" : ""} 
        ${isInvalid ? "invalid" : ""}`}
    >
      {child}
      <label htmlFor={id}>{label}</label>
    </div>
  );
};

export default FloatingLabelWrapper;
