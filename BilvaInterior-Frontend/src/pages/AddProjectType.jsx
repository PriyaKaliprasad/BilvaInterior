import React, { useState, useEffect } from 'react';
import './projectTypes.css';

// KendoReact imports
import { Button } from '@progress/kendo-react-buttons';
import { Form, Field, FormElement } from '@progress/kendo-react-form';

// Custom components
import FormInput from '../components/Form/FormInput';
import CustomFormFieldSet from '../components/Form/CustomFormFieldSet';
import { nameValidator } from '../utils/validators';

const AddProjectType = () => {
    const responsiveBreakpoints = [
        { minWidth: 0, maxWidth: 499, value: 1 },
        { minWidth: 500, value: 2 }
    ];

    const [isLoading, setIsLoading] = useState(false);
    const [formMessage, setFormMessage] = useState({ text: '', type: '' });
    const [formKey, setFormKey] = useState(0); // ✅ used to force reset

    // ✅ Auto-hide success/error messages after 3 seconds
    useEffect(() => {
        if (formMessage.text) {
            const timer = setTimeout(() => {
                setFormMessage({ text: '', type: '' });
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [formMessage]);

    // ✅ Backend submit
    const handleSubmit = async (dataItem, formRenderProps) => {
        const newTypeName = dataItem.typeName;
        if (!newTypeName || !newTypeName.trim()) {
            setFormMessage({ text: 'Project type name cannot be empty.', type: 'error' });
            return;
        }

        setIsLoading(true);
        setFormMessage({ text: '', type: '' });

        const apiUrl = 'https://localhost:7142/api/ProjectTypes';
        const dataToSend = { name: newTypeName };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend),
            });

            if (response.status === 201) {
                const createdItem = await response.json();
                setFormMessage({
                    text: `✅ Project type "${createdItem.name}" created successfully!`,
                    type: 'success',
                });

                // ✅ Clear input field after success
                if (formRenderProps && formRenderProps.onFormReset) {
                    formRenderProps.onFormReset();
                }
                setFormKey(prev => prev + 1); // ✅ force full reset
            } else {
                const errorText = await response.text();
                setFormMessage({
                    text: `Error: ${errorText || 'Something went wrong.'}`,
                    type: 'error',
                });
            }
        } catch (error) {
            console.error('Failed to connect to the API:', error);
            setFormMessage({
                text: '❌ Network error. Please make sure the backend is running.',
                type: 'error',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <Form
                key={formKey} // ✅ important: re-mount form on reset
                initialValues={{ typeName: '' }} // ✅ ensures input clears
                onSubmit={(dataItem, formRenderProps) =>
                    handleSubmit(dataItem, formRenderProps)
                }
                render={(formRenderProps) => (
                    <FormElement style={{ maxWidth: 500, padding: '0 1rem' }}>
                        <CustomFormFieldSet cols={responsiveBreakpoints}>
                            <Field
                                name="typeName"
                                component={FormInput}
                                label="Project Type Name"
                                validator={nameValidator}
                            />
                            <p className="note-text">
                                NOTE: Once created, project type cannot be deleted.
                            </p>
                        </CustomFormFieldSet>

                        {/* ✅ Success/Error message UI */}
                        {formMessage.text && (
                            <div
                                className={`form-message ${formMessage.type}`}
                                style={{
                                    marginTop: 20,
                                    padding: '10px',
                                    borderRadius: '4px',
                                    textAlign: 'center',
                                    border: '1px solid transparent',
                                    backgroundColor:
                                        formMessage.type === 'success'
                                            ? '#d4edda'
                                            : '#f8d7da',
                                    color:
                                        formMessage.type === 'success'
                                            ? '#155724'
                                            : '#721c24',
                                    borderColor:
                                        formMessage.type === 'success'
                                            ? '#c3e6cb'
                                            : '#f5c6cb',
                                }}
                            >
                                {formMessage.text}
                            </div>
                        )}

                        <div className="k-form-buttons" style={{ marginTop: 20 }}>
                            <Button
                                type="submit"
                                themeColor="primary"
                                disabled={!formRenderProps.allowSubmit || isLoading}
                            >
                                {isLoading ? 'Creating...' : 'Create Type'}
                            </Button>
                            <Button
                                onClick={formRenderProps.onFormReset}
                                style={{ marginLeft: 12 }}
                                disabled={isLoading}
                            >
                                Reset
                            </Button>
                        </div>
                    </FormElement>
                )}
            />
        </div>
    );
};

export default AddProjectType;
