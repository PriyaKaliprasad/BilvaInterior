// import React, { useEffect, useState } from "react";
// import { Grid, GridColumn } from "@progress/kendo-react-grid";
// import { Button } from "@progress/kendo-react-buttons";
// import "bootstrap/dist/css/bootstrap.min.css";

// const AllQuotations = () => {
//   const API_BASE = "https://localhost:7142/api";
//   const [quotations, setQuotations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // ✅ Fetch all quotations when page loads
//   useEffect(() => {
//     fetch(`${API_BASE}/quotations`)
//       .then((res) => {
//         if (!res.ok) throw new Error("Failed to load quotations");
//         return res.json();
//       })
//       .then((data) => {
//         setQuotations(data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         setError(err.message);
//         setLoading(false);
//       });
//   }, []);

//   return (
//     <div className="container-fluid py-4">
//       {/* ✅ Header bar only with right-aligned button */}
//       <div className="d-flex justify-content-end align-items-center mb-3">
//         <Button themeColor="primary" href="/quotation">
//           ➕ New Quotation
//         </Button>
//       </div>

//       {loading && <p>Loading quotations...</p>}
//       {error && <p className="text-danger">{error}</p>}

//       {!loading && quotations.length === 0 && (
//         <p className="text-muted text-center">No quotations found.</p>
//       )}

//       {!loading && quotations.length > 0 && (
//         <Grid data={quotations} style={{ height: "auto" }}>
//           <GridColumn field="quotationId" title="ID" width="60px" />
//           <GridColumn field="quotationName" title="Quotation Name" />
//           <GridColumn field="clientName" title="Client Name" />
//           <GridColumn field="projectName" title="Project Name" />
//           <GridColumn field="amount" title="Amount" />
//           <GridColumn
//             title="Actions"
//             cell={(props) => (
//               <td>
//                 <Button
//                   size="small"
//                   onClick={() => alert(`Edit ${props.dataItem.quotationId}`)}
//                 >
//                   Edit
//                 </Button>
//               </td>
//             )}
//           />
//         </Grid>
//       )}
//     </div>
//   );
// };

// export default AllQuotations;

// import React, { useEffect, useState } from "react";
// import { Grid, GridColumn } from "@progress/kendo-react-grid";
// import { Button } from "@progress/kendo-react-buttons";
// import "bootstrap/dist/css/bootstrap.min.css";

// const AllQuotations = () => {
//   const API_BASE = "https://localhost:7142/api";
//   const [quotations, setQuotations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // ✅ Fetch all quotations when page loads
//   useEffect(() => {
//     fetch(`${API_BASE}/quotations`)
//       .then((res) => {
//         if (!res.ok) throw new Error("Failed to load quotations");
//         return res.json();
//       })
//       .then((data) => {
//         setQuotations(data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         setError(err.message);
//         setLoading(false);
//       });
//   }, []);

//   return (
//     <div className="container-fluid py-4">
//       {/* ✅ Responsive header */}
//       <div className="row mb-3">
//         <div className="col-12 d-flex justify-content-md-end justify-content-center align-items-center">
//           <Button
//             themeColor="primary"
//             href="/quotation"
//             className="px-3 py-2"
//           >
//             New Quotation
//           </Button>
//         </div>
//       </div>

//       {/* ✅ Status and Error Messages */}
//       <div className="row">
//         <div className="col-12">
//           {loading && (
//             <p className="text-center fw-semibold text-secondary">
//               Loading quotations...
//             </p>
//           )}
//           {error && <p className="text-danger text-center">{error}</p>}

//           {!loading && quotations.length === 0 && (
//             <p className="text-muted text-center mt-4">
//               No quotations found.
//             </p>
//           )}
//         </div>
//       </div>

//       {/* ✅ Responsive Kendo Grid */}
//       {!loading && quotations.length > 0 && (
//         <div className="row">
//           <div className="col-12">
//             <div className="table-responsive shadow-sm rounded-3">
//               <Grid
//                 data={quotations}
//                 style={{ minWidth: "600px" }} // ensures proper horizontal scroll on mobile
//               >
//                 <GridColumn field="quotationId" title="ID" width="60px" />
//                 <GridColumn field="quotationName" title="Quotation Name" />
//                 <GridColumn field="clientName" title="Client Name" />
//                 <GridColumn field="projectName" title="Project Name" />
//                 <GridColumn field="amount" title="Amount" />
//                 <GridColumn
//                   title="Actions"
//                   cell={(props) => (
//                     <td>
//                       <Button
//                         size="small"
//                         onClick={() =>
//                           alert(`Edit ${props.dataItem.quotationId}`)
//                         }
//                       >
//                         Edit
//                       </Button>
//                     </td>
//                   )}
//                 />
//               </Grid>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AllQuotations;

import React, { useEffect, useState } from "react";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { Button } from "@progress/kendo-react-buttons";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AllQuotations.css"; // ✅ Styles below

const AllQuotations = () => {
  const API_BASE = "https://localhost:7142/api";
  const [quotations, setQuotations] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingQuotation, setEditingQuotation] = useState(null);
  const [formData, setFormData] = useState({
    quotationId: "",
    clientName: "",
    projectName: "",
    amount: "",
  });

  // ✅ Fetch quotations
  useEffect(() => {
    fetch(`${API_BASE}/quotations`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load quotations");
        return res.json();
      })
      .then((data) => {
        setQuotations(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // ✅ Fetch projects for dropdown
  useEffect(() => {
    fetch(`${API_BASE}/projects`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load projects");
        return res.json();
      })
      .then((data) => setProjects(data))
      .catch((err) => console.error("Error fetching projects:", err));
  }, []);

  // ✅ Handlers
  const handleEdit = (quotation) => {
    setEditingQuotation(quotation);
    setFormData({ ...quotation });
    setError("");
    setSuccess("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setEditingQuotation(null);
    setError("");
    setSuccess("");
  };

  const handleSave = async () => {
    setError("");
    setSuccess("");

    if (
    //   !formData.quotationName ||
      !formData.clientName ||
      !formData.projectName ||
      !formData.amount
    ) {
      setError("All fields are required. Please fill in all details.");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE}/quotations/${formData.quotationId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Failed to save quotation");

      const updated = quotations.map((q) =>
        q.quotationId === formData.quotationId ? formData : q
      );
      setQuotations(updated);

      setSuccess("Quotation updated successfully!");
      setError("");

      setTimeout(() => setSuccess(""), 5000);
    } catch (err) {
      setError("Error saving quotation: " + err.message);
    }
  };

  return (
    <div className="container-fluid py-4 allquotation-page">
      {/* ✅ Quotation List */}
      {!editingQuotation && (
        <>
          <div className="row mb-3">
            <div className="col-12 d-flex justify-content-md-end justify-content-center align-items-center">
              <Button themeColor="primary" href="/quotation" className="px-3 py-2">
                New Quotation
              </Button>
            </div>
          </div>

          {loading && <p className="text-center text-secondary">Loading quotations...</p>}
          {error && <p className="text-danger text-center">{error}</p>}

          {!loading && quotations.length === 0 && (
            <p className="text-muted text-center mt-4">No quotations found.</p>
          )}

          {!loading && quotations.length > 0 && (
            <div className="row">
              <div className="col-12">
                <div className="table-responsive quotation-table shadow-sm rounded-3 p-2">
                  <Grid data={quotations} style={{ minWidth: "600px" }}>
                    <GridColumn field="quotationId" title="ID" width="60px" />
                    <GridColumn field="clientName" title="Client Name" />
                    <GridColumn field="projectName" title="Project Name" />
                    <GridColumn field="amount" title="Amount" />
                    <GridColumn
                      title="Actions"
                      cell={(props) => (
                        <td>
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
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ✅ Edit Page */}
      {editingQuotation && (
        <div className="container-fluid edit-page">
          <div className="container py-4">
            <Button fillMode="flat" icon="arrow-left" onClick={handleCancel} className="mb-3">
              Back
            </Button>

            <div className="card edit-card shadow-sm border-0 rounded-4 p-4">
              <h4 className="fw-bold mb-4 text-center text-md-start">Edit Quotation</h4>

              <div className="row g-4">
                
                <div className="col-md-6 col-12">
                  <label className="form-label">Client Name:</label>
                  <input
                    type="text"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                <div className="col-md-6 col-12">
                  <label className="form-label">Project Name:</label>
                  <select
                    name="projectName"
                    value={formData.projectName}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="">-- Select Project --</option>
                    {projects.map((proj) => (
                      <option
                        key={proj.projectId}
                        value={proj.projectName || proj.name}
                      >
                        {proj.projectName || proj.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6 col-12">
                  <label className="form-label">Amount:</label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              </div>

              {/* ✅ Messages */}
              <div className="mt-4">
                {success && <div className="alert alert-success py-2 mb-3">{success}</div>}
                {error && <div className="alert alert-danger py-2 mb-3">{error}</div>}

                <div className="d-flex flex-column flex-md-row justify-content-start">
                  <Button themeColor="primary" onClick={handleSave} className="me-md-2 mb-2 mb-md-0">
                    Save
                  </Button>
                  <Button themeColor="secondary" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllQuotations;








