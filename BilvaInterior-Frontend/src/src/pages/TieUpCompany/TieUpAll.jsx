import React, { useEffect, useState } from "react";
import { ListView } from "@progress/kendo-react-listview";
import CustomAvatar from "../../components/Avatar/CustomAvatar";
import { Button } from "@progress/kendo-react-buttons";
import "./TieUpAll.css";
import axios from "axios";
import TieUpEdit from "./TieUpEdit";
import TieUpNew from "./TieUpNew";

// ------------------ Styles ------------------
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

// ------------------ API Base ------------------
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ------------------ Avatar ------------------
const getAvatarUrl = (dataItem) => {
    if (dataItem.profilePicPath) {
        return `${API_BASE_URL}${dataItem.profilePicPath}`;
    }
    return `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(
        dataItem.id
    )}`;
};

// ------------------ List Item ------------------
const ListViewItem = (props) => {
    const { dataItem, onEdit } = props;
    return (
        <div className="tieup-list-row">
            <div className="tieup-list-logo tieup-list-cell">
                <CustomAvatar src={getAvatarUrl(dataItem)} height={40} />
            </div>
            <div className="tieup-list-code tieup-list-cell">{dataItem.id}</div>
            <div className="tieup-list-contact tieup-list-cell">
                {dataItem.companyName}
            </div>
            <div className="tieup-list-phone tieup-list-cell">{dataItem.phone}</div>
            <div className="tieup-list-city tieup-list-cell">{dataItem.city}</div>
            <div className="tieup-list-state tieup-list-cell">{dataItem.state}</div>
            <div className="tieup-list-gstin tieup-list-cell">{dataItem.gstin}</div>
            <div className="tieup-list-template tieup-list-cell">
                {dataItem.billingTemplatePath ? (
                    <a
                        href={`${API_BASE_URL}/uploads/${dataItem.billingTemplatePath}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        View
                    </a>
                ) : (
                    "N/A"
                )}
            </div>
            <div className="tieup-list-status tieup-list-cell">
                {dataItem.isActive === false ? "Inactive" : "Active"}
            </div>
            <div className="tieup-list-actions tieup-list-cell">
                <Button
                    size="small"
                    themeColor="primary"
                    onClick={() => onEdit(dataItem)}
                >
                    Edit
                </Button>
            </div>
        </div>
    );
};

// ------------------ Header ------------------
const ListViewHeader = () => (
    <div className="tieup-list-header">
        <div className="tieup-list-header-logo tieup-list-header-cell"></div>
        <div className="tieup-list-header-code tieup-list-header-cell">ID</div>
        <div className="tieup-list-header-contact tieup-list-header-cell">
            Company Name
        </div>
        <div className="tieup-list-header-phone tieup-list-header-cell">Phone</div>
        <div className="tieup-list-header-city tieup-list-header-cell">City</div>
        <div className="tieup-list-header-state tieup-list-header-cell">State</div>
        <div className="tieup-list-header-gstin tieup-list-header-cell">GSTIN</div>
        <div className="tieup-list-header-template tieup-list-header-cell">
            Template
        </div>
        <div className="tieup-list-header-status tieup-list-header-cell">
            Status
        </div>
        <div className="tieup-list-header-actions tieup-list-header-cell">
            Actions
        </div>
    </div>
);

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
        return this.state.hasError ? (
            <div>Something went wrong.</div>
        ) : (
            this.props.children
        );
    }
}

// ------------------ Main Component ------------------
const TieUpAll = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [showAddNew, setShowAddNew] = useState(false);

    // Fetch Companies
    const refreshCompanies = () => {
        setLoading(true);
        axios
            .get(`${API_BASE_URL}/api/TieUpCompany`)
            .then((res) => {
                const data = Array.isArray(res.data) ? res.data : [];
                setCompanies(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        refreshCompanies();
    }, []);

    // Handlers
    const handleAdd = () => setShowAddNew(true);
    const handleCancelAdd = () => setShowAddNew(false);
    const handleEdit = (company) => setSelectedCompany(company);
    const handleCloseEdit = () => setSelectedCompany(null);
    const handleEditSuccess = () => {
        refreshCompanies();
        setSelectedCompany(null);
    };

    // ------------------ RENDER ------------------
    if (loading) return <div>Loading companies...</div>;

    return (
        <>
            {/* Action Bar */}
            {!selectedCompany && !showAddNew && (
                <div style={actionBarStyle} className="tieup-action-bar">
                    <div style={actionBarBtnGroup}>
                        <Button
                            size="small"
                            icon="refresh"
                            onClick={refreshCompanies}
                            className="action-btn refresh-btn"
                        >
                            Refresh
                        </Button>
                    </div>
                    <div style={actionBarBtnGroup}>
                        <Button
                            size="small"
                            icon="plus"
                            onClick={handleAdd}
                            themeColor="primary"
                            className="action-btn add-btn"
                        >
                            Add New Company
                        </Button>
                    </div>
                </div>
            )}

            {/* Add New Company Form */}
            {showAddNew ? (
                <>
                    <div
                        style={{ display: "flex", alignItems: "center", marginBottom: 16 }}
                    >
                        <Button
                            icon="arrow-left"
                            size="small"
                            onClick={handleCancelAdd}
                            className="action-btn back-btn"
                            style={{ marginRight: 8 }}
                        >
                            Back
                        </Button>
                    </div>
                    <TieUpNew onCancel={handleCancelAdd} />
                </>
            ) : selectedCompany ? (
                <>
                    <div
                        style={{ display: "flex", alignItems: "center", marginBottom: 16 }}
                    >
                        <Button
                            icon="arrow-left"
                            size="small"
                            onClick={handleCloseEdit}
                            className="action-btn back-btn"
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
                <div className="tieup-list-container">
                    <div className="tieup-list-inner">
                        <ListViewHeader />
                        <ErrorBoundary>
                            <ListView
                                data={companies}
                                item={(props) => (
                                    <ListViewItem
                                        key={props.dataItem.id}
                                        {...props}
                                        onEdit={handleEdit}
                                    />
                                )}
                            />
                        </ErrorBoundary>
                        {companies.length === 0 && (
                            <div
                                style={{
                                    textAlign: "center",
                                    marginTop: "1rem",
                                    color: "#777",
                                }}
                            >
                                No companies found.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default TieUpAll;
