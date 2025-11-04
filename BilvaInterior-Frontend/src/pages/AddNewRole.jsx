
// import React, { useState, useEffect } from "react";
// import "./ManageRoles.css";
// import { Form, Field, FormElement } from "@progress/kendo-react-form";
// import { Button } from "@progress/kendo-react-buttons";
// import { Switch, Checkbox } from "@progress/kendo-react-inputs";
// import FormInput from "../components/Form/FormInput";

// const AddRole = () => {
//   const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api/Role`;

//   const [popupMessage, setPopupMessage] = useState("");
//   const [isSuccess, setIsSuccess] = useState(false);
//   const [formKey, setFormKey] = useState(0);
//   const [availableFeatures, setAvailableFeatures] = useState([]);

//   useEffect(() => {
//     fetch(`${API_BASE}/features`)
//       .then((res) => {
//         if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
//         return res.json();
//       })
//       .then((data) => setAvailableFeatures(data))
//       .catch((err) => console.error("Error fetching features:", err));
//   }, []);

//   const handleSubmit = async (dataItem) => {
//     setPopupMessage("Saving...");
//     setIsSuccess(false);

//     const selectedFeatureIds = Object.keys(dataItem.permissions || {})
//       .filter((key) => dataItem.permissions[key])
//       .map((key) => {
//         const feature = availableFeatures.find(
//           (f) => f.featureName.replace(/[\s&]/g, "") === key
//         );
//         return feature ? feature.featureId : null;
//       })
//       .filter((id) => id !== null);

//     const newRole = {
//       name: dataItem.roleName,
//       description: dataItem.roleDescription,
//       isActive: dataItem.status,
//       featureIds: selectedFeatureIds,
//     };

//     try {
//       const response = await fetch(API_BASE, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(newRole),
//       });

//       if (response.ok) {
//         setPopupMessage("✅ Role saved successfully!");
//         setIsSuccess(true);
//         setFormKey((prevKey) => prevKey + 1);

//         setTimeout(() => {
//           setPopupMessage("");
//           setIsSuccess(false);
//         }, 5000);
//       } else if (response.status === 409) {
//         const errorData = await response.json();
//         setPopupMessage(
//           `⚠️ ${errorData.message || "This role already exists!"}`
//         );
//         setIsSuccess(false);
//       } else {
//         setPopupMessage("❌ Failed to save role");
//         setIsSuccess(false);
//       }
//     } catch (error) {
//       console.error("Error saving role:", error);
//       setPopupMessage("❌ Error saving role");
//       setIsSuccess(false);
//     }
//   };

//   // ✅ SwitchField with default ON
//   const SwitchField = (fieldRenderProps) => {
//     const isChecked =
//       fieldRenderProps.value === undefined ? true : fieldRenderProps.value;

//     return (
//       <div
//         className="k-form-field"
//         style={{ display: "flex", alignItems: "center", gap: "1rem" }}
//       >
//         <label style={{ marginRight: "1rem", fontWeight: "bold" }}>
//           Status:
//         </label>
//         <Switch
//           checked={isChecked}
//           onChange={(e) =>
//             fieldRenderProps.onChange({
//               value: e.value,
//             })
//           }
//           onLabel="ACTIVE"
//           offLabel="INACTIVE"
//         />
//         <span>{isChecked ? "ACTIVE" : "INACTIVE"}</span>
//       </div>
//     );
//   };

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
//           key={formKey}
//           onSubmit={handleSubmit}
//           initialValues={{ status: true, permissions: {} }}
//           render={(formRenderProps) => (
//             <FormElement>
//               <fieldset className="k-form-fieldset">
//                 <div className="form-row">
//                   <Field
//                     name="roleName"
//                     component={FormInput}
//                     label="Role Name"
//                     required={true}
//                   />
//                   <Field
//                     name="roleDescription"
//                     component={FormInput}
//                     label="Description"
//                   />
//                 </div>
//               </fieldset>

//               <fieldset className="k-form-fieldset">
//                 <Field name="status" component={SwitchField} />
//               </fieldset>

//               <fieldset className="k-form-fieldset">
//                 <legend className="k-form-legend">FEATURES</legend>
//                 <div className="permissions-grid">
//                   {availableFeatures.map((feature) => (
//                     <Field
//                       key={feature.featureId}
//                       name={`permissions.${feature.featureName.replace(
//                         /[\s&]/g,
//                         ""
//                       )}`}
//                       component={Checkbox}
//                       label={feature.featureName}
//                     />
//                   ))}
//                 </div>
//               </fieldset>

//               {/* ✅ BOTH MESSAGES ABOVE BUTTONS */}
//               {popupMessage && popupMessage !== "Saving..." && (
//                 <div
//                   style={{
//                     marginBottom: "1rem",
//                     padding: "8px",
//                     borderRadius: "6px",
//                     textAlign: "center",
//                     fontWeight: "bold",
//                     color: isSuccess ? "#065f46" : "#b91c1c",
//                     backgroundColor: isSuccess ? "#d1fae5" : "#fee2e2",
//                     border: isSuccess
//                       ? "1px solid #34d399"
//                       : "1px solid #f87171",
//                   }}
//                 >
//                   {popupMessage}
//                 </div>
//               )}

//               <div className="k-form-buttons">
//                 <Button
//                   type="submit"
//                   themeColor="primary"
//                   disabled={
//                     !formRenderProps.allowSubmit ||
//                     popupMessage === "Saving..."
//                   }
//                 >
//                   Add New Role
//                 </Button>
//                 <Button
//                   type="button"
//                   onClick={() => setFormKey((k) => k + 1)}
//                   style={{ marginLeft: "10px" }}
//                 >
//                   Cancel
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


import React, { useState, useEffect } from "react";
import "./ManageRoles.css";
import { Form, Field, FormElement } from "@progress/kendo-react-form";
import { Button } from "@progress/kendo-react-buttons";
import { Switch, Checkbox } from "@progress/kendo-react-inputs";
import FormInput from "../components/Form/FormInput";

const AddRole = () => {
  const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api/Role`;

  const [popupMessage, setPopupMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [availableFeatures, setAvailableFeatures] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/features`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((data) => setAvailableFeatures(data))
      .catch((err) => console.error("Error fetching features:", err));
  }, []);

  const handleSubmit = async (dataItem) => {
    // ✅ Step 1: Manual validation before saving
    const roleName = dataItem.roleName?.trim();
    if (!roleName) {
      setPopupMessage("⚠️ Role name is required");
      setIsSuccess(false);
      return;
    }

    const selectedFeatureIds = Object.keys(dataItem.permissions || {})
      .filter((key) => dataItem.permissions[key])
      .map((key) => {
        const feature = availableFeatures.find(
          (f) => f.featureName.replace(/[\s&]/g, "") === key
        );
        return feature ? feature.featureId : null;
      })
      .filter((id) => id !== null);

    if (selectedFeatureIds.length === 0) {
      setPopupMessage("⚠️ Select at least one feature");
      setIsSuccess(false);
      return;
    }

    // ✅ Step 2: Proceed with saving if validation passes
    setPopupMessage("Saving...");
    setIsSuccess(false);

    const newRole = {
      name: roleName,
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
        setPopupMessage("✅ Role added successfully!");
        setIsSuccess(true);
        setFormKey((prevKey) => prevKey + 1); // reset form

        // Hide message after few seconds
        setTimeout(() => {
          setPopupMessage("");
          setIsSuccess(false);
        }, 3000);
      } else if (response.status === 409) {
        const errorData = await response.json();
        setPopupMessage(
          `⚠️ ${errorData.message || "This role already exists!"}`
        );
        setIsSuccess(false);
      } else {
        setPopupMessage("❌ Failed to save role");
        setIsSuccess(false);
      }
    } catch (error) {
      console.error("Error saving role:", error);
      setPopupMessage("❌ Error saving role");
      setIsSuccess(false);
    }
  };

  // ✅ SwitchField with default ON
  const SwitchField = (fieldRenderProps) => {
    const isChecked =
      fieldRenderProps.value === undefined ? true : fieldRenderProps.value;

    return (
      <div
        className="k-form-field"
        style={{ display: "flex", alignItems: "center", gap: "1rem" }}
      >
        <label style={{ marginRight: "1rem", fontWeight: "bold" }}>
          Status:
        </label>
        <Switch
          checked={isChecked}
          onChange={(e) =>
            fieldRenderProps.onChange({
              value: e.value,
            })
          }
          onLabel="ACTIVE"
          offLabel="INACTIVE"
        />
        <span>{isChecked ? "ACTIVE" : "INACTIVE"}</span>
      </div>
    );
  };

  return (
    <main>
      <div className="card">
        <p
          style={{
            fontSize: "0.9rem",
            color: "var(--dark-gray)",
            marginBottom: "1.5rem",
          }}
        >
          NOTE: Once created, a role cannot be deleted.
        </p>

        <Form
          key={formKey}
          onSubmit={handleSubmit}
          initialValues={{ status: true, permissions: {} }}
          render={(formRenderProps) => (
            <FormElement>
              <fieldset className="k-form-fieldset">
                <div className="form-row">
                  <Field
                    name="roleName"
                    component={FormInput}
                    label="Role Name"
                    required={true}
                  />
                  <Field
                    name="roleDescription"
                    component={FormInput}
                    label="Description"
                  />
                </div>
              </fieldset>

              <fieldset className="k-form-fieldset">
                <Field name="status" component={SwitchField} />
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

              {/* ✅ SAME SUCCESS / ERROR MESSAGE ABOVE BUTTONS */}
              {popupMessage && popupMessage !== "Saving..." && (
                <div
                  style={{
                    marginBottom: "1rem",
                    padding: "8px",
                    borderRadius: "6px",
                    textAlign: "center",
                    fontWeight: "bold",
                    color: isSuccess ? "#065f46" : "#b91c1c",
                    backgroundColor: isSuccess ? "#d1fae5" : "#fee2e2",
                    border: isSuccess ? "1px solid #34d399" : "1px solid #f87171",
                  }}
                >
                  {popupMessage}
                </div>
              )}

              {/* ✅ BUTTONS ALIGNED LEFT */}
              <div
                className="k-form-buttons"
                style={{
                  display: "flex",
                  justifyContent: "flex-start", // Align to left
                  gap: "10px",
                  marginTop: "1rem",
                }}
              >
                <Button
                  type="submit"
                  themeColor="primary"
                  disabled={
                    !formRenderProps.allowSubmit || popupMessage === "Saving..."
                  }
                >
                  Add New Role
                </Button>
                <Button type="button" onClick={() => setFormKey((k) => k + 1)}>
                  Cancel
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


