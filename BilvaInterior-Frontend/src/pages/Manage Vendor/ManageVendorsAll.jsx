import React, { useEffect, useState } from 'react';
import { Button } from '@progress/kendo-react-buttons';
import axios from 'axios';
import ManageVendors from './ManageVendors';
import './ManageVendorAll.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '') || 'https://localhost:7142';

// Hardcoded Categories (kept for display mapping)
const categories = [
  { id: 1, name: 'TILES' },
  { id: 2, name: 'WOOD' },
  { id: 3, name: 'PAINT' },
  { id: 4, name: 'ELECTRICAL' },
];

const actionBarStyle = {
  position: 'sticky',
  top: 0,
  zIndex: 10,
  background: '#fff',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0.5rem',
  borderBottom: '1px solid #eee',
  minHeight: 48,
};

const actionBarBtnGroup = { display: 'flex', gap: '0.5rem' };

const VendorsListHeader = () => (
  <div className="vendors-list-header">
    <div className="vendors-col id">ID</div>
    <div className="vendors-col name">Name</div>
    <div className="vendors-col email">Email</div>
    <div className="vendors-col mobile">Mobile</div>
    <div className="vendors-col category">Category</div>
    <div className="vendors-col bank">Bank</div>
    <div className="vendors-col actions">Actions</div>
  </div>
);

// Row Component — pencil-only edit button using Kendo icon span
const VendorsListRow = ({ v, onEdit, onDelete }) => (
  <div className="vendors-list-row">
    <div className="vendors-col id">{v.id}</div>
    <div className="vendors-col name">{v.firstName} {v.lastName}</div>
    <div className="vendors-col email">{v.email}</div>
    <div className="vendors-col mobile">{v.mobile}</div>
    <div className="vendors-col category">
      {categories.find(c => c.id === v.categoryId)?.name || '—'}
    </div>
    <div className="vendors-col bank">{v.bankId}</div>
    <div className="vendors-col actions">
      <button
        type="button"
        className="vendors-action-btn edit k-button"
        title="Edit"
        aria-label={`Edit vendor ${v.id}`}
        onClick={() => onEdit(v)}
      > 
        {/* Kendo icon markup you requested */}
        <span className="k-icon k-font-icon k-i-edit k-button-icon" role="presentation" aria-hidden="true"></span>
      </button>

      <button
  type="button"
  className="vendors-action-btn delete k-button"
  title="Delete"
  aria-label={`Delete vendor ${v.id}`}
  onClick={() => onDelete(v)}
>
  <span className="k-icon k-font-icon k-i-delete k-button-icon"></span>
</button>

    </div>
  </div>
);

export default function ManageVendorsAll() {
    useEffect(() => {
    document.title = "Manage Vendors";
  }, []);

  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddNew, setShowAddNew] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  // Delete confirmation popup
  const [deleteVendor, setDeleteVendor] = useState(null);

  const refreshVendors = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/ManageVendors`);
      setVendors(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to load vendors', err);
      setVendors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshVendors();
  }, []);

  const handleAdd = () => {
    setSelectedVendor(null);
    setShowAddNew(true);
  };

  const handleCancel = () => setShowAddNew(false);

  const handleEdit = (vendor) => {
    setSelectedVendor(vendor);
    setShowAddNew(true);
  };
  const handleDelete = (vendor) => {
  setDeleteVendor(vendor);  // open popup
};
const confirmDeleteVendor = async () => {
  if (!deleteVendor) return;

  try {
    await axios.delete(`${API_BASE_URL}/api/ManageVendors/${deleteVendor.id}`);
    refreshVendors();
  } catch (err) {
    console.error("Delete failed", err);
  }

  setDeleteVendor(null); // close popup
};


  if (loading) return <div>Loading vendors...</div>;

  return (
    <div>
      {/* Action Bar */}
      {!showAddNew && (
        <div style={actionBarStyle} className="vendors-action-bar">
          <div style={actionBarBtnGroup}>
            <Button size="small" icon="refresh" onClick={refreshVendors}>
              <span className="vendors-action-btn-text">Refresh</span>
            </Button>
          </div>
          <div style={actionBarBtnGroup}>
            <Button size="small" icon="plus" themeColor="primary" onClick={handleAdd}>
              <span className="vendors-action-btn-text">Add Vendor</span>
            </Button>
          </div>
        </div>
      )}

      {/* Add/Edit Form */}
      {showAddNew ? (
        <div style={{ marginTop: 12 }}>
          <div style={{ marginBottom: 12 }}>
            <Button icon="arrow-left" onClick={handleCancel}>Back</Button>
          </div>
          <ManageVendors
            selectedVendor={selectedVendor}
            onSaved={() => {
              refreshVendors();
              setShowAddNew(false); // close after save
            }}
          />
        </div>
      ) : (
        /* Vendors List */
     /* Vendors List */
<div className="vendors-table-wrapper">
  <div className="vendors-list-container">
    <div className="vendors-list-inner">
      <VendorsListHeader />

      {vendors.length === 0 ? (
        <div className="vendors-list-row">
          <div className="vendors-col" style={{ gridColumn: "1 / 8", textAlign: "center" }}>
            No vendors found
          </div>
        </div>
      ) : (
        vendors.map(v => (
          <VendorsListRow
            key={v.id}
            v={v}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))
      )}
    </div>
  </div>
</div>
      )}
      {deleteVendor && (
  <div 
    style={{
      position: "fixed",
      top: 0, left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(0,0,0,0.45)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999
    }}
  >
    <div 
      style={{
        background: "#fff",
        padding: "22px 28px",
        borderRadius: "10px",
        width: "350px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
        textAlign: "center"
      }}
    >
      <p style={{ fontSize: "15px", marginBottom: "20px" }}>
        Are you sure you want to delete this vendor?
      </p>

      <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
        
        {/* YES DELETE */}
        <button 
          onClick={confirmDeleteVendor}
          style={{
            padding: "8px 14px",
            background: "#2563eb",
            border: "none",
            borderRadius: "6px",
            color: "white",
            cursor: "pointer"
          }}
        >
          Yes, Delete
        </button>

        {/* CANCEL */}
        <button 
          onClick={() => setDeleteVendor(null)}
          style={{
            padding: "8px 14px",
            background: "#e5e7eb",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Cancel
        </button>

      </div>
    </div>
  </div>
)}
    </div>
  );
}