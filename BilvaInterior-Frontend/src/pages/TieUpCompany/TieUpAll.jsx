import React, { useEffect, useState } from "react";
import { ListView } from "@progress/kendo-react-listview";
import CustomAvatar from "../../components/Avatar/CustomAvatar";
import { Button } from "@progress/kendo-react-buttons";
import "./TieUpAll.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const getAvatarUrl = (dataItem) => {
  return dataItem.profilePicPath
    ? `${import.meta.env.VITE_API_BASE_URL}/Uploads/profile/${dataItem.profilePicPath}`
    : `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(dataItem.id)}`;
};

const ListViewItem = (props) => {
  const { dataItem } = props;
  const navigate = useNavigate();

  return (
    <div className="tieup-list-row">
      <div className="tieup-list-logo tieup-list-cell">
        <CustomAvatar src={getAvatarUrl(dataItem)} height={40} />
      </div>
      <div className="tieup-list-code tieup-list-cell">{dataItem.id}</div>
      <div className="tieup-list-contact tieup-list-cell">{dataItem.companyName}</div>
      <div className="tieup-list-phone tieup-list-cell">{dataItem.phone}</div>
      <div className="tieup-list-city tieup-list-cell">{dataItem.city}</div>
      <div className="tieup-list-state tieup-list-cell">{dataItem.state}</div>
      <div className="tieup-list-gstin tieup-list-cell">{dataItem.gstin}</div>
      <div className="tieup-list-template tieup-list-cell">
        {dataItem.billingTemplatePath ? "Uploaded" : "N/A"}
      </div>
      <div className="tieup-list-status tieup-list-cell">
        {dataItem.isActive ? "Active" : "Inactive"}
      </div>
      <div className="tieup-list-actions tieup-list-cell">
        <Button
          size="small"
          themeColor="primary"
          onClick={() => navigate(`/tie-up-company/edit/${dataItem.id}`)}
        >
          Edit
        </Button>
      </div>
    </div>
  );
};

const ListViewHeader = () => (
  <div className="tieup-list-header">
    <div className="tieup-list-header-logo tieup-list-header-cell"></div>
    <div className="tieup-list-header-code tieup-list-header-cell">ID</div>
    <div className="tieup-list-header-contact tieup-list-header-cell">Company Name</div>
    <div className="tieup-list-header-phone tieup-list-header-cell">Phone</div>
    <div className="tieup-list-header-city tieup-list-header-cell">City</div>
    <div className="tieup-list-header-state tieup-list-header-cell">State</div>
    <div className="tieup-list-header-gstin tieup-list-header-cell">GSTIN</div>
    <div className="tieup-list-header-template tieup-list-header-cell">Template</div>
    <div className="tieup-list-header-status tieup-list-header-cell">Status</div>
    <div className="tieup-list-header-actions tieup-list-header-cell">Actions</div>
  </div>
);

const TieUpAll = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/TieUpCompany`)
      .then((res) => {
        setCompanies(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to load companies");
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading companies...</div>;
  if (companies.length === 0) return <div>No companies found.</div>;

  return (
    <div className="tieup-list-container">
      <div className="tieup-list-inner">
        <ListViewHeader />
        <ListView data={companies} item={ListViewItem} />
      </div>
    </div>
  );
};

export default TieUpAll;
