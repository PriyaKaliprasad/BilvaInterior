import React, { useState } from "react";
import "./ManageRoles.css";
import { Form, Field, FormElement } from "@progress/kendo-react-form";
import { Button } from "@progress/kendo-react-buttons";
import { Switch, Checkbox } from "@progress/kendo-react-inputs";
import FormInput from "../components/Form/FormInput";

const AddRole = () => {
  const API_BASE = "https://localhost:7142/api/Role";
  
  const [popupMessage, setPopupMessage] = useState("");
  const [formKey, setFormKey] = useState(0); // This key is used to reset the form

  // A static list of features is fine for the creation page.
  const staticFeatures = [
    { featureId: 1, featureName: "CRUD on Employees" },
    { featureId: 2, featureName: "CRUD on Roles" },
    { featureId: 3, featureName: "Manage Projects" },
    { featureId: 4, featureName: "Access Audit Trail" },
    { featureId: 5, featureName: "Manage Billing & Expenses" },
    { featureId: 6, featureName: "Log Site Visits" },
    { featureId: 7, featureName: "View Assigned Projects" },
    { featureId: 8, featureName: "Upload Site Documents" },
    { featureId: 9, featureName: "View Reports & Dashboards" },
    { featureId: 10, featureName: "Approve Budgets & Expenses" },
    { featureId: 11, featureName: "Oversee Employee & Project Status" },
  ];
  const [availableFeatures, setAvailableFeatures] = useState(staticFeatures);

  const handleSubmit = async (dataItem) => {
    // Disable the button while submitting to prevent double-clicks
    setPopupMessage("Saving...");

    const selectedFeatureIds = Object.keys(dataItem.permissions || {})
      .filter((key) => dataItem.permissions[key])
      .map((key) => {
        const feature = availableFeatures.find(f => f.featureName.replace(/[\s&]/g, "") === key);
        return feature ? feature.featureId : null;
      })
      .filter(id => id !== null);

    const newRole = {
      name: dataItem.roleName,
      description: dataItem.roleDescription,
      isActive: dataItem.status,
      featureIds: selectedFeatureIds,
    };

    try {
      const response = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRole),
      });

      if (response.ok) {
        setPopupMessage("✅ Role saved successfully!");
        setFormKey(prevKey => prevKey + 1); // Reset the form
        setTimeout(() => setPopupMessage(""), 2500); // Clear the message
      } else if (response.status === 409) {
        const errorData = await response.json();
        setPopupMessage(`❌ ${errorData.message || 'This role already exists!'}`);
      } else {
        setPopupMessage("❌ Failed to save role");
      }
    } catch (error) {
      console.error("Error saving role:", error);
      setPopupMessage("❌ Error saving role");
    }
  };

  return (
    <main>
      <div className="card">
        <p style={{ fontSize: "0.9rem", color: "var(--dark-gray)", marginBottom: "1.5rem" }}>
          NOTE: Once created, a role cannot be deleted.
        </p>
        
        {popupMessage && (
          <div style={{ marginBottom: "1rem", padding: "8px", borderRadius: "6px", textAlign: "center", fontWeight: "bold", color: popupMessage.includes("✅") ? "#065f46" : "#b91c1c", backgroundColor: popupMessage.includes("✅") ? "#d1fae5" : "#fee2e2" }}>
            {popupMessage}
          </div>
        )}

        <Form
          key={formKey}
          onSubmit={handleSubmit}
          initialValues={{ status: true, permissions: {} }}
          render={(formRenderProps) => (
            <FormElement>
              <fieldset className="k-form-fieldset">
                <div className="form-row">
                  <Field name="roleName" component={FormInput} label="Role Name" required={true} />
                  <Field name="roleDescription" component={FormInput} label="Description" />
                </div>
              </fieldset>

              <fieldset className="k-form-fieldset">
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <label style={{ marginRight: "1rem", fontWeight: "bold" }}>Status:</label>
                  <Field name="status" component={Switch} />
                  <span>{formRenderProps.valueGetter("status") ? "ACTIVE" : "INACTIVE"}</span>
                </div>
              </fieldset>

              <fieldset className="k-form-fieldset">
                <legend className="k-form-legend">FEATURES</legend>
                <div className="permissions-grid">
                  {availableFeatures.map((feature) => (
                    <Field
                      key={feature.featureId}
                      name={`permissions.${feature.featureName.replace(/[\s&]/g, "")}`}
                      component={Checkbox}
                      label={feature.featureName}
                    />
                  ))}
                </div>
              </fieldset>

              <div className="k-form-buttons">
                <Button 
                  type="submit" 
                  themeColor="primary" 
                  disabled={!formRenderProps.allowSubmit || popupMessage === "Saving..."}
                >
                  Create New Role
                </Button>
                <Button 
                  type="button" 
                  onClick={() => setFormKey(k => k + 1)}
                  style={{ marginLeft: "10px" }}
                >
                  Reset
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