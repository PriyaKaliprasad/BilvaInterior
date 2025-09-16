import React from "react";
import "./ManageRoles.css";

export default function ManageRoles() {
  return (
    <main>
      {/* Roles Table */}
      <div className="card">
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
              <td data-label="Role Name">Admin</td>
              <td data-label="Description">Administrator with full access</td>
              <td data-label="Status">Active</td>
              <td data-label="Features">
                <ul>
                  <li>CRUD on Employees</li>
                  <li>CRUD on Roles</li>
                  <li>Manage Projects</li>
                  <li>Access Audit Trail</li>
                  <li>Manage Billing & Expenses</li>
                </ul>
              </td>
              <td data-label="Actions">
                <button className="btn btn-primary">Edit</button>
              </td>
            </tr>
            <tr>
              <td data-label="Role Name">Site Visitor</td>
              <td data-label="Description">Can log and track site visits</td>
              <td data-label="Status">Active</td>
              <td data-label="Features">
                <ul>
                  <li>Log Site Visits</li>
                  <li>View Assigned Projects</li>
                  <li>Upload Site Documents</li>
                </ul>
              </td>
              <td data-label="Actions">
                <button className="btn btn-primary">Edit</button>
              </td>
            </tr>
            <tr>
              <td data-label="Role Name">Managing Director</td>
              <td data-label="Description">Top-level executive with oversight</td>
              <td data-label="Status">Active</td>
              <td data-label="Features">
                <ul>
                  <li>View Reports & Dashboards</li>
                  <li>Approve Budgets & Expenses</li>
                  <li>Oversee Employee & Project Status</li>
                  <li>Access Audit Trail</li>
                </ul>
              </td>
            	<td data-label="Actions">
                <button className="btn btn-primary">Edit</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  );
}