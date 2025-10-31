import React from "react";
import { FieldWrapper } from "@progress/kendo-react-form";
import { MultiSelect } from "@progress/kendo-react-dropdowns";
import { Label, Error, Hint } from "@progress/kendo-react-labels";

const FormMultiSelect = (fieldRenderProps) => {
    const {
        validationMessage,
        touched,
        label,
        id,
        valid,
        disabled,
        hint,
        wrapperStyle,
        colSpan,
        optional,
        data,
        defaultValue,
        textField,
        dataItemKey,
        adaptive,
        ...others
    } = fieldRenderProps;
    const editorRef = React.useRef(null);
    const showValidationMessage = touched && validationMessage;
    const showHint = !showValidationMessage && hint;
    const hintId = showHint ? `${id}_hint` : '';
    const errorId = showValidationMessage ? `${id}_error` : '';
    const labelId = label ? `${id}_label` : '';

    return (
        <FieldWrapper style={wrapperStyle} colSpan={colSpan}>
            <Label
                id={labelId}
                editorRef={editorRef}
                editorId={id}
                editorValid={valid}
                editorDisabled={disabled}
                className="k-form-label"
                optional={optional}
            >
                {label}
            </Label>
            <div className={'k-form-field-wrap'}>
                <MultiSelect
                    ariaLabelledBy={labelId}
                    aria-describedby={`${hintId} ${errorId}`}
                    ref={editorRef}
                    valid={valid}
                    id={id}
                    disabled={disabled}
                    data={data}
                    defaultValue={defaultValue}
                    textField={textField}
                    dataItemKey={dataItemKey}
                    adaptive={adaptive}
                    size='large'
                    {...others}
                />
                {showHint && <Hint id={hintId}>{hint}</Hint>}
                {showValidationMessage && <Error id={errorId}>{validationMessage}</Error>}
            </div>
        </FieldWrapper>
    );
};

export default FormMultiSelect;
