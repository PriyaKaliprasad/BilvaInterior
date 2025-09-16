import React from 'react';
import { DatePicker } from '@progress/kendo-react-dateinputs';
import { FieldWrapper } from '@progress/kendo-react-form';
import { Label, Hint, Error } from '@progress/kendo-react-labels';
import FloatingLabelWrapper from "./FloatingLabelWrapper/FloatingLabelWrapper";


const FormDatePicker = (fieldRenderProps) => {
    const { validationMessage, touched, label, id, valid, disabled, hint, wrapperStyle, hintDirection, value, ...others } = fieldRenderProps;

    const showValidationMessage = touched && validationMessage;
    const showHint = !showValidationMessage && hint;
    const hintId = showHint ? `${id}_hint` : '';
    const errorId = showValidationMessage ? `${id}_error` : '';
    const labelId = label ? `${id}_label` : '';

    return (
        <FieldWrapper style={wrapperStyle}>
            <FloatingLabelWrapper id={id} label={label} value={value} valid={valid}>
                <div className={'k-form-field-wrap'}>
                    <DatePicker
                        ariaLabelledBy={labelId}
                        ariaDescribedBy={`${hintId} ${errorId}`}
                        valid={valid}
                        id={id}
                        disabled={disabled}
                        value={value}
                        placeholder=""
                        size="large"
                        {...others}
                    />
                    {showHint && (
                        <Hint id={hintId} direction={hintDirection}>
                            {hint}
                        </Hint>
                    )}
                    {showValidationMessage && <Error id={errorId}>{validationMessage}</Error>}
                </div>
            </FloatingLabelWrapper>
        </FieldWrapper>
    );
};

export default FormDatePicker;