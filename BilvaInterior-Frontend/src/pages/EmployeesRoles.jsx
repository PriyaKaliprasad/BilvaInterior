import React, { useEffect, useState } from "react";
import "./ManageRoles.css"; 

export default function ManageRoles() {
  const [roles, setRoles] = useState([]);
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    description: "",
    isActive: true,
    featureIds: []
  });
  const [dialogPopupMessage, setDialogPopupMessage] = useState("");
  const [mainPopupMessage, setMainPopupMessage] = useState("");

  const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api/Role`;

  // This useEffect hook runs once when the component is first loaded.
  useEffect(() => {
    fetchRoles();
    fetchFeatures();
  }, []);

  const fetchRoles = async () => {
    try {
      // --- THIS IS THE FIX ---
      // We add { cache: 'no-cache' } to ensure the browser always gets the latest data from the server.
      const res = await fetch(API_BASE, { cache: 'no-cache' });

      if (!res.ok) throw new Error(`Failed to fetch roles (${res.status})`);
      const data = await res.json();
      setRoles(data || []);
    } catch (err) {
      console.error("Error fetching roles:", err);
      setRoles([]);
      setMainPopupMessage("❌ Error loading roles from the server.");
    } finally {
      setLoading(false);
    }
  };

  const fetchFeatures = async () => {
    try {
      const res = await fetch(`${API_BASE}/features`, { cache: 'no-cache' });
      if (!res.ok) throw new Error(`Failed to fetch features (${res.status})`);
      const data = await res.json();
      setFeatures(data || []);
    } catch (err) {
      console.error("Error fetching features:", err);
      setFeatures([]);
    }
  };

  const handleEdit = (role) => {
    const selectedIds = role.roleFeatures ? role.roleFeatures.map((rf) => rf.featureId) : [];
    setFormData({
      id: role.id,
      name: role.name ?? "",
      description: role.description ?? "",
      isActive: role.isActive ?? true,
      featureIds: selectedIds
    });
    setDialogPopupMessage("");
    setShowDialog(true);
  };

  const handleFeatureToggle = (featureId) => {
    setFormData((prev) => {
      const exists = prev.featureIds.includes(featureId);
      return {
        ...prev,
        featureIds: exists
          ? prev.featureIds.filter((id) => id !== featureId)
          : [...prev.featureIds, featureId],
      };
    });
  };

  const handleSave = async () => {
    if (!formData.name || formData.name.trim() === "") {
      setDialogPopupMessage("⚠️ Role name is required");
      return;
    }

    const duplicate = roles.some(
      (r) =>
        r.name &&
        r.name.toLowerCase() === formData.name.toLowerCase() &&
        r.id !== formData.id
    );
    if (duplicate) {
      setDialogPopupMessage("⚠️ This role already exists!");
      return;
    }

    try {
      const url = `${API_BASE}/${formData.id}`;
      const method = "PUT";
      const body = {
        name: formData.name,
        description: formData.description,
        isActive: formData.isActive,
        featureIds: formData.featureIds
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setDialogPopupMessage("✅ Role saved successfully!");
        await fetchRoles(); // Re-fetch roles to show updated data
        setTimeout(() => {
          setShowDialog(false);
          setDialogPopupMessage("");
        }, 1200);
      } else {
        const errData = await res.json().catch(() => ({ message: "Failed to save role" }));
        setDialogPopupMessage(`❌ ${errData.message}`);
      }
    } catch (err) {
      console.error("Error saving role:", err);
      setDialogPopupMessage("❌ An error occurred while saving.");
    }
  };

  const renderFeaturesForRole = (role) => {
    const rf = role.roleFeatures;
    if (!rf || rf.length === 0) {
      return <span>No features assigned</span>;
    }
    
    const sortedFeatures = rf
      .map((rfi) => (rfi.feature?.featureName ?? "Unnamed"))
      .sort();

    return (
      <ul style={{ margin: 0, paddingLeft: '20px', listStyleType: 'disc', textAlign: 'left' }}>
        {sortedFeatures.map((featureName, index) => (
          <li key={index}>{featureName}</li>
        ))}
      </ul>
    );
  };

  if (loading) return <p>Loading roles...</p>;

  return (
    <main>
        <div className="card">
            {mainPopupMessage && ( <p className="popup-message error">{mainPopupMessage}</p> )}
            <table className="roles-table" style={{ width: "100%" }}>
                <thead>
                    <tr>
                        <th>Role Name</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Features</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {roles.length > 0 ? (
                        roles.map((role) => (
                            <tr key={role.id}>
                                <td data-label="Role Name">{role.name}</td>
                                <td data-label="Description">{role.description}</td>
                                <td data-label="Status">{role.isActive ? "Active" : "Inactive"}</td>
                                <td data-label="Features"><div style={{ maxWidth: 360 }}>{renderFeaturesForRole(role)}</div></td>
                                <td data-label="Actions"><button className="btn btn-primary" onClick={() => handleEdit(role)}>Edit</button></td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan={5} style={{ textAlign: "center" }}>No roles found.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
        {showDialog && (
            <div className="modal-overlay">
                <div className="modal-content">
                    <h3>Edit Role</h3>
                    <div className="form-group">
                        <label>Role Name</label>
                        <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <input type="text" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label>Status</label>
                        <select value={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.value === "true" })}>
                            <option value={true}>Active</option>
                            <option value={false}>Inactive</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Assign Features</label>
                        <div className="features-container">
                            {features.map((f) => (
                                <div key={f.featureId} className="feature-item">
                                    <input id={`feat-${f.featureId}`} type="checkbox" checked={formData.featureIds.includes(f.featureId)} onChange={() => handleFeatureToggle(f.featureId)} />
                                    <label htmlFor={`feat-${f.featureId}`}>{f.featureName}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                    {dialogPopupMessage && (<p className="popup-message">{dialogPopupMessage}</p>)}
                    <div className="modal-actions">
                        <button className="btn btn-primary" onClick={handleSave}>Save</button>
                        <button className="btn" onClick={() => setShowDialog(false)}>Cancel</button>
                    </div>
                </div>
            </div>
        )}
    </main>
  );
}
