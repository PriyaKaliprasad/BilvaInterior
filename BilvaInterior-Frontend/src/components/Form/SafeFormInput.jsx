import React from "react";
import { FieldWrapper } from "@progress/kendo-react-form";
import { TextBox, InputSuffix } from "@progress/kendo-react-inputs";
import { Error, Hint } from "@progress/kendo-react-labels";
import { Button } from "@progress/kendo-react-buttons";
import { eyeIcon, eyeSlashIcon } from "@progress/kendo-svg-icons";
import FloatingLabelWrapper from "./FloatingLabelWrapper/FloatingLabelWrapper";

const SafeFormInput = (fieldRenderProps) => {
    const {
        validationMessage,
        touched,
        label,
        id,
        valid,
        disabled,
        hint,
        type,
        optional,
        colSpan,
        autoComplete,
        value,
        onChange,
        ...others
    } = fieldRenderProps;
    const showValidationMessage = touched && validationMessage;
    const showHint = !showValidationMessage && hint;
    const hintId = showHint ? `${id}_hint` : '';
    const errorId = showValidationMessage ? `${id}_error` : '';
    const [togglePassword, setTogglePassword] = React.useState(type === 'password');

    const togglePasswordVisibility = () => {
        setTogglePassword(!togglePassword);
    };
    // Guarded onChange handler to prevent destructuring errors
    const safeOnChange = (event) => {
        if (!event || typeof event !== 'object' || !('value' in event)) {
            onChange && onChange({ value: '' });
        } else {
            onChange(event);
        }
    };
    return (
        <FieldWrapper colSpan={colSpan}>
            <div className={'k-form-field-wrap'}>
                <FloatingLabelWrapper id={id} label={label} value={value}>
                    <TextBox
                        valid={valid}
                        type={togglePassword ? 'password' : 'text'}
                        id={id}
                        disabled={disabled}
                        value={value ?? ""}
                        onChange={safeOnChange}
                        aria-describedby={`${hintId} ${errorId}`}
                        autoComplete={autoComplete}
                        size='large'
                        suffix={
                            type === 'password' &&
                            (() => {
                                return (
                                    <InputSuffix>
                                        <Button
                                            svgIcon={togglePassword ? eyeSlashIcon : eyeIcon}
                                            fillMode="clear"
                                            onClick={() => {
                                                togglePasswordVisibility();
                                            }}
                                        />
                                    </InputSuffix>
                                );
                            })
                        }
                        {...others}
                    />
                </FloatingLabelWrapper>
                {showHint && <Hint id={hintId}>{hint}</Hint>}
                {showValidationMessage && <Error id={errorId}>{validationMessage}</Error>}
            </div>
        </FieldWrapper>
    );
};

export default SafeFormInput;
