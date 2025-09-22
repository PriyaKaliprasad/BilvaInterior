// import React from "react";
// import "./ManageRoles.css";

// // KendoReact component imports
// import { Form, Field, FormElement } from "@progress/kendo-react-form";
// import { Button } from "@progress/kendo-react-buttons";
// import { Input, Switch, Checkbox } from "@progress/kendo-react-inputs";

// // Assuming FormInput is a custom component you've created for Kendo Fields
// // If not, you can replace `FormInput` with `Input` from Kendo.
// import FormInput from "../components/Form/FormInput";

// const AddRole = () => {
//   // Kendo Form passes the final data object directly
//   const handleSubmit = (dataItem) => {
//     alert("New Role Created:\n" + JSON.stringify(dataItem, null, 2));
//   };

//   const permissionsList = [
//     "CRUD on Employees", "CRUD on Roles", "Manage Projects",
//     "Access Audit Trail", "Manage Billing & Expenses", "Log Site Visits",
//     "View Assigned Projects", "Upload Site Documents", "View Reports & Dashboards",
//     "Approve Budgets & Expenses", "Oversee Employee & Project Status",
//   ];

//   return (
//     <main>
//       <div className="card">
//         <p style={{ fontSize: "0.9rem", color: "var(--dark-gray)", marginBottom: "1.5rem" }}>
//           NOTE: Once created, a role cannot be deleted.
//         </p>

//         <Form
//           onSubmit={handleSubmit}
//           initialValues={{ status: true }} // Set the switch to "Active" by default
//           render={(formRenderProps) => (
//             <FormElement>
//               {/* Fieldset for Role Name and Description */}
//               <fieldset className="k-form-fieldset">
//                 <div className="form-row">
//                   <Field
//                     name="roleName"
//                     component={FormInput}
//                     label="Role Name"
//                   />
//                   <Field
//                     name="roleDescription"
//                     component={FormInput}
//                     label="Description"
//                   />
//                 </div>
//               </fieldset>

//               {/* Fieldset for Status Toggle */}
//               <fieldset className="k-form-fieldset">
//                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
//                     <label style={{ marginRight: '1rem', fontWeight: 'bold' }}>Status:</label>
//                     <Field
//                       name="status"
//                       component={Switch}
//                     />
//                     <span>{formRenderProps.valueGetter('status') ? 'ACTIVE' : 'INACTIVE'}</span>
//                  </div>
//               </fieldset>
              
//               {/* Fieldset for Permissions */}
//               <fieldset className="k-form-fieldset">
//                 <legend className="k-form-legend">FEATURES</legend>
//                 <div className="permissions-grid">
//                   {permissionsList.map((perm, idx) => (
//                     <Field
//                       key={idx}
//                       name={`permissions.${perm.replace(/[\s&]/g, "")}`} // Create a valid unique name
//                       component={Checkbox}
//                       label={perm}
//                     />
//                   ))}
//                 </div>
//               </fieldset>

//               {/* Submission Button */}
//               <div className="k-form-buttons">
//                 <Button
//                   type="submit"
//                   themeColor="primary"
//                   disabled={!formRenderProps.allowSubmit}
//                 >
//                   Create New Role
//                 </Button>
//               </div>
//             </FormElement>
//           )}
//         />
//       </div>
//     </main>
//   );
// };

// export default AddRole;

// import React from "react";
// import "./ManageRoles.css";
// import { Form, Field, FormElement } from "@progress/kendo-react-form";
// import { Button } from "@progress/kendo-react-buttons";
// import { Input, Switch, Checkbox } from "@progress/kendo-react-inputs";
// import FormInput from "../components/Form/FormInput";
// import { useNavigate } from "react-router-dom"; // 👈 if you’re using react-router

// const AddRole = () => {
//   const navigate = useNavigate();
//   const API_BASE = "https://localhost:7178/api"; // 👉 Change when deploying

//   const handleSubmit = async (dataItem) => {
//     // Transform role object to match backend model
//     const newRole = {
//       name: dataItem.roleName,
//       description: dataItem.roleDescription,
//       isActive: dataItem.status,
//       features: Object.keys(dataItem.permissions || {})
//         .filter((key) => dataItem.permissions[key])
//         .map((key) => ({ title: key })), // Adjust if your backend expects IDs
//     };

//     try {
//       const response = await fetch(`${API_BASE}/Role`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(newRole),
//       });

//       if (response.ok) {
//         alert("✅ Role saved successfully!");
//         navigate("/manage-roles"); // 👈 redirect to ManageRoles page
//       } else {
//         alert("❌ Failed to save role");
//       }
//     } catch (error) {
//       console.error("Error saving role:", error);
//       alert("❌ Error saving role");
//     }
//   };

//   const permissionsList = [
//     "CRUD on Employees",
//     "CRUD on Roles",
//     "Manage Projects",
//     "Access Audit Trail",
//     "Manage Billing & Expenses",
//     "Log Site Visits",
//     "View Assigned Projects",
//     "Upload Site Documents",
//     "View Reports & Dashboards",
//     "Approve Budgets & Expenses",
//     "Oversee Employee & Project Status",
//   ];

//   return (
//     <main>
//       <div className="card">
//         <p
//           style={{
//             fontSize: "0.9rem",
//             color: "var(--dark-gray)",
//             marginBottom: "1.5rem",
//           }}
//         >
//           NOTE: Once created, a role cannot be deleted.
//         </p>

//         <Form
//           onSubmit={handleSubmit}
//           initialValues={{ status: true }}
//           render={(formRenderProps) => (
//             <FormElement>
//               <fieldset className="k-form-fieldset">
//                 <div className="form-row">
//                   <Field
//                     name="roleName"
//                     component={FormInput}
//                     label="Role Name"
//                   />
//                   <Field
//                     name="roleDescription"
//                     component={FormInput}
//                     label="Description"
//                   />
//                 </div>
//               </fieldset>

//               <fieldset className="k-form-fieldset">
//                 <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
//                   <label style={{ marginRight: "1rem", fontWeight: "bold" }}>
//                     Status:
//                   </label>
//                   <Field name="status" component={Switch} />
//                   <span>
//                     {formRenderProps.valueGetter("status") ? "ACTIVE" : "INACTIVE"}
//                   </span>
//                 </div>
//               </fieldset>

//               <fieldset className="k-form-fieldset">
//                 <legend className="k-form-legend">FEATURES</legend>
//                 <div className="permissions-grid">
//                   {permissionsList.map((perm, idx) => (
//                     <Field
//                       key={idx}
//                       name={`permissions.${perm.replace(/[\s&]/g, "")}`}
//                       component={Checkbox}
//                       label={perm}
//                     />
//                   ))}
//                 </div>
//               </fieldset>

//               <div className="k-form-buttons">
//                 <Button
//                   type="submit"
//                   themeColor="primary"
//                   disabled={!formRenderProps.allowSubmit}
//                 >
//                   Create New Role
//                 </Button>
//               </div>
//             </FormElement>
//           )}
//         />
//       </div>
//     </main>
//   );
// };

// export default AddRole;

// import React, { useState } from "react";
// import "./ManageRoles.css";
// import { Form, Field, FormElement } from "@progress/kendo-react-form";
// import { Button } from "@progress/kendo-react-buttons";
// import { Switch, Checkbox } from "@progress/kendo-react-inputs";
// import FormInput from "../components/Form/FormInput";

// const AddRole = () => {
//   const API_BASE = "https://localhost:7178/api"; // 👉 Change when deploying
//   const [popupMessage, setPopupMessage] = useState("");

//   const handleSubmit = async (dataItem, formRenderProps) => {
//     const newRole = {
//       name: dataItem.roleName,
//       description: dataItem.roleDescription,
//       isActive: dataItem.status,
//       features: Object.keys(dataItem.permissions || {})
//         .filter((key) => dataItem.permissions[key])
//         .map((key) => ({ title: key })),
//     };

//     try {
//       const response = await fetch(`${API_BASE}/Role`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(newRole),
//       });

//       if (response.ok) {
//         setPopupMessage("✅ Role saved successfully!");
//         formRenderProps.onFormReset(); // 👈 clears form fields
//         setTimeout(() => setPopupMessage(""), 2000); // hide popup after 2s
//       } else if (response.status === 409) {
//         // 👈 duplicate role error from backend
//         setPopupMessage("❌ Role with this name already exists!");
//         setTimeout(() => setPopupMessage(""), 2000);
//       } else {
//         setPopupMessage("❌ Failed to save role");
//         setTimeout(() => setPopupMessage(""), 2000);
//       }
//     } catch (error) {
//       console.error("Error saving role:", error);
//      // setPopupMessage("❌ Error saving role");
//       setTimeout(() => setPopupMessage(""), 2000);
//     }
//   };

//   const permissionsList = [
//     "CRUD on Employees",
//     "CRUD on Roles",
//     "Manage Projects",
//     "Access Audit Trail",
//     "Manage Billing & Expenses",
//     "Log Site Visits",
//     "View Assigned Projects",
//     "Upload Site Documents",
//     "View Reports & Dashboards",
//     "Approve Budgets & Expenses",
//     "Oversee Employee & Project Status",
//   ];

//   return (
//     <main>
//       <div className="card">
//         <p
//           style={{
//             fontSize: "0.9rem",
//             color: "var(--dark-gray)",
//             marginBottom: "1.5rem",
//           }}
//         >
//           NOTE: Once created, a role cannot be deleted.
//         </p>

//         {/* ✅ Popup message */}
//         {popupMessage && (
//           <div
//             style={{
//               marginBottom: "1rem",
//               padding: "8px",
//               borderRadius: "6px",
//               textAlign: "center",
//               fontWeight: "bold",
//               color: popupMessage.includes("✅") ? "#065f46" : "#b91c1c",
//               backgroundColor: popupMessage.includes("✅")
//                 ? "#d1fae5"
//                 : "#fee2e2",
//             }}
//           >
//             {popupMessage}
//           </div>
//         )}

//         <Form
//           onSubmit={handleSubmit}
//           initialValues={{ status: true }}
//           render={(formRenderProps) => (
//             <FormElement>
//               {/* Role Name + Description */}
//               <fieldset className="k-form-fieldset">
//                 <div className="form-row">
//                   <Field
//                     name="roleName"
//                     component={FormInput}
//                     label="Role Name"
//                   />
//                   <Field
//                     name="roleDescription"
//                     component={FormInput}
//                     label="Description"
//                   />
//                 </div>
//               </fieldset>

//               {/* Status */}
//               <fieldset className="k-form-fieldset">
//                 <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
//                   <label style={{ marginRight: "1rem", fontWeight: "bold" }}>
//                     Status:
//                   </label>
//                   <Field name="status" component={Switch} />
//                   <span>
//                     {formRenderProps.valueGetter("status")
//                       ? "ACTIVE"
//                       : "INACTIVE"}
//                   </span>
//                 </div>
//               </fieldset>

//               {/* Features */}
//               <fieldset className="k-form-fieldset">
//                 <legend className="k-form-legend">FEATURES</legend>
//                 <div className="permissions-grid">
//                   {permissionsList.map((perm, idx) => (
//                     <Field
//                       key={idx}
//                       name={`permissions.${perm.replace(/[\s&]/g, "")}`}
//                       component={Checkbox}
//                       label={perm}
//                     />
//                   ))}
//                 </div>
//               </fieldset>

//               {/* Buttons */}
//               <div className="k-form-buttons">
//                 <Button
//                   type="submit"
//                   themeColor="primary"
//                   disabled={!formRenderProps.allowSubmit}
//                 >
//                   Create New Role
//                 </Button>
//                 <Button
//                   type="button"
//                   onClick={formRenderProps.onFormReset}
//                   style={{ marginLeft: "10px" }}
//                 >
//                   Reset
//                 </Button>
//               </div>
//             </FormElement>
//           )}
//         />
//       </div>
//     </main>
//   );
// };

// export default AddRole;


// AddNewRole.js
// AddNewRole.js
import React, { useState, useEffect } from "react";
import "./ManageRoles.css";
import { Form, Field, FormElement } from "@progress/kendo-react-form";
import { Button } from "@progress/kendo-react-buttons";
import { Switch, Checkbox } from "@progress/kendo-react-inputs";
import FormInput from "../components/Form/FormInput";

const AddRole = () => {
  const API_BASE = "https://localhost:7142/api";
  const [popupMessage, setPopupMessage] = useState("");
  const [availableFeatures, setAvailableFeatures] = useState([]);

  const [isLoadingFeatures, setIsLoadingFeatures] = useState(true);
  const [featureError, setFeatureError] = useState(null);

  useEffect(() => {
    const fetchFeatures = async () => {
      setIsLoadingFeatures(true);
      setFeatureError(null);
      try {
        const response = await fetch(`${API_BASE}/Role/features`);
        if (response.ok) {
          const data = await response.json();
          setAvailableFeatures(data);
        } else {
          throw new Error("Failed to load features from the server.");
        }
      } catch (error) {
        console.error("Error fetching features:", error);
        setFeatureError(error.message);
      } finally {
        setIsLoadingFeatures(false);
      }
    };
    fetchFeatures();
  }, []);

  const handleSubmit = async (dataItem, formRenderProps) => {
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
      const response = await fetch(`${API_BASE}/Role`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRole),
      });

      if (response.ok) {
        setPopupMessage("✅ Role saved successfully!");
        formRenderProps.onFormReset();
        setTimeout(() => setPopupMessage(""), 2000);
      } else if (response.status === 409) {
        const errorData = await response.json();
        setPopupMessage(`❌ ${errorData.message || 'This role already exists!'}`);
        setTimeout(() => setPopupMessage(""), 2000);
      } else {
        setPopupMessage("❌ Failed to save role");
        setTimeout(() => setPopupMessage(""), 2000);
      }
    } catch (error) {
      console.error("Error saving role:", error);
      //setPopupMessage("❌ Error saving role");
      setTimeout(() => setPopupMessage(""), 2000);
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
          onSubmit={handleSubmit}
          initialValues={{ status: true }}
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
                  <label style={{ marginRight: "1rem", fontWeight: "bold" }}>
                    Status:
                  </label>
                  <Field name="status" component={Switch} />
                  <span>
                    {formRenderProps.valueGetter("status") ? "ACTIVE" : "INACTIVE"}
                  </span>
                </div>
              </fieldset>

              <fieldset className="k-form-fieldset">
                <legend className="k-form-legend">FEATURES</legend>
                
                {isLoadingFeatures ? (
                  <p>Loading features...</p>
                ) : featureError ? (
                  <p style={{ color: 'red' }}>Error: {featureError}</p>
                ) : availableFeatures.length === 0 ? (
                  <p>No features available.</p>
                ) : (
                  <div className="permissions-grid">
                    {availableFeatures.map((feature) => (
                      <Field
                        // --- FIXED: Using the unique featureId for the key ---
                        key={feature.featureId}
                        name={`permissions.${feature.featureName.replace(/[\s&]/g, "")}`}
                        component={Checkbox}
                        label={feature.featureName}
                      />
                    ))}
                  </div>
                )}
              </fieldset>

              <div className="k-form-buttons">
                <Button type="submit" themeColor="primary" disabled={!formRenderProps.allowSubmit}>
                  Create New Role
                </Button>
                <Button type="button" onClick={formRenderProps.onFormReset} style={{ marginLeft: "10px" }}>
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





