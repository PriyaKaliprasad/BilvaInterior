import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "@progress/kendo-theme-default/dist/all.css";
import { Checkbox } from "@progress/kendo-react-inputs";
import { Button } from "@progress/kendo-react-buttons";
import FormInput from "../../components/Form/FormInput";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { Form, Field, FormElement, FieldWrapper } from "@progress/kendo-react-form";
import FloatingLabelWrapper from "../../components/Form/FloatingLabelWrapper/FloatingLabelWrapper";
import "./NewProject.css";

/*
  This EditProject.jsx stores the selected Tie-up Company as the full object
  in the form state (tieUpCompany). The key fix below is correctly resolving
  the project's existing company when the API returns:
    - projectData.tieUpCompany (embedded object), or
    - projectData.tieUpCompanyId (primitive id)
  and matching it against the loaded tieUpCompanies list.

  Changes made in this version:
  - After a successful update we now navigate back to the All Projects route
    and pass a `refresh` timestamp in location.state so ProjectsAll will re-fetch.
    This avoids landing on Dashboard and ensures All Projects shows the updated list.
  - Cancel button now also navigates explicitly to the All Projects route with a refresh flag.
  - If your app uses a different path for the All Projects page (for example "/projects/all"),
    change the path passed to `navigate()` below to match your router.
*/

const MEMBERS_API = `${import.meta.env.VITE_API_BASE_URL}/api/Projects/members`;

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [members, setMembers] = useState([]);
  const [tieUpCompanies, setTieUpCompanies] = useState([]);
  const [projectData, setProjectData] = useState(null);
  const [formInitialValues, setFormInitialValues] = useState(null);
  const [notification, setNotification] = useState(null);
  const [formKey, setFormKey] = useState(0);

  // Validators
  const requiredValidator = (value) =>
    value === undefined || value === null || value === "" ? "This field is required." : "";
  const projectNameValidator = (value) =>
    !value || value.trim().length < 3 ? "Project name must be at least 3 characters." : "";

  // Fetch project data
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Projects/${id}`);
        const raw = await res.text();
        if (!res.ok) throw new Error(`API ${res.status}: ${raw}`);
        const data = JSON.parse(raw);
        setProjectData(data);
      } catch (err) {
        console.error("Error fetching project:", err);
        setNotification({ type: "error", message: "Failed to load project data." });
      }
    };
    if (id) fetchProject();
  }, [id]);

  // Fetch members
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await fetch(MEMBERS_API);
        const raw = await res.text();
        if (!res.ok) throw new Error(`API ${res.status}: ${raw}`);
        const data = JSON.parse(raw);
        setMembers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching members:", err);
        setMembers([]);
      }
    };
    fetchMembers();
  }, []);

  // Fetch tie-up companies
  useEffect(() => {
    const fetchTieUpCompanies = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/TieUpCompany`, {
          headers: { Accept: "application/json" },
        });
        const raw = await res.text();
        if (!res.ok) throw new Error(`API ${res.status}: ${raw}`);
        const data = JSON.parse(raw);
        setTieUpCompanies(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching tie-up companies:", err);
        setTieUpCompanies([]);
      }
    };
    fetchTieUpCompanies();
  }, []);

  // Build initial form values once projectData and/or tieUpCompanies are available.
  // Important: this supports projectData having either .tieUpCompany (object) OR .tieUpCompanyId (primitive)
  useEffect(() => {
    if (!projectData) return;

    // helper: determine a target id from projectData (supports various shapes)
    const getTargetCompanyId = () => {
      // 1) if backend already gives embedded object -> use its id
      if (projectData.tieUpCompany && projectData.tieUpCompany.id != null) {
        return projectData.tieUpCompany.id;
      }
      // 2) if backend gives primitive ID field
      if (projectData.tieUpCompanyId != null) {
        return projectData.tieUpCompanyId;
      }
      // 3) fallback: sometimes backend might put id in another field — try direct property 'companyId'
      if (projectData.companyId != null) {
        return projectData.companyId;
      }
      return null;
    };

    const targetId = getTargetCompanyId();

    // Try to find the corresponding company object from the loaded list.
    // Use string comparison to avoid number/string mismatch issues.
    const findCompanyObject = () => {
      if (!Array.isArray(tieUpCompanies) || tieUpCompanies.length === 0) return null;

      if (targetId != null) {
        return (
          tieUpCompanies.find(
            (c) =>
              c &&
              (c.id === targetId || String(c.id) === String(targetId) || String(c.id) === String(projectData.tieUpCompany?.id))
          ) || null
        );
      }

      // No target id — maybe projectData already contains the full object that matches one in list
      if (projectData.tieUpCompany && projectData.tieUpCompany.id != null) {
        return (
          tieUpCompanies.find((c) => String(c.id) === String(projectData.tieUpCompany.id)) || null
        );
      }

      return null;
    };

    const initialTieUpCompany = findCompanyObject();

    const initial = {
      projectName: projectData.projectName || "",
      description: projectData.description || "",
      address: projectData.address || "",
      location: projectData.location || "",
      // store the whole object in the form (object-mode) — null if not found
      tieUpCompany: initialTieUpCompany,
      projectMembers: (projectData.memberIds || []).reduce((acc, mId) => {
        acc[mId] = true;
        return acc;
      }, {}),
    };

    setFormInitialValues(initial);
    // bump key so the Form remounts and picks up fresh initialValues reliably
    setFormKey((k) => k + 1);
  }, [projectData, tieUpCompanies]);

  const handleSubmit = async (dataItem) => {
    setNotification(null);

    const selectedMemberIds = Object.keys(dataItem.projectMembers || {})
      .filter((key) => dataItem.projectMembers[key])
      .map((id) => Number(id));

    const requestBody = {
      projectName: dataItem.projectName,
      description: dataItem.description,
      address: dataItem.address,
      location: dataItem.location,
      // extract id from the selected company object (or null)
      tieUpCompanyId: dataItem.tieUpCompany ? dataItem.tieUpCompany.id : null,
      memberIds: selectedMemberIds,
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(requestBody),
      });

      const text = await res.text();
      if (!res.ok) throw new Error(text || `Server returned ${res.status}`);

      // Immediately navigate back to All Projects and trigger a refresh there.
      // ProjectsAll reads location.state?.refresh and will re-fetch.
      // If your All Projects route is "/projects/all" change "/projects" below accordingly.
      navigate("/projects", { state: { refresh: Date.now() } });
    } catch (err) {
      console.error("Error updating project:", err);
      setNotification({ type: "error", message: `Failed to update project: ${err.message}` });
    }
  };

  return (
    <main>
      <div className="card">
        {formInitialValues ? (
          <Form
            key={`${formKey}-${id}`}
            onSubmit={handleSubmit}
            initialValues={formInitialValues}
            render={(formRenderProps) => (
              <FormElement>
                {/* Project Name & Description */}
                <fieldset className="k-form-fieldset">
                  <div className="form-row">
                    <Field
                      name="projectName"
                      component={FormInput}
                      label="Project Name"
                      validator={projectNameValidator}
                      required
                    />
                    <Field
                      name="description"
                      component={FormInput}
                      label="Description"
                      validator={requiredValidator}
                      required
                    />
                  </div>
                </fieldset>

                {/* Address & Tie-up Company */}
                <fieldset className="k-form-fieldset">
                  <div className="form-row">
                    <Field
                      name="address"
                      component={FormInput}
                      label="Address"
                      validator={requiredValidator}
                      required
                    />
                    <div style={{ flex: 1, marginRight: 16, position: "relative" }}>
                      <FieldWrapper>
                        <FloatingLabelWrapper label="Tie-up Company">
                          <Field
                            name="tieUpCompany"
                            validator={requiredValidator}
                            required
                            component={(props) => (
                              <DropDownList
                                {...props}
                                data={tieUpCompanies}
                                textField="companyName"
                                // dataItemKey helps DropDownList identify items by id
                                dataItemKey="id"
                                // object mode: props.value is the whole selected object (or null)
                                value={props.value ?? null}
                                // Form Field expects onChange called with an object: { value: ... }
                                onChange={(e) => props.onChange({ value: e.value ?? null })}
                                filterable
                                style={{ width: "100%" }}
                                size="large"
                              />
                            )}
                          />
                        </FloatingLabelWrapper>
                      </FieldWrapper>
                    </div>
                  </div>
                </fieldset>

                {/* Location */}
                <fieldset className="k-form-fieldset">
                  <Field
                    name="location"
                    component={FormInput}
                    label="Location (Web link)"
                    validator={requiredValidator}
                    required
                  />
                </fieldset>

                {/* Project Members */}
                <fieldset className="k-form-fieldset">
                  <legend className="k-form-legend">Project Members</legend>
                  <div className="members-list">
                    {members.length === 0 ? (
                      <div style={{ color: "#666" }}>No employees found.</div>
                    ) : (
                      members.map((member) => (
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

                {/* Notification */}
                {notification && (
                  <div
                    style={{
                      marginBottom: "1rem",
                      padding: "8px",
                      borderRadius: "6px",
                      textAlign: "center",
                      fontWeight: "bold",
                      color: notification.type === "success" ? "#065f46" : "#b91c1c",
                      backgroundColor:
                        notification.type === "success" ? "#d1fae5" : "#fee2e2",
                    }}
                  >
                    {notification.message}
                  </div>
                )}

                {/* Actions */}
                <div className="form-actions">
                  <Button themeColor="primary" type="submit">
                    Update Project
                  </Button>
                  <Button
                    type="button"
                    look="outline"
                    onClick={() => {
                      // Explicitly navigate back to All Projects and request a refresh.
                      // Change path if your All Projects route is different.
                      navigate("/projects", { state: { refresh: Date.now() } });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </FormElement>
            )}
          />
        ) : (
          <div style={{ padding: 24 }}>Loading form...</div>
        )}
      </div>
    </main>
  );
};

export default EditProject;