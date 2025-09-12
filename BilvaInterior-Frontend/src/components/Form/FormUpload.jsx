import React from 'react'
import { FieldWrapper } from '@progress/kendo-react-form';
import { Error, Label, Hint } from '@progress/kendo-react-labels';
import { Upload } from '@progress/kendo-react-upload';

const FormUpload = (fieldRenderProps) => {
    const { value, id, optional, label, hint, validationMessage, touched, colSpan, onImageUpload, allowedFormatsArray, ...others } =
        fieldRenderProps;
    const showValidationMessage = touched && validationMessage;
    const showHint = !showValidationMessage && hint;
    const hintId = showHint ? `${id}_hint` : '';
    const errorId = showValidationMessage ? `${id}_error` : '';
    const labelId = label ? `${id}_label` : '';
    const onChangeHandler = (event) => {
        fieldRenderProps.onChange({
            value: event.newState
        });
        // Extract image file and notify parent
        if (event.newState && event.newState.length > 0 && event.newState[0].getRawFile) {
            const file = event.newState[0].getRawFile();
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    if (onImageUpload) {
                        onImageUpload(e.target?.result);
                    }
                };
                reader.readAsDataURL(file);
            }
        } else if (onImageUpload) {
            onImageUpload(null);
        }
    };

    const onRemoveHandler = (event) => {
        fieldRenderProps.onChange({
            value: event.newState
        });
        if (onImageUpload) {
            onImageUpload(null);
        }
    };
    return (
        <FieldWrapper colSpan={colSpan}>
            <Label id={labelId} editorId={id} optional={optional} className="k-form-label">
                {label}
            </Label>
            <div className={'k-form-field-wrap'}>
                <Upload
                    id={id}
                    autoUpload={false}
                    showActionButtons={false}
                    multiple={false}
                    files={value}
                    onAdd={onChangeHandler}
                    onRemove={onRemoveHandler}
                    aria-describedby={`${hintId} ${errorId}`}
                    ariaLabelledBy={labelId}
                    size='large'
                    restrictions={{
                        allowedExtensions: allowedFormatsArray // ✅ only Excel formats
                    }}
                    {...others}
                />
                {showHint && <Hint id={hintId}>{hint}</Hint>}
                {showValidationMessage && <Error id={errorId}>{validationMessage}</Error>}
            </div>
        </FieldWrapper>
    );
}

export default FormUpload