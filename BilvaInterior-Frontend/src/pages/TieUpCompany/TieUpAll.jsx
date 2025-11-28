import React, { useEffect, useState } from "react";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import CustomAvatar from "../../components/Avatar/CustomAvatar";
import { Button } from "@progress/kendo-react-buttons";
import "./TieUpAll.css";
// import { useNavigate } from "react-router-dom";
import axios from "axios";
import TieUpEdit from "./TieUpEdit";
import TieUpNew from "./TieUpNew";

// ------------------ Styles for Fixed Action Bar ------------------
const actionBarStyle = {
  position: "sticky",
  top: 0,
  zIndex: 10,
  background: "#fff",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0.5rem",
  borderBottom: "1px solid #eee",
  minHeight: 48,
};

const actionBarBtnGroup = {
  display: "flex",
  gap: "0.5rem",
};

// ------------------ Set API Base URL ------------------
const API_BASE_URL = "https://localhost:7142";

// ------------------ Avatar URL ------------------
const getAvatarUrl = (dataItem) => {
  if (dataItem.profilePicPath) {
    // backend already returns like: /uploads/profile/logo_xxx.png
    const path = dataItem.profilePicPath.startsWith("/uploads")
      ? dataItem.profilePicPath
      : `/uploads/profile/${dataItem.profilePicPath}`;
    return `${API_BASE_URL}${path}`;
  }
  // fallback avatar
  return `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(
    dataItem.id
  )}`;
};

// ------------------ Error Boundary ------------------
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    return this.state.hasError ? <div>Something went wrong.</div> : this.props.children;
  }
}

// ------------------ Main Component ------------------
const TieUpAll = () => {

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showAddNew, setShowAddNew] = useState(false);

  // Refresh handler    
  const refreshCompanies = () => {
    setLoading(true);
    axios
      .get(`${API_BASE_URL}/api/TieUpCompany?t=${Date.now()}`, { withCredentials: true })
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setCompanies(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching companies:", err);
        // alert("Failed to load companies");
        setCompanies([]);
        setLoading(false);
      });
  };

  // Add new company handler
const handleAdd = () => {
setShowAddNew(true);

};
  // Cancel add new company
const handleCancelAdd = () => {
  setShowAddNew(false);
};

  useEffect(() => {
    refreshCompanies();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
  const handleBack = () => {
    if (showAddNew) {
      setShowAddNew(false);
    } else if (selectedCompany) {
      setSelectedCompany(null);
    }
  };

  window.addEventListener("popstate", handleBack);
  return () => window.removeEventListener("popstate", handleBack);
}, [showAddNew, selectedCompany]);

const handleEdit = (company) => {
  setSelectedCompany(company);
};

const handleCloseEdit = () => {
  setSelectedCompany(null);
};

  // Refetch companies from backend after edit success
  const handleEditSuccess = () => {
    refreshCompanies();
    setSelectedCompany(null);
  };

  if (loading) return <div>Loading companies...</div>;
  if (!showAddNew && companies.length === 0) return <div>No companies found.</div>;

  return (
    <>
      {/* Action Bar: Always visible, sticky */}
      {!selectedCompany && !showAddNew && (
        <div style={actionBarStyle} className="tieup-action-bar">
          <div style={actionBarBtnGroup}>
            <Button size="small" icon="refresh" onClick={refreshCompanies}>
              Refresh
            </Button>
          </div>
          <div style={actionBarBtnGroup}>
            <Button
              size="small"
              icon="plus"
              onClick={handleAdd}
              themeColor="primary"
            >
              Add New Company
            </Button>
          </div>
        </div>
      )}

      {/* ------------------ Add New Company Section ------------------ */}
      {showAddNew ? (
        <>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
            <Button
              icon="arrow-left"
              size="small"
              onClick={handleCancelAdd}
              style={{ marginRight: 8 }}
            >
              Back
            </Button>
          </div>

          {/* ✅ Pass success callback to refresh & auto-close */}
          <TieUpNew
            onCancel={handleCancelAdd}
            onSuccess={() => {
              setShowAddNew(false);
              refreshCompanies();
            }}
          />
        </>
      ) : selectedCompany ? (
        <>
          {/* ------------------ Edit Company Section ------------------ */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
            <Button
              icon="arrow-left"
              size="small"
              onClick={handleCloseEdit}
              style={{ marginRight: 8 }}
            >
              Back
            </Button>
          </div>
          <TieUpEdit
            companyId={selectedCompany.id}
            closeEdit={handleCloseEdit}
            onEditSuccess={handleEditSuccess}
          />
        </>
      ) : (
        <div className="tieup-grid-wrapper">
          <ErrorBoundary>
            <Grid
              data={companies}
              style={{ minWidth: "1500px" }}
              resizable={true}
              scrollable="scrollable"
            >
              {/* ------------------ Avatar Column ------------------ */}
              <GridColumn
                title=""
                width="70px"
                cell={(props) => (
                  <td style={{ textAlign: "center" }}>
                    <CustomAvatar src={getAvatarUrl(props.dataItem)} height={40} />
                  </td>
                )}
              />

              {/* ------------------ Basic Info Columns ------------------ */}
              <GridColumn field="id" title="ID" width="80px" />
              <GridColumn field="companyName" title="Company Name" width="180px" />
              <GridColumn field="phone" title="Phone" width="130px" />
              <GridColumn field="city" title="City" width="120px" />
              <GridColumn field="state" title="State" width="120px" />
              <GridColumn field="gstin" title="GSTIN" width="160px" />

              {/* ✅ Template Column (Download Button Restored) */}
              <GridColumn
                title="Template"
                width="150px"
                cell={(props) => (
                  <td style={{ textAlign: "center" }}>
                    {props.dataItem.billingTemplatePath ? (
                      <a
                        href={
                          props.dataItem.billingTemplatePath.startsWith("/uploads")
                            ? `${API_BASE_URL}${props.dataItem.billingTemplatePath}`
                            : `${API_BASE_URL}/uploads/${props.dataItem.billingTemplatePath}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="tieup-download-link"
                      >
                        Download
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </td>
                )}
              />

              {/* ✅ Status Column */}
              <GridColumn
                title="Status"
                width="120px"
                cell={(props) => (
                  <td
                    style={{
                      color: props.dataItem.isActive === false ? "#a94442" : "#2b7a0b",
                      fontWeight: 500,
                      textAlign: "center",
                    }}
                  >
                    {props.dataItem.isActive === false ? "Inactive" : "Active"}
                  </td>
                )}
              />

              {/* ✅ Actions Column */}
              <GridColumn
                title="Actions"
                width="110px"
                cell={(props) => (
                  <td style={{ textAlign: "center" }}>
                    <Button
                      size="small"
                      themeColor="primary"
                      onClick={() => handleEdit(props.dataItem)}
                    >
                      Edit
                    </Button>
                  </td>
                )}
              />
            </Grid>
          </ErrorBoundary>
        </div>
      )}
    </>
  );
};

export default TieUpAll;
