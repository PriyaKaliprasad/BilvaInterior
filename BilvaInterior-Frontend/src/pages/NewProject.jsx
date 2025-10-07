import React, { useState, useEffect } from "react";
import "@progress/kendo-theme-default/dist/all.css";
import { Checkbox } from "@progress/kendo-react-inputs";
import { Button } from "@progress/kendo-react-buttons";
import FormInput from "../components/Form/FormInput";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { Form, Field, FormElement } from "@progress/kendo-react-form";
import "./NewProject.css";

const MEMBERS_API = `${import.meta.env.VITE_API_BASE_URL}/api/Projects/members`;

const NewProject = () => {
  const [notification, setNotification] = useState(null);
  const [members, setMembers] = useState([]);
  const [tieUpCompanies, setTieUpCompanies] = useState([]);
  const [formKey, setFormKey] = useState(0); // for resetting form


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

  // Validators
  const projectNameValidator = (value) => {
    if (!value || value.trim().length < 3) {
      return "Project name must be at least 3 characters.";
    }
    return "";
  };
  const requiredValidator = (value) => {
    if (value === undefined || value === null || value === "") {
      return "This field is required.";
    }
    return "";
  };
  const budgetValidator = (value) => {
    if (value === undefined || value === null || value === "") {
      return "Budget is required.";
    }
    if (Number(value) < 1000) {
      return "Budget must be at least 1000.";
    }
    return "";
  };

  // Kendo Form submit handler
  const handleSubmit = async (dataItem) => {
    setNotification(null);

    const selectedMemberIds = Object.keys(dataItem.projectMembers || {})
      .filter(key => dataItem.projectMembers[key])
      .map(id => Number(id));

    // Compose request body
    const requestBody = {
      projectName: dataItem.projectName,
      description: dataItem.description,
      address: dataItem.address,
      location: dataItem.location,
      tieUpCompanyId: dataItem.tieUpCompanyId,
      memberIds: selectedMemberIds,
      Budget: Number(dataItem.budget)
    };

    console.log("Submitting new project:", requestBody);
    try {
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
    <main>
      <div className="card">
        {notification && (
          <div
            style={{ marginBottom: "1rem", padding: "8px", borderRadius: "6px", textAlign: "center", fontWeight: "bold", color: notification.type === "success" ? "#065f46" : "#b91c1c", backgroundColor: notification.type === "success" ? "#d1fae5" : "#fee2e2" }}
          >
            {notification.message}
          </div>
        )}
        <Form
          key={formKey}
          onSubmit={handleSubmit}
          initialValues={{ projectMembers: {} }}
          render={formRenderProps => (
            <FormElement>
              <fieldset className="k-form-fieldset">
                <div className="form-row">
                  <Field
                    name="projectName"
                    component={FormInput}
                    label="Project Name"
                    validator={projectNameValidator}
                    required={true}
                  />
                  <Field
                    name="description"
                    component={FormInput}
                    label="Description"
                    validator={requiredValidator}
                    required={true}
                  />
                </div>
              </fieldset>

              <fieldset className="k-form-fieldset">
                <div className="form-row">
                  <div style={{ flex: 1, marginRight: 16, position: 'relative' }}>
                    <style>{`
                      .floating-label-static {
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
                    <div className="floating-label-static">Tie-up Company</div>
                    <Field
                      name="tieUpCompanyId"
                      validator={requiredValidator}
                      required={true}
                      component={props => (
                        <DropDownList
                          {...props}
                          data={tieUpCompanies}
                          textField="companyName"
                          value={tieUpCompanies.find(c => c.id === props.value) || null}
                          onChange={e => props.onChange({ value: e.value ? e.value.id : null })}
                          filterable={true}
                          style={{ width: "100%" }}
                          size={'large'}
                        />
                      )}
                    />
                  </div>
                  <Field
                    name="address"
                    component={FormInput}
                    label="Address"
                    validator={requiredValidator}
                    required={true}
                  />
                </div>
              </fieldset>

              <fieldset className="k-form-fieldset">
                <div className="form-row">
                  <Field
                    name="location"
                    component={FormInput}
                    label="Location (Web link)"
                    validator={requiredValidator}
                    required={true}
                    style={{ flex: 1, marginRight: 16 }}
                  />
                  <Field
                    name="budget"
                    component={FormInput}
                    label="Budget"
                    type="number"
                    min={1000}
                    validator={budgetValidator}
                    required={true}
                    style={{ width: "100%" }}
                  />
                </div>
              </fieldset>

              <fieldset className="k-form-fieldset">
                <legend className="k-form-legend">Project Members</legend>
                <div className="members-list">
                  {members.length === 0 ? (
                    <div style={{ color: "#666" }}>No employees found.</div>
                  ) : (

                    members.map(member => (
                      <Field
                        key={member.id}
                        name={`projectMembers.${member.id}`}
                        component={Checkbox}
                        label={`${member.firstName} ${member.lastName}`}
                      />
                    ))
                  )}
                </div>
              </fieldset>

              <div className="form-actions">
                <Button themeColor="primary" type="submit" disabled={!formRenderProps.allowSubmit}>
                  Save Project
                </Button>
                <Button
                  type="button"
                  look="outline"
                  onClick={() => setFormKey(k => k + 1)}
                  style={{ marginLeft: "10px" }}
                >
                  Cancel
                </Button>
              </div>
            </FormElement>
          )}
        />
      </div>
    </main>
  );
};

export default NewProject;









