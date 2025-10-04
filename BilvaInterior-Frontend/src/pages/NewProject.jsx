// import React, { useState, useEffect } from "react";
// import "@progress/kendo-theme-default/dist/all.css";
// import { Checkbox } from "@progress/kendo-react-inputs";
// import { Button } from "@progress/kendo-react-buttons";
// import FormInput from "../components/Form/FormInput";   // ✅ fixed path (all lowercase 'form')
// import FormDropDown from "../components/Form/FormDropDown"; // ✅ new wrapper for dropdown
// import "./NewProject.css";

// const NewProject = () => {
//   const [formData, setFormData] = useState({
//     projectName: "",
//     description: "",
//     tieUpCompany: null,
//     projectMembers: [],
//     address: "",
//     location: "",
//   });

//   const [notification, setNotification] = useState(null);

//   const tieUpCompanies = ["Company A", "Company B", "Company C"];
//   const members = ["John Doe", "Jane Smith", "Michael Lee", "Priya Sharma"];

//   // ✅ Generic input handler (FormInput + FormDropDown)
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleDropdownChange = (e) => {
//     setFormData((prev) => ({ ...prev, tieUpCompany: e.value }));
//     console.log(formData);
//   };

//   const handleMemberChange = (member) => (e) => {
//     if (e.value) {
//       setFormData((prev) => ({
//         ...prev,
//         projectMembers: [...prev.projectMembers, member],
//       }));
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         projectMembers: prev.projectMembers.filter((m) => m !== member),
//       }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.projectName || !formData.description) {
//       setNotification({
//         type: "error",
//         message: "Project Name & Description are required!",
//       });
//       return;
//     }
// console.log(formData);
//     try {
//       const response = await fetch("https://localhost:7142/api/projects", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           projectName: formData.projectName,
//           description: formData.description,
//           tieUpCompany: formData.tieUpCompany,
//           projectMembers: formData.projectMembers.join(","), // backend expects string
//           address: formData.address,
//           location: formData.location,
//         }),
//       });

//       if (response.ok) {
//         setNotification({
//           type: "success",
//           message: "Project created successfully!",
//         });
//         setFormData({
//           projectName: "",
//           description: "",
//           tieUpCompany: null,
//           projectMembers: [],
//           address: "",
//           location: "",
//         });
//       } else {
//         const err = await response.text();
//         setNotification({ type: "error", message: `Failed to save: ${err}` });
//       }
//     } catch (error) {
//       setNotification({ type: "error", message: `Error: ${error.message}` });
//     }
//   };

//   // Auto hide after 5 seconds
//   useEffect(() => {
//     if (notification) {
//       const timer = setTimeout(() => setNotification(null), 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [notification]);

//   return (
//     <div className="page-root">
//       <div className="form-wrapper">
//         <form onSubmit={handleSubmit} className="form-grid">
//           {/* Project Name */}
//           <FormInput
//             id="projectName"
//             name="projectName"
//             label="Project Name"
//             value={formData.projectName}
//             onChange={handleChange}
//           />

//           {/* Description */}
//           <FormInput
//             id="description"
//             name="description"
//             label="Description"
//             value={formData.description}
//             onChange={handleChange}
//           />

//           {/* Tie-up Company */}
//           <FormDropDown
//             id="tieUpCompany"
//             name="tieUpCompany"
//             label="Tie-up Company"
//             data={tieUpCompanies}
//             value={formData.tieUpCompany}
//             onChange={handleDropdownChange}
//             hint="Select a company"
//           />

//           {/* Project Members */}
//           <div className="members-box">
//             <label className="members-label">Project Members</label>
//             <div className="members-list">
//               {members.map((member) => (
//                 <div className="member-row" key={member}>
//                   <Checkbox
//                     checked={formData.projectMembers.includes(member)}
//                     onChange={handleMemberChange(member)}
//                   />
//                   <span>{member}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Address */}
//           <FormInput
//             id="address"
//             name="address"
//             label="Address"
//             value={formData.address}
//             onChange={handleChange}
//           />

//           {/* Location */}
//           <FormInput
//             id="location"
//             name="location"
//             label="Location (Web link)"
//             value={formData.location}
//             onChange={handleChange}
//           />

//           {/* Buttons */}
//           <div className="form-actions">
//             <Button themeColor="primary" type="submit">
//               Save Project
//             </Button>
//             <Button
//               type="button"
//               look="outline"
//               onClick={() => window.history.back()}
//             >
//               Cancel
//             </Button>
//           </div>

//           {/* Inline Notification */}
//           {notification && (
//             <div
//               className={`notification-box ${
//                 notification.type === "success" ? "success" : "error"
//               }`}
//             >
//               {notification.message}
//             </div>
//           )}
//         </form>
//       </div>
//     </div>
//   );
// };

// export default NewProject;

// import React, { useState, useEffect } from "react";
// import "@progress/kendo-theme-default/dist/all.css";
// import { Checkbox } from "@progress/kendo-react-inputs";
// import { Button } from "@progress/kendo-react-buttons";
// import FormInput from "../components/Form/FormInput";   
// import FormDropDown from "../components/Form/FormDropDown"; 
// import "./NewProject.css";

// const NewProject = () => {
//   const [formData, setFormData] = useState({
//     projectName: "",
//     description: "",
//     tieUpCompany: "",
//     projectMembers: [],
//     address: "",
//     location: "",
//   });

//   const [notification, setNotification] = useState(null);

//   const tieUpCompanies = ["Company A", "Company B", "Company C"];
//   const members = ["John Doe", "Jane Smith", "Michael Lee", "Priya Sharma"];

//   // ✅ Generic input handler
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // ✅ Dropdown handler (always string, not object)
//   const handleDropdownChange = (e) => {
//     const value = e.value ?? e.target.value; // normalize
//     setFormData((prev) => ({ ...prev, tieUpCompany: value }));
//   };

//   const handleMemberChange = (member) => (e) => {
//     if (e.value) {
//       setFormData((prev) => ({
//         ...prev,
//         projectMembers: [...prev.projectMembers, member],
//       }));
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         projectMembers: prev.projectMembers.filter((m) => m !== member),
//       }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // ✅ all fields mandatory
//     if (
//       !formData.projectName ||
//       !formData.description ||
//       !formData.tieUpCompany ||
//       !formData.address ||
//       !formData.location
//     ) {
//       setNotification({
//         type: "error",
//         message: "All fields are required!",
//       });
//       return;
//     }

//     try {
//       const response = await fetch("https://localhost:7142/api/projects", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           projectName: formData.projectName,
//           description: formData.description,
//           tieUpCompany: formData.tieUpCompany,
//           projectMembers: formData.projectMembers.join(","), // backend expects string
//           address: formData.address,
//           location: formData.location,
//         }),
//       });

//       if (response.ok) {
//         setNotification({
//           type: "success",
//           message: "Project created successfully!",
//         });
//         setFormData({
//           projectName: "",
//           description: "",
//           tieUpCompany: "",
//           projectMembers: [],
//           address: "",
//           location: "",
//         });
//       } else {
//         const err = await response.text();
//         setNotification({ type: "error", message: `Failed to save: ${err}` });
//       }
//     } catch (error) {
//       setNotification({ type: "error", message: `Error: ${error.message}` });
//     }
//   };

//   // Auto hide notification
//   useEffect(() => {
//     if (notification) {
//       const timer = setTimeout(() => setNotification(null), 4000);
//       return () => clearTimeout(timer);
//     }
//   }, [notification]);

//   return (
//     <div className="page-root">
//       <div className="form-wrapper">
//         <form onSubmit={handleSubmit} className="form-grid">
//           {/* Project Name + Description */}
//           <div className="form-row">
//             <FormInput
//               id="projectName"
//               name="projectName"
//               label="Project Name"
//               value={formData.projectName}
//               onChange={handleChange}
//             />
//             <FormInput
//               id="description"
//               name="description"
//               label="Description"
//               value={formData.description}
//               onChange={handleChange}
//             />
//           </div>

//           {/* Tie-up Company + Address */}
//           <div className="form-row">
//             <FormDropDown
//               id="tieUpCompany"
//               name="tieUpCompany"
//               label="Tie-up Company"
//               data={tieUpCompanies}
//               value={formData.tieUpCompany}
//               onChange={handleDropdownChange}
//               hint="Select a company"
//             />
//             <FormInput
//               id="address"
//               name="address"
//               label="Address"
//               value={formData.address}
//               onChange={handleChange}
//             />
//           </div>

//           {/* Location */}
//           <div className="form-row">
//             <FormInput
//               id="location"
//               name="location"
//               label="Location (Web link)"
//               value={formData.location}
//               onChange={handleChange}
//             />
//           </div>

//           {/* Project Members at last */}
//           <div className="members-box">
//             <label className="members-label">Project Members</label>
//             <div className="members-list">
//               {members.map((member) => (
//                 <div className="member-row" key={member}>
//                   <Checkbox
//                     checked={formData.projectMembers.includes(member)}
//                     onChange={handleMemberChange(member)}
//                   />
//                   <span>{member}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Buttons */}
//           <div className="form-actions">
//             <Button themeColor="primary" type="submit">
//               Save Project
//             </Button>
//             <Button
//               type="button"
//               look="outline"
//               onClick={() => window.history.back()}
//             >
//               Cancel
//             </Button>
//           </div>

//           {/* Notification */}
//           {notification && (
//             <div
//               className={`notification-box ${
//                 notification.type === "success" ? "success" : "error"
//               }`}
//             >
//               {notification.message}
//             </div>
//           )}
//         </form>
//       </div>
//     </div>
//   );
// };

// export default NewProject;



// import React, { useState, useEffect } from "react";
// import "@progress/kendo-theme-default/dist/all.css";
// import { Checkbox } from "@progress/kendo-react-inputs";
// import { Button } from "@progress/kendo-react-buttons";
// import FormInput from "../components/Form/FormInput";
// import "./NewProject.css";

// const API_BASE = "https://localhost:7142/api/Employee"; // ✅ correct URL

// const NewProject = () => {
//   const [formData, setFormData] = useState({
//     projectName: "",
//     description: "",
//     projectMembers: [],
//     address: "",
//     location: "",
//   });

//   const [notification, setNotification] = useState(null);
//   const [members, setMembers] = useState([]);

//   // ✅ Fetch employees
//   useEffect(() => {
//     const loadEmployees = async () => {
//       try {
//         const res = await fetch(API_BASE, {
//           method: "GET",
//           headers: { Accept: "application/json" },
//         });

//         console.log("[Employees] status:", res.status, res.statusText);
//         const raw = await res.text();
//         console.log("[Employees] raw response:", raw);

//         if (!res.ok) throw new Error(`API ${res.status}: ${raw}`);
//         if (!raw || raw.trim().length === 0) {
//           setMembers([]);
//           return;
//         }

//         let data = JSON.parse(raw);

//         // ✅ filter only role === "Employee"
//         if (Array.isArray(data)) {
//           const onlyEmployees = data.filter(
//             (emp) => emp.role?.toLowerCase() === "employee"
//           );
//           setMembers(onlyEmployees);
//         } else {
//           setMembers([]);
//         }
//       } catch (err) {
//         console.error("Error fetching employees:", err);
//         setMembers([]);
//         setNotification({
//           type: "error",
//           message: "Failed to load employees — check backend (see console).",
//         });
//       }
//     };

//     loadEmployees();
//   }, []);

//   const safeGetChecked = (e) =>
//     (typeof e.target?.checked === "boolean" ? e.target.checked : e.value) ||
//     false;

//   const handleMemberToggle = (userId) => (e) => {
//     const checked = safeGetChecked(e);
//     setFormData((prev) => {
//       const exists = prev.projectMembers.includes(userId);
//       const next = checked
//         ? exists
//           ? prev.projectMembers
//           : [...prev.projectMembers, userId]
//         : prev.projectMembers.filter((id) => id !== userId);
//       return { ...prev, projectMembers: next };
//     });
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setNotification(null);

//     if (!formData.projectName || !formData.description) {
//       setNotification({
//         type: "error",
//         message: "Project name and description are required.",
//       });
//       return;
//     }

//     try {
//       const res = await fetch("https://localhost:7142/api/Projects", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Accept: "application/json",
//         },
//         body: JSON.stringify(formData),
//       });

//       const text = await res.text();
//       console.log("[Projects POST] status:", res.status, "body:", text);

//       if (!res.ok) throw new Error(text || `Server returned ${res.status}`);

//       setNotification({
//         type: "success",
//         message: "Project created successfully.",
//       });
//       setFormData({
//         projectName: "",
//         description: "",
//         projectMembers: [],
//         address: "",
//         location: "",
//       });
//     } catch (err) {
//       console.error("Error saving project:", err);
//       setNotification({
//         type: "error",
//         message: `Failed to save project: ${err.message}`,
//       });
//     }
//   };

//   // auto-hide notification
//   useEffect(() => {
//     if (!notification) return;
//     const t = setTimeout(() => setNotification(null), 5000);
//     return () => clearTimeout(t);
//   }, [notification]);

//   return (
//     <div className="page-root">
//       <div className="form-wrapper">
//         <form onSubmit={handleSubmit} className="form-grid">
//           {/* ✅ Project Name + Description side by side */}
//           <div className="form-row">
//             <FormInput
//               id="projectName"
//               name="projectName"
//               label="Project Name"
//               value={formData.projectName}
//               onChange={handleChange}
//             />
//             <FormInput
//               id="description"
//               name="description"
//               label="Description"
//               value={formData.description}
//               onChange={handleChange}
//             />
//           </div>

//           {/* ✅ Address + Location side by side */}
//           <div className="form-row">
//             <FormInput
//               id="address"
//               name="address"
//               label="Address"
//               value={formData.address}
//               onChange={handleChange}
//             />
//             <FormInput
//               id="location"
//               name="location"
//               label="Location (Web link)"
//               value={formData.location}
//               onChange={handleChange}
//             />
//           </div>

//           {/* ✅ Project Members at the end */}
//           <div className="members-box">
//             <label className="members-label">Project Members</label>
//             <div className="members-list">
//               {members.length === 0 ? (
//                 <div style={{ color: "#666" }}>No employees found.</div>
//               ) : (
//                 members.map((member) => (
//                   <div className="member-row" key={member.id}>
//                     <Checkbox
//                       checked={formData.projectMembers.includes(member.id)}
//                       onChange={handleMemberToggle(member.id)}
//                     />
//                     <span className="member-name">
//                       {member.firstName} {member.lastName}
//                     </span>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>

//           <div className="form-actions">
//             <Button themeColor="primary" type="submit">
//               Save Project
//             </Button>
//             <Button
//               type="button"
//               look="outline"
//               onClick={() => window.history.back()}
//             >
//               Cancel
//             </Button>
//           </div>

//           {notification && (
//             <div
//               className={`notification-box ${
//                 notification.type === "success" ? "success" : "error"
//               }`}
//             >
//               {notification.message}
//             </div>
//           )}
//         </form>
//       </div>
//     </div>
//   );
// };

// export default NewProject;



// src/pages/NewProject.jsx
import React, { useState, useEffect } from "react";
import "@progress/kendo-theme-default/dist/all.css";
import { Checkbox } from "@progress/kendo-react-inputs";
import { Button } from "@progress/kendo-react-buttons";
import FormInput from "../components/Form/FormInput";
import FormDropDown from "../components/Form/FormDropDown"; // ✅ Added
import "./NewProject.css";

const API_BASE = "https://localhost:7142/api/Employee";

const NewProject = () => {
  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
    tieUpCompany: "", // ✅ added
    projectMembers: [],
    address: "",
    location: "",
  });

  const [notification, setNotification] = useState(null);
  const [members, setMembers] = useState([]);

  // Tie-up companies list
  const tieUpCompanies = ["Company A", "Company B", "Company C"];

  // ✅ Fetch employees
  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const res = await fetch(API_BASE, {
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
          const onlyEmployees = data.filter(
            (emp) => emp.role?.toLowerCase() === "employee"
          );
          setMembers(onlyEmployees);
        } else {
          setMembers([]);
        }
      } catch (err) {
        console.error("Error fetching employees:", err);
        setMembers([]);
        setNotification({
          type: "error",
          message: "Failed to load employees — check backend.",
        });
      }
    };

    loadEmployees();
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

  const handleDropdownChange = (e) => {
    const value = e.value ?? e.target.value;
    setFormData((prev) => ({ ...prev, tieUpCompany: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotification(null);

    if (
      !formData.projectName ||
      !formData.description ||
      !formData.tieUpCompany ||
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
      const res = await fetch("https://localhost:7142/api/Projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
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
        tieUpCompany: "",
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
            <FormDropDown
              id="tieUpCompany"
              name="tieUpCompany"
              label="Tie-up Company"
              data={tieUpCompanies}
              value={formData.tieUpCompany}
              onChange={handleDropdownChange}
              hint="Select a company"
            />
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









