import React from "react";
import { FieldWrapper } from "@progress/kendo-react-form";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { Hint, Error } from "@progress/kendo-react-labels";
import FloatingLabelWrapper from "./FloatingLabelWrapper/FloatingLabelWrapper";

const FormDropDown = (fieldRenderProps) => {
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
        value,
        onChange,
        data,
        textField,
        dataItemKey,
        ...others
    } = fieldRenderProps;

    const showValidationMessage = touched && validationMessage;
    const showHint = !showValidationMessage && hint;
    const hintId = showHint ? `${id}_hint` : "";
    const errorId = showValidationMessage ? `${id}_error` : "";

    return (
        <FieldWrapper colSpan={colSpan}>
            <div className="k-form-field-wrap">
                <FloatingLabelWrapper id={id} label={label} value={value}>
                    <DropDownList
                        id={id}
                        valid={valid}
                        disabled={disabled}
                        size="large"
                        data={data || []} // ✅ fallback
                        textField={textField}
                        dataItemKey={dataItemKey}
                        value={
                            (Array.isArray(data)
                                ? data.find((item) => item[dataItemKey] === value)
                                : null) || null
                        }
                        onChange={(e) =>
                            onChange({ value: e.value ? e.value[dataItemKey] : null })
                        }
                        aria-describedby={`${hintId} ${errorId}`}
                        {...others}
                    />
                </FloatingLabelWrapper>
                {showHint && <Hint id={hintId}>{hint}</Hint>}
                {showValidationMessage && (
                    <Error id={errorId}>{validationMessage}</Error>
                )}
            </div>
        </FieldWrapper>
    );
};

export default FormDropDown;
