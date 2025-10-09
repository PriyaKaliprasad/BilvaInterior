import React, { useState, useEffect } from "react";
import "@progress/kendo-theme-default/dist/all.css";
import { Checkbox } from "@progress/kendo-react-inputs";
import { Button } from "@progress/kendo-react-buttons";
import FormInput from "../../components/Form/FormInput";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import "./NewProject.css";

const MEMBERS_API = `${import.meta.env.VITE_API_BASE_URL}/api/Projects/members`;

const NewProject = () => {
  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
    tieUpCompanyId: null,
    projectMembers: [],
    address: "",
    location: "",
  });

  const [notification, setNotification] = useState(null);
  const [members, setMembers] = useState([]);

  const [tieUpCompanies, setTieUpCompanies] = useState([]);
  
  
  // Fetch tie-up companies for dropdown
  useEffect(() => {
    const fetchTieUpCompanies = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/TieUpCompany`, {
          method: "GET",
          headers: { Accept: "application/json" },
        });
        const raw = await res.text();
        if (!res.ok) throw new Error(`API ${res.status}: ${raw}`);
        let data;
        try {
          data = JSON.parse(raw);
        } catch (err) {
          console.error("Invalid JSON from /api/TieUpCompany:", raw);
          setTieUpCompanies([]);
          return;
        }
        setTieUpCompanies(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching /api/TieUpCompany:", err);
        setTieUpCompanies([]);
      }
    };
    fetchTieUpCompanies();
  }, []);

  
  
  // ✅ Fetch project members
  useEffect(() => {
    const loadMembers = async () => {
      try {
        const res = await fetch(MEMBERS_API, {
          method: "GET",
          headers: { Accept: "application/json" },
        });

        const raw = await res.text();
        if (!res.ok) throw new Error(`API ${res.status}: ${raw}`);
        if (!raw || raw.trim().length === 0) {
          setMembers([]);
          return;
        }

        let data;
        try {
          data = JSON.parse(raw);
        } catch (err) {
          console.error("Invalid JSON from API:", raw);
          setMembers([]);
          return;
        }

        if (Array.isArray(data)) {
          setMembers(data);
        } else {
          setMembers([]);
        }
      } catch (err) {
        console.error("Error fetching members:", err);
        setMembers([]);
        setNotification({
          type: "error",
          message: "Failed to load members — check backend.",
        });
      }
    };

    loadMembers();
  }, []);

  const safeGetChecked = (e) =>
    (typeof e.target?.checked === "boolean" ? e.target.checked : e.value) ||
    false;

  const handleMemberToggle = (userId) => (e) => {
    const checked = safeGetChecked(e);
    setFormData((prev) => {
      const exists = prev.projectMembers.includes(userId);
      const next = checked
        ? exists
          ? prev.projectMembers
          : [...prev.projectMembers, userId]
        : prev.projectMembers.filter((id) => id !== userId);
      return { ...prev, projectMembers: next };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTieUpCompanyChange = (e) => {
    setFormData((prev) => ({ ...prev, tieUpCompanyId: e.value ? e.value.id : null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotification(null);

    if (
      !formData.projectName ||
      !formData.description ||
      !formData.tieUpCompanyId ||
      !formData.address ||
      !formData.location
    ) {
      setNotification({
        type: "error",
        message: "All fields are required.",
      });
      return;
    }

    try {
      // Prepare request body with correct field names
      const requestBody = {
        projectName: formData.projectName,
        description: formData.description,
        address: formData.address,
        location: formData.location,
        tieUpCompanyId: formData.tieUpCompanyId,
        memberIds: formData.projectMembers,
      };
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const text = await res.text();
      console.log("[Projects POST] status:", res.status, "body:", text);

      if (!res.ok) throw new Error(text || `Server returned ${res.status}`);

      setNotification({
        type: "success",
        message: "Project created successfully.",
      });
      setFormData({
        projectName: "",
        description: "",
        tieUpCompanyId: null,
        projectMembers: [],
        address: "",
        location: "",
      });
    } catch (err) {
      console.error("Error saving project:", err);
      setNotification({
        type: "error",
        message: `Failed to save project: ${err.message}`,
      });
    }
  };

  // auto-hide notification
  useEffect(() => {
    if (!notification) return;
    const t = setTimeout(() => setNotification(null), 5000);
    return () => clearTimeout(t);
  }, [notification]);

  return (
    <div className="page-root">
      <div className="form-wrapper">
        <form onSubmit={handleSubmit} className="form-grid">
          {/* Project Name + Description side by side */}
          <div className="form-row">
            <FormInput
              id="projectName"
              name="projectName"
              label="Project Name"
              value={formData.projectName}
              onChange={handleChange}
            />
            <FormInput
              id="description"
              name="description"
              label="Description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {/* Tie-up Company + Address side by side */}
          <div className="form-row">
            <div style={{ flex: 1, marginRight: 16, position: 'relative' }}>
              <style>{`
                .floating-label-container {
                  position: relative;
                }
                .floating-label {
                  position: absolute;
                  top: -8px;
                  left: 12px;
                  background: white;
                  padding: 0 4px;
                  font-size: 12px;
                  color: #666;
                  z-index: 1;
                  pointer-events: none;
                  transition: none;
                }
              `}</style>
              <div className="floating-label-container">
                <div className="floating-label">Tie-up Company</div>
                <DropDownList
                  id="tieUpCompanyId"
                  name="tieUpCompanyId"
                  data={tieUpCompanies}
                  textField="companyName"
                  value={tieUpCompanies.find(c => c.id === formData.tieUpCompanyId) || null}
                  onChange={handleTieUpCompanyChange}
                  filterable={true}
                  style={{ width: "100%" }}
                  placeholder="Select a company"
                  size={'large'}
                />
              </div>
            </div>
            <FormInput
              id="address"
              name="address"
              label="Address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          {/* Location */}
          <div className="form-row">
            <FormInput
              id="location"
              name="location"
              label="Location (Web link)"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          {/* Project Members */}
          <div className="members-box">
            <label className="members-label">Project Members</label>
            <div className="members-list">
              {members.length === 0 ? (
                <div style={{ color: "#666" }}>No employees found.</div>
              ) : (
                members.map((member) => (
                  <div className="member-row" key={member.id}>
                    <Checkbox
                      checked={formData.projectMembers.includes(member.id)}
                      onChange={handleMemberToggle(member.id)}
                    />
                    <span className="member-name">
                      {member.firstName} {member.lastName}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="form-actions">
            <Button themeColor="primary" type="submit">
              Save Project
            </Button>
            <Button
              type="button"
              look="outline"
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
          </div>

          {/* Notifications */}
          {notification && (
            <div
              className={`notification-box ${
                notification.type === "success" ? "success" : "error"
              }`}
            >
              {notification.message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default NewProject;









