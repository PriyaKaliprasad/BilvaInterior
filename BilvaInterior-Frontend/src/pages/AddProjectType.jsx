import React, { useState } from 'react';
import './projectTypes.css';

// KendoReact imports
import { Button } from '@progress/kendo-react-buttons';
import { Form, Field, FormElement } from '@progress/kendo-react-form';

// Custom components
import FormInput from '../components/Form/FormInput';
import CustomFormFieldSet from '../components/Form/CustomFormFieldSet';
import { nameValidator } from '../utils/validators'; // ✅ reusing your validators

const AddProjectType = () => {
    const responsiveBreakpoints = [
        { minWidth: 0, maxWidth: 499, value: 1 },
        { minWidth: 500, value: 2 }
    ];
    const handleSubmit = (dataItem) => {
        const newTypeName = dataItem.typeName;
        if (!newTypeName.trim()) {
            alert('Project type name cannot be empty.');
            return;
        }
        const newType = {
            id: projectTypes.length + 1,
            type: newTypeName,
            status: 'Active',
        };
        setProjectTypes([...projectTypes, newType]);
        alert(`Project type "${newTypeName}" created!`);
    };

    return (

        <div >
            
            <p className="note-text">
                NOTE: Once created, project type cannot be deleted.
            </p>

            <Form
                onSubmit={handleSubmit}
                render={(formRenderProps) => (
                    <FormElement style={{ maxWidth: 500, padding: '0 1rem' }}>
                        <CustomFormFieldSet cols={responsiveBreakpoints}>
                            <Field
                                name="typeName"
                                component={FormInput}
                                label="Project Type Name"
                                // placeholder="Enter Project Type"
                                validator={nameValidator}
                            />
                        </CustomFormFieldSet>

                        <div className="k-form-buttons" style={{ marginTop: 20 }}>
                            <Button
                                type="submit"
                                themeColor="primary"
                                disabled={!formRenderProps.allowSubmit}
                            >
                                Create Type
                            </Button>
                            <Button
                                onClick={formRenderProps.onFormReset}
                                style={{ marginLeft: 12 }}
                            >
                                Reset
                            </Button>
                        </div>
                    </FormElement>
                )}
            />
        </div>
    )
}

export default AddProjectType;