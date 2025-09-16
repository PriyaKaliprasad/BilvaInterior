import React from "react";
import "./ManageRoles.css";

// KendoReact component imports
import { Form, Field, FormElement } from "@progress/kendo-react-form";
import { Button } from "@progress/kendo-react-buttons";
import { Input, Switch, Checkbox } from "@progress/kendo-react-inputs";

// Assuming FormInput is a custom component you've created for Kendo Fields
// If not, you can replace `FormInput` with `Input` from Kendo.
import FormInput from "../components/Form/FormInput";

const AddRole = () => {
  // Kendo Form passes the final data object directly
  const handleSubmit = (dataItem) => {
    alert("New Role Created:\n" + JSON.stringify(dataItem, null, 2));
  };

  const permissionsList = [
    "CRUD on Employees", "CRUD on Roles", "Manage Projects",
    "Access Audit Trail", "Manage Billing & Expenses", "Log Site Visits",
    "View Assigned Projects", "Upload Site Documents", "View Reports & Dashboards",
    "Approve Budgets & Expenses", "Oversee Employee & Project Status",
  ];

  return (
    <main>
      <div className="card">
        <p style={{ fontSize: "0.9rem", color: "var(--dark-gray)", marginBottom: "1.5rem" }}>
          NOTE: Once created, a role cannot be deleted.
        </p>

        <Form
          onSubmit={handleSubmit}
          initialValues={{ status: true }} // Set the switch to "Active" by default
          render={(formRenderProps) => (
            <FormElement>
              {/* Fieldset for Role Name and Description */}
              <fieldset className="k-form-fieldset">
                <div className="form-row">
                  <Field
                    name="roleName"
                    component={FormInput}
                    label="Role Name"
                  />
                  <Field
                    name="roleDescription"
                    component={FormInput}
                    label="Description"
                  />
                </div>
              </fieldset>

              {/* Fieldset for Status Toggle */}
              <fieldset className="k-form-fieldset">
                 <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <label style={{ marginRight: '1rem', fontWeight: 'bold' }}>Status:</label>
                    <Field
                      name="status"
                      component={Switch}
                    />
                    <span>{formRenderProps.valueGetter('status') ? 'ACTIVE' : 'INACTIVE'}</span>
                 </div>
              </fieldset>
              
              {/* Fieldset for Permissions */}
              <fieldset className="k-form-fieldset">
                <legend className="k-form-legend">FEATURES</legend>
                <div className="permissions-grid">
                  {permissionsList.map((perm, idx) => (
                    <Field
                      key={idx}
                      name={`permissions.${perm.replace(/[\s&]/g, "")}`} // Create a valid unique name
                      component={Checkbox}
                      label={perm}
                    />
                  ))}
                </div>
              </fieldset>

              {/* Submission Button */}
              <div className="k-form-buttons">
                <Button
                  type="submit"
                  themeColor="primary"
                  disabled={!formRenderProps.allowSubmit}
                >
                  Create New Role
                </Button>
              </div>
            </FormElement>
          )}
        />
      </div>
    </main>
  );
};

export default AddRole;