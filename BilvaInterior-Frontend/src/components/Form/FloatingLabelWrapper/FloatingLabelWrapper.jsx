import React, { useState, cloneElement } from "react";
import "./FloatingLabelWrapper.css";

const FloatingLabelWrapper = ({ id, label, value, valid, children }) => {
  const [focused, setFocused] = useState(false);

  // Use child's value if wrapper value not provided
  const childValue = value ?? children?.props?.value;

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
  const isInvalid = valid === false || (children?.props?.valid === false);

  // Determine if there is a value  
  const hasValue =
    childValue instanceof Date
      ? !isNaN(childValue.getTime()) // valid date
      : childValue !== null &&
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
