import React from "react";
import "./CustomFormFieldSet.css";

const CustomFormFieldSet = ({ legend, children }) => {
  return (
    <div className="custom-fieldset">
      {legend && <h3 className="fieldset-legend">{legend}</h3>}
      <div className="fieldset-grid">{children}</div>
    </div>
  );
};

export default CustomFormFieldSet;