
// import React, { useEffect, useState } from "react";
// import { Button } from "@progress/kendo-react-buttons";
// import { Grid, GridColumn } from "@progress/kendo-react-grid";
// import { filterBy } from "@progress/kendo-data-query";
// import AddNewRole from "./AddNewRole";
// import "./ManageRoles.css";

// const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api/Role`;

// /* ---------- Roles List Page ---------- */
// function RolesList({ roles, features, loading, error, onEdit }) {
//   const [filter, setFilter] = useState(null);

//   if (loading) return <p>Loading roles...</p>;

//   // Generic cell renderer
//   const WrapCell = (props) => {
//     const value =
//       props.field && props.field in props.dataItem
//         ? props.dataItem[props.field]
//         : "";

//     return (
//       <td style={{ whiteSpace: "normal", wordBreak: "break-word", padding: 12 }}>
//         {value}
//       </td>
//     );
//   };

//   const StatusCell = (props) => (
//     <td style={{ textAlign: "center", padding: 12 }}>
//       {props.dataItem.isActive ? "Active" : "Inactive"}
//     </td>
//   );

//   const ActionsCell = (props) => (
//     <td style={{ textAlign: "center", padding: 12 }}>
//       <button
//         className="btn btn-primary"
//         onClick={() => onEdit(props.dataItem)}
//       >
//         Edit
//       </button>
//     </td>
//   );

//   return (
//     <main>
//       <div className="card roles-card">
//         {error && <p className="popup-message error">{error}</p>}
//         <div style={{ overflowX: "auto" }}>
//           <Grid
//             style={{ minWidth: 800, height: 500 }}
//             data={filterBy(roles, filter)}
//             filterable={true}
//             filter={filter}
//             onFilterChange={(e) => setFilter(e.filter)}
//           >
//             {/* Role Name */}
//             <GridColumn
//               field="name"
//               title="Role Name"
//               width={200}
//               cell={WrapCell}
//             />
//             {/* Description */}
//             <GridColumn
//               field="description"
//               title="Description"
//               width={200}
//               cell={WrapCell}
//             />
//             {/* Status */}
//             <GridColumn
//               field="isActive"
//               title="Status"
//               width={120}
//               cell={StatusCell}
//             />
//             {/* Actions - no filter */}
//             <GridColumn
//               title="Actions"
//               width={120}
//               filterable={false}
//               cell={ActionsCell}
//             />
//           </Grid>
//         </div>
//       </div>
//     </main>
//   );
// }

// /* ---------- Full Page Edit Form ---------- */
// function EditRole({ features, role, onCancel, onSave }) {
//   const [formData, setFormData] = useState({
//     id: 0,
//     name: "",
//     description: "",
//     isActive: true,
//     featureIds: [],
//   });
//   const [popupMessage, setPopupMessage] = useState({ text: "", type: "" });
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (role) {
//       // Use role.features (array of feature objects) to get assigned featureIds
//       const assignedIds = Array.isArray(role.features)
//         ? role.features.map(f => f.featureId)
//         : [];
//       setFormData({
//         id: role.id,
//         name: role.name ?? "",
//         description: role.description ?? "",
//         isActive: role.isActive ?? true,
//         featureIds: assignedIds,
//       });
//       setLoading(false);
//     }
//   }, [role]);

//   const handleFeatureToggle = (featureId) => {
//     setFormData((prev) => ({
//       ...prev,
//       featureIds: prev.featureIds.includes(featureId)
//         ? prev.featureIds.filter((id) => id !== featureId)
//         : [...prev.featureIds, featureId],
//     }));
//   };

//   const handleSelectAll = (e) => {
//     if (e.target.checked) {
//       setFormData((prev) => ({
//         ...prev,
//         featureIds: features.map((f) => f.featureId),
//       }));
//     } else {
//       setFormData((prev) => ({ ...prev, featureIds: [] }));
//     }
//   };

//   const handleSave = async () => {
//     if (!formData.name.trim()) {
//       setPopupMessage({ text: "⚠️ Role name is required", type: "error" });
//       return;
//     }
//     if (formData.featureIds.length === 0) {
//       setPopupMessage({ text: "⚠️ Select at least one feature", type: "error" });
//       return;
//     }

//     try {
//       const res = await fetch(`${API_BASE}/${formData.id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       if (res.ok) {
//         setPopupMessage({ text: "✅ Role saved successfully!", type: "success" });
//         setTimeout(() => {
//           setPopupMessage({ text: "", type: "" });
//           if (onSave) onSave(formData);
//         }, 1200);
//       } else {
//         const errData = await res
//           .json()
//           .catch(() => ({ message: "Failed to save role" }));
//         setPopupMessage({ text: `❌ ${errData.message}`, type: "error" });
//       }
//     } catch (err) {
//       console.error("Error saving role:", err);
//       setPopupMessage({ text: "❌ Error saving role", type: "error" });
//     }
//   };

//   if (loading) return <p>Loading role details...</p>;

//   const allSelected =
//     features.length > 0 && formData.featureIds.length === features.length;

//   return (
//     <main className="fullpage-form">
//       <div className="card" style={{ padding: 12 }}>
//         <h3>Edit Role</h3>

//         <div className="form-group">
//           <label>Role Name</label>
//           <input
//             type="text"
//             value={formData.name}
//             onChange={(e) =>
//               setFormData((prev) => ({ ...prev, name: e.target.value }))
//             }
//           />
//         </div>

//         <div className="form-group">
//           <label>Description</label>
//           <input
//             type="text"
//             value={formData.description}
//             onChange={(e) =>
//               setFormData((prev) => ({ ...prev, description: e.target.value }))
//             }
//           />
//         </div>

//         <div className="form-group">
//           <label>Status</label>
//           <select
//             value={formData.isActive ? "true" : "false"}
//             onChange={(e) =>
//               setFormData((prev) => ({
//                 ...prev,
//                 isActive: e.target.value === "true",
//               }))
//             }
//           >
//             <option value="true">Active</option>
//             <option value="false">Inactive</option>
//           </select>
//         </div>

//         <div className="form-group">
//           <label>Assign Features</label>
//           <div className="features-container">
//             {features.length > 0 && (
//               <div className="feature-item">
//                 <input
//                   type="checkbox"
//                   id="select-all"
//                   checked={allSelected}
//                   onChange={handleSelectAll}
//                 />
//                 <label htmlFor="select-all">
//                   <strong>Select All</strong>
//                 </label>
//               </div>
//             )}

//             {features.length > 0 ? (
//               features.map((f) => (
//                 <div key={f.featureId} className="feature-item">
//                   <input
//                     id={`feat-${f.featureId}`}
//                     type="checkbox"
//                     checked={formData.featureIds.includes(f.featureId)}
//                     onChange={() => handleFeatureToggle(f.featureId)}
//                   />
//                   <label htmlFor={`feat-${f.featureId}`}>
//                     {f.featureName}
//                   </label>
//                 </div>
//               ))
//             ) : (
//               <p style={{ color: "red" }}>
//                 ⚠️ No features loaded. Check API response.
//               </p>
//             )}
//           </div>
//         </div>


//         {popupMessage.text && (
//           <div
//             style={{
//               marginBottom: "1rem",
//               padding: "8px",
//               borderRadius: "6px",
//               textAlign: "center",
//               fontWeight: "bold",
//               color: popupMessage.type === "success" ? "#065f46" : "#b91c1c",
//               backgroundColor: popupMessage.type === "success" ? "#d1fae5" : "#fee2e2"
//             }}
//           >
//             {popupMessage.text}
//           </div>
//         )}

//         <div className="form-actions">
//           <button className="btn btn-primary" onClick={handleSave}>
//             Save
//           </button>
//           <button
//             className="btn"
//             onClick={onCancel}
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </main>
//   );
// }

// /* ---------- Main Component with In-Place Edit ---------- */

// export default function ManageRoles() {
//   const [roles, setRoles] = useState([]);
//   const [features, setFeatures] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [editItem, setEditItem] = useState(null);
//   const [showAdd, setShowAdd] = useState(false);

//   useEffect(() => {
//     fetchRoles();
//     fetchFeatures();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const fetchRoles = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(API_BASE);
//       if (!res.ok) throw new Error(`Failed to fetch roles`);
//       const data = await res.json();
//       setRoles(data || []);
//     } catch (err) {
//       console.error("Error fetching roles:", err);
//       setError("❌ Error loading roles");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchFeatures = async () => {
//     try {
//       const res = await fetch(`${API_BASE}/features`);
//       if (!res.ok) throw new Error("Failed to fetch features");
//       const data = await res.json();
//       setFeatures(data || []);
//     } catch (err) {
//       console.error("Error fetching features:", err);
//       setFeatures([]);
//     }
//   };

//   // When save is successful, update the roles list
//   const handleEditSave = (updatedRole) => {
//     setRoles((prev) => prev.map((r) => (r.id === updatedRole.id ? { ...r, ...updatedRole } : r)));
//     setEditItem(null);
//   };

//   // Responsive action bar style (same as ProjectTypes)
//   const actionBarStyle = {
//     position: 'sticky',
//     top: 0,
//     zIndex: 10,
//     background: '#fff',
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: '0.5rem 0.5rem 0.5rem 0.5rem',
//     borderBottom: '1px solid #eee',
//     minHeight: 48,
//     marginBottom: 10,
//   };
//   const actionBarBtnGroup = {
//     display: 'flex',
//     gap: '0.5rem',
//   };

//   // --- Main Render ---
//   if (showAdd) {
//     return (
//       <>
//         <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
//           <Button
//             icon="arrow-left"
//             size="small"
//             onClick={() => setShowAdd(false)}
//             className="action-btn back-btn"
//             style={{ marginRight: 8 }}
//           >
//             <span className="tieup-action-btn-text">Back</span>
//           </Button>
//         </div>
//         <AddNewRole />
//       </>
//     );
//   }
//   if (editItem) {
//     return (
//       <>
//         <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
//           <Button
//             icon="arrow-left"
//             size="small"
//             onClick={() => setEditItem(null)}
//             className="action-btn back-btn"
//             style={{ marginRight: 8 }}
//           >
//             <span className="tieup-action-btn-text">Back</span>
//           </Button>
//         </div>
//         <EditRole
//           features={features}
//           role={editItem}
//           onCancel={() => setEditItem(null)}
//           onSave={handleEditSave}
//         />
//       </>
//     );
//   }

//   return (
//     <main className="page-container">
//       {/* Action Bar: Always visible, sticky */}
//       <div style={actionBarStyle} className="emprole-action-bar">
//         <div style={actionBarBtnGroup}>
//           <Button
//             icon="refresh"
//             size="small"
//             onClick={fetchRoles}
//             className="action-btn refresh-btn"
//           >
//             <span className="tieup-action-btn-text">Refresh</span>
//           </Button>
//         </div>
//         <div style={actionBarBtnGroup}>
//           <Button
//             icon="plus"
//             size="small"
//             themeColor={'primary'}
//             onClick={() => setShowAdd(true)}
//             className="action-btn add-btn"
//           >
//             <span className="tieup-action-btn-text">Add</span>
//           </Button>
//         </div>
//       </div>
//       <RolesList
//         roles={roles}
//         features={features}
//         loading={loading}
//         error={error}
//         onEdit={setEditItem}
//       />
//     </main>
//   );
// }

import React, { useEffect, useState, useCallback } from "react";
import { Button } from "@progress/kendo-react-buttons";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { filterBy } from "@progress/kendo-data-query";
import "./ManageRoles.css";

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api/Role`;
// Utility to trim leading & trailing spaces live and on blur
const trimInput = (value) => value.replace(/^\s+|\s+$/g, "");


/* ---------- Roles List Page ---------- */
function RolesList({ roles, features, loading, error, onEdit, filter, setFilter }) {
  if (loading) return <p>Loading roles...</p>;

  // Generic cell renderer
  const WrapCell = (props) => {
    const value =
      props.field && props.field in props.dataItem
        ? props.dataItem[props.field]
        : "";

    return (
      <td style={{ whiteSpace: "normal", wordBreak: "break-word", padding: 12 }}>
        {value}
      </td>
    );
  };

  const StatusCell = (props) => (
    <td style={{ textAlign: "center", padding: 12 }}>
      {props.dataItem.isActive ? "Active" : "Inactive"}
    </td>
  );

  const ActionsCell = (props) => (
    <td style={{ textAlign: "center", padding: 12 }}>
      <button
        className="btn btn-primary"
        onClick={() => onEdit(props.dataItem)}
      >
        Edit
      </button>
    </td>
  );

  // Safely attempt to apply filters (Kendo can throw for mismatched operators/fields)
  let displayedData = roles || [];
  try {
    displayedData = filter ? filterBy(roles, filter) : roles;
  } catch (err) {
    // If filterBy fails due to invalid combination (eg. "contains" on boolean), fallback to unfiltered data
    console.error("Filter application error, falling back to unfiltered roles:", err);
    displayedData = roles;
  }

  return (
    <main>
      <div className="card roles-card">
        {error && <p className="popup-message error">{error}</p>}
        <div style={{ overflowX: "auto" }}>
          <Grid
            style={{ minWidth: 800, height: 500 }}
            data={displayedData}
            filterable={true}
            filter={filter}
            onFilterChange={(e) => setFilter && setFilter(e.filter)}
          >
            {/* Role Name */}
            <GridColumn
              field="name"
              title="Role Name"
              width={200}
              cell={WrapCell}
            />
            {/* Description */}
            <GridColumn
              field="description"
              title="Description"
              width={200}
              cell={WrapCell}
            />
            {/* Status */}
            <GridColumn
              field="isActive"
              title="Status"
              width={120}
              // keep as filterable but Grid/filter change handler is defensive
              cell={StatusCell}
            />
            {/* Actions - no filter */}
            <GridColumn
              title="Actions"
              width={120}
              filterable={false}
              className="actions-cell"
              cell={(props) => <ActionsCell {...props} />}
            />


          </Grid>
        </div>
      </div>
    </main>
  );
}

/* ---------- Add New Role (in-file to control behavior) ---------- */
function AddNewRole({ features = [], onCancel, onAdded }) {
  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    description: "",
    isActive: true,
    featureIds: [],
  });
  const [popupMessage, setPopupMessage] = useState({ text: "", type: "" });
  const [saving, setSaving] = useState(false);

  const handleFeatureToggle = (featureId) => {
    setFormData((prev) => ({
      ...prev,
      featureIds: prev.featureIds.includes(featureId)
        ? prev.featureIds.filter((id) => id !== featureId)
        : [...prev.featureIds, featureId],
    }));
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setFormData((prev) => ({
        ...prev,
        featureIds: features.map((f) => f.featureId),
      }));
    } else {
      setFormData((prev) => ({ ...prev, featureIds: [] }));
    }
  };

  const handleAdd = async () => {
    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      setPopupMessage({ text: "⚠️ Role name is required", type: "error" });
      return;
    }
    if (!formData.featureIds.length) {
      setPopupMessage({ text: "⚠️ Select at least one feature", type: "error" });
      return;
    }

    setSaving(true);
    try {
      const payload = { ...formData, name: trimmedName };
      const res = await fetch(`${API_BASE}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const created = await res.json().catch(() => null);
        setPopupMessage({ text: "✅ Role created successfully!", type: "success" });
        setTimeout(() => {
          setPopupMessage({ text: "", type: "" });
          if (onAdded) onAdded(created || payload);
        }, 900);
      } else {
        const errData = await res.json().catch(() => ({ message: "Failed to create role" }));
        setPopupMessage({ text: `❌ ${errData.message}`, type: "error" });
      }
    } catch (err) {
      console.error("Add role error:", err);
      setPopupMessage({ text: "❌ Error creating role", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const allSelected = features.length > 0 && formData.featureIds.length === features.length;

  return (
    <main className="fullpage-form">
      <div className="card" style={{ padding: 12 }}>
        <h3>Add New Role</h3>

        {/* Role Name */}
        <div className="form-group">
          <label>Role Name</label>
          <input
            type="text"
            value={formData.name}
            style={{ cursor: "text" }}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                name: trimInput(e.target.value),
              }))
            }
            onBlur={(e) =>
              setFormData((prev) => ({
                ...prev,
                name: trimInput(prev.name),
              }))
            }
          />
        </div>


        {/* Description */}
        <div className="form-group">
          <label>Description</label>
          <input
            type="text"
            value={formData.description}
            style={{ cursor: "text" }}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                description: trimInput(e.target.value),
              }))
            }
            onBlur={(e) =>
              setFormData((prev) => ({
                ...prev,
                description: trimInput(prev.description),
              }))
            }
          />
        </div>


        {/* Status */}
        <div className="form-group">
          <label>Status</label>
          <select
            value={formData.isActive ? "true" : "false"}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                isActive: e.target.value === "true",
              }))
            }
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        {/* Features */}
        <div className="form-group">
          <label>Assign Features</label>
          <div className="features-container">
            {features.length > 0 && (
              <div className="feature-item">
                <input
                  type="checkbox"
                  id="add-select-all"
                  checked={allSelected}
                  onChange={handleSelectAll}
                />
                <label htmlFor="add-select-all">
                  <strong>Select All</strong>
                </label>
              </div>
            )}

            {features.length > 0 ? (
              features.map((f) => (
                <div key={f.featureId} className="feature-item">
                  <input
                    id={`add-feat-${f.featureId}`}
                    type="checkbox"
                    checked={formData.featureIds.includes(f.featureId)}
                    onChange={() => handleFeatureToggle(f.featureId)}
                  />
                  <label htmlFor={`add-feat-${f.featureId}`}>{f.featureName}</label>
                </div>
              ))
            ) : (
              <p style={{ color: "red" }}>⚠️ No features loaded. Check API response.</p>
            )}
          </div>
        </div>

        {/* Popup Message */}
        {popupMessage.text && (
          <div
            style={{
              marginBottom: "1rem",
              padding: "8px",
              borderRadius: "6px",
              textAlign: "center",
              fontWeight: "bold",
              color: popupMessage.type === "success" ? "#065f46" : "#b91c1c",
              backgroundColor: popupMessage.type === "success" ? "#d1fae5" : "#fee2e2",
            }}
          >
            {popupMessage.text}
          </div>
        )}

        {/* Buttons */}
        <div className="form-actions">
          <button className="btn btn-primary" onClick={handleAdd} disabled={saving}>
            {saving ? "Saving..." : "Add"}
          </button>
          <button className="btn" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </main>
  );
}


/* ---------- Full Page Edit Form ---------- */
function EditRole({ features, role, onCancel, onSave }) {
  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    description: "",
    isActive: true,
    featureIds: [],
  });
  const [popupMessage, setPopupMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (role) {
      // Use role.features (array of feature objects) to get assigned featureIds
      const assignedIds = Array.isArray(role.features)
        ? role.features.map((f) => f.featureId)
        : Array.isArray(role.featureIds)
          ? role.featureIds // fallback if API returns IDs directly
          : [];

      setFormData({
        id: role.id,
        name: role.name ?? "",
        description: role.description ?? "",
        isActive: role.isActive ?? true,
        featureIds: assignedIds,
      });
      setLoading(false);
    } else {
      // ensure not stuck in loading if no role passed
      setLoading(false);
    }
  }, [role]);

  const handleFeatureToggle = (featureId) => {
    setFormData((prev) => ({
      ...prev,
      featureIds: prev.featureIds.includes(featureId)
        ? prev.featureIds.filter((id) => id !== featureId)
        : [...prev.featureIds, featureId],
    }));
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setFormData((prev) => ({
        ...prev,
        featureIds: features.map((f) => f.featureId),
      }));
    } else {
      setFormData((prev) => ({ ...prev, featureIds: [] }));
    }
  };

  const handleSave = async () => {
    // trim name before validating/saving
    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      setPopupMessage({ text: "⚠️ Role name is required", type: "error" });
      return;
    }
    if (formData.featureIds.length === 0) {
      setPopupMessage({ text: "⚠️ Select at least one feature", type: "error" });
      return;
    }

    setSaving(true);
    try {
      const payload = { ...formData, name: trimmedName };

      const res = await fetch(`${API_BASE}/${formData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setPopupMessage({ text: "✅ Role saved successfully!", type: "success" });
        setTimeout(() => {
          setPopupMessage({ text: "", type: "" });
          if (onSave) onSave(payload);
        }, 900);
      } else {
        const errData = await res.json().catch(() => ({ message: "Failed to save role" }));
        setPopupMessage({ text: `❌ ${errData.message}`, type: "error" });
      }
    } catch (err) {
      console.error("Error saving role:", err);
      setPopupMessage({ text: "❌ Error saving role", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading role details...</p>;

  const allSelected =
    features.length > 0 && formData.featureIds.length === features.length;

  return (
    <main className="fullpage-form">
      <div className="card" style={{ padding: 12 }}>
        <h3>Edit Role</h3>

        <div className="form-group">
          <label>Role Name</label>
          <input
            type="text"
            value={formData.name}
            style={{ cursor: "text" }}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                name: trimInput(e.target.value),
              }))
            }
            onBlur={(e) =>
              setFormData((prev) => ({
                ...prev,
                name: trimInput(prev.name),
              }))
            }
          />
        </div>


        <div className="form-group">
          <label>Description</label>
          <input
            type="text"
            value={formData.description}
            style={{ cursor: "text" }}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                description: trimInput(e.target.value),
              }))
            }
            onBlur={(e) =>
              setFormData((prev) => ({
                ...prev,
                description: trimInput(prev.description),
              }))
            }
          />
        </div>

        <div className="form-group">
          <label>Status</label>
          <select
            value={formData.isActive ? "true" : "false"}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                isActive: e.target.value === "true",
              }))
            }
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        <div className="form-group">
          <label>Assign Features</label>
          <div className="features-container">
            {features.length > 0 && (
              <div className="feature-item">
                <input
                  type="checkbox"
                  id="select-all"
                  checked={allSelected}
                  onChange={handleSelectAll}
                />
                <label htmlFor="select-all">
                  <strong>Select All</strong>
                </label>
              </div>
            )}

            {features.length > 0 ? (
              features.map((f) => (
                <div key={f.featureId} className="feature-item">
                  <input
                    id={`feat-${f.featureId}`}
                    type="checkbox"
                    checked={formData.featureIds.includes(f.featureId)}
                    onChange={() => handleFeatureToggle(f.featureId)}
                  />
                  <label htmlFor={`feat-${f.featureId}`}>
                    {f.featureName}
                  </label>
                </div>
              ))
            ) : (
              <p style={{ color: "red" }}>
                ⚠️ No features loaded. Check API response.
              </p>
            )}
          </div>
        </div>

        {popupMessage.text && (
          <div
            style={{
              marginBottom: "1rem",
              padding: "8px",
              borderRadius: "6px",
              textAlign: "center",
              fontWeight: "bold",
              color: popupMessage.type === "success" ? "#065f46" : "#b91c1c",
              backgroundColor: popupMessage.type === "success" ? "#d1fae5" : "#fee2e2"
            }}
          >
            {popupMessage.text}
          </div>
        )}

        <div
          className="form-actions"
          style={{
            display: "flex",
            justifyContent: "flex-start", // 👈 Aligns buttons to the left
            gap: "10px",
            marginTop: "1rem",
          }}
        >
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
          <button className="btn" onClick={onCancel}>
            Cancel
          </button>
        </div>

      </div>
    </main>
  );
}

/* ---------- Main Component with In-Place Edit / Add ---------- */

export default function ManageRoles() {
  const [roles, setRoles] = useState([]);
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editItem, setEditItem] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  // grid filter state moved to top-level so action bar can clear filters (TC_046)
  const [gridFilter, setGridFilter] = useState(null);

  useEffect(() => {
    // TC_003: set page title
    document.title = "Employee Roles";

    // history popstate handler to support browser back navigation (TC_070)
    const onPop = () => {
      // if user navigated back, close add/edit
      setShowAdd(false);
      setEditItem(null);
      // also clear any grid filter navigation state (we leave filter as-is)
    };

    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    fetchRoles();
    fetchFeatures();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error(`Failed to fetch roles`);
      const data = await res.json();
      setRoles(data || []);
      setError("");
    } catch (err) {
      console.error("Error fetching roles:", err);
      setError("❌ Error loading roles");
    } finally {
      setLoading(false);
    }
  };

  const fetchFeatures = async () => {
    try {
      const res = await fetch(`${API_BASE}/features`);
      if (!res.ok) throw new Error("Failed to fetch features");
      const data = await res.json();
      setFeatures(data || []);
    } catch (err) {
      console.error("Error fetching features:", err);
      setFeatures([]);
    }
  };

  // When save (edit) is successful, update the roles list in-place
  const handleEditSave = (updatedRole) => {
    // Trim name to be sure (TC_022)
    const trimmed = { ...updatedRole, name: (updatedRole.name || "").trim() };
    setRoles((prev) => prev.map((r) => (r.id === trimmed.id ? { ...r, ...trimmed } : r)));
    setEditItem(null);
    // push a history entry so state is consistent
    try { window.history.pushState({}, "", window.location.pathname); } catch { }
  };

  // After successful Add, refresh roles & close add view (TC_058)
  const handleAddSuccess = (createdRole) => {
    // Best-effort: if API returned the created role with id, we can insert directly:
    if (createdRole && createdRole.id) {
      setRoles((prev) => [createdRole, ...prev]);
    } else {
      // otherwise refresh from server to pick up the new role
      fetchRoles();
    }
    setShowAdd(false);
    try { window.history.pushState({}, "", window.location.pathname); } catch { }
  };

  // history entry push helpers for Add/Edit to support browser back navigation (TC_070)
  const openAdd = () => {
    setShowAdd(true);
    try {
      window.history.pushState({ page: "add-role" }, "", "#add");
    } catch { }
  };
  const openEdit = (role) => {
    setEditItem(role);
    try {
      window.history.pushState({ page: "edit-role" }, "", `#edit-${role?.id ?? ""}`);
    } catch { }
  };

  // Responsive action bar style (same as ProjectTypes)
  const actionBarStyle = {
    position: 'sticky',
    top: 0,
    zIndex: 10,
    background: '#fff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem 0.5rem 0.5rem 0.5rem',
    borderBottom: '1px solid #eee',
    minHeight: 48,
    marginBottom: 10,
  };
  const actionBarBtnGroup = {
    display: 'flex',
    gap: '0.5rem',
  };

  // --- Main Render ---
  if (showAdd) {
    return (
      <>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <Button
            icon="arrow-left"
            size="small"
            onClick={() => setShowAdd(false)} // ✅ only go back to Manage Roles list
            className="action-btn back-btn"
            style={{ marginRight: 8 }}
          >
            <span className="tieup-action-btn-text">Back</span>
          </Button>
        </div>

        <AddNewRole
          features={features}
          onCancel={() => setShowAdd(false)} // ✅ same logic here
          onAdded={handleAddSuccess}
        />
      </>
    );
  }
  // if (showAdd) {
  //   return (
  //     <>
  //       <div
  //         style={{
  //           display: "flex",
  //           alignItems: "center",
  //           marginBottom: 16,
  //         }}
  //       >
  //         <Button
  //           icon="arrow-left"
  //           size="small"
  //           onClick={() => setShowAdd(false)} // ✅ only go back to Manage Roles list
  //           className="action-btn back-btn"
  //           style={{ marginRight: 8 }}
  //         >
  //           <span className="tieup-action-btn-text">Back</span>
  //         </Button>
  //       </div>

  //       <AddNewRole
  //         features={features}
  //         onCancel={() => setShowAdd(false)} // ✅ same logic here
  //         onAdded={handleAddSuccess}
  //       />
  //     </>
  //   );
  // }

  if (editItem) {
    return (
      <>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          <Button
            icon="arrow-left"
            size="small"
            onClick={() => setEditItem(null)}  // ✅ Only close edit view
            className="action-btn back-btn"
            style={{ marginRight: 8 }}
          >
            <span className="tieup-action-btn-text">Back</span>
          </Button>
        </div>

        <EditRole
          features={features}
          role={editItem}
          onCancel={() => setEditItem(null)}  // ✅ Only close edit view
          onSave={handleEditSave}
        />
      </>
    );
  }


  return (
    <main className="page-container">
      {/* Action Bar: Always visible, sticky */}
      <div className="emprole-action-bar">
        <div className="left-actions">
          <Button
            icon="refresh"
            size="small"
            onClick={fetchRoles}
            className="k-button k-primary"
          >
            Refresh
          </Button>
          <Button
            icon="filter-clear"
            size="small"
            onClick={() => setGridFilter(null)}
            className="k-button k-secondary"
          >
            Clear Filters
          </Button>
        </div>

        <div className="right-actions">
          <Button
            icon="plus"
            size="small"
            onClick={() => setShowAdd(true)}
            className="k-button k-primary"
            themeColor={"primary"}
          >
            Add Role
          </Button>
        </div>
      </div>
      <RolesList
        roles={roles}
        features={features}
        loading={loading}
        error={error}
        onEdit={openEdit}
        filter={gridFilter}
        setFilter={setGridFilter}
      />
    </main>
  );
}
