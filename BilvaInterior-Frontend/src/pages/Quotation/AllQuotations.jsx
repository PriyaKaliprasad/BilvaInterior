// import React, { useEffect, useState } from "react";
// import { Grid, GridColumn } from "@progress/kendo-react-grid";
// import { Button } from "@progress/kendo-react-buttons";
// import { DropDownList } from "@progress/kendo-react-dropdowns";
// import "bootstrap/dist/css/bootstrap.min.css";

// const AllQuotations_Simple = () => {
//   const API_BASE = "https://localhost:7142/api";
//   const [quotations, setQuotations] = useState([]);
//   const [projects, setProjects] = useState([]);
//   const [editingQuotation, setEditingQuotation] = useState(null);
//   const [formData, setFormData] = useState({});
//   const [message, setMessage] = useState({ text: "", type: "" });

//   // Clear message after 5s
//   useEffect(() => {
//     if (!message.text) return;
//     const t = setTimeout(() => setMessage({ text: "", type: "" }), 5000);
//     return () => clearTimeout(t);
//   }, [message]);

//   // ✅ Load quotations and projects
//   useEffect(() => {
//     fetch(`${API_BASE}/quotations`)
//       .then((res) => res.json())
//       .then((data) => setQuotations(data))
//       .catch(() =>
//         setMessage({ text: "❌ Failed to load quotations", type: "error" })
//       );

//     fetch(`${API_BASE}/projects`)
//       .then((res) => res.json())
//       .then((data) => setProjects(data))
//       .catch(console.error);
//   }, []);

//   // helper to format date value for input[type=date]
//   const toDateInputValue = (val) => {
//     if (!val) return "";
//     try {
//       // handle Date object or ISO string
//       const d = new Date(val);
//       if (isNaN(d)) return "";
//       return d.toISOString().slice(0, 10);
//     } catch {
//       return "";
//     }
//   };

//   const handleEdit = (quotation) => {
//   setEditingQuotation(quotation);

//   setFormData({
//     ...quotation,
//     billDate: quotation.billDate ? toDateInputValue(quotation.billDate) : "",
//     dateOfEstimate: quotation.dateOfEstimate
//       ? toDateInputValue(quotation.dateOfEstimate)
//       : "",
//     poDate: quotation.poDate ? toDateInputValue(quotation.poDate) : "",
//     createdDate: quotation.createdDate || "",
//     updatedDate: quotation.updatedDate || "",
//     lineItems: quotation.lineItems || [],
//   });
// };


//   // ✅ Handle Form Input Change
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // specialized change for numeric inputs (keeps numbers as numbers)
//   const handleNumberChange = (e) => {
//     const { name, value } = e.target;
//     // allow empty to clear
//     const parsed = value === "" ? "" : parseFloat(value);
//     setFormData((prev) => ({ ...prev, [name]: parsed }));
//   };

//   // handle project dropdown change
//   const handleProjectChange = (e) =>
//     setFormData((prev) => ({ ...prev, projectName: e.value }));

//   // ✅ Handle Save
//   const handleSave = async () => {
//     try {
//       if (!formData || !formData.quotationId) {
//         setMessage({ text: "❌ Missing quotation id.", type: "error" });
//         return;
//       }

//       // Prepare payload: convert date inputs (YYYY-MM-DD) to ISO strings (keep as-is if empty)
//       const payload = {
//         ...formData,
//         billDate: formData.billDate ? new Date(formData.billDate).toISOString() : null,
//         dateOfEstimate: formData.dateOfEstimate
//           ? new Date(formData.dateOfEstimate).toISOString()
//           : null,
//         poDate: formData.poDate ? new Date(formData.poDate).toISOString() : null,
//         updatedDate: new Date().toISOString(),
//       };

//       const res = await fetch(`${API_BASE}/quotations/${formData.quotationId}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
//       if (!res.ok) {
//         const txt = await res.text().catch(() => "");
//         console.error("PUT failed:", res.status, txt);
//         throw new Error("API PUT failed");
//       }

//       // update local state
//       setQuotations((prev) =>
//         prev.map((q) =>
//           q.quotationId === formData.quotationId ? { ...q, ...payload } : q
//         )
//       );

//       // keep editingQuotation open (user requested to stay on edit page)
//       setFormData((prev) => ({ ...prev, updatedDate: new Date().toISOString() }));
//       setMessage({ text: "✅ Quotation updated successfully!", type: "success" });
//     } catch (err) {
//       console.error(err);
//       setMessage({ text: "❌ Failed to update quotation", type: "error" });
//     }
//   };

//   const handleCancel = () => {
//     setEditingQuotation(null);
//     setFormData({});
//     setMessage({ text: "", type: "" });
//   };

//   // ==============================
//   // LIST VIEW (All Quotations Page)
//   // ==============================
//   if (!editingQuotation)
//     return (
//       <div className="container py-4">
//         <div className="d-flex justify-content-end mb-3">
//           <Button themeColor="primary" href="/quotation">
//             + New Quotation
//           </Button>
//         </div>

//         {quotations.length === 0 ? (
//           <p className="text-muted text-center">No quotations found.</p>
//         ) : (
//           <div style={{ overflowX: "auto" }}>
//             <Grid data={quotations} style={{ backgroundColor: "white" }}>
//               <GridColumn field="projectName" title="Project Name" width="250px" />
//               <GridColumn
//                 field="updatedDate"
//                 title="Last Modified At"
//                 width="200px"
//                 cell={(props) => (
//                   <td>
//                     {props.dataItem.updatedDate
//                       ? new Date(props.dataItem.updatedDate).toLocaleString()
//                       : "-"}
//                   </td>
//                 )}
//               />
//               <GridColumn
//                 title="Actions"
//                 width="120px"
//                 cell={(props) => (
//                   <td>
//                     <Button
//                       size="small"
//                       themeColor="primary"
//                       onClick={() => handleEdit(props.dataItem)}
//                     >
//                       Edit
//                     </Button>
//                   </td>
//                 )}
//               />
//             </Grid>
//           </div>
//         )}
//       </div>
//     );

//   // ==============================
//   // EDIT VIEW - structured like New Quotation page
//   // ==============================
//   return (
//     <div className="container-fluid py-3">
//       <Button fillMode="flat" onClick={handleCancel} className="mb-3">
//         ← Back
//       </Button>

// <div className="card p-4 shadow-sm">
//   <h4 className="fw-bold mb-3">Edit Quotation</h4>

//   {/* Projects */}
//   <div className="mb-4">
//     <label className="form-label fw-bold">
//       Projects <span className="text-danger">*</span>
//     </label>
//     <div style={{ maxWidth: "320px" }}>
//       <DropDownList
//         data={projects.map((p) => p.projectName)}
//         value={formData.projectName}
//         onChange={handleProjectChange}
//         defaultItem="Select Option"
//       />
//     </div>
//   </div>

//   {/* Parties & Addresses */}
//   <div>
//     <h6 className="fw-bold mb-3">Parties and Addresses</h6>
//     <div className="row g-3">
//       {/* Billing From */}
//       <div className="col-md-6">
//         <div className="border rounded p-3 h-100">
//           <h6 className="fw-bold mb-2">Billing From (Bilva Interiors)</h6>
//           <textarea
//             name="billingFromAddress"
//             value={formData.billingFromAddress || ""}
//             onChange={handleChange}
//             className="form-control mb-2"
//             placeholder="Address"
//             style={{ height: "100px" }}
//           />
//           <div className="row g-2 mt-2">
//             <div className="col-md-6">
//               <label className="form-label">State Code</label>

//               <input
//                 name="billingFromStateCode"
//                 value={formData.billingFromStateCode || ""}
//                 onChange={handleChange}
//                 className="form-control"
//                 placeholder="State Code"
//               />
//             </div>
//             <div className="col-md-6">
//               <label className="form-label">GSTIN</label>

//               <input
//                 name="billingFromGSTIN"
//                 value={formData.billingFromGSTIN || ""}
//                 onChange={handleChange}
//                 className="form-control"
//                 placeholder="GSTIN"
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Shipping Address */}
//       <div className="col-md-6">
//         <div className="border rounded p-3 h-100">
//           <h6 className="fw-bold mb-2">Shipping Address</h6>
//           <textarea
//             name="shippingAddress"
//             value={formData.shippingAddress || ""}
//             onChange={handleChange}
//             className="form-control mb-2"
//             placeholder="Address"
//             style={{ height: "100px" }}
//           />
//           <div className="row g-2 mt-2">
//             <div className="col-md-6">
//               <label className="form-label">GSTIN</label>

//               <input
//                 name="shippingGSTIN"
//                 value={formData.shippingGSTIN || ""}
//                 onChange={handleChange}
//                 className="form-control"
//                 placeholder="GSTIN"
//               />
//             </div>
//             <div className="col-md-6">
//               <label className="form-label">Brand / Sub-brand</label>

//               <input
//                 name="brandOrSubBrand"
//                 value={formData.brandOrSubBrand || ""}
//                 onChange={handleChange}
//                 className="form-control"
//                 placeholder="Brand / Sub-brand"
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Billing To */}
//       <div className="col-md-6">
//         <div className="border rounded p-3 h-100">
//           <h6 className="fw-bold mb-2">Billing To</h6>
//           <textarea
//             name="billingToAddress"
//             value={formData.billingToAddress || ""}
//             onChange={handleChange}
//             className="form-control mb-2"
//             placeholder="Address"
//             style={{ height: "100px" }}
//           />
//           <div className="row g-2 mt-2">
//             <div className="col-md-6">
//               <label className="form-label">GSTIN (Consignee)</label>

//               <input
//                 name="gstinConsignee"
//                 value={formData.gstinConsignee || formData.billingToConsigneeGSTIN || ""}
//                 onChange={handleChange}
//                 className="form-control"
//                 placeholder="GSTIN (Consignee)"
//               />
//             </div>
//             <div className="col-md-6">
//               <label className="form-label">GSTIN (Buyer)</label>

//               <input
//                 name="gstinBuyer"
//                 value={formData.gstinBuyer || formData.billingToBuyerGSTIN || ""}
//                 onChange={handleChange}
//                 className="form-control"
//                 placeholder="GSTIN (Buyer)"
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Delivery Address */}
//       <div className="col-md-6">
//         <div className="border rounded p-3 h-100">
//           <h6 className="fw-bold mb-2">Delivery Address</h6>
//           <textarea
//             name="deliveryAddress"
//             value={formData.deliveryAddress || ""}
//             onChange={handleChange}
//             className="form-control mb-2"
//             placeholder="Address"
//             style={{ height: "100px" }}
//           />
//           <div className="row g-2 mt-2">
//             <div className="col-md-4">
//               <label className="form-label">Store Code</label>

//               <input
//                 name="storeCode"
//                 value={formData.storeCode || ""}
//                 onChange={handleChange}
//                 className="form-control"
//                 placeholder="Store Code"
//               />
//             </div>
//             <div className="col-md-4">
//               <label className="form-label">SAP Code</label>

//               <input
//                 name="sapCode"
//                 value={formData.sapCode || ""}
//                 onChange={handleChange}
//                 className="form-control"
//                 placeholder="SAP Code"
//               />
//             </div>
//             <div className="col-md-4">
//               <label className="form-label">Vendor Code</label>

//               <input
//                 name="vendorCode"
//                 value={formData.vendorCode || ""}
//                 onChange={handleChange}
//                 className="form-control"
//                 placeholder="Vendor Code"
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>

//   {/* Document Details */}
//   <div className="mt-4">
//     <h6 className="fw-bold mb-3">Document Details</h6>
//     <div className="row g-3 align-items-end">
//       <div className="col-md-3 col-sm-6">
//         <label className="form-label">Bill Number</label>
//         <input
//           name="billNumber"
//           value={formData.billNumber || ""}
//           onChange={handleChange}
//           className="form-control"
//           placeholder="Bill Number"
//           type="text"
//         />
//       </div>

//       <div className="col-md-3 col-sm-6">
//         <label className="form-label">Bill Date</label>
//         <input
//           name="billDate"
//           value={formData.billDate || toDateInputValue(formData.billDate)}
//           onChange={handleChange}
//           className="form-control"
//           type="date"
//         />
//       </div>

//       <div className="col-md-3 col-sm-6">
//         <label className="form-label">GST Number</label>
//         <input
//           name="gstNumber"
//           value={formData.gstNumber || formData.GSTNumber || formData.gstNumber || ""}
//           onChange={handleChange}
//           className="form-control"
//           placeholder="GST Number"
//           type="text"
//         />
//       </div>

//       <div className="col-md-3 col-sm-6">
//         <label className="form-label">PAN</label>
//         <input
//           name="pan"
//           value={formData.pan || ""}
//           onChange={handleChange}
//           className="form-control"
//           placeholder="PAN"
//           type="text"
//         />
//       </div>

//       <div className="col-md-3 col-sm-6">
//         <label className="form-label">Estimate No</label>
//         <input
//           name="estimateNo"
//           value={formData.estimateNo || formData.EstimateNo || ""}
//           onChange={handleChange}
//           className="form-control"
//           placeholder="Estimate No"
//           type="text"
//         />
//       </div>

//       <div className="col-md-3 col-sm-6">
//         <label className="form-label">Date of Estimate</label>
//         <input
//           name="dateOfEstimate"
//           value={formData.dateOfEstimate || toDateInputValue(formData.dateOfEstimate)}
//           onChange={handleChange}
//           className="form-control"
//           type="date"
//         />
//       </div>

//       <div className="col-md-3 col-sm-6">
//         <label className="form-label">Project ID</label>
//         <input
//           name="projectID"
//           value={formData.projectID || formData.projectId || ""}
//           onChange={handleChange}
//           className="form-control"
//           placeholder="Project ID"
//           type="text"
//         />
//       </div>

//       <div className="col-md-3 col-sm-6">
//         <label className="form-label">PO Number</label>
//         <input
//           name="poNumber"
//           value={formData.poNumber || formData.PONumber || ""}
//           onChange={handleChange}
//           className="form-control"
//           placeholder="PO Number"
//           type="text"
//         />
//       </div>

//       <div className="col-md-3 col-sm-6">
//         <label className="form-label">PO Date</label>
//         <input
//           name="poDate"
//           value={formData.poDate || toDateInputValue(formData.poDate)}
//           onChange={handleChange}
//           className="form-control"
//           type="date"
//         />
//       </div>

//       <div className="col-md-3 col-sm-6">
//         <label className="form-label">PO Type</label>
//         <input
//           name="poType"
//           value={formData.poType || formData.POType || ""}
//           onChange={handleChange}
//           className="form-control"
//           placeholder="PO Type"
//         />
//       </div>

//       <div className="col-md-6 col-sm-12">
//         <label className="form-label">Brand Name / Sub-brand</label>
//         <input
//           name="brandNameSubBrand"
//           value={formData.brandNameSubBrand || formData.brandNameSubBrand || formData.brandOrSubBrand || ""}
//           onChange={handleChange}
//           className="form-control"
//           placeholder="Brand Name / Sub-brand"
//         />
//       </div>

//       <div className="col-md-6 col-sm-12">
//         <label className="form-label">Sub(work Description)</label>
//         <input
//           name="subWorkDescription"
//           value={formData.subWorkDescription || formData.subWorkDescription || ""}
//           onChange={handleChange}
//           className="form-control"
//           placeholder="Sub(work Description)"
//         />
//       </div>
//     </div>
//   </div>

//   {/* Line Items (simple read/edit placeholder) */}
//   <div className="mt-4 border rounded p-3">
//     <h6 className="fw-bold mb-2">Line Items</h6>
//     {/* If you have a dedicated EditableLineItemsGrid component, you can replace this simple rendering with that component */}
//     {Array.isArray(formData.lineItems) && formData.lineItems.length > 0 ? (
//       <div className="table-responsive">
//         <table className="table table-sm">
//           <thead>
//             <tr>
//               <th>Material Code</th>
//               <th>HSN Code</th>
//               <th>Description</th>
//               <th>UOM</th>
//               <th>Quantity</th>
//               <th>Rate</th>
//               <th>Amount</th>
//             </tr>
//           </thead>
//           <tbody>
//             {formData.lineItems.map((li, idx) => (
//               <tr key={idx}>
//                 <td><input className="form-control form-control-sm" name={`li_${idx}_materialCode`} value={li.materialCode || ""} onChange={(e) => {
//                   const copy = { ...formData };
//                   copy.lineItems = copy.lineItems.map((r, i) => i === idx ? { ...r, materialCode: e.target.value } : r);
//                   setFormData(copy);
//                 }} /></td>
//                 <td><input className="form-control form-control-sm" name={`li_${idx}_hsnCode`} value={li.hsnCode || ""} onChange={(e) => {
//                   const copy = { ...formData };
//                   copy.lineItems = copy.lineItems.map((r, i) => i === idx ? { ...r, hsnCode: e.target.value } : r);
//                   setFormData(copy);
//                 }} /></td>
//                 <td><input className="form-control form-control-sm" name={`li_${idx}_description`} value={li.description || ""} onChange={(e) => {
//                   const copy = { ...formData };
//                   copy.lineItems = copy.lineItems.map((r, i) => i === idx ? { ...r, description: e.target.value } : r);
//                   setFormData(copy);
//                 }} /></td>
//                 <td><input className="form-control form-control-sm" name={`li_${idx}_uom`} value={li.uom || ""} onChange={(e) => {
//                   const copy = { ...formData };
//                   copy.lineItems = copy.lineItems.map((r, i) => i === idx ? { ...r, uom: e.target.value } : r);
//                   setFormData(copy);
//                 }} /></td>
//                 <td><input className="form-control form-control-sm" type="number" name={`li_${idx}_quantity`} value={li.quantity || ""} onChange={(e) => {
//                   const copy = { ...formData };
//                   copy.lineItems = copy.lineItems.map((r, i) => i === idx ? { ...r, quantity: e.target.value } : r);
//                   setFormData(copy);
//                 }} /></td>
//                 <td><input className="form-control form-control-sm" type="number" name={`li_${idx}_rate`} value={li.rate || ""} onChange={(e) => {
//                   const copy = { ...formData };
//                   copy.lineItems = copy.lineItems.map((r, i) => i === idx ? { ...r, rate: e.target.value } : r);
//                   setFormData(copy);
//                 }} /></td>
//                 <td><input className="form-control form-control-sm" type="number" name={`li_${idx}_amount`} value={li.amount || ""} onChange={(e) => {
//                   const copy = { ...formData };
//                   copy.lineItems = copy.lineItems.map((r, i) => i === idx ? { ...r, amount: e.target.value } : r);
//                   setFormData(copy);
//                 }} /></td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     ) : (
//       <div className="text-muted">No line items</div>
//     )}
//   </div>

//   {/* Tax & Totals */}
//   <div className="mt-4 row">
//     <div className="col-md-6">
//       <h6 className="fw-bold mb-2">Tax Options</h6>
//       <div className="d-flex gap-2 mb-2 align-items-center">
//         <select
//           className="form-select"
//           name="taxOption1"
//           value={formData.taxOption1 || ""}
//           onChange={handleChange}
//           style={{ maxWidth: 220 }}
//         >
//           <option value="">Select Option</option>
//           <option>IGST</option>
//           <option>CGST</option>
//           <option>SGST</option>
//         </select>
//         <input
//           name="taxPercent1"
//           value={formData.taxPercent1 ?? ""}
//           onChange={handleNumberChange}
//           className="form-control"
//           placeholder="%"
//           style={{ width: 100 }}
//           type="number"
//         />
//       </div>

//       <div className="d-flex gap-2 align-items-center">
//         <select
//           className="form-select"
//           name="taxOption2"
//           value={formData.taxOption2 || ""}
//           onChange={handleChange}
//           style={{ maxWidth: 220 }}
//         >
//           <option value="">Select Option</option>
//           <option>IGST</option>
//           <option>CGST</option>
//           <option>SGST</option>
//         </select>
//         <input
//           name="taxPercent2"
//           value={formData.taxPercent2 ?? ""}
//           onChange={handleNumberChange}
//           className="form-control"
//           placeholder="%"
//           style={{ width: 100 }}
//           type="number"
//         />
//       </div>
//     </div>

//     <div className="col-md-6">
//       <h6 className="fw-bold mb-2">Total</h6>
//       <div className="d-flex justify-content-between mb-2">
//         <span>Net Total:</span>
//         <input
//           type="number"
//           name="netTotal"
//           className="form-control w-25"
//           value={formData.netTotal ?? ""}
//           onChange={handleNumberChange}
//         />
//       </div>
//       <div className="d-flex justify-content-between mb-2">
//         <span>IGST:</span>
//         <input
//           type="number"
//           name="igst"
//           className="form-control w-25"
//           value={formData.igst ?? ""}
//           onChange={handleNumberChange}
//         />
//       </div>
//       <div className="d-flex justify-content-between mb-2">
//         <span>Round Off:</span>
//         <input
//           type="number"
//           name="roundOff"
//           className="form-control w-25"
//           value={formData.roundOff ?? ""}
//           onChange={handleNumberChange}
//         />
//       </div>
//       <div className="d-flex justify-content-between fw-bold border-top pt-2 mb-3">
//         <span>Grand Total:</span>
//         <input
//           type="number"
//           name="grandTotal"
//           className="form-control w-25"
//           value={formData.grandTotal ?? ""}
//           onChange={handleNumberChange}
//         />
//       </div>
//     </div>
//   </div>

//   {/* Message */}
//   {message.text && (
//     <div
//       className={`mt-3 text-center fw-semibold ${message.type === "success" ? "text-success" : "text-danger"
//         }`}
//     >
//       {message.text}
//     </div>
//   )}

//   {/* Buttons */}
//   <div className="d-flex justify-content-start gap-2 mt-3 mb-4">
//     <Button themeColor="primary" onClick={handleSave}>
//       Save
//     </Button>
//     <Button type="button" onClick={handleCancel}>
//       Cancel
//     </Button>
//   </div>
// </div>
//     </div>
//   );
// };

// export default AllQuotations_Simple;


// import React, { useEffect, useState } from "react";
// import { Grid, GridColumn } from "@progress/kendo-react-grid";
// import { Button } from "@progress/kendo-react-buttons";
// import { DropDownList } from "@progress/kendo-react-dropdowns";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./AllQuotations.css";

// const AllQuotations_Simple = () => {
//   const API_BASE = "https://localhost:7142/api";
//   const [quotations, setQuotations] = useState([]);
//   const [projects, setProjects] = useState([]);
//   const [editingQuotation, setEditingQuotation] = useState(null);
//   const [formData, setFormData] = useState({});
//   const [message, setMessage] = useState({ text: "", type: "" });
//   const [page, setPage] = useState({ skip: 0, take: 7 });

//   // ✅ Clear message
//   useEffect(() => {
//     if (!message.text) return;
//     const t = setTimeout(() => setMessage({ text: "", type: "" }), 5000);
//     return () => clearTimeout(t);
//   }, [message]);

//   // ✅ Load quotations + projects
//   useEffect(() => {
//     fetch(`${API_BASE}/quotations`)
//       .then((res) => res.json())
//       .then((data) => setQuotations(data))
//       .catch(() => setMessage({ text: "❌ Failed to load quotations", type: "error" }));

//     fetch(`${API_BASE}/projects`)
//       .then((res) => res.json())
//       .then((data) => setProjects(data))
//       .catch(console.error);
//   }, []);

//   const toDateInputValue = (val) => {
//     if (!val) return "";
//     try {
//       const d = new Date(val);
//       if (isNaN(d)) return "";
//       return d.toISOString().slice(0, 10);
//     } catch {
//       return "";
//     }
//   };

//   const handleEdit = (quotation) => {
//     setEditingQuotation(quotation);
//     setFormData({
//       ...quotation,
//       billDate: quotation.billDate ? toDateInputValue(quotation.billDate) : "",
//       dateOfEstimate: quotation.dateOfEstimate ? toDateInputValue(quotation.dateOfEstimate) : "",
//       poDate: quotation.poDate ? toDateInputValue(quotation.poDate) : "",
//       createdDate: quotation.createdDate || "",
//       updatedDate: quotation.updatedDate || "",
//       lineItems: quotation.lineItems || [],
//     });
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleNumberChange = (e) => {
//     const { name, value } = e.target;
//     const parsed = value === "" ? "" : parseFloat(value);
//     setFormData((prev) => ({ ...prev, [name]: parsed }));
//   };

//   const handleProjectChange = (e) =>
//     setFormData((prev) => ({ ...prev, projectName: e.value }));

//   const handleSave = async () => {
//     try {
//       if (!formData || !formData.quotationId) {
//         setMessage({ text: "❌ Missing quotation id.", type: "error" });
//         return;
//       }

//       // Always set current time for updatedDate
//       const currentTime = new Date().toISOString();

//       const payload = {
//         ...formData,
//         billDate: formData.billDate ? new Date(formData.billDate).toISOString() : null,
//         dateOfEstimate: formData.dateOfEstimate ? new Date(formData.dateOfEstimate).toISOString() : null,
//         poDate: formData.poDate ? new Date(formData.poDate).toISOString() : null,
//         updatedDate: currentTime,
//       };

//       const res = await fetch(`${API_BASE}/quotations/${formData.quotationId}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) throw new Error("API PUT failed");

//       // Update local quotations state immediately with new date/time
//       setQuotations((prev) =>
//         prev.map((q) =>
//           q.quotationId === formData.quotationId
//             ? { ...q, ...payload, updatedDate: currentTime }
//             : q
//         )
//       );

//       // Also update formData to reflect latest date
//       setFormData((prev) => ({ ...prev, updatedDate: currentTime }));

//       setMessage({ text: "✅ Quotation updated successfully!", type: "success" });
//     } catch (err) {
//       console.error(err);
//       setMessage({ text: "❌ Failed to update quotation", type: "error" });
//     }
//   };


//   const handleCancel = () => {
//     setEditingQuotation(null);
//     setFormData({});
//     setMessage({ text: "", type: "" });
//   };

//   const handlePageChange = (event) => {
//     setPage(event.page);
//   };

//   const pagedData = quotations.slice(page.skip, page.skip + page.take);

//   // ✅ LIST VIEW
//   if (!editingQuotation) {
//     return (
//       <div className="container py-4">
//         <div className="d-flex justify-content-between align-items-center mb-3">
//           {/* Refresh Button (Left Side) */}
//           <Button
//             icon="refresh"
//             size="small"
//             onClick={() => {
//               fetch(`${API_BASE}/quotations`)
//                 .then((res) => res.json())
//                 .then((data) => setQuotations(data))
//                 .catch(() =>
//                   setMessage({
//                     text: "❌ Failed to refresh quotations",
//                     type: "error",
//                   })
//                 );
//             }}
//             className="action-btn refresh-btn"
//           >
//             <span className="tieup-action-btn-text">Refresh</span>
//           </Button>

//           {/* Add Quotation Button (Right Side) */}
//           <Button themeColor="primary" href="/quotation" size="small">
//             + New Quotation
//           </Button>
//         </div>


//         {quotations.length === 0 ? (
//           <p className="text-muted text-center">No quotations found.</p>
//         ) : (
//           <div
//             className="quotation-grid-wrapper"
//             style={{
//               overflowX: "auto",
//               WebkitOverflowScrolling: "touch",
//               paddingBottom: "10px",
//               maxWidth: "100vw",
//             }}
//           >

//             <div
//               className="quotation-grid-inner"
//               style={{
//                 minWidth: "900px",
//                 overflowX: "auto",
//               }}
//             >
//               <Grid
//                 data={pagedData}
//                 pageable={true}
//                 total={quotations.length}
//                 skip={page.skip}
//                 take={page.take}
//                 onPageChange={handlePageChange}
//               >
//                 <GridColumn field="projectName" title="Project Name" width="100px" />
//                 <GridColumn
//                   field="lastModifiedAt"
//                   title="Last Modified At"
//                   width="180px"
//                   cell={(props) => (
//                     <td>
//                       {props.dataItem.lastModifiedAt
//                         ? new Date(props.dataItem.lastModifiedAt).toLocaleString()
//                         : "-"}
//                     </td>
//                   )}
//                 />
//                 <GridColumn
//                   title="Actions"
//                   width="100px"
//                   cell={(props) => (
//                     <td style={{ textAlign: "center" }}>
//                       <Button
//                         size="small"
//                         themeColor="primary"
//                         onClick={() => handleEdit(props.dataItem)}
//                         style={{
//                           whiteSpace: "nowrap",
//                           padding: "4px 12px",
//                         }}
//                       >
//                         Edit
//                       </Button>
//                     </td>
//                   )}
//                 />


//               </Grid>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   }

//   // ✅ EDIT VIEW
//   return (
//     <div className="container-fluid py-3">
//       <Button fillMode="flat" onClick={handleCancel} className="mb-3">
//         ← Back
//       </Button>

//       {/* ✅ Edit Page UI remains unchanged */}
//       <div className="card p-4 shadow-sm">
//         <h4 className="fw-bold mb-3">Edit Quotation</h4>

//         {/* Projects */}
//         <div className="mb-4">
//           <label className="form-label fw-bold">
//             Projects <span className="text-danger">*</span>
//           </label>
//           <div style={{ maxWidth: "320px" }}>
//             <DropDownList
//               data={projects.map((p) => p.projectName)}
//               value={formData.projectName}
//               onChange={handleProjectChange}
//               defaultItem="Select Option"
//             />
//           </div>
//         </div>

//         {/* Parties & Addresses */}
//         <div>
//           <h6 className="fw-bold mb-3">Parties and Addresses</h6>
//           <div className="row g-3">
//             {/* Billing From */}
//             <div className="col-md-6">
//               <div className="border rounded p-3 h-100">
//                 <h6 className="fw-bold mb-2">Billing From - Bilva Interiors</h6>
//                 <textarea
//                   name="billingFromAddress"
//                   value={formData.billingFromAddress || ""}
//                   onChange={handleChange}
//                   className="form-control mb-2"
//                   placeholder="Address"
//                   style={{ height: "100px" }}
//                 />
//                 <div className="row g-2 mt-2">
//                   <div className="col-md-6">
//                     <label className="form-label">State Code</label>

//                     <input
//                       name="billingFromStateCode"
//                       value={formData.billingFromStateCode || ""}
//                       onChange={handleChange}
//                       className="form-control"
//                       placeholder="State Code"
//                     />
//                   </div>
//                   <div className="col-md-6">
//                     <label className="form-label">GSTIN</label>

//                     <input
//                       name="billingFromGSTIN"
//                       value={formData.billingFromGSTIN || ""}
//                       onChange={handleChange}
//                       className="form-control"
//                       placeholder="GSTIN"
//                     />
//                   </div>

//                 </div>
//               </div>
//             </div>

//             {/* Shipping Address */}
//             <div className="col-md-6">
//               <div className="border rounded p-3 h-100">
//                 <h6 className="fw-bold mb-2">Shipping Address</h6>
//                 <textarea
//                   name="shippingAddress"
//                   value={formData.shippingAddress || ""}
//                   onChange={handleChange}
//                   className="form-control mb-2"
//                   placeholder="Address"
//                   style={{ height: "100px" }}
//                 />
//                 <div className="row g-2 mt-2">
//                   <div className="col-md-6">
//                     <label className="form-label">GSTIN</label>

//                     <input
//                       name="shippingGSTIN"
//                       value={formData.shippingGSTIN || ""}
//                       onChange={handleChange}
//                       className="form-control"
//                       placeholder="GSTIN"
//                     />
//                   </div>
//                   <div className="col-md-6">
//                     <label className="form-label">Brand / Sub-brand</label>

//                     <input
//                       name="brandOrSubBrand"
//                       value={formData.brandOrSubBrand || ""}
//                       onChange={handleChange}
//                       className="form-control"
//                       placeholder="Brand / Sub-brand"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Billing To */}
//             <div className="col-md-6">
//               <div className="border rounded p-3 h-100">
//                 <h6 className="fw-bold mb-2">Billing To</h6>
//                 <textarea
//                   name="billingToAddress"
//                   value={formData.billingToAddress || ""}
//                   onChange={handleChange}
//                   className="form-control mb-2"
//                   placeholder="Address"
//                   style={{ height: "100px" }}
//                 />
//                 <div className="row g-2 mt-2">
//                   <div className="col-md-6">
//                     <label className="form-label">GSTIN (Consignee)</label>

//                     <input
//                       name="gstinConsignee"
//                       value={formData.gstinConsignee || formData.billingToConsigneeGSTIN || ""}
//                       onChange={handleChange}
//                       className="form-control"
//                       placeholder="GSTIN (Consignee)"
//                     />
//                   </div>
//                   <div className="col-md-6">
//                     <label className="form-label">GSTIN (Buyer)</label>

//                     <input
//                       name="gstinBuyer"
//                       value={formData.gstinBuyer || formData.billingToBuyerGSTIN || ""}
//                       onChange={handleChange}
//                       className="form-control"
//                       placeholder="GSTIN (Buyer)"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Delivery Address */}
//             <div className="col-md-6">
//               <div className="border rounded p-3 h-100">
//                 <h6 className="fw-bold mb-2">Delivery Address</h6>
//                 <textarea
//                   name="deliveryAddress"
//                   value={formData.deliveryAddress || ""}
//                   onChange={handleChange}
//                   className="form-control mb-2"
//                   placeholder="Address"
//                   style={{ height: "100px" }}
//                 />
//                 <div className="row g-2 mt-2">
//                   <div className="col-md-4">
//                     <label className="form-label">Store Code</label>

//                     <input
//                       name="storeCode"
//                       value={formData.storeCode || ""}
//                       onChange={handleChange}
//                       className="form-control"
//                     />
//                   </div>
//                   <div className="col-md-4">
//                     <label className="form-label">SAP Code</label>

//                     <input
//                       name="sapCode"
//                       value={formData.sapCode || ""}
//                       onChange={handleChange}
//                       className="form-control"
//                     />
//                   </div>
//                   <div className="col-md-4">
//                     <label className="form-label">Vendor Code</label>

//                     <input
//                       name="vendorCode"
//                       value={formData.vendorCode || ""}
//                       onChange={handleChange}
//                       className="form-control"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Document Details */}
//         <div className="mt-4">
//           <h6 className="fw-bold mb-3">Document Details</h6>
//           <div className="row g-3 align-items-end">
//             <div className="col-md-3 col-sm-6">
//               <label className="form-label">Bill Number</label>
//               <input
//                 name="billNumber"
//                 value={formData.billNumber || ""}
//                 onChange={handleChange}
//                 className="form-control"
//                 type="text"
//               />
//             </div>

//             <div className="col-md-3 col-sm-6">
//               <label className="form-label">Bill Date</label>
//               <input
//                 name="billDate"
//                 value={formData.billDate || toDateInputValue(formData.billDate)}
//                 onChange={handleChange}
//                 className="form-control"
//                 type="date"
//               />
//             </div>

//             <div className="col-md-3 col-sm-6">
//               <label className="form-label">GST Number</label>
//               <input
//                 name="gstNumber"
//                 value={formData.gstNumber || formData.GSTNumber || formData.gstNumber || ""}
//                 onChange={handleChange}
//                 className="form-control"
//                 type="text"
//               />
//             </div>

//             <div className="col-md-3 col-sm-6">
//               <label className="form-label">PAN</label>
//               <input
//                 name="pan"
//                 value={formData.pan || ""}
//                 onChange={handleChange}
//                 className="form-control"
//                 type="text"
//               />
//             </div>

//             <div className="col-md-3 col-sm-6">
//               <label className="form-label">Invoice No</label>
//               <input
//                 name="estimateNo"
//                 value={formData.estimateNo || formData.EstimateNo || ""}
//                 onChange={handleChange}
//                 className="form-control"
//                 type="text"
//               />
//             </div>

//             <div className="col-md-3 col-sm-6">
//               <label className="form-label">Date of Invoice</label>
//               <input
//                 name="dateOfEstimate"
//                 value={formData.dateOfEstimate || toDateInputValue(formData.dateOfEstimate)}
//                 onChange={handleChange}
//                 className="form-control"
//                 type="date"
//               />
//             </div>

//             <div className="col-md-3 col-sm-6">
//               <label className="form-label">Project ID</label>
//               <input
//                 name="projectID"
//                 value={formData.projectID || formData.projectId || ""}
//                 onChange={handleChange}
//                 className="form-control"
//                 type="text"
//               />
//             </div>

//             <div className="col-md-3 col-sm-6">
//               <label className="form-label">PO Number</label>
//               <input
//                 name="poNumber"
//                 value={formData.poNumber || formData.PONumber || ""}
//                 onChange={handleChange}
//                 className="form-control"

//                 type="text"
//               />
//             </div>

//             <div className="col-md-3 col-sm-6">
//               <label className="form-label">PO Date</label>
//               <input
//                 name="poDate"
//                 value={formData.poDate || toDateInputValue(formData.poDate)}
//                 onChange={handleChange}
//                 className="form-control"
//                 type="date"
//               />
//             </div>

//             <div className="col-md-3 col-sm-6">
//               <label className="form-label">PO Type</label>
//               <input
//                 name="poType"
//                 value={formData.poType || formData.POType || ""}
//                 onChange={handleChange}
//                 className="form-control"

//               />
//             </div>

//             <div className="col-md-6 col-sm-12">
//               <label className="form-label">Brand Name / Sub-brand</label>
//               <input
//                 name="brandNameSubBrand"
//                 value={formData.brandNameSubBrand || formData.brandNameSubBrand || formData.brandOrSubBrand || ""}
//                 onChange={handleChange}
//                 className="form-control"

//               />
//             </div>

//             <div className="col-md-6 col-sm-12">
//               <label className="form-label">Sub(work Description)</label>
//               <input
//                 name="subWorkDescription"
//                 value={formData.subWorkDescription || formData.subWorkDescription || ""}
//                 onChange={handleChange}
//                 className="form-control"
//               />
//             </div>
//           </div>
//         </div>

//         {/* ✅ Line Items Section with Add & Delete buttons */}
//         <div className="mt-4 border rounded p-3 position-relative">
//           <div className="d-flex justify-content-between align-items-center mb-2">
//             <h6 className="fw-bold mb-0">Line Items</h6>

//             {/* ✅ Add Line Item Button (top-right) */}
//             <Button
//               size="small"
//               themeColor="primary"
//               onClick={() => {
//                 setFormData((prev) => ({
//                   ...prev,
//                   lineItems: [
//                     ...(prev.lineItems || []),
//                     {
//                       materialCode: "",
//                       hsnCode: "",
//                       description: "",
//                       uom: "",
//                       quantity: "",
//                       rate: "",
//                       amount: "",
//                     },
//                   ],
//                 }));
//               }}
//             >
//               + Add Line Item
//             </Button>
//           </div>

//           {Array.isArray(formData.lineItems) && formData.lineItems.length > 0 ? (
//             <div className="table-responsive">
//               <table className="table table-sm table-bordered align-middle">
//                 <thead className="table-light">
//                   <tr>
//                     <th>Material Code</th>
//                     <th>HSN Code</th>
//                     <th>Description</th>
//                     <th>UOM</th>
//                     <th>Quantity</th>
//                     <th>Rate</th>
//                     <th>Amount</th>
//                     <th style={{ width: "80px", textAlign: "center" }}>Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {formData.lineItems.map((li, idx) => (
//                     <tr key={idx}>
//                       <td>
//                         <input
//                           className="form-control form-control-sm"
//                           value={li.materialCode || ""}
//                           onChange={(e) => {
//                             const copy = { ...formData };
//                             copy.lineItems[idx].materialCode = e.target.value;
//                             setFormData(copy);
//                           }}
//                         />
//                       </td>
//                       <td>
//                         <input
//                           className="form-control form-control-sm"
//                           value={li.hsnCode || ""}
//                           onChange={(e) => {
//                             const copy = { ...formData };
//                             copy.lineItems[idx].hsnCode = e.target.value;
//                             setFormData(copy);
//                           }}
//                         />
//                       </td>
//                       <td>
//                         <input
//                           className="form-control form-control-sm"
//                           value={li.description || ""}
//                           onChange={(e) => {
//                             const copy = { ...formData };
//                             copy.lineItems[idx].description = e.target.value;
//                             setFormData(copy);
//                           }}
//                         />
//                       </td>
//                       <td>
//                         <input
//                           className="form-control form-control-sm"
//                           value={li.uom || ""}
//                           onChange={(e) => {
//                             const copy = { ...formData };
//                             copy.lineItems[idx].uom = e.target.value;
//                             setFormData(copy);
//                           }}
//                         />
//                       </td>
//                       <td>
//                         <input
//                           type="number"
//                           className="form-control form-control-sm"
//                           value={li.quantity || ""}
//                           onChange={(e) => {
//                             const copy = { ...formData };
//                             copy.lineItems[idx].quantity = e.target.value;
//                             setFormData(copy);
//                           }}
//                         />
//                       </td>
//                       <td>
//                         <input
//                           type="number"
//                           className="form-control form-control-sm"
//                           value={li.rate || ""}
//                           onChange={(e) => {
//                             const copy = { ...formData };
//                             copy.lineItems[idx].rate = e.target.value;
//                             setFormData(copy);
//                           }}
//                         />
//                       </td>
//                       <td>
//                         <input
//                           type="number"
//                           className="form-control form-control-sm"
//                           value={li.amount || ""}
//                           onChange={(e) => {
//                             const copy = { ...formData };
//                             copy.lineItems[idx].amount = e.target.value;
//                             setFormData(copy);
//                           }}
//                         />
//                       </td>

//                       {/* ✅ Delete Button (after Amount column) */}
//                       <td style={{ textAlign: "center" }}>
//                         <Button
//                           size="small"
//                           themeColor="error"
//                           fillMode="outline"
//                           onClick={() => {
//                             const copy = { ...formData };
//                             copy.lineItems = copy.lineItems.filter((_, i) => i !== idx);
//                             setFormData(copy);
//                           }}
//                         >
//                           🗑️
//                         </Button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <div className="text-muted">No line items</div>
//           )}
//         </div>


//         {/* Tax & Totals */}
//         <div className="mt-4 row">
//           <div className="col-md-6">
//             <h6 className="fw-bold mb-2">Tax</h6>

//             {/* IGST */}
//             <div className="d-flex gap-2 mb-2 align-items-center">
//               <label className="fw-semibold" style={{ minWidth: 80 }}>
//                 IGST
//               </label>
//               <input
//                 name="igstPercent"
//                 value={formData.igstPercent ?? ""}
//                 onChange={handleNumberChange}
//                 className="form-control"
//                 placeholder="%"
//                 style={{ width: 100 }}
//                 type="number"
//               />
//             </div>

//             {/* CGST */}
//             <div className="d-flex gap-2 mb-2 align-items-center">
//               <label className="fw-semibold" style={{ minWidth: 80 }}>
//                 CGST
//               </label>
//               <input
//                 name="cgstPercent"
//                 value={formData.cgstPercent ?? ""}
//                 onChange={handleNumberChange}
//                 className="form-control"
//                 placeholder="%"
//                 style={{ width: 100 }}
//                 type="number"
//               />
//             </div>

//             {/* SGST */}
//             <div className="d-flex gap-2 align-items-center">
//               <label className="fw-semibold" style={{ minWidth: 80 }}>
//                 SGST
//               </label>
//               <input
//                 name="sgstPercent"
//                 value={formData.sgstPercent ?? ""}
//                 onChange={handleNumberChange}
//                 className="form-control"
//                 placeholder="%"
//                 style={{ width: 100 }}
//                 type="number"
//               />
//             </div>
//           </div>


//           <div className="col-md-6">
//             <h6 className="fw-bold mb-2">Total</h6>
//             <div className="d-flex justify-content-between mb-2">
//               <span>Net Total:</span>
//               <input
//                 type="number"
//                 name="netTotal"
//                 className="form-control w-25"
//                 value={formData.netTotal ?? ""}
//                 onChange={handleNumberChange}
//               />
//             </div>
//             <div className="d-flex justify-content-between mb-2">
//               <span>Tax Total:</span>
//               <input
//                 type="number"
//                 name="igst"
//                 className="form-control w-25"
//                 value={formData.igst ?? ""}
//                 onChange={handleNumberChange}
//               />
//             </div>
//             <div className="d-flex justify-content-between mb-2">
//               <span>Round Off:</span>
//               <input
//                 type="number"
//                 name="roundOff"
//                 className="form-control w-25"
//                 value={formData.roundOff ?? ""}
//                 onChange={handleNumberChange}
//               />
//             </div>
//             <div className="d-flex justify-content-between fw-bold border-top pt-2 mb-3">
//               <span>Grand Total:</span>
//               <input
//                 type="number"
//                 name="grandTotal"
//                 className="form-control w-25"
//                 value={formData.grandTotal ?? ""}
//                 onChange={handleNumberChange}
//               />
//             </div>
//           </div>
//         </div>

//         {/* Message */}
//         {message.text && (
//           <div
//             className={`mt-3 text-center fw-semibold ${message.type === "success" ? "text-success" : "text-danger"
//               }`}
//           >
//             {message.text}
//           </div>
//         )}

//         {/* Buttons */}
//         <div className="button-group mt-3 mb-4">
//           <Button themeColor="primary" onClick={handleSave}>
//             Save
//           </Button>
//           <Button type="button" onClick={handleCancel}>
//             Cancel
//           </Button>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default AllQuotations_Simple;


// import React, { useEffect, useState } from "react";
// import { Grid, GridColumn } from "@progress/kendo-react-grid";
// import { Button } from "@progress/kendo-react-buttons";
// import { DropDownList } from "@progress/kendo-react-dropdowns";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./AllQuotations.css";

// // <-- ADDED: Import your new Quotation component
// import Quotations from "./Quotations.jsx";

// const AllQuotations_Simple = () => {
//   const API_BASE = "https://localhost:7142/api";
//   const [quotations, setQuotations] = useState([]);
//   const [projects, setProjects] = useState([]);
//   const [editingQuotation, setEditingQuotation] = useState(null);
//   const [formData, setFormData] = useState({});
//   const [message, setMessage] = useState({ text: "", type: "" });
//   const [page, setPage] = useState({ skip: 0, take: 7 });

//   // <-- ADDED: State to control showing the "New Quotation" page
//   const [showNew, setShowNew] = useState(false);

//   // ✅ Clear message
//   useEffect(() => {
//     if (!message.text) return;
//     const t = setTimeout(() => setMessage({ text: "", type: "" }), 5000);
//     return () => clearTimeout(t);
//   }, [message]);

//   // ✅ Load quotations + projects
//   useEffect(() => {
//     fetch(`${API_BASE}/quotations`)
//       .then((res) => res.json())
//       .then((data) => setQuotations(data))
//       .catch(() => setMessage({ text: "❌ Failed to load quotations", type: "error" }));

//     fetch(`${API_BASE}/projects`)
//       .then((res) => res.json())
//       .then((data) => setProjects(data))
//       .catch(console.error);
//   }, []);

//   const toDateInputValue = (val) => {
//     if (!val) return "";
//     try {
//       const d = new Date(val);
//       if (isNaN(d)) return "";
//       return d.toISOString().slice(0, 10);
//     } catch {
//       return "";
//     }
//   };

//   const handleEdit = (quotation) => {
//     setEditingQuotation(quotation);
//     setFormData({
//       ...quotation,
//       billDate: quotation.billDate ? toDateInputValue(quotation.billDate) : "",
//       dateOfEstimate: quotation.dateOfEstimate ? toDateInputValue(quotation.dateOfEstimate) : "",
//       poDate: quotation.poDate ? toDateInputValue(quotation.poDate) : "",
//       createdDate: quotation.createdDate || "",
//       updatedDate: quotation.updatedDate || "",
//       lineItems: quotation.lineItems || [],
//     });
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleNumberChange = (e) => {
//     const { name, value } = e.target;
//     const parsed = value === "" ? "" : parseFloat(value);
//     setFormData((prev) => ({ ...prev, [name]: parsed }));
//   };

//   const handleProjectChange = (e) =>
//     setFormData((prev) => ({ ...prev, projectName: e.value }));

//   const handleSave = async () => {
//     try {
//       if (!formData || !formData.quotationId) {
//         setMessage({ text: "❌ Missing quotation id.", type: "error" });
//         return;
//       }

//       // Always set current time for updatedDate
//       const currentTime = new Date().toISOString();

//       const payload = {
//         ...formData,
//         billDate: formData.billDate ? new Date(formData.billDate).toISOString() : null,
//         dateOfEstimate: formData.dateOfEstimate ? new Date(formData.dateOfEstimate).toISOString() : null,
//         poDate: formData.poDate ? new Date(formData.poDate).toISOString() : null,
//         updatedDate: currentTime,
//       };

//       const res = await fetch(`${API_BASE}/quotations/${formData.quotationId}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) throw new Error("API PUT failed");

//       // Update local quotations state immediately with new date/time
//       setQuotations((prev) =>
//         prev.map((q) =>
//           q.quotationId === formData.quotationId
//             ? { ...q, ...payload, updatedDate: currentTime }
//             : q
//         )
//       );

//       // Also update formData to reflect latest date
//       setFormData((prev) => ({ ...prev, updatedDate: currentTime }));

//       setMessage({ text: "✅ Quotation updated successfully!", type: "success" });
//     } catch (err) {
//       console.error(err);
//       setMessage({ text: "❌ Failed to update quotation", type: "error" });
//     }
//   };


//   const handleCancel = () => {
//     setEditingQuotation(null);
//     setFormData({});
//     setMessage({ text: "", type: "" });
//   };

//   const handlePageChange = (event) => {
//     setPage(event.page);
//   };

//   const pagedData = quotations.slice(page.skip, page.skip + page.take);

//   // <-- ADDED: This block handles showing the "New Quotation" page
//   // It passes a function `onBack` that Quotations.jsx can call.
//   if (showNew) {
//     return <Quotations onBack={() => setShowNew(false)} />;
//   }

//   // ✅ LIST VIEW (This is your original logic)
//   if (!editingQuotation) {
//     return (
//       <div className="container py-4">
//         <div className="d-flex justify-content-between align-items-center mb-3">
//           {/* Refresh Button (Left Side) */}
//           <Button
//             icon="refresh"
//             size="small"
//             onClick={() => {
//               fetch(`${API_BASE}/quotations`)
//                 .then((res) => res.json())
//                 .then((data) => setQuotations(data))
//                 .catch(() =>
//                   setMessage({
//                     text: "❌ Failed to refresh quotations",
//                     type: "error",
//                   })
//                 );
//             }}
//             className="action-btn refresh-btn"
//           >
//             <span className="tieup-action-btn-text">Refresh</span>
//           </Button>

//           {/* <-- CHANGED: Removed href, added onClick to set state */}
//           <Button
//             themeColor="primary"
//             onClick={() => setShowNew(true)}
//             size="small"
//           >
//             + New Quotation
//           </Button>
//         </div>


//         {quotations.length === 0 ? (
//           <p className="text-muted text-center">No quotations found.</p>
//         ) : (
//           <div
//             className="quotation-grid-wrapper"
//             style={{
//               overflowX: "auto",
//               WebkitOverflowScrolling: "touch",
//               paddingBottom: "10px",
//               maxWidth: "100vw",
//             }}
//           >

//             <div
//               className="quotation-grid-inner"
//               style={{
//                 minWidth: "900px",
//                 overflowX: "auto",
//               }}
//             >
//               <Grid
//                 data={pagedData}
//                 pageable={true}
//                 total={quotations.length}
//                 skip={page.skip}
//                 take={page.take}
//                 onPageChange={handlePageChange}
//               >
//                 <GridColumn field="projectName" title="Project Name" width="100px" />
//                 <GridColumn
//                   field="lastModifiedAt"
//                   title="Last Modified At"
//                   width="180px"
//                   cell={(props) => (
//                     <td>
//                       {props.dataItem.lastModifiedAt
//                         ? new Date(props.dataItem.lastModifiedAt).toLocaleString()
//                         : "-"}
//                     </td>
//                   )}
//                 />
//                 <GridColumn
//                   title="Actions"
//                   width="100px"
//                   cell={(props) => (
//                     <td style={{ textAlign: "center" }}>
//                       <Button
//                         size="small"
//                         themeColor="primary"
//                         onClick={() => handleEdit(props.dataItem)}
//                         style={{
//                           whiteSpace: "nowrap",
//                           padding: "4px 12px",
//                         }}
//                       >
//                         Edit
//                       </Button>
//                     </td>
//                   )}
//                 />


//               </Grid>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   }

//   // ✅ EDIT VIEW (This is your original logic, unchanged)
//   return (
//     <div className="container-fluid py-3">
//       <Button fillMode="flat" onClick={handleCancel} className="mb-3">
//         ← Back
//       </Button>

//       {/* ✅ Edit Page UI remains unchanged */}
//       <div className="card p-4 shadow-sm">
//         <h4 className="fw-bold mb-3">Edit Quotation</h4>

//         {/* Projects */}
//         <div className="mb-4">
//           <label className="form-label fw-bold">
//             Projects <span className="text-danger">*</span>
//           </label>
//           <div style={{ maxWidth: "320px" }}>
//             <DropDownList
//               data={projects.map((p) => p.projectName)}
//               value={formData.projectName}
//               onChange={handleProjectChange}
//               defaultItem="Select Option"
//             />
//           </div>
//         </div>

//         {/* Parties & Addresses */}
//         <div>
//           <h6 className="fw-bold mb-3">Parties and Addresses</h6>
//           <div className="row g-3">
//             {/* Billing From */}
//             <div className="col-md-6">
//               <div className="border rounded p-3 h-100">
//                 <h6 className="fw-bold mb-2">Billing From - Bilva Interiors</h6>
//                 <textarea
//                   name="billingFromAddress"
//                   value={formData.billingFromAddress || ""}
//                   onChange={handleChange}
//                   className="form-control mb-2"
//                   placeholder="Address"
//                   style={{ height: "100px" }}
//                 />
//                 <div className="row g-2 mt-2">
//                   <div className="col-md-6">
//                     <label className="form-label">State Code</label>

//                     <input
//                       name="billingFromStateCode"
//                       value={formData.billingFromStateCode || ""}
//                       onChange={handleChange}
//                       className="form-control"
//                       placeholder="State Code"
//                     />
//                   </div>
//                   <div className="col-md-6">
//                     <label className="form-label">GSTIN</label>

//                     <input
//                       name="billingFromGSTIN"
//                       value={formData.billingFromGSTIN || ""}
//                       onChange={handleChange}
//                       className="form-control"
//                       placeholder="GSTIN"
//                     />
//                   </div>

//                 </div>
//               </div>
//             </div>

//             {/* Shipping Address */}
//             <div className="col-md-6">
//               <div className="border rounded p-3 h-100">
//                 <h6 className="fw-bold mb-2">Shipping Address</h6>
//                 <textarea
//                   name="shippingAddress"
//                   value={formData.shippingAddress || ""}
//                   onChange={handleChange}
//                   className="form-control mb-2"
//                   placeholder="Address"
//                   style={{ height: "100px" }}
//                 />
//                 <div className="row g-2 mt-2">
//                   <div className="col-md-6">
//                     <label className="form-label">GSTIN</label>

//                     <input
//                       name="shippingGSTIN"
//                       value={formData.shippingGSTIN || ""}
//                       onChange={handleChange}
//                       className="form-control"
//                       placeholder="GSTIN"
//                     />
//                   </div>
//                   <div className="col-md-6">
//                     <label className="form-label">Brand / Sub-brand</label>

//                     <input
//                       name="brandOrSubBrand"
//                       value={formData.brandOrSubBrand || ""}
//                       onChange={handleChange}
//                       className="form-control"
//                       placeholder="Brand / Sub-brand"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Billing To */}
//             <div className="col-md-6">
//               <div className="border rounded p-3 h-100">
//                 <h6 className="fw-bold mb-2">Billing To</h6>
//                 <textarea
//                   name="billingToAddress"
//                   value={formData.billingToAddress || ""}
//                   onChange={handleChange}
//                   className="form-control mb-2"
//                   placeholder="Address"
//                   style={{ height: "100px" }}
//                 />
//                 <div className="row g-2 mt-2">
//                   <div className="col-md-6">
//                     <label className="form-label">GSTIN (Consignee)</label>

//                     <input
//                       name="gstinConsignee"
//                       value={formData.gstinConsignee || formData.billingToConsigneeGSTIN || ""}
//                       onChange={handleChange}
//                       className="form-control"
//                       placeholder="GSTIN (Consignee)"
//                     />
//                   </div>
//                   <div className="col-md-6">
//                     <label className="form-label">GSTIN (Buyer)</label>

//                     <input
//                       name="gstinBuyer"
//                       value={formData.gstinBuyer || formData.billingToBuyerGSTIN || ""}
//                       onChange={handleChange}
//                       className="form-control"
//                       placeholder="GSTIN (Buyer)"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Delivery Address */}
//             <div className="col-md-6">
//               <div className="border rounded p-3 h-100">
//                 <h6 className="fw-bold mb-2">Delivery Address</h6>
//                 <textarea
//                   name="deliveryAddress"
//                   value={formData.deliveryAddress || ""}
//                   onChange={handleChange}
//                   className="form-control mb-2"
//                   placeholder="Address"
//                   style={{ height: "100px" }}
//                 />
//                 <div className="row g-2 mt-2">
//                   <div className="col-md-4">
//                     <label className="form-label">Store Code</label>

//                     <input
//                       name="storeCode"
//                       value={formData.storeCode || ""}
//                       onChange={handleChange}
//                       className="form-control"
//                     />
//                   </div>
//                   <div className="col-md-4">
//                     <label className="form-label">SAP Code</label>

//                     <input
//                       name="sapCode"
//                       value={formData.sapCode || ""}
//                       onChange={handleChange}
//                       className="form-control"
//                     />
//                   </div>
//                   <div className="col-md-4">
//                     <label className="form-label">Vendor Code</label>

//                     <input
//                       name="vendorCode"
//                       value={formData.vendorCode || ""}
//                       onChange={handleChange}
//                       className="form-control"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Document Details */}
//         <div className="mt-4">
//           <h6 className="fw-bold mb-3">Document Details</h6>
//           <div className="row g-3 align-items-end">
//             <div className="col-md-3 col-sm-6">
//               <label className="form-label">Bill Number</label>
//               <input
//                 name="billNumber"
//                 value={formData.billNumber || ""}
//                 onChange={handleChange}
//                 className="form-control"
//                 type="text"
//               />
//             </div>

//             <div className="col-md-3 col-sm-6">
//               <label className="form-label">Bill Date</label>
//               <input
//                 name="billDate"
//                 value={formData.billDate || toDateInputValue(formData.billDate)}
//                 onChange={handleChange}
//                 className="form-control"
//                 type="date"
//               />
//             </div>

//             <div className="col-md-3 col-sm-6">
//               <label className="form-label">GST Number</label>
//               <input
//                 name="gstNumber"
//                 value={formData.gstNumber || formData.GSTNumber || formData.gstNumber || ""}
//                 onChange={handleChange}
//                 className="form-control"
//                 type="text"
//               />
//             </div>

//             <div className="col-md-3 col-sm-6">
//               <label className="form-label">PAN</label>
//               <input
//                 name="pan"
//                 value={formData.pan || ""}
//                 onChange={handleChange}
//                 className="form-control"
//                 type="text"
//               />
//             </div>

//             <div className="col-md-3 col-sm-6">
//               <label className="form-label">Invoice No</label>
//               <input
//                 name="estimateNo"
//                 value={formData.estimateNo || formData.EstimateNo || ""}
//                 onChange={handleChange}
//                 className="form-control"
//                 type="text"
//               />
//             </div>

//             <div className="col-md-3 col-sm-6">
//               <label className="form-label">Date of Invoice</label>
//               <input
//                 name="dateOfEstimate"
//                 value={formData.dateOfEstimate || toDateInputValue(formData.dateOfEstimate)}
//                 onChange={handleChange}
//                 className="form-control"
//                 type="date"
//               />
//             </div>

//             <div className="col-md-3 col-sm-6">
//               <label className="form-label">Project ID</label>
//               <input
//                 name="projectID"
//                 value={formData.projectID || formData.projectId || ""}
//                 onChange={handleChange}
//                 className="form-control"
//                 type="text"
//               />
//             </div>

//             <div className="col-md-3 col-sm-6">
//               <label className="form-label">PO Number</label>
//               <input
//                 name="poNumber"
//                 value={formData.poNumber || formData.PONumber || ""}
//                 onChange={handleChange}
//                 className="form-control"

//                 type="text"
//               />
//             </div>

//             <div className="col-md-3 col-sm-6">
//               <label className="form-label">PO Date</label>
//               <input
//                 name="poDate"
//                 value={formData.poDate || toDateInputValue(formData.poDate)}
//                 onChange={handleChange}
//                 className="form-control"
//                 type="date"
//               />
//             </div>

//             <div className="col-md-3 col-sm-6">
//               <label className="form-label">PO Type</label>
//               <input
//                 name="poType"
//                 value={formData.poType || formData.POType || ""}
//                 onChange={handleChange}
//                 className="form-control"

//               />
//             </div>

//             <div className="col-md-6 col-sm-12">
//               <label className="form-label">Brand Name / Sub-brand</label>
//               <input
//                 name="brandNameSubBrand"
//                 value={formData.brandNameSubBrand || formData.brandNameSubBrand || formData.brandOrSubBrand || ""}
//                 onChange={handleChange}
//                 className="form-control"

//               />
//             </div>

//             <div className="col-md-6 col-sm-12">
//               <label className="form-label">Sub(work Description)</label>
//               <input
//                 name="subWorkDescription"
//                 value={formData.subWorkDescription || formData.subWorkDescription || ""}
//                 onChange={handleChange}
//                 className="form-control"
//               />
//             </div>
//           </div>
//         </div>

//         {/* ✅ Line Items Section with Add & Delete buttons */}
//         <div className="mt-4 border rounded p-3 position-relative">
//           <div className="d-flex justify-content-between align-items-center mb-2">
//             <h6 className="fw-bold mb-0">Line Items</h6>

//             {/* ✅ Add Line Item Button (top-right) */}
//             <Button
//               size="small"
//               themeColor="primary"
//               onClick={() => {
//                 setFormData((prev) => ({
//                   ...prev,
//                   lineItems: [
//                     ...(prev.lineItems || []),
//                     {
//                       materialCode: "",
//                       hsnCode: "",
//                       description: "",
//                       uom: "",
//                       quantity: "",
//                       rate: "",
//                       amount: "",
//                     },
//                   ],
//                 }));
//               }}
//             >
//               + Add Line Item
//             </Button>
//           </div>

//           {Array.isArray(formData.lineItems) && formData.lineItems.length > 0 ? (
//             <div className="table-responsive">
//               <table className="table table-sm table-bordered align-middle">
//                 <thead className="table-light">
//                   <tr>
//                     <th>Material Code</th>
//                     <th>HSN Code</th>
//                     <th>Description</th>
//                     <th>UOM</th>
//                     <th>Quantity</th>
//                     <th>Rate</th>
//                     <th>Amount</th>
//                     <th style={{ width: "80px", textAlign: "center" }}>Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {formData.lineItems.map((li, idx) => (
//                     <tr key={idx}>
//                       <td>
//                         <input
//                           className="form-control form-control-sm"
//                           value={li.materialCode || ""}
//                           onChange={(e) => {
//                             const copy = { ...formData };
//                             copy.lineItems[idx].materialCode = e.target.value;
//                             setFormData(copy);
//                           }}
//                         />
//                       </td>
//                       <td>
//                         <input
//                           className="form-control form-control-sm"
//                           value={li.hsnCode || ""}
//                           onChange={(e) => {
//                             const copy = { ...formData };
//                             copy.lineItems[idx].hsnCode = e.target.value;
//                             setFormData(copy);
//                           }}
//                         />
//                       </td>
//                       <td>
//                         <input
//                           className="form-control form-control-sm"
//                           value={li.description || ""}
//                           onChange={(e) => {
//                             const copy = { ...formData };
//                             copy.lineItems[idx].description = e.target.value;
//                             setFormData(copy);
//                           }}
//                         />
//                       </td>
//                       <td>
//                         <input
//                           className="form-control form-control-sm"
//                           value={li.uom || ""}
//                           onChange={(e) => {
//                             const copy = { ...formData };
//                             copy.lineItems[idx].uom = e.target.value;
//                             setFormData(copy);
//                           }}
//                         />
//                       </td>
//                       <td>
//                         <input
//                           type="number"
//                           className="form-control form-control-sm"
//                           value={li.quantity || ""}
//                           onChange={(e) => {
//                             const copy = { ...formData };
//                             copy.lineItems[idx].quantity = e.target.value;
//                             setFormData(copy);
//                           }}
//                         />
//                       </td>
//                       <td>
//                         <input
//                           type="number"
//                           className="form-control form-control-sm"
//                           value={li.rate || ""}
//                           onChange={(e) => {
//                             const copy = { ...formData };
//                             copy.lineItems[idx].rate = e.target.value;
//                             setFormData(copy);
//                           }}
//                         />
//                       </td>
//                       <td>
//                         <input
//                           type="number"
//                           className="form-control form-control-sm"
//                           value={li.amount || ""}
//                           onChange={(e) => {
//                             const copy = { ...formData };
//                             copy.lineItems[idx].amount = e.target.value;
//                             setFormData(copy);
//                           }}
//                         />
//                       </td>

//                       {/* ✅ Delete Button (after Amount column) */}
//                       <td style={{ textAlign: "center" }}>
//                         <Button
//                           size="small"
//                           themeColor="error"
//                           fillMode="outline"
//                           onClick={() => {
//                             const copy = { ...formData };
//                             copy.lineItems = copy.lineItems.filter((_, i) => i !== idx);
//                             setFormData(copy);
//                           }}
//                         >
//                           🗑️
//                         </Button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <div className="text-muted">No line items</div>
//           )}
//         </div>


//         {/* Tax & Totals */}
//         <div className="mt-4 row">
//           <div className="col-md-6">
//             <h6 className="fw-bold mb-2">Tax</h6>

//             {/* IGST */}
//             <div className="d-flex gap-2 mb-2 align-items-center">
//               <label className="fw-semibold" style={{ minWidth: 80 }}>
//                 IGST
//               </label>
//               <input
//                 name="igstPercent"
//                 value={formData.igstPercent ?? ""}
//                 onChange={handleNumberChange}
//                 className="form-control"
//                 placeholder="%"
//                 style={{ width: 100 }}
//                 type="number"
//               />
//             </div>

//             {/* CGST */}
//             <div className="d-flex gap-2 mb-2 align-items-center">
//               <label className="fw-semibold" style={{ minWidth: 80 }}>
//                 CGST
//               </label>
//               <input
//                 name="cgstPercent"
//                 value={formData.cgstPercent ?? ""}
//                 onChange={handleNumberChange}
//                 className="form-control"
//                 placeholder="%"
//                 style={{ width: 100 }}
//                 type="number"
//               />
//             </div>

//             {/* SGST */}
//             <div className="d-flex gap-2 align-items-center">
//               <label className="fw-semibold" style={{ minWidth: 80 }}>
//                 SGST
//               </label>
//               <input
//                 name="sgstPercent"
//                 value={formData.sgstPercent ?? ""}
//                 onChange={handleNumberChange}
//                 className="form-control"
//                 placeholder="%"
//                 style={{ width: 100 }}
//                 type="number"
//               />
//             </div>
//           </div>


//           <div className="col-md-6">
//             <h6 className="fw-bold mb-2">Total</h6>
//             <div className="d-flex justify-content-between mb-2">
//               <span>Net Total:</span>
//               <input
//                 type="number"
//                 name="netTotal"
//                 className="form-control w-25"
//                 value={formData.netTotal ?? ""}
//                 onChange={handleNumberChange}
//               />
//             </div>
//             <div className="d-flex justify-content-between mb-2">
//               <span>Tax Total:</span>
//               <input
//                 type="number"
//                 name="igst"
//                 className="form-control w-25"
//                 value={formData.igst ?? ""}
//                 onChange={handleNumberChange}
//               />
//             </div>
//             <div className="d-flex justify-content-between mb-2">
//               <span>Round Off:</span>
//               <input
//                 type="number"
//                 name="roundOff"
//                 className="form-control w-25"
//                 value={formData.roundOff ?? ""}
//                 onChange={handleNumberChange}
//               />
//             </div>
//             <div className="d-flex justify-content-between fw-bold border-top pt-2 mb-3">
//               <span>Grand Total:</span>
//               <input
//                 type="number"
//                 name="grandTotal"
//                 className="form-control w-25"
//                 value={formData.grandTotal ?? ""}
//                 onChange={handleNumberChange}
//               />
//             </div>
//           </div>
//         </div>

//         {/* Message */}
//         {message.text && (
//           <div
//             className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"} mt-3`}
//             style={{
//               fontWeight: 600,
//               borderRadius: "8px",
//               padding: "10px 15px",
//               alignContent: "center",
//             }}
//           >
//             {message.text}
//           </div>
//         )}

//         {/* Buttons */}
//         <div className="button-group mt-3 mb-4">
//           <Button themeColor="primary" onClick={handleSave}>
//             Save
//           </Button>
//           <Button type="button" onClick={handleCancel}>
//             Cancel
//           </Button>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default AllQuotations_Simple;

import React, { useEffect, useState } from "react";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { Button } from "@progress/kendo-react-buttons";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AllQuotations.css";

// Import your new Quotation component
import Quotations from "./Quotations.jsx";

const AllQuotations_Simple = () => {
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const [quotations, setQuotations] = useState([]);
  const [projects, setProjects] = useState([]);
  const [editingQuotation, setEditingQuotation] = useState(null);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState({ text: "", type: "" });
  const [page, setPage] = useState({ skip: 0, take: 7 });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [quotationToDelete, setQuotationToDelete] = useState(null);


  // State to control showing the "New Quotation" page
  const [showNew, setShowNew] = useState(false);

  // ✅ Clear message (THIS IS YOUR ORIGINAL 5-SECOND TIMER)
  useEffect(() => {
    // We only clear the message if it's an error. Success messages
    // will be "cleared" by the navigation itself.
    if (!message.text || message.type === "success") return;

    const t = setTimeout(() => setMessage({ text: "", type: "" }), 5000);
    return () => clearTimeout(t);
  }, [message]); // Only re-run if the message object changes

  // ✅ Load quotations + projects
  useEffect(() => {
    fetch(`${API_BASE}/api/quotations`)
      .then((res) => res.json())
      .then((data) => setQuotations(data))
      .catch(() => setMessage({ text: "❌ Failed to load quotations", type: "error" }));

    fetch(`${API_BASE}/api/projects`)
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch(console.error);
  }, []);

  const toDateInputValue = (val) => {
    if (!val) return "";
    try {
      const d = new Date(val);
      if (isNaN(d)) return "";
      return d.toISOString().slice(0, 10);
    } catch {
      return "";
    }
  };

  const handleEdit = (quotation) => {
    setEditingQuotation(quotation);
    setFormData({
      ...quotation,
      billDate: quotation.billDate ? toDateInputValue(quotation.billDate) : "",
      dateOfEstimate: quotation.dateOfEstimate ? toDateInputValue(quotation.dateOfEstimate) : "",
      poDate: quotation.poDate ? toDateInputValue(quotation.poDate) : "",
      createdDate: quotation.createdDate || "",
      updatedDate: quotation.updatedDate || "",
      lineItems: quotation.lineItems || [],
      igstPercent: quotation.igst ?? "",
      cgstPercent: quotation.cgst ?? "",
      sgstPercent: quotation.sgst ?? "",

    });
  };
  // STEP 2 — DELETE CLICK HANDLER
  const handleDelete = (quotation) => {
    setQuotationToDelete(quotation);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!quotationToDelete) return;

    try {
      const res = await fetch(
        `${API_BASE}/api/quotations/${quotationToDelete.quotationId}`,
        { method: "DELETE" }
      );

      if (!res.ok) throw new Error("Delete failed");

      setQuotations(prev =>
        prev.filter(q => q.quotationId !== quotationToDelete.quotationId)
      );

      setMessage({ text: "Deleted successfully!", type: "success" });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);

    } catch (err) {
      setMessage({ text: "Failed to delete", type: "error" });
    }

    setShowDeleteConfirm(false);
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ REVISED handleNumberChange

  // const handleNumberChange = (e) => {
  //   const { name, value } = e.target;

  //   setFormData((prev) => {
  //     // 1. Create the new, updated data object
  //     const updated = { ...prev, [name]: value };

  //     // 2. Check if this change needs a recalculation
  //     if (
  //       name === "igstPercent" ||
  //       name === "cgstPercent" ||
  //       name === "sgstPercent" ||
  //       name === "netTotal" ||
  //       name === "roundOff"
  //     ) {
  //       // 3. Calculate totals using the *new* 'updated' data
  //       const newTotals = calculateTotals(updated);

  //       // 4. Return the merged state
  //       return { ...updated, ...newTotals };
  //     }

  //     // 5. If no calculation was needed, just return the updated field
  //     return updated;
  //   });
  // };

  // ✅ REVISED handleNumberChange
  const handleNumberChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      // 1. Create the new, updated data object
      const updated = { ...prev, [name]: value };

      // 2. Check if this change needs a recalculation
      if (
        name === "igstPercent" ||
        name === "cgstPercent" ||
        name === "sgstPercent" ||
        name === "netTotal" ||
        name === "roundOff" ||
        name === "taxTotal" // 👈 ADDED THIS
      ) {
        // 3. Calculate totals (Pass 'name' so we know what field triggered it)
        const newTotals = calculateTotals(updated, name);

        // 4. Return the merged state
        return { ...updated, ...newTotals };
      }

      // 5. If no calculation was needed, just return the updated field
      return updated;
    });
  };

  // ✅ In AllQuotations_Simple.jsx

  // ADD THIS ENTIRE FUNCTION
  const handleLineItemChange = (e, index) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      // 1. Get a copy of the line items array
      const updatedLineItems = [...prev.lineItems];

      // 2. Get the specific item we are updating
      const itemToUpdate = { ...updatedLineItems[index] };

      // 3. Update its property (e.g., 'quantity' or 'rate')
      itemToUpdate[name] = value;

      // 4. Recalculate 'amount' for THIS item
      const qty = Number(itemToUpdate.quantity) || 0;
      const rate = Number(itemToUpdate.rate) || 0;
      itemToUpdate.amount = (qty * rate).toFixed(2);

      // 5. Put the updated item back in the array
      updatedLineItems[index] = itemToUpdate;

      // 6. Recalculate the 'netTotal' for the *whole form*
      const newNetTotal = updatedLineItems.reduce((sum, item) => {
        return sum + (Number(item.amount) || 0);
      }, 0);

      // 7. Create a 'pending' data object with all our new values
      const pendingData = {
        ...prev,
        lineItems: updatedLineItems,
        netTotal: newNetTotal.toFixed(2),
      };

      // 8. Use your existing 'calculateTotals' function to get the final tax/grand totals
      const finalTotals = calculateTotals(pendingData); // (This returns { igst: '...', grandTotal: '...' })

      // 9. Return the final, merged state
      return {
        ...pendingData,
        ...finalTotals,
      };
    });
  };


  const handleProjectChange = (e) =>
    setFormData((prev) => ({ ...prev, projectName: e.value }));



  // ✅ In AllQuotations_Simple.jsx

  const handleSave = async () => {
    try {
      if (!formData || !formData.quotationId) {
        setMessage({ text: "❌ Missing quotation id.", type: "error" });
        return;
      }

      const currentTime = new Date().toISOString();

      // === START OF FIX ===
      // Create the payload with the correct property names
      const payload = {
        ...formData,
        billDate: formData.billDate ? new Date(formData.billDate).toISOString() : null,
        dateOfEstimate: formData.dateOfEstimate ? new Date(formData.dateOfEstimate).toISOString() : null,
        poDate: formData.poDate ? new Date(formData.poDate).toISOString() : null,
        updatedDate: currentTime,

        // Map names BACK to what the database expects
        taxPercent1: formData.igstPercent || 0,
        taxPercent2: formData.cgstPercent || 0,
        taxPercent3: formData.sgstPercent || 0,
      };

      // (Optional but good practice): Remove the temporary names
      // so they don't accidentally save to the DB.
      delete payload.igstPercent;
      delete payload.cgstPercent;
      delete payload.sgstPercent;
      // === END OF FIX ===

      const res = await fetch(`${API_BASE}/api/quotations/${formData.quotationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload), // Send the corrected payload
      });

      if (!res.ok) throw new Error("API PUT failed");

      setQuotations((prev) =>
        prev.map((q) =>
          q.quotationId === formData.quotationId
            ? { ...q, ...payload } // Update local state with correct payload
            : q
        )
      );

      setFormData((prev) => ({ ...prev, updatedDate: currentTime }));
      setMessage({ text: "✅ Quotation updated!", type: "success" });

      setTimeout(() => {
        handleCancel();
      }, 5000);

    } catch (err) {
      console.error(err);
      setMessage({ text: "❌ Failed to update quotation", type: "error" });
    }
  };


  const handleCancel = () => {
    setEditingQuotation(null);
    setFormData({});
    setMessage({ text: "", type: "" });
  };

  const handlePageChange = (event) => {
    setPage(event.page);
  };

  const pagedData = quotations.slice(page.skip, page.skip + page.take);

  // This block handles showing the "New Quotation" page
  if (showNew) {
    return <Quotations onBack={() => setShowNew(false)} />;
  }

  // ✅ LIST VIEW
  if (!editingQuotation) {
    return (
      <div className="container py-4">
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }} className="quotation-action-bar">
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Button
              icon="refresh"
              size="small"
              onClick={() => {
                fetch(`${API_BASE}/api/quotations`)
                  .then((res) => res.json())
                  .then((data) => setQuotations(data))
                  .catch(() =>
                    setMessage({
                      text: "❌ Failed to refresh quotations",
                      type: "error",
                    })
                  );
              }}
              className="action-btn refresh-btn"
            >
              <span className="tieup-action-btn-text">Refresh</span>
            </Button>
          </div>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Button
              icon="plus"
              size="small"
              onClick={() => setShowNew(true)}
              themeColor="primary"
              className="action-btn add-btn"
            >
              <span className="tieup-action-btn-text">New Quotation</span>
            </Button>
          </div>
        </div>


        {/* <-- ADDED: This will show the error message on the list page if one exists --> */}
        {message.text && message.type === 'error' && (
          <div
            className={`mt-3 mb-3 text-center fw-semibold text-danger`}
          >
            {message.text}
          </div>
        )}

        {quotations.length === 0 ? (
          <p className="text-muted text-center">No quotations found.</p>
        ) : (
          <div
            className="quotation-grid-wrapper"
            style={{
              overflowX: "auto",
              WebkitOverflowScrolling: "touch",
              paddingBottom: "10px",
              maxWidth: "100vw",
            }}
          >

            <div
              className="quotation-grid-inner"
              style={{
                minWidth: "900px",
                overflowX: "auto",
              }}
            >
              <Grid
                data={pagedData}
                pageable={true}
                total={quotations.length}
                skip={page.skip}
                take={page.take}
                onPageChange={handlePageChange}
              >
                <GridColumn field="projectName" title="Project Name" width="100px" cell={(props) => (
                  <td style={{ textAlign: 'left' }}>
                    {props.dataItem[props.field]}
                  </td>
                )} />
                <GridColumn
                  field="lastModifiedAt"
                  title="Last Modified At"
                  width="180px"
                  cell={(props) => (
                    <td>
                      {props.dataItem.lastModifiedAt
                        ? new Date(props.dataItem.lastModifiedAt).toLocaleString()
                        : "-"}
                    </td>
                  )}
                />
                {/* --- EDIT COLUMN --- */}
                <GridColumn
                  title="Edit"
                  width="100px"
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

                {/* --- DELETE COLUMN --- */}
                <GridColumn
                  title="Actions"
                  width="80px"
                  cell={(props) => (
                    <td style={{ textAlign: "center" }}>
                      <Button
                        icon="delete"      // Kendo Trash Icon
                        size="small"
                        themeColor="error"
                        onClick={() => handleDelete(props.dataItem)}
                        title="Delete"
                      />
                    </td>
                  )}
                />

              </Grid>
            </div>
          </div>
        )}
        {showDeleteConfirm && (
          <Dialog title="Confirm Delete" onClose={() => setShowDeleteConfirm(false)}>
            <p>Are you sure you want to delete this quotation?</p>

            <DialogActionsBar>
              <Button onClick={() => setShowDeleteConfirm(false)}>No</Button>
              <Button themeColor="error" onClick={confirmDelete}>Yes</Button>
            </DialogActionsBar>
          </Dialog>
        )}
      </div>
    );
  }
  // ✅ REVISED calculateTotals

  // It now accepts the form data as an argument
  // const calculateTotals = (data) => {
  //   const net = Number(data.netTotal) || 0;

  //   const igstAmt = (net * Number(data.igstPercent || 0)) / 100;
  //   const cgstAmt = (net * Number(data.cgstPercent || 0)) / 100;
  //   const sgstAmt = (net * Number(data.sgstPercent || 0)) / 100;

  //   const taxTotal = igstAmt + cgstAmt + sgstAmt;

  //   const grand = net + taxTotal + Number(data.roundOff || 0);

  //   // It now RETURNS the new totals instead of calling setFormData
  //   // return {
  //   //   igst: taxTotal.toFixed(2),       // 👈 shows in "Tax Total"
  //   //   grandTotal: grand.toFixed(2),   // 👈 shows in "Grand Total"
  //   // };
  //   return {
  //     taxTotal: taxTotal.toFixed(2),   // 👈 CORRECT TAX TOTAL
  //     grandTotal: grand.toFixed(2),
  //     igst: igstAmt.toFixed(2),
  //     cgst: cgstAmt.toFixed(2),
  //     sgst: sgstAmt.toFixed(2),
  //   };

  // };

  // ✅ REVISED calculateTotals
  // Accepts formData AND the name of the field that changed
  // ✅ REVISED calculateTotals (Final Fix)
  const calculateTotals = (data, changedField = "") => {
    const net = Number(data.netTotal) || 0;

    // 1. Calculate what the tax WOULD be based on percentages
    const igstAmt = (net * Number(data.igstPercent || 0)) / 100;
    const cgstAmt = (net * Number(data.cgstPercent || 0)) / 100;
    const sgstAmt = (net * Number(data.sgstPercent || 0)) / 100;

    const percentageTaxTotal = igstAmt + cgstAmt + sgstAmt;

    // 2. Determine the Final Tax Total for Math purposes
    let finalTaxTotal = 0;

    if (changedField === "taxTotal") {
      // Use whatever the user typed for the math calculation
      finalTaxTotal = Number(data.taxTotal) || 0;
    } else {
      // Otherwise use the percentage calculation
      finalTaxTotal = percentageTaxTotal;
    }

    // 3. Calculate Grand Total
    const grand = net + finalTaxTotal + Number(data.roundOff || 0);

    // 4. Build the result object
    const result = {
      grandTotal: grand.toFixed(2),
      igst: igstAmt.toFixed(2),
      cgst: cgstAmt.toFixed(2),
      sgst: sgstAmt.toFixed(2),
    };

    // 🔥 CRITICAL FIX: 
    // Only overwrite the taxTotal field in the UI if the user IS NOT currently typing in it.
    // If 'changedField' IS 'taxTotal', we omit it from this object so the raw user input remains in the state.
    if (changedField !== "taxTotal") {
      result.taxTotal = finalTaxTotal.toFixed(2);
    }

    return result;
  };


  // ✅ EDIT VIEW
  return (
    <div className="container-fluid py-3">
      {/* <Button fillMode="flat" onClick={handleCancel} className="mb-3">
        ← Back
      </Button> */}
      <Button
        icon="arrow-left"
        size="small"
        onClick={handleCancel}
        className="action-btn back-btn"
        style={{ marginRight: 8 }}
      >
        <span className="tieup-action-btn-text">Back</span>
      </Button>

      {/* ✅ Edit Page UI remains unchanged */}
      <div className="card p-4 shadow-sm">
        <h4 className="fw-bold mb-3">Edit Quotation</h4>

        {/* Projects */}
        <div className="mb-4">
          <label className="form-label fw-bold">
            Projects <span className="text-danger">*</span>
          </label>
          <div style={{ maxWidth: "320px" }}>
            <DropDownList
              data={projects.map((p) => p.projectName)}
              value={formData.projectName}
              onChange={handleProjectChange}
              defaultItem="Select Option"
            />
          </div>
        </div>

        {/* Parties & Addresses */}
        <div>
          <h6 className="fw-bold mb-3">Parties and Addresses</h6>
          <div className="row g-3">
            {/* Billing From */}
            <div className="col-md-6">
              <div className="border rounded p-3 h-100">
                <h6 className="fw-bold mb-2">Billing From - Bilva Interiors</h6>
                <textarea
                  name="billingFromAddress"
                  value={formData.billingFromAddress || ""}
                  onChange={handleChange}
                  className="form-control mb-2"
                  placeholder="Address"
                  style={{ height: "100px" }}
                />
                <div className="row g-2 mt-2">
                  <div className="col-md-6">
                    <label className="form-label">State Code</label>

                    <input
                      name="billingFromStateCode"
                      value={formData.billingFromStateCode || ""}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="State Code"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">GSTIN</label>

                    <input
                      name="billingFromGSTIN"
                      value={formData.billingFromGSTIN || ""}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="GSTIN"
                    />
                  </div>

                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="col-md-6">
              <div className="border rounded p-3 h-100">
                <h6 className="fw-bold mb-2">Shipping Address</h6>
                <textarea
                  name="shippingAddress"
                  value={formData.shippingAddress || ""}
                  onChange={handleChange}
                  className="form-control mb-2"
                  placeholder="Address"
                  style={{ height: "100px" }}
                />
                <div className="row g-2 mt-2">
                  <div className="col-md-6">
                    <label className="form-label">GSTIN</label>

                    <input
                      name="shippingGSTIN"
                      value={formData.shippingGSTIN || ""}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="GSTIN"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Brand / Sub-brand</label>

                    <input
                      name="brandOrSubBrand"
                      value={formData.brandOrSubBrand || ""}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Brand / Sub-brand"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Billing To */}
            <div className="col-md-6">
              <div className="border rounded p-3 h-100">
                <h6 className="fw-bold mb-2">Billing To</h6>
                <textarea
                  name="billingToAddress"
                  value={formData.billingToAddress || ""}
                  onChange={handleChange}
                  className="form-control mb-2"
                  placeholder="Address"
                  style={{ height: "100px" }}
                />
                <div className="row g-2 mt-2">
                  <div className="col-md-6">
                    <label className="form-label">GSTIN (Consignee)</label>

                    <input
                      name="gstinConsignee"
                      value={formData.gstinConsignee || formData.billingToConsigneeGSTIN || ""}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="GSTIN (Consignee)"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">GSTIN (Buyer)</label>

                    <input
                      name="gstinBuyer"
                      value={formData.gstinBuyer || formData.billingToBuyerGSTIN || ""}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="GSTIN (Buyer)"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="col-md-6">
              <div className="border rounded p-3 h-100">
                <h6 className="fw-bold mb-2">Delivery Address</h6>
                <textarea
                  name="deliveryAddress"
                  value={formData.deliveryAddress || ""}
                  onChange={handleChange}
                  className="form-control mb-2"
                  placeholder="Address"
                  style={{ height: "100px" }}
                />
                <div className="row g-2 mt-2">
                  <div className="col-md-4">
                    <label className="form-label">Store Code</label>

                    <input
                      name="storeCode"
                      value={formData.storeCode || ""}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">SAP Code</label>

                    <input
                      name="sapCode"
                      value={formData.sapCode || ""}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Vendor Code</label>

                    <input
                      name="vendorCode"
                      value={formData.vendorCode || ""}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Document Details */}
        <div className="mt-4">
          <h6 className="fw-bold mb-3">Document Details</h6>
          <div className="row g-3 align-items-end">
            <div className="col-md-3 col-sm-6">
              <label className="form-label">Bill Number</label>
              <input
                name="billNumber"
                value={formData.billNumber || ""}
                onChange={handleChange}
                className="form-control"
                type="text"
              />
            </div>

            <div className="col-md-3 col-sm-6">
              <label className="form-label">Bill Date</label>
              <input
                name="billDate"
                value={formData.billDate || toDateInputValue(formData.billDate)}
                onChange={handleChange}
                className="form-control"
                type="date"
              />
            </div>

            <div className="col-md-3 col-sm-6">
              <label className="form-label">GST Number</label>
              <input
                name="gstNumber"
                value={formData.gstNumber || formData.GSTNumber || formData.gstNumber || ""}
                onChange={handleChange}
                className="form-control"
                type="text"
              />
            </div>

            <div className="col-md-3 col-sm-6">
              <label className="form-label">PAN</label>
              <input
                name="pan"
                value={formData.pan || ""}
                onChange={handleChange}
                className="form-control"
                type="text"
              />
            </div>

            <div className="col-md-3 col-sm-6">
              <label className="form-label">Invoice No</label>
              <input
                name="estimateNo"
                value={formData.estimateNo || formData.EstimateNo || ""}
                onChange={handleChange}
                className="form-control"
                type="text"
              />
            </div>

            <div className="col-md-3 col-sm-6">
              <label className="form-label">Date of Invoice</label>
              <input
                name="dateOfEstimate"
                value={formData.dateOfEstimate || toDateInputValue(formData.dateOfEstimate)}
                onChange={handleChange}
                className="form-control"
                type="date"
              />
            </div>

            <div className="col-md-3 col-sm-6">
              <label className="form-label">Project ID</label>
              <input
                name="projectID"
                value={formData.projectID || formData.projectId || ""}
                onChange={handleChange}
                className="form-control"
                type="text"
              />
            </div>

            <div className="col-md-3 col-sm-6">
              <label className="form-label">PO Number</label>
              <input
                name="poNumber"
                value={formData.poNumber || formData.PONumber || ""}
                onChange={handleChange}
                className="form-control"

                type="text"
              />
            </div>

            <div className="col-md-3 col-sm-6">
              <label className="form-label">PO Date</label>
              <input
                name="poDate"
                value={formData.poDate || toDateInputValue(formData.poDate)}
                onChange={handleChange}
                className="form-control"
                type="date"
              />
            </div>

            <div className="col-md-3 col-sm-6">
              <label className="form-label">PO Type</label>
              <input
                name="poType"
                value={formData.poType || formData.POType || ""}
                onChange={handleChange}
                className="form-control"

              />
            </div>

            <div className="col-md-6 col-sm-12">
              <label className="form-label">Brand Name / Sub-brand</label>
              <input
                name="brandNameSubBrand"
                value={formData.brandNameSubBrand || formData.brandNameSubBrand || formData.brandOrSubBrand || ""}
                onChange={handleChange}
                className="form-control"

              />
            </div>

            <div className="col-md-6 col-sm-12">
              <label className="form-label">Sub(work Description)</label>
              <input
                name="subWorkDescription"
                value={formData.subWorkDescription || formData.subWorkDescription || ""}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </div>
        </div>

        {/* ✅ Line Items Section with Add & Delete buttons */}
        <div className="mt-4 border rounded p-3 position-relative">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="fw-bold mb-0">Line Items</h6>

            {/* ✅ Add Line Item Button (top-right) */}
            <Button
              size="small"
              themeColor="primary"
              onClick={() => {
                setFormData((prev) => ({
                  ...prev,
                  lineItems: [
                    ...(prev.lineItems || []),
                    {
                      materialCode: "",
                      hsnCode: "",
                      description: "",
                      uom: "",
                      quantity: "",
                      rate: "",
                      amount: "",
                    },
                  ],
                }));
              }}
            >
              + Add Line Item
            </Button>
          </div>

          {Array.isArray(formData.lineItems) && formData.lineItems.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-sm table-bordered align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Material Code</th>
                    <th>HSN Code</th>
                    <th>Description</th>
                    <th>UOM</th>
                    <th>Quantity</th>
                    <th>Rate</th>
                    <th>Amount</th>
                    <th style={{ width: "80px", textAlign: "center" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.lineItems.map((li, idx) => (
                    <tr key={idx}>
                      <td>
                        <input
                          name="materialCode" // <-- ADD NAME
                          className="form-control form-control-sm"
                          value={li.materialCode || ""}
                          onChange={(e) => handleLineItemChange(e, idx)} // <-- USE NEW HANDLER
                        />
                      </td>
                      <td>
                        <input
                          name="hsnCode" // <-- ADD NAME
                          className="form-control form-control-sm"
                          value={li.hsnCode || ""}
                          onChange={(e) => handleLineItemChange(e, idx)} // <-- USE NEW HANDLER
                        />
                      </td>
                      <td>
                        <input
                          name="description" // <-- ADD NAME
                          className="form-control form-control-sm"
                          value={li.description || ""}
                          onChange={(e) => handleLineItemChange(e, idx)} // <-- USE NEW HANDLER
                        />
                      </td>
                      <td>
                        <input
                          name="uom" // <-- ADD NAME
                          className="form-control form-control-sm"
                          value={li.uom || ""}
                          onChange={(e) => handleLineItemChange(e, idx)} // <-- USE NEW HANDLER
                        />
                      </td>
                      <td>
                        <input
                          name="quantity" // <-- ADD NAME
                          type="number"
                          className="form-control form-control-sm"
                          value={li.quantity || ""}
                          onChange={(e) => handleLineItemChange(e, idx)} // <-- USE NEW HANDLER
                        />
                      </td>
                      <td>
                        <input
                          name="rate" // <-- ADD NAME
                          type="number"
                          className="form-control form-control-sm"
                          value={li.rate || ""}
                          onChange={(e) => handleLineItemChange(e, idx)} // <-- USE NEW HANDLER
                        />
                      </td>
                      <td>
                        <input
                          name="amount" // <-- ADD NAME
                          type="number"
                          className="form-control form-control-sm"
                          value={li.amount || ""}
                          onChange={(e) => handleLineItemChange(e, idx)} // <-- USE NEW HANDLER
                        />
                      </td>

                      {/* Delete Button (no changes needed) */}
                      <td style={{ textAlign: "center" }}>
                        <Button
                          size="small"
                          themeColor="error"
                          fillMode="outline"
                          onClick={() => {
                            const copy = { ...formData };
                            copy.lineItems = copy.lineItems.filter((_, i) => i !== idx);
                            setFormData(copy);
                            // TODO: You might want to trigger a recalculation here too,
                            // but let's fix one thing at a time.
                          }}
                        >
                          🗑️
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-muted">No line items</div>
          )}
        </div>


        {/* Tax & Totals */}
        <div className="mt-4 row">
          <div className="col-md-6">
            <h6 className="fw-bold mb-2">Tax</h6>

            {/* IGST */}
            <div className="d-flex gap-2 mb-2 align-items-center">
              <label className="fw-semibold" style={{ minWidth: 80 }}>
                IGST
              </label>
              <input
                name="igstPercent"
                value={formData.igstPercent ?? ""}
                onChange={handleNumberChange}
                className="form-control"
                placeholder="%"
                style={{ width: 100 }}
                type="number"
              />
            </div>

            {/* CGST */}
            <div className="d-flex gap-2 mb-2 align-items-center">
              <label className="fw-semibold" style={{ minWidth: 80 }}>
                CGST
              </label>
              <input
                name="cgstPercent"
                value={formData.cgstPercent ?? ""}
                onChange={handleNumberChange}
                className="form-control"
                placeholder="%"
                style={{ width: 100 }}
                type="number"
              />
            </div>

            {/* SGST */}
            <div className="d-flex gap-2 align-items-center">
              <label className="fw-semibold" style={{ minWidth: 80 }}>
                SGST
              </label>
              <input
                name="sgstPercent"
                value={formData.sgstPercent ?? ""}
                onChange={handleNumberChange}
                className="form-control"
                placeholder="%"
                style={{ width: 100 }}
                type="number"
              />
            </div>
          </div>


          <div className="col-md-6">
            <h6 className="fw-bold mb-2">Total</h6>
            <div className="d-flex justify-content-between mb-2">
              <span>Net Total:</span>
              <input
                type="number"
                name="netTotal"
                className="form-control w-25"
                value={formData.netTotal ?? ""}
                onChange={handleNumberChange}
              />
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>Tax Total:</span>
              <input
                type="number"
                name="taxTotal"
                className="form-control w-25"
                value={formData.taxTotal ?? ""}
                onChange={handleNumberChange}
              // readOnly  

              />
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>Round Off:</span>
              <input
                type="number"
                name="roundOff"
                className="form-control w-25"
                value={formData.roundOff ?? ""}
                onChange={handleNumberChange}
                readOnly

              />
            </div>
            <div className="d-flex justify-content-between fw-bold border-top pt-2 mb-3">
              <span>Grand Total:</span>
              <input
                type="number"
                name="grandTotal"
                className="form-control w-25"
                value={formData.grandTotal ?? ""}
                onChange={handleNumberChange}
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Message */}
        {message.text && (
          <div
            className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"} mt-3`}
            style={{
              fontWeight: 600,
              borderRadius: "8px",
              padding: "10px 15px",
              alignContent: "center",
            }}
          >
            {message.text}
          </div>
        )}

        {/* Buttons */}
        <div className="button-group mt-3 mb-4">
          <Button themeColor="primary" onClick={handleSave}>
            Save
          </Button>
          <Button type="button" onClick={handleCancel}>
            Cancel
          </Button>
        </div>

      </div>
    </div>
  );
};

export default AllQuotations_Simple;