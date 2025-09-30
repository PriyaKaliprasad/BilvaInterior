// import React, { useEffect, useState } from "react";
// import "./ManageRoles.css";

// export default function ManageRoles() {
//   const [roles, setRoles] = useState([]);
//   const [features, setFeatures] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showDialog, setShowDialog] = useState(false);
//   const [formData, setFormData] = useState({
//     id: 0,
//     name: "",
//     description: "",
//     isActive: true,
//     featureIds: []
//   });
//   const [popupMessage, setPopupMessage] = useState("");

//   const API_BASE = "https://localhost:7142/api/Role";

//   useEffect(() => {
//     fetchRoles();
//     fetchFeatures();
//   }, []);

//   const fetchRoles = async () => {
//     try {
//       const res = await fetch(`${API_BASE}`);
//       if (!res.ok) throw new Error(`(${res.status})`);
//       const data = await res.json();
//       setRoles(data || []);
//     } catch (err) {
//       console.error("Error fetching roles:", err);
//       setRoles([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchFeatures = async () => {
//     try {
//       const res = await fetch(`${API_BASE}/features`);
//       if (!res.ok) throw new Error(`Failed to fetch features (${res.status})`);
//       const data = await res.json();
//       setFeatures(data || []);
//     } catch (err) {
//       console.error("Error fetching features:", err);
//       setFeatures([]);
//     }
//   };

//   const handleAddNew = () => {
//     setFormData({
//       id: 0,
//       name: "",
//       description: "",
//       isActive: true,
//       featureIds: []
//     });
//     setPopupMessage("");
//     setShowDialog(true);
//   };

//   const handleEdit = (role) => {
//     const selectedIds = role.roleFeatures ? role.roleFeatures.map((rf) => rf.featureId) : [];
//     setFormData({
//       id: role.id,
//       name: role.name ?? "",
//       description: role.description ?? "",
//       isActive: role.isActive ?? true,
//       featureIds: selectedIds
//     });
//     setPopupMessage("");
//     setShowDialog(true);
//   };

//   const handleFeatureToggle = (featureId) => {
//     setFormData((prev) => {
//       const exists = prev.featureIds.includes(featureId);
//       return {
//         ...prev,
//         featureIds: exists
//           ? prev.featureIds.filter((id) => id !== featureId)
//           : [...prev.featureIds, featureId],
//       };
//     });
//   };

//   const handleSave = async () => {
//     if (!formData.name || formData.name.trim() === "") {
//       setPopupMessage("⚠️ Role name is required");
//       return;
//     }

//     const duplicate = roles.some(
//       (r) =>
//         r.name &&
//         r.name.toLowerCase() === formData.name.toLowerCase() &&
//         r.id !== formData.id
//     );
//     if (duplicate) {
//       setPopupMessage("⚠️ This role already exists!");
//       return;
//     }

//     try {
//       const isNew = formData.id === 0;
//       const url = isNew ? `${API_BASE}` : `${API_BASE}/${formData.id}`;
//       const method = isNew ? "POST" : "PUT";

//       const body = {
//         name: formData.name,
//         description: formData.description,
//         isActive: formData.isActive,
//         featureIds: formData.featureIds
//       };

//       const res = await fetch(url, {
//         method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(body),
//       });

//       if (res.ok) {
//         setPopupMessage("✅ Role saved successfully");
//         await fetchRoles();
//         setTimeout(() => {
//           setShowDialog(false);
//           setPopupMessage("");
//         }, 1100);
//       } else {
//         const err = await res.json().catch(() => null);
//         setPopupMessage(`❌ ${err?.message ?? "Failed to save role"}`);
//       }
//     } catch (err) {
//       console.error("Error saving role:", err);
//       setPopupMessage("❌ Error saving role");
//     }
//   };

//   const renderFeaturesForRole = (role) => {
//     const rf = role.roleFeatures;
//     if (!rf || rf.length === 0) return <span>No features</span>;

//     const sortedFeatures = rf
//       .map((rfi) => (rfi.feature?.featureName ?? "Unnamed"))
//       .sort();

//     return (
//       <ul style={{ margin: 0, paddingLeft: '20px', listStyleType: 'disc', textAlign: 'left' }}>
//         {sortedFeatures.map((featureName, index) => (
//           <li key={index}>{featureName}</li>
//         ))}
//       </ul>
//     );
//   };

//   if (loading) return <p>Loading roles...</p>;

//   return (
//     <main>
//       <div className="card">
//         {popupMessage && (
//             <p style={{
//               color: popupMessage.includes('❌') || popupMessage.includes('⚠️') ? '#b91c1c' : '#065f46',
//               backgroundColor: popupMessage.includes('❌') || popupMessage.includes('⚠️') ? '#fee2e2' : '#d1fae5',
//               padding: '8px', borderRadius: '6px', textAlign: 'center', fontWeight: 'bold', marginBottom: '1rem'
//             }}>
//               {popupMessage}
//             </p>
//         )}
        
//         <table className="roles-table" style={{ width: "100%" }}>
//           <thead>
//             <tr>
//               <th>Role Name</th>
//               <th>Description</th>
//               <th>Status</th>
//               <th>Features</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {roles && roles.length > 0 ? (
//               roles.map((role) => (
//                 <tr key={role.id}>
//                   <td data-label="Role Name">{role.name}</td>
//                   <td data-label="Description">{role.description}</td>
//                   <td data-label="Status">{role.isActive ? "Active" : "Inactive"}</td>
//                   <td data-label="Features">
//                     <div style={{ maxWidth: 360 }}>{renderFeaturesForRole(role)}</div>
//                   </td>
//                   <td data-label="Actions">
//                     <button className="btn btn-primary" onClick={() => handleEdit(role)} style={{ padding: "6px 10px" }}>
//                       Edit
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={5} style={{ textAlign: "center" }}>No roles found.</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//       {showDialog && (
//         <div aria-modal="true" role="dialog" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1200, padding: 16 }}>
//           <div style={{ width: "520px", maxWidth: "100%", maxHeight: "85vh", overflowY: "auto", background: "#fff", borderRadius: 10, padding: "20px 22px", boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}>
//             <h3 style={{ textAlign: "center", marginBottom: 12 }}>
//               {formData.id === 0 ? "Add New Role" : "Edit Role"}
//             </h3>
//             <div style={{ marginBottom: 12 }}>
//               <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>Role Name</label>
//               <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ width: "100%", padding: "9px 10px", borderRadius: 6, border: "1px solid #d1d5db" }} placeholder="Enter role name"/>
//             </div>
//             <div style={{ marginBottom: 12 }}>
//               <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>Description</label>
//               <input type="text" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} style={{ width: "100%", padding: "9px 10px", borderRadius: 6, border: "1px solid #d1d5db" }} placeholder="Short description"/>
//             </div>
//             <div style={{ marginBottom: 12 }}>
//               <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>Status</label>
//               <select value={formData.isActive ? "true" : "false"} onChange={(e) => setFormData({ ...formData, isActive: e.target.value === "true" })} style={{ width: "100%", padding: "9px 10px", borderRadius: 6, border: "1px solid #d1d5db" }}>
//                 <option value="true">Active</option>
//                 <option value="false">Inactive</option>
//               </select>
//             </div>
//             <div style={{ marginBottom: 12 }}>
//               <label style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>Assign Features</label>
//               <div style={{ border: "1px solid #e6e6e6", borderRadius: 6, padding: 8, maxHeight: 180, overflowY: "auto" }}>
//                 {features && features.length > 0 ? (
//                   features.map((f) => (
//                     <div key={f.featureId} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 4px" }}>
//                       <input id={`feat-${f.featureId}`} type="checkbox" checked={formData.featureIds.includes(f.featureId)} onChange={() => handleFeatureToggle(f.featureId)}/>
//                       <label htmlFor={`feat-${f.featureId}`} style={{ userSelect: "none" }}>{f.featureName}</label>
//                     </div>
//                   ))
//                 ) : (
//                   <div>No features available</div>
//                 )}
//               </div>
//             </div>
//             <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginTop: 8 }}>
//               <button onClick={handleSave} style={{ flex: 1, padding: "9px 12px", borderRadius: 8, border: "none", background: "#0d6efd", color: "#fff", fontWeight: 600, cursor: "pointer" }}>Save</button>
//               <button onClick={() => { setShowDialog(false); setPopupMessage(""); }} style={{ flex: 1, padding: "9px 12px", borderRadius: 8, border: "1px solid #d1d5db", background: "#fff", color: "#111827", fontWeight: 600, cursor: "pointer" }}>Cancel</button>
//             </div>
//             {popupMessage && (<div style={{ marginTop: 12, textAlign: "center", fontWeight: 600 }}>{popupMessage}</div>)}
//           </div>
//         </div>
//       )}
//     </main>
//   );
// }



// import React, { useEffect, useState } from "react";
// import { Routes, Route, useNavigate, useParams } from "react-router-dom";
// import "./ManageRoles.css";

// const API_BASE = "https://localhost:7142/api/Role";

// /* ---------- Roles List Page ---------- */
// function RolesList({ roles, features, loading, error }) {
//   const navigate = useNavigate();

//   const renderFeaturesForRole = (role) => {
//     if (!features.length || !role.featureIds?.length) {
//       return <span>No features assigned</span>;
//     }

//     const assignedFeatures = features
//       .filter((f) => role.featureIds.includes(f.featureId))
//       .map((f) => f.featureName)
//       .sort();

//     return assignedFeatures.length > 0 ? (
//       <ul style={{ margin: 0, paddingLeft: "20px", listStyleType: "disc", textAlign: "left" }}>
//         {assignedFeatures.map((featureName, idx) => (
//           <li key={idx}>{featureName}</li>
//         ))}
//       </ul>
//     ) : (
//       <span>No features assigned</span>
//     );
//   };

//   if (loading) return <p>Loading roles...</p>;

//   return (
//     <main>
//       <div className="card">
//         {error && <p className="popup-message error">{error}</p>}
//         <table className="roles-table" style={{ width: "100%" }}>
//           <thead>
//             <tr>
//               <th>Role Name</th>
//               <th>Description</th>
//               <th>Status</th>
//               <th>Features</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {roles.length > 0 ? (
//               roles.map((role) => (
//                 <tr key={role.id}>
//                   <td>{role.name}</td>
//                   <td>{role.description}</td>
//                   <td>{role.isActive ? "Active" : "Inactive"}</td>
//                   <td>
//                     <div style={{ maxWidth: 360 }}>{renderFeaturesForRole(role)}</div>
//                   </td>
//                   <td>
//                     <button className="btn btn-primary" onClick={() => navigate(`edit/${role.id}`)}>
//                       Edit
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={5} style={{ textAlign: "center" }}>No roles found.</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </main>
//   );
// }

// /* ---------- Full Page Edit Form ---------- */
// function EditRole({ features }) {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     id: 0,
//     name: "",
//     description: "",
//     isActive: true,
//     featureIds: []
//   });
//   const [popupMessage, setPopupMessage] = useState("");

//   useEffect(() => {
//     fetchRole();
//   }, [id]);

//   const fetchRole = async () => {
//     try {
//       const res = await fetch(`${API_BASE}/${id}`);
//       if (!res.ok) throw new Error("Failed to fetch role");
//       const data = await res.json();
//       setFormData({
//         id: data.id,
//         name: data.name ?? "",
//         description: data.description ?? "",
//         isActive: data.isActive ?? true,
//         featureIds: data.featureIds || []
//       });
//     } catch (err) {
//       console.error(err);
//       setPopupMessage("❌ Error loading role details");
//     }
//   };

//   const handleFeatureToggle = (featureId) => {
//     setFormData((prev) => ({
//       ...prev,
//       featureIds: prev.featureIds.includes(featureId)
//         ? prev.featureIds.filter((id) => id !== featureId)
//         : [...prev.featureIds, featureId]
//     }));
//   };

//   const handleSave = async () => {
//     if (!formData.name.trim()) {
//       setPopupMessage("⚠️ Role name is required");
//       return;
//     }

//     try {
//       const res = await fetch(`${API_BASE}/${formData.id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData)
//       });

//       if (res.ok) {
//         setPopupMessage("✅ Role saved successfully!");
//         setTimeout(() => navigate("/manage-employees/roles"), 1200);
//       } else {
//         const errData = await res.json().catch(() => ({ message: "Failed to save role" }));
//         setPopupMessage(`❌ ${errData.message}`);
//       }
//     } catch (err) {
//       console.error(err);
//       setPopupMessage("❌ Error saving role");
//     }
//   };

//   return (
//     <main className="fullpage-form">
//       <div className="card">
//         <h3>Edit Role</h3>

//         <div className="form-group">
//           <label>Role Name</label>
//           <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
//         </div>

//         <div className="form-group">
//           <label>Description</label>
//           <input type="text" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
//         </div>

//         <div className="form-group">
//           <label>Status</label>
//           <select value={formData.isActive ? "true" : "false"} onChange={(e) => setFormData({ ...formData, isActive: e.target.value === "true" })}>
//             <option value="true">Active</option>
//             <option value="false">Inactive</option>
//           </select>
//         </div>

//         <div className="form-group">
//           <label>Assign Features</label>
//           <div className="features-container">
//             {features.length > 0 ? (
//               features.map((f) => (
//                 <div key={f.featureId} className="feature-item">
//                   <input
//                     id={`feat-${f.featureId}`}
//                     type="checkbox"
//                     checked={formData.featureIds.includes(f.featureId)}
//                     onChange={() => handleFeatureToggle(f.featureId)}
//                   />
//                   <label htmlFor={`feat-${f.featureId}`}>{f.featureName}</label>
//                 </div>
//               ))
//             ) : (
//               <p>No features available</p>
//             )}
//           </div>
//         </div>

//         {popupMessage && <p className="popup-message">{popupMessage}</p>}

//         <div className="form-actions">
//           <button className="btn btn-primary" onClick={handleSave}>Save</button>
//           <button className="btn" onClick={() => navigate("/manage-employees/roles")}>Cancel</button>
//         </div>
//       </div>
//     </main>
//   );
// }

// /* ---------- Main Component with Routes ---------- */
// export default function ManageRoles() {
//   const [roles, setRoles] = useState([]);
//   const [features, setFeatures] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     fetchRoles();
//     fetchFeatures();
//   }, []);

//   const fetchRoles = async () => {
//     try {
//       const res = await fetch(API_BASE);
//       if (!res.ok) throw new Error(`Failed to fetch roles`);
//       const data = await res.json();
//       setRoles(data || []);
//     } catch (err) {
//       console.error(err);
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
//       console.error(err);
//       setFeatures([]);
//     }
//   };

//   return (
//     <Routes>
//       <Route path="/" element={<RolesList roles={roles} features={features} loading={loading} error={error} />} />
//       <Route path="edit/:id" element={<EditRole features={features} />} />
//     </Routes>
//   );
// }

// import React, { useEffect, useState } from "react";
// import { Routes, Route, useNavigate, useParams } from "react-router-dom";
// import "./ManageRoles.css";

// const API_BASE = "https://localhost:7142/api/Role";

// /* ---------- Roles List Page ---------- */
// function RolesList({ roles, features, loading, error }) {
//   const navigate = useNavigate();

//   const renderFeaturesForRole = (role) => {
//     let assignedFeatureIds = role.featureIds?.length
//       ? role.featureIds
//       : role.roleFeatures?.map(rf => rf.featureId) || [];

//     if (!features.length || !assignedFeatureIds.length) {
//       return <span>No features assigned</span>;
//     }

//     const assignedFeatures = features
//       .filter((f) => assignedFeatureIds.includes(f.featureId))
//       .map((f) => f.featureName)
//       .sort();

//     return assignedFeatures.length > 0 ? (
//       <ul style={{ margin: 0, paddingLeft: "20px", listStyleType: "disc", textAlign: "left" }}>
//         {assignedFeatures.map((featureName, idx) => (
//           <li key={idx}>{featureName}</li>
//         ))}
//       </ul>
//     ) : (
//       <span>No features assigned</span>
//     );
//   };

//   if (loading) return <p>Loading roles...</p>;

//   return (
//     <main>
//       <div className="card">
//         {error && <p className="popup-message error">{error}</p>}
//         <table className="roles-table" style={{ width: "100%" }}>
//           <thead>
//             <tr>
//               <th>Role Name</th>
//               <th>Description</th>
//               <th>Status</th>
//               <th>Features</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {roles.length > 0 ? (
//               roles.map((role) => (
//                 <tr key={role.id}>
//                   <td>{role.name}</td>
//                   <td>{role.description}</td>
//                   <td>{role.isActive ? "Active" : "Inactive"}</td>
//                   <td>
//                     <div style={{ maxWidth: 360 }}>{renderFeaturesForRole(role)}</div>
//                   </td>
//                   <td>
//                     <button className="btn btn-primary" onClick={() => navigate(`edit/${role.id}`)}>
//                       Edit
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={5} style={{ textAlign: "center" }}>No roles found.</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </main>
//   );
// }

// /* ---------- Full Page Edit Form ---------- */
// function EditRole({ features }) {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     id: 0,
//     name: "",
//     description: "",
//     isActive: true,
//     featureIds: []
//   });
//   const [popupMessage, setPopupMessage] = useState("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchRole();
//   }, [id]);

//   const fetchRole = async () => {
//     try {
//       const res = await fetch(`${API_BASE}/${id}`);
//       if (!res.ok) throw new Error("Failed to fetch role");
//       const data = await res.json();

//       // If roleFeatures exists, convert to featureIds array
//       const assignedIds = data.featureIds?.length
//         ? data.featureIds
//         : data.roleFeatures?.map(rf => rf.featureId) || [];

//       setFormData({
//         id: data.id,
//         name: data.name ?? "",
//         description: data.description ?? "",
//         isActive: data.isActive ?? true,
//         featureIds: assignedIds
//       });
//     } catch (err) {
//       console.error("Error fetching role:", err);
//       setPopupMessage("❌ Error loading role details");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFeatureToggle = (featureId) => {
//     setFormData((prev) => ({
//       ...prev,
//       featureIds: prev.featureIds.includes(featureId)
//         ? prev.featureIds.filter((id) => id !== featureId)
//         : [...prev.featureIds, featureId]
//     }));
//   };

//   const handleSave = async () => {
//     if (!formData.name.trim()) {
//       setPopupMessage("⚠️ Role name is required");
//       return;
//     }

//     try {
//       const res = await fetch(`${API_BASE}/${formData.id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData)
//       });

//       if (res.ok) {
//         setPopupMessage("✅ Role saved successfully!");
//         setTimeout(() => navigate("/manage-employees/roles"), 1200);
//       } else {
//         const errData = await res.json().catch(() => ({ message: "Failed to save role" }));
//         setPopupMessage(`❌ ${errData.message}`);
//       }
//     } catch (err) {
//       console.error("Error saving role:", err);
//       setPopupMessage("❌ Error saving role");
//     }
//   };

//   if (loading) return <p>Loading role details...</p>;

//   return (
//     <main className="fullpage-form">
//       <div className="card">
//         <h3>Edit Role</h3>

//         <div className="form-group">
//           <label>Role Name</label>
//           <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
//         </div>

//         <div className="form-group">
//           <label>Description</label>
//           <input type="text" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
//         </div>

//         <div className="form-group">
//           <label>Status</label>
//           <select value={formData.isActive ? "true" : "false"} onChange={(e) => setFormData({ ...formData, isActive: e.target.value === "true" })}>
//             <option value="true">Active</option>
//             <option value="false">Inactive</option>
//           </select>
//         </div>

//         <div className="form-group">
//           <label>Assign Features</label>
//           <div className="features-container">
//             {features && features.length > 0 ? (
//               features.map((f) => { 
//                 return (
//                 <div key={f.featureId} className="feature-item">
//                   <input
//                     id={`feat-${f.featureId}`}
//                     type="checkbox"
//                     checked={formData.featureIds.includes(f.featureId)}
//                     onChange={() => handleFeatureToggle(f.featureId)}
//                   />
//                   <label htmlFor={`feat-${f.featureId}`}>{f.featureName}</label>
//                 </div>
//               )})
//             ) : (
//               <p style={{ color: "red" }}>⚠️ No features loaded. Check API response in console.</p>
//             )}
//           </div>
//         </div>

//         {popupMessage && <p className="popup-message">{popupMessage}</p>}

//         <div className="form-actions">
//           <button className="btn btn-primary" onClick={handleSave}>Save</button>
//           <button className="btn" onClick={() => navigate("/manage-employees/roles")}>Cancel</button>
//         </div>
//       </div>
//     </main>
//   );
// }

// /* ---------- Main Component with Routes ---------- */
// export default function ManageRoles() {
//   const [roles, setRoles] = useState([]);
//   const [features, setFeatures] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     fetchRoles();
//     fetchFeatures();
//   }, []);

//   const fetchRoles = async () => {
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
//   try {
//     const res = await fetch(`${API_BASE}/features`);
//     if (!res.ok) throw new Error("Failed to fetch features");
//     const data = await res.json();
//     console.log("Features API response:", data); // <--- Check this in console
//     setFeatures(data || []);
//   } catch (err) {
//     console.error("Error fetching features:", err);
//     setFeatures([]);
//   }
// };


//   return (
//     <Routes>
//       <Route path="/" element={<RolesList roles={roles} features={features} loading={loading} error={error} />} />
//       <Route path="edit/:id" element={<EditRole features={features} />} />
//     </Routes>
//   );
// }




// import React, { useEffect, useState } from "react";
// import { Routes, Route, useNavigate, useParams } from "react-router-dom";
// import "./ManageRoles.css";

// const API_BASE = "https://localhost:7142/api/Role";

// /* ---------- Roles List Page ---------- */
// function RolesList({ roles, features, loading, error }) {
//   const navigate = useNavigate();

//   const renderFeaturesForRole = (role) => {
//     let assignedFeatureIds = role.featureIds?.length
//       ? role.featureIds
//       : role.roleFeatures?.map((rf) => rf.featureId) || [];

//     if (!features.length || !assignedFeatureIds.length) {
//       return <span>No features assigned</span>;
//     }

//     const assignedFeatures = features
//       .filter((f) => assignedFeatureIds.includes(f.featureId))
//       .map((f) => f.featureName)
//       .sort();

//     return assignedFeatures.length > 0 ? (
//       <ul
//         style={{
//           margin: 0,
//           paddingLeft: "20px",
//           listStyleType: "disc",
//           textAlign: "left",
//         }}
//       >
//         {assignedFeatures.map((featureName, idx) => (
//           <li key={idx}>{featureName}</li>
//         ))}
//       </ul>
//     ) : (
//       <span>No features assigned</span>
//     );
//   };

//   if (loading) return <p>Loading roles...</p>;

//   return (
//     <main>
//       <div className="card">
//         {error && <p className="popup-message error">{error}</p>}
//         <table className="roles-table" style={{ width: "100%" }}>
//           <thead>
//             <tr>
//               <th>Role Name</th>
//               <th>Description</th>
//               <th>Status</th>
//               <th>Features</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {roles.length > 0 ? (
//               roles.map((role) => (
//                 <tr key={role.id}>
//                   <td>{role.name}</td>
//                   <td>{role.description}</td>
//                   <td>{role.isActive ? "Active" : "Inactive"}</td>
//                   <td>
//                     <div style={{ maxWidth: 360 }}>
//                       {renderFeaturesForRole(role)}
//                     </div>
//                   </td>
//                   <td>
//                     <button
//                       className="btn btn-primary"
//                       onClick={() => navigate(`edit/${role.id}`)}
//                     >
//                       Edit
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={5} style={{ textAlign: "center" }}>
//                   No roles found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </main>
//   );
// }

// /* ---------- Full Page Edit Form ---------- */
// function EditRole({ features }) {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     id: 0,
//     name: "",
//     description: "",
//     isActive: true,
//     featureIds: [],
//   });
//   const [popupMessage, setPopupMessage] = useState("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchRole();
//   }, [id]);

//   const fetchRole = async () => {
//     try {
//       const res = await fetch(`${API_BASE}/${id}`);
//       if (!res.ok) throw new Error("Failed to fetch role");
//       const data = await res.json();

//       const assignedIds = data.featureIds?.length
//         ? data.featureIds
//         : data.roleFeatures?.map((rf) => rf.featureId) || [];

//       setFormData({
//         id: data.id,
//         name: data.name ?? "",
//         description: data.description ?? "",
//         isActive: data.isActive ?? true,
//         featureIds: assignedIds,
//       });
//     } catch (err) {
//       console.error("Error fetching role:", err);
//       setPopupMessage("❌ Error loading role details");
//     } finally {
//       setLoading(false);
//     }
//   };

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
//       setPopupMessage("⚠️ Role name is required");
//       return;
//     }

//     if (formData.featureIds.length === 0) {
//       setPopupMessage("⚠️ Select at least one feature");
//       return;
//     }

//     try {
//       const res = await fetch(`${API_BASE}/${formData.id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       if (res.ok) {
//         setPopupMessage("✅ Role saved successfully!");
//         setTimeout(() => navigate("/manage-employees/roles"), 1200);
//       } else {
//         const errData = await res
//           .json()
//           .catch(() => ({ message: "Failed to save role" }));
//         setPopupMessage(`❌ ${errData.message}`);
//       }
//     } catch (err) {
//       console.error("Error saving role:", err);
//       setPopupMessage("❌ Error saving role");
//     }
//   };

//   if (loading) return <p>Loading role details...</p>;

//   const allSelected =
//     features.length > 0 &&
//     formData.featureIds.length === features.length;

//   return (
//     <main className="fullpage-form">
//       <div className="card">
//         <h3>Edit Role</h3>

//         <div className="form-group">
//           <label>Role Name</label>
//           <input
//             type="text"
//             value={formData.name}
//             onChange={(e) =>
//               setFormData({ ...formData, name: e.target.value })
//             }
//           />
//         </div>

//         <div className="form-group">
//           <label>Description</label>
//           <input
//             type="text"
//             value={formData.description}
//             onChange={(e) =>
//               setFormData({ ...formData, description: e.target.value })
//             }
//           />
//         </div>

//         <div className="form-group">
//           <label>Status</label>
//           <select
//             value={formData.isActive ? "true" : "false"}
//             onChange={(e) =>
//               setFormData({
//                 ...formData,
//                 isActive: e.target.value === "true",
//               })
//             }
//           >
//             <option value="true">Active</option>
//             <option value="false">Inactive</option>
//           </select>
//         </div>

//         <div className="form-group">
//           <label>Assign Features</label>
//           <div className="features-container">
//             {/* Select All Checkbox */}
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

//             {features && features.length > 0 ? (
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
//                 ⚠️ No features loaded. Check API response in console.
//               </p>
//             )}
//           </div>
//         </div>

//         {popupMessage && <p className="popup-message">{popupMessage}</p>}

//         <div className="form-actions">
//           <button className="btn btn-primary" onClick={handleSave}>
//             Save
//           </button>
//           <button
//             className="btn"
//             onClick={() => navigate("/manage-employees/roles")}
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </main>
//   );
// }

// /* ---------- Main Component with Routes ---------- */
// export default function ManageRoles() {
//   const [roles, setRoles] = useState([]);
//   const [features, setFeatures] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     fetchRoles();
//     fetchFeatures();
//   }, []);

//   const fetchRoles = async () => {
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
//       console.log("Features API response:", data);
//       setFeatures(data || []);
//     } catch (err) {
//       console.error("Error fetching features:", err);
//       setFeatures([]);
//     }
//   };

//   return (
//     <Routes>
//       <Route
//         path="/"
//         element={
//           <RolesList
//             roles={roles}
//             features={features}
//             loading={loading}
//             error={error}
//           />
//         }
//       />
//       <Route path="edit/:id" element={<EditRole features={features} />} />
//     </Routes>
//   );
// }


import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { filterBy } from "@progress/kendo-data-query";
import "./ManageRoles.css";

const API_BASE = "https://localhost:7142/api/Role";

/* ---------- Roles List Page ---------- */
function RolesList({ roles, features, loading, error }) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState(null);

  if (loading) return <p>Loading roles...</p>;

  // Generic cell renderer that respects wrapping / word-break
  const WrapCell = (props) => {
    // value: use field if present otherwise fallback to dataItem
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
        onClick={() => navigate(`edit/${props.dataItem.id}`)}
      >
        Edit
      </button>
    </td>
  );

  return (
    <main>
      <div className="card roles-card">
        {error && <p className="popup-message error">{error}</p>}
        <div style={{ overflowX: "auto" }}>
          <Grid
            style={{ minWidth: 800, height: 500 }}
            data={filterBy(roles, filter)}
            filterable={true}
            filter={filter}
            onFilterChange={(e) => setFilter(e.filter)}
            // optional: enable column resizing if desired
            // resizable={true}
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
              width={300}
              cell={WrapCell}
            />
            {/* Status */}
            <GridColumn
              field="isActive"
              title="Status"
              width={120}
              cell={StatusCell}
            />
            {/* Actions - no filter here */}
            <GridColumn
              title="Actions"
              width={120}
              filterable={false}
              cell={ActionsCell}
            />
          </Grid>
        </div>
      </div>
    </main>
  );
}

/* ---------- Full Page Edit Form ---------- */
function EditRole({ features }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    description: "",
    isActive: true,
    featureIds: [],
  });
  const [popupMessage, setPopupMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRole();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchRole = async () => {
    try {
      const res = await fetch(`${API_BASE}/${id}`);
      if (!res.ok) throw new Error("Failed to fetch role");
      const data = await res.json();

      const assignedIds = data.featureIds?.length
        ? data.featureIds
        : data.roleFeatures?.map((rf) => rf.featureId) || [];

      setFormData({
        id: data.id,
        name: data.name ?? "",
        description: data.description ?? "",
        isActive: data.isActive ?? true,
        featureIds: assignedIds,
      });
    } catch (err) {
      console.error("Error fetching role:", err);
      setPopupMessage("❌ Error loading role details");
    } finally {
      setLoading(false);
    }
  };

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
    if (!formData.name.trim()) {
      setPopupMessage("⚠️ Role name is required");
      return;
    }

    if (formData.featureIds.length === 0) {
      setPopupMessage("⚠️ Select at least one feature");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/${formData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setPopupMessage("✅ Role saved successfully!");
        setTimeout(() => navigate("/manage-employees/roles"), 1200);
      } else {
        const errData = await res
          .json()
          .catch(() => ({ message: "Failed to save role" }));
        setPopupMessage(`❌ ${errData.message}`);
      }
    } catch (err) {
      console.error("Error saving role:", err);
      setPopupMessage("❌ Error saving role");
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
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
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

        {popupMessage && <p className="popup-message">{popupMessage}</p>}

        <div className="form-actions">
          <button className="btn btn-primary" onClick={handleSave}>
            Save
          </button>
          <button className="btn" onClick={() => navigate("/manage-employees/roles")}>
            Cancel
          </button>
        </div>
      </div>
    </main>
  );
}

/* ---------- Main Component with Routes ---------- */
export default function ManageRoles() {
  const [roles, setRoles] = useState([]);
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRoles();
    fetchFeatures();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error(`Failed to fetch roles`);
      const data = await res.json();
      setRoles(data || []);
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

  return (
    <Routes>
      <Route
        path="/"
        element={
          <RolesList
            roles={roles}
            features={features}
            loading={loading}
            error={error}
          />
        }
      />
      <Route path="edit/:id" element={<EditRole features={features} />} />
    </Routes>
  );
}






