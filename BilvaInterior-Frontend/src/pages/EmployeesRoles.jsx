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

  const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api/Role`;

  // This useEffect hook runs once when the component is first loaded.
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






