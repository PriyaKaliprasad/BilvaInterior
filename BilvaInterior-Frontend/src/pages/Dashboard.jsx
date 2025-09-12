import React from "react";
import { Form, Field } from "@progress/kendo-react-form";
import { Input } from "@progress/kendo-react-inputs";
const Dashboard = () => <div>
    <FormComponent />
</div>;
export default Dashboard;
const FormComponent = () => (
    <Form
        onSubmit={dataItem => alert(JSON.stringify(dataItem, null, 2))}
        render={(formRenderProps) => (
            <form onSubmit={formRenderProps.onSubmit}>
                <div>
                    <Field
                        name="name"
                        component={Input}
                        label="Name"
                        placeholder="Enter your name"
                    />
                </div>
                <div>
                    <Field
                        name="email"
                        component={Input}
                        label="Email"
                        placeholder="Enter your email"
                        type="email"
                    />
                </div>
                <button type="submit" className="k-button k-primary" disabled={!formRenderProps.allowSubmit}>
                    Submit
                </button>
            </form>
        )}
    />
);

export { FormComponent };