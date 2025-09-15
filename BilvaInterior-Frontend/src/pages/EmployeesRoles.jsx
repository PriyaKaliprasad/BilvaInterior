import React, { useState } from "react";
import "./ManageRoles.css"; // 👈 Move your CSS here (same styles you already wrote)

export default function ManageRoles() {
  // State for the status toggle
  const [statusActive, setStatusActive] = useState(true);

  const handleStatusChange = (e) => {
    setStatusActive(e.target.checked);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("New Role Created (dummy action)");
  };

  return (
    <main>
      {/* Roles Table */}
      <div className="card">
        <h2>Manage Roles</h2>
        <table className="roles-table">
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
            <tr>
              <td>Admin</td>
              <td>Administrator with full access</td>
              <td>Active</td>
              <td>
                <ul>
                  <li>CRUD on Employees</li>
                  <li>CRUD on Roles</li>
                  <li>Manage Projects</li>
                  <li>Access Audit Trail</li>
                  <li>Manage Billing & Expenses</li>
                </ul>
              </td>
              <td>
                <button className="btn btn-primary">Edit</button>
              </td>
            </tr>
            <tr>
              <td>Site Visitor</td>
              <td>Can log and track site visits</td>
              <td>Active</td>
              <td>
                <ul>
                  <li>Log Site Visits</li>
                  <li>View Assigned Projects</li>
                  <li>Upload Site Documents</li>
                </ul>
              </td>
              <td>
                <button className="btn btn-primary">Edit</button>
              </td>
            </tr>
            <tr>
              <td>Managing Director</td>
              <td>Top-level executive with oversight</td>
              <td>Active</td>
              <td>
                <ul>
                  <li>View Reports & Dashboards</li>
                  <li>Approve Budgets & Expenses</li>
                  <li>Oversee Employee & Project Status</li>
                  <li>Access Audit Trail</li>
                </ul>
              </td>
              <td>
                <button className="btn btn-primary">Edit</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Add New Role Form */}
      <div className="card">
        <h2>Add New Role</h2>
        <p
          style={{
            fontSize: "0.9rem",
            color: "var(--dark-gray)",
            marginBottom: "1.5rem",
          }}
        >
          NOTE: Once created, a role cannot be deleted.
        </p>

        <form className="add-role-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="roleName">Role Name</label>
              <input type="text" id="roleName" name="roleName" />
            </div>
            <div className="form-group">
              <label htmlFor="roleDescription">Description</label>
              <input type="text" id="roleDescription" name="roleDescription" />
            </div>
          </div>

          {/* Status Toggle */}
          <div className="status-toggle">
            <span>Status:</span>
            <span style={{ fontWeight: 600 }}>
              {statusActive ? "ACTIVE" : "INACTIVE"}
            </span>
            <label className="switch">
              <input
                type="checkbox"
                checked={statusActive}
                onChange={handleStatusChange}
              />
              <span className="slider"></span>
            </label>
          </div>

          {/* Permissions Grid */}
          <div className="permissions-grid">
            {[
              "CRUD on Employees",
              "CRUD on Roles",
              "Manage Projects",
              "Access Audit Trail",
              "Manage Billing & Expenses",
              "Log Site Visits",
              "View Assigned Projects",
              "Upload Site Documents",
              "View Reports & Dashboards",
              "Approve Budgets & Expenses",
              "Oversee Employee & Project Status",
            ].map((perm, idx) => (
              <div className="permission-item" key={idx}>
                <input
                  type="checkbox"
                  id={`perm-${idx}`}
                  name="permissions[]"
                />
                <label htmlFor={`perm-${idx}`}>{perm}</label>
              </div>
            ))}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Create New Role
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
