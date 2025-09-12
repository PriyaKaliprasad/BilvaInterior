import React from "react";
import { FieldWrapper } from "@progress/kendo-react-form";
import { MaskedTextBox } from "@progress/kendo-react-inputs";
import { Label, Error, Hint } from "@progress/kendo-react-labels";
import FloatingLabelWrapper from "./FloatingLabelWrapper/FloatingLabelWrapper";

const FormMaskedInput = (fieldRenderProps) => {
  const {
    validationMessage,
    touched,
    label,
    id,
    valid,
    disabled,
    hint,
    optional,
    colSpan,
    mask,           // <-- important: mask is passed from Field
    placeholder,
    ...others
  } = fieldRenderProps;

  const showValidationMessage = touched && validationMessage;
  const showHint = !showValidationMessage && hint;
  const hintId = showHint ? `${id}_hint` : "";
  const errorId = showValidationMessage ? `${id}_error` : "";

  return (
    <FieldWrapper colSpan={colSpan}>
      <div className="k-form-field-wrap">
        <FloatingLabelWrapper id={id} label={label}>
          <MaskedTextBox
            id={id}
            mask={mask}                // e.g. "+0 (000) 000-0000"
            placeholder={placeholder}  // e.g. "Enter phone number"
          valid={valid}
          disabled={disabled}
          size='large'
          aria-describedby={`${hintId} ${errorId}`}
          {...others}
        />
        </FloatingLabelWrapper>
        {showHint && <Hint id={hintId}>{hint}</Hint>}
        {showValidationMessage && <Error id={errorId}>{validationMessage}</Error>}
      </div>
    </FieldWrapper>
  );
};

export default FormMaskedInput;
