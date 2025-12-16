// import React, { useEffect, useState } from "react";
// import { Grid, GridColumn } from "@progress/kendo-react-grid";
// import { Button } from "@progress/kendo-react-buttons";
// import { DropDownList } from "@progress/kendo-react-dropdowns";
// import "bootstrap/dist/css/bootstrap.min.css";
// import BillingNew from "./Billing";


// const AllBillings_Simple = () => {
//     const API_BASE = "https://localhost:7142/api";
//     const [billings, setBillings] = useState([]);
//     const [projects, setProjects] = useState([]);
//     const [editingBilling, setEditingBilling] = useState(null);
//     const [formData, setFormData] = useState({});
//     const [message, setMessage] = useState({ text: "", type: "" });
//     const [page, setPage] = useState({ skip: 0, take: 7 });
//     const [showAdd, setShowAdd] = useState(false);


//     // <-- MODIFIED: This now only auto-clears error messages.
//     // The success message is "cleared" by the navigation itself.
//     useEffect(() => {
//         if (!message.text || message.type === "success") return;
//         const t = setTimeout(() => setMessage({ text: "", type: "" }), 5000);
//         return () => clearTimeout(t);
//     }, [message]);

//     // ✅ Load billings + projects
//     useEffect(() => {
//         fetch(`${API_BASE}/Billing`)
//             .then((res) => res.json())
//             .then((data) => setBillings(data))
//             .catch(() => setMessage({ text: "❌ Failed to load billings", type: "error" }));

//         fetch(`${API_BASE}/projects`)
//             .then((res) => res.json())
//             .then((data) => setProjects(data))
//             .catch(console.error);
//     }, []);

//     const toDateInputValue = (val) => {
//         if (!val) return "";
//         try {
//             const d = new Date(val);
//             if (isNaN(d)) return "";
//             return d.toISOString().slice(0, 10);
//         } catch {
//             return "";
//         }
//     };
//     const handleBack = () => {
//         setShowAdd(false);
//         try {
//             window.history.replaceState({}, "");
//         } catch { }
//     };


//     // ✅ EDIT handler
//     const handleEdit = (billing) => {
//         setEditingBilling(billing);
//         setFormData({
//             ...billing,
//             billDate: billing.billDate ? toDateInputValue(billing.billDate) : "",
//             dateOfEstimate: billing.dateOfEstimate ? toDateInputValue(billing.dateOfEstimate) : "",
//             poDate: billing.poDate ? toDateInputValue(billing.poDate) : "",
//             createdDate: billing.createdDate || "",
//             updatedDate: billing.updatedDate || "",
//             lineItems: billing.lineItems || [],
//         });
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({ ...prev, [name]: value }));
//     };

//     const handleNumberChange = (e) => {
//         const { name, value } = e.target;
//         const parsed = value === "" ? "" : parseFloat(value);
//         setFormData((prev) => ({ ...prev, [name]: parsed }));
//     };

//     const handleProjectChange = (e) =>
//         setFormData((prev) => ({ ...prev, projectName: e.value }));

//     // ✅ SAVE handler (PUT)
//     const handleSave = async () => {
//         try {
//             if (!formData || !formData.billingId) {
//                 setMessage({ text: "❌ Missing billing id.", type: "error" });
//                 return;
//             }

//             const currentTime = new Date().toISOString();
//             // const payload = {
//             //     ...formData,
//             //     billDate: formData.billDate ? new Date(formData.billDate).toISOString() : null,
//             //     dateOfEstimate: formData.dateOfEstimate ? new Date(formData.dateOfEstimate).toISOString() : null,
//             //     poDate: formData.poDate ? new Date(formData.poDate).toISOString() : null,
//             //     updatedDate: currentTime,
//             //     lineItems: formData.lineItems || [], // ensure array
//             // };
//             const payload = {
//                 ...formData,
//                 billDate: formData.billDate ? new Date(formData.billDate).toISOString() : null,
//                 dateOfEstimate: formData.dateOfEstimate ? new Date(formData.dateOfEstimate).toISOString() : null,
//                 poDate: formData.poDate ? new Date(formData.poDate).toISOString() : null,
//                 updatedDate: currentTime,
//                 GSTNumber: formData.gstNumber,
//                 IGST: formData.igst,
//                 Tax1Option: formData.taxOption1,
//                 Tax1Percent: formData.taxPercent1,
//                 Tax2Option: formData.taxOption2,
//                 Tax2Percent: formData.taxPercent2,
//                 LineItems: (formData.lineItems || []).map((li) => ({
//                     LineItemId: li.lineItemId || 0,
//                     MaterialCode: li.materialCode,
//                     HSNCode: li.hsnCode,
//                     Description: li.description,
//                     UOM: li.uom,
//                     Quantity: parseFloat(li.quantity || 0),
//                     Rate: parseFloat(li.rate || 0),
//                     Amount: parseFloat(li.amount || 0),
//                 })),
//             };


//             const res = await fetch(`${API_BASE}/Billing/${formData.billingId}`, {
//                 method: "PUT",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify(payload),
//             });

//             if (!res.ok) throw new Error("API PUT failed");

//             setBillings((prev) =>
//                 prev.map((b) =>
//                     b.billingId === formData.billingId ? { ...b, ...payload } : b
//                 )
//             );

//             setFormData((prev) => ({ ...prev, updatedDate: currentTime }));

//             // <-- MODIFIED: Updated message text
//             setMessage({ text: "✅ Billing updated! Returning to list...", type: "success" });

//             // <-- ADDED: Automatically go back to the list after 5 seconds
//             setTimeout(() => {
//                 handleCancel(); // This function resets the view to the list
//             }, 5000);

//         } catch (err) {
//             console.error(err);
//             setMessage({ text: "❌ Failed to update billing", type: "error" });
//         }
//     };


//     const handleCancel = () => {
//         setEditingBilling(null);
//         setFormData({});
//         setMessage({ text: "", type: "" });
//     };

//     const handlePageChange = (event) => setPage(event.page);
//     const pagedData = billings.slice(page.skip, page.skip + page.take);

//     if (showAdd) {
//         return (
//             <>
//                 <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
//                     <Button
//                         icon="arrow-left"
//                         size="small"
//                         onClick={handleBack}
//                         className="action-btn back-btn"
//                         style={{ marginRight: 8 }}
//                     >
//                         <span className="tieup-action-btn-text">Back</span>
//                     </Button>
//                 </div>
//                 {/* This component (BillingNew) will use its *own* 5-second timer 
//                   and then call `onAdded` (which is `handleBack`) when done.
//                 */}
//                 <BillingNew onBack={handleBack} />
//             </>
//         );
//     }

//     // ✅ LIST VIEW
//     if (!editingBilling) {
//         return (
//             <div className="container py-4">
//                 {/* <div className="d-flex justify-content-between align-items-center mb-3">
//                     <Button
//                         icon="refresh"
//                         size="small"
//                         onClick={() => {
//                             fetch(`${API_BASE}/Billing`)
//                                 .then((res) => res.json())
//                                 .then((data) => setBillings(data))
//                                 .catch(() =>
//                                     setMessage({
//                                         text: "❌ Failed to refresh billings",
//                                         type: "error",
//                                     })
//                                 );
//                         }}
//                         className="action-btn refresh-btn"
//                     >
//                         <span className="tieup-action-btn-text">Refresh</span>
//                     </Button>

//                     <Button
//                         icon="plus"
//                         size="small"
//                         onClick={() => {
//                             setShowAdd(true);
//                             try {
//                                 window.history.pushState({ view: "addBilling" }, "");
//                             } catch { }
//                         }}
//                         themeColor="primary"
//                         className="action-btn add-btn"
//                     >
//                         <span className="tieup-action-btn-text">New Billing</span>
//                     </Button>

//                 </div> */}

//                 <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }} className="billing-action-bar">
//                     <div style={{ display: "flex", gap: "0.5rem" }}>
//                         <Button
//                             icon="refresh"
//                             size="small"
//                             onClick={() => {
//                                 fetch(`${API_BASE}/Billing`)
//                                     .then((res) => res.json())
//                                     .then((data) => setBillings(data))
//                                     .catch(() =>
//                                         setMessage({
//                                             text: "❌ Failed to refresh billings",
//                                             type: "error",
//                                         })
//                                     );
//                             }}
//                             className="action-btn refresh-btn"
//                         >
//                             <span className="tieup-action-btn-text">Refresh</span>
//                         </Button>
//                     </div>

//                     <div style={{ display: "flex", gap: "0.5rem" }}>
//                         <Button
//                             icon="plus"
//                             size="small"
//                             onClick={() => {
//                                 setShowAdd(true);
//                                 try {
//                                     window.history.pushState({ view: "addBilling" }, "");
//                                 } catch { }
//                             }}
//                             themeColor="primary"
//                             className="action-btn add-btn"
//                         >
//                             <span className="tieup-action-btn-text">New Billing</span>
//                         </Button>
//                     </div>
//                 </div>


//                 {/* This will show error messages on the list page if they exist */}
//                 {message.text && message.type === 'error' && (
//                     <div className={`mt-3 mb-3 text-center fw-semibold text-danger`}>
//                         {message.text}
//                     </div>
//                 )}

//                 {billings.length === 0 ? (
//                     <p className="text-muted text-center">No billings found.</p>
//                 ) : (
//                     <div className="quotation-grid-wrapper" style={{ overflowX: "auto", paddingBottom: "10px" }}>
//                         <div className="quotation-grid-inner" style={{ minWidth: "900px", overflowX: "auto" }}>
//                             <Grid
//                                 data={pagedData}
//                                 pageable={true}
//                                 total={billings.length}
//                                 skip={page.skip}
//                                 take={page.take}
//                                 onPageChange={handlePageChange}
//                             >
//                                 <GridColumn field="projectName" title="Project Name" width="150px" />
//                                 <GridColumn
//                                     field="updatedDate"      // <-- change this
//                                     title="Last Modified At"
//                                     width="180px"
//                                     cell={(props) => (
//                                         <td>
//                                             {props.dataItem.updatedDate
//                                                 ? new Date(props.dataItem.updatedDate).toLocaleString()
//                                                 : "-"}
//                                         </td>
//                                     )}
//                                 />

//                                 <GridColumn
//                                     title="Actions"
//                                     width="120px"
//                                     cell={(props) => (
//                                         <td style={{ textAlign: "center" }}>
//                                             <Button
//                                                 size="small"
//                                                 themeColor="primary"
//                                                 onClick={() => handleEdit(props.dataItem)}
//                                                 style={{ whiteSpace: "nowrap", padding: "4px 12px" }}
//                                             >
//                                                 Edit
//                                             </Button>
//                                         </td>
//                                     )}
//                                 />
//                             </Grid>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         );
//     }


//     // ✅ EDIT VIEW (same structure reused)
//     return (
//         <div className="container-fluid py-3">
//             {/* <Button fillMode="flat" onClick={handleCancel} className="mb-3">
//                 ← Back
//             </Button> */}
//             <Button
//                     icon="arrow-left"
//                     size="small"
//                     onClick={handleCancel}
//                     className="action-btn back-btn"
//                     style={{ marginRight: 8 }}
//                   >
//                     <span className="tieup-action-btn-text">Back</span>
//                   </Button>

//             {/* ✅ Edit Page UI remains unchanged */}
//             <div className="card p-4 shadow-sm">
//                 <h4 className="fw-bold mb-3">Edit Bill</h4>

//                 {/* Projects */}
//                 <div className="mb-4">
//                     <label className="form-label fw-bold">
//                         Projects <span className="text-danger">*</span>
//                     </label>
//                     <div style={{ maxWidth: "320px" }}>
//                         <DropDownList
//                             data={projects.map((p) => p.projectName)}
//                             value={formData.projectName}
//                             onChange={handleProjectChange}
//                             defaultItem="Select Option"
//                         />
//                     </div>
//                 </div>

//                 {/* Parties & Addresses */}
//                 <div>
//                     <h6 className="fw-bold mb-3">Parties and Addresses</h6>
//                     <div className="row g-3">
//                         {/* Billing From */}
//                         <div className="col-md-6">
//                             <div className="border rounded p-3 h-100">
//                                 <h6 className="fw-bold mb-2">Billing From - Bilva Interiors</h6>
//                                 <textarea
//                                     name="billingFromAddress"
//                                     value={formData.billingFromAddress || ""}
//                                     onChange={handleChange}
//                                     className="form-control mb-2"
//                                     placeholder="Address"
//                                     style={{ height: "100px" }}
//                                 />
//                                 <div className="row g-2 mt-2">
//                                     <div className="col-md-4">
//                                         <label className="form-label">State</label>

//                                         <input
//                                             name="billingFromState"
//                                             value={formData.billingFromState || ""}
//                                             onChange={handleChange}
//                                             className="form-control"
//                                             placeholder="State"
//                                         />
//                                     </div>
//                                     <div className="col-md-4">
//                                         <label className="form-label">State Code</label>

//                                         <input
//                                             name="billingFromStateCode"
//                                             value={formData.billingFromStateCode || ""}
//                                             onChange={handleChange}
//                                             className="form-control"
//                                             placeholder="State Code"
//                                         />
//                                     </div>
//                                     <div className="col-md-4">
//                                         <label className="form-label">GSTIN</label>

//                                         <input
//                                             name="billingFromGSTIN"
//                                             value={formData.billingFromGSTIN || ""}
//                                             onChange={handleChange}
//                                             className="form-control"
//                                             placeholder="GSTIN"
//                                         />
//                                     </div>
//                                     <div className="col-md-6">
//                                         <label className="form-label">Brand</label>

//                                         <input
//                                             name="billingFromBrand"
//                                             value={formData.billingFromBrand || ""}
//                                             onChange={handleChange}
//                                             className="form-control"
//                                             placeholder="Brand"
//                                         />
//                                     </div>
//                                     <div className="col-md-6">
//                                         <label className="form-label">Contact Email / Phone (Optional)</label>

//                                         <input
//                                             name="billingFromContact"
//                                             value={formData.billingFromContact || ""}
//                                             onChange={handleChange}
//                                             className="form-control"
//                                             placeholder="ContactEmailorPhone"
//                                         />
//                                     </div>

//                                 </div>
//                             </div>
//                         </div>

//                         {/* Shipping Address */}
//                         <div className="col-md-6">
//                             <div className="border rounded p-3 h-100">
//                                 <h6 className="fw-bold mb-2">Shipping Address</h6>
//                                 <textarea
//                                     name="shippingAddress"
//                                     value={formData.shippingAddress || ""}
//                                     onChange={handleChange}
//                                     className="form-control mb-2"
//                                     placeholder="Address"
//                                     style={{ height: "100px" }}
//                                 />
//                                 <div className="row g-2 mt-2">
//                                     <div className="col-md-4">
//                                         <label className="form-label">State</label>

//                                         <input
//                                             name="shippingState"
//                                             value={formData.shippingState || ""}
//                                             onChange={handleChange}
//                                             className="form-control"
//                                             placeholder="State"
//                                         />
//                                     </div>
//                                     <div className="col-md-4">
//                                         <label className="form-label">State Code</label>

//                                         <input
//                                             name="shippingStateCode"
//                                             value={formData.shippingStateCode || ""}
//                                             onChange={handleChange}
//                                             className="form-control"
//                                             placeholder="State Code"
//                                         />
//                                     </div>
//                                     <div className="col-md-4">
//                                         <label className="form-label">GSTIN</label>

//                                         <input
//                                             name="shippingGSTIN"
//                                             value={formData.shippingGSTIN || ""}
//                                             onChange={handleChange}
//                                             className="form-control"
//                                             placeholder="GSTIN"
//                                         />
//                                     </div>
//                                     <div className="col-md-6">
//                                         <label className="form-label">Brand</label>

//                                         <input
//                                             name="shippingBrand"
//                                             value={formData.shippingBrand || ""}
//                                             onChange={handleChange}
//                                             className="form-control"
//                                             placeholder="Brand"
//                                         />
//                                     </div>
//                                     <div className="col-md-6">
//                                         <label className="form-label">Contact Email / Phone (Optional)</label>

//                                         <input
//                                             name="shippingContact"
//                                             value={formData.shippingContact || ""}
//                                             onChange={handleChange}
//                                             className="form-control"
//                                             placeholder="ContactEmailorPhone"
//                                         />
//                                     </div>

//                                 </div>
//                             </div>
//                         </div>

//                         {/* Billing To */}
//                         <div className="col-md-6">
//                             <div className="border rounded p-3 h-100">
//                                 <h6 className="fw-bold mb-2">Billing To</h6>
//                                 <textarea
//                                     name="billingToAddress"
//                                     value={formData.billingToAddress || ""}
//                                     onChange={handleChange}
//                                     className="form-control mb-2"
//                                     placeholder="Address"
//                                     style={{ height: "100px" }}
//                                 />
//                                 <div className="row g-2 mt-2">
//                                     <div className="col-md-4">
//                                         <label className="form-label">State</label>

//                                         <input
//                                             name="billingToState"
//                                             value={formData.billingToState || ""}
//                                             onChange={handleChange}
//                                             className="form-control"
//                                             placeholder="State"
//                                         />
//                                     </div>
//                                     <div className="col-md-4">
//                                         <label className="form-label">State Code</label>

//                                         <input
//                                             name="billingToStateCode"
//                                             value={formData.billingToStateCode || ""}
//                                             onChange={handleChange}
//                                             className="form-control"
//                                             placeholder="State Code"
//                                         />
//                                     </div>
//                                     <div className="col-md-4">
//                                         <label className="form-label">GSTIN</label>

//                                         <input
//                                             name="billingToGSTIN"
//                                             value={formData.billingToGSTIN || ""}
//                                             onChange={handleChange}
//                                             className="form-control"
//                                             placeholder="GSTIN"
//                                         />
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Delivery Address */}
//                         <div className="col-md-6">
//                             <div className="border rounded p-3 h-100">
//                                 <h6 className="fw-bold mb-2">Delivery Address</h6>
//                                 <textarea
//                                     name="deliveryAddress"
//                                     value={formData.deliveryAddress || ""}
//                                     onChange={handleChange}
//                                     className="form-control mb-2"
//                                     placeholder="Address"
//                                     style={{ height: "100px" }}
//                                 />
//                                 <div className="row g-2 mt-2">
//                                     <div className="col-md-4">
//                                         <label className="form-label">Store Code</label>

//                                         <input
//                                             name="storeCode"
//                                             value={formData.storeCode || ""}
//                                             onChange={handleChange}
//                                             className="form-control"
//                                         />
//                                     </div>
//                                     <div className="col-md-4">
//                                         <label className="form-label">SAP Code</label>

//                                         <input
//                                             name="sapCode"
//                                             value={formData.sapCode || ""}
//                                             onChange={handleChange}
//                                             className="form-control"
//                                         />
//                                     </div>
//                                     <div className="col-md-4">
//                                         <label className="form-label">Vendor Code</label>

//                                         <input
//                                             name="vendorCode"
//                                             value={formData.vendorCode || ""}
//                                             onChange={handleChange}
//                                             className="form-control"
//                                         />
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Document Details */}
//                 <div className="mt-4">
//                     <h6 className="fw-bold mb-3">Document Details</h6>
//                     <div className="row g-3 align-items-end">

//                         {/* Bill Number */}
//                         <div className="col-md-3 col-sm-6">
//                             <label className="form-label">Bill Number</label>
//                             <input
//                                 name="billNumber"
//                                 value={formData.billNumber || ""}
//                                 onChange={handleChange}
//                                 className="form-control"
//                                 type="text"
//                             />
//                         </div>

//                         {/* Bill Date */}
//                         <div className="col-md-3 col-sm-6">
//                             <label className="form-label">Bill Date</label>
//                             <input
//                                 name="billDate"
//                                 value={formData.billDate || toDateInputValue(formData.billDate)}
//                                 onChange={handleChange}
//                                 className="form-control"
//                                 type="date"
//                             />
//                         </div>

//                         {/* Estimate No */}
//                         <div className="col-md-3 col-sm-6">
//                             <label className="form-label">Invoice No</label>
//                             <input
//                                 name="estimateNo"
//                                 value={formData.estimateNo || ""}
//                                 onChange={handleChange}
//                                 className="form-control"
//                                 type="text"
//                             />
//                         </div>

//                         {/* Date of Estimate */}
//                         <div className="col-md-3 col-sm-6">
//                             <label className="form-label">Date of Invoice</label>
//                             <input
//                                 name="dateOfEstimate"
//                                 value={formData.dateOfEstimate || toDateInputValue(formData.dateOfEstimate)}
//                                 onChange={handleChange}
//                                 className="form-control"
//                                 type="date"
//                             />
//                         </div>

//                         {/* Project ID */}
//                         <div className="col-md-3 col-sm-6">
//                             <label className="form-label">Project ID</label>
//                             <input
//                                 name="projectId"
//                                 value={formData.projectId || ""}
//                                 onChange={handleChange}
//                                 className="form-control"
//                                 type="text"
//                             />
//                         </div>

//                         {/* GST Number */}
//                         <div className="col-md-3 col-sm-6">
//                             <label className="form-label">GST Number</label>
//                             <input
//                                 name="gstNumber"
//                                 value={formData.gstNumber || ""}
//                                 onChange={handleChange}
//                                 className="form-control"
//                                 type="text"
//                             />
//                         </div>

//                         {/* PAN */}
//                         <div className="col-md-3 col-sm-6">
//                             <label className="form-label">PAN</label>
//                             <input
//                                 name="pan"
//                                 value={formData.pan || ""}
//                                 onChange={handleChange}
//                                 className="form-control"
//                                 type="text"
//                             />
//                         </div>

//                         {/* PO Number */}
//                         <div className="col-md-3 col-sm-6">
//                             <label className="form-label">PO Number</label>
//                             <input
//                                 name="poNumber"
//                                 value={formData.poNumber || ""}
//                                 onChange={handleChange}
//                                 className="form-control"
//                                 type="text"
//                             />
//                         </div>

//                         {/* PO Date */}
//                         <div className="col-md-3 col-sm-6">
//                             <label className="form-label">PO Date</label>
//                             <input
//                                 name="poDate"
//                                 value={formData.poDate || toDateInputValue(formData.poDate)}
//                                 onChange={handleChange}
//                                 className="form-control"
//                                 type="date"
//                             />
//                         </div>

//                         {/* PO Type */}
//                         <div className="col-md-3 col-sm-6">
//                             <label className="form-label">PO Type</label>
//                             <input
//                                 name="poType"
//                                 value={formData.poType || ""}
//                                 onChange={handleChange}
//                                 className="form-control"
//                                 type="text"
//                             />
//                         </div>

//                         {/* Sub(work Description) */}
//                         <div className="col-md-6 col-sm-12">
//                             <label className="form-label">Sub(work Description)</label>
//                             <input
//                                 name="subWorkDescription"
//                                 value={formData.subWorkDescription || ""}
//                                 onChange={handleChange}
//                                 className="form-control"
//                                 type="text"
//                             />
//                         </div>

//                         {/* Invoice Title / Subject */}
//                         <div className="col-md-6 col-sm-12">
//                             <label className="form-label">Invoice Title / Subject</label>
//                             <input
//                                 name="invoiceTitle"
//                                 value={formData.invoiceTitle || ""}
//                                 onChange={handleChange}
//                                 className="form-control"
//                                 type="text"
//                             />
//                         </div>

//                     </div>
//                 </div>


//                 {/* ✅ Line Items Section with Add & Delete buttons */}
//                 <div className="mt-4 border rounded p-3 position-relative">
//                     <div className="d-flex justify-content-between align-items-center mb-2">
//                         <h6 className="fw-bold mb-0">Line Items</h6>

//                         {/* ✅ Add Line Item Button (top-right) */}
//                         <Button
//                             size="small"
//                             themeColor="primary"
//                             onClick={() => {
//                                 setFormData((prev) => ({
//                                     ...prev,
//                                     lineItems: [
//                                         ...(prev.lineItems || []),
//                                         {
//                                             lineItemId: 0,
//                                             materialCode: "",
//                                             hsnCode: "",
//                                             description: "",
//                                             uom: "",
//                                             quantity: "",
//                                             rate: "",
//                                             amount: "",
//                                         },
//                                     ],

//                                 }));
//                             }}
//                         >
//                             + Add Line Item
//                         </Button>
//                     </div>

//                     {Array.isArray(formData.lineItems) && formData.lineItems.length > 0 ? (
//                         <div className="table-responsive">
//                             <table className="table table-sm table-bordered align-middle">
//                                 <thead className="table-light">
//                                     <tr>
//                                         <th>Material Code</th>
//                                         <th>HSN Code</th>
//                                         <th>Description</th>
//                                         <th>UOM</th>
//                                         <th>Quantity</th>
//                                         <th>Rate</th>
//                                         <th>Amount</th>
//                                         <th style={{ width: "80px", textAlign: "center" }}>Action</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {formData.lineItems.map((li, idx) => (
//                                         <tr key={idx}>
//                                             <td>
//                                                 <input
//                                                     className="form-control form-control-sm"
//                                                     value={li.materialCode || ""}
//                                                     onChange={(e) => {
//                                                         const copy = { ...formData };
//                                                         copy.lineItems[idx].materialCode = e.target.value;
//                                                         setFormData(copy);
//                                                     }}
//                                                 />
//                                             </td>
//                                             <td>
//                                                 <input
//                                                     className="form-control form-control-sm"
//                                                     value={li.hsnCode || ""}
//                                                     onChange={(e) => {
//                                                         const copy = { ...formData };
//                                                         copy.lineItems[idx].hsnCode = e.target.value;
//                                                         setFormData(copy);
//                                                     }}
//                                                 />
//                                             </td>
//                                             <td>
//                                                 <input
//                                                     className="form-control form-control-sm"
//                                                     value={li.description || ""}
//                                                     onChange={(e) => {
//                                                         const copy = { ...formData };
//                                                         copy.lineItems[idx].description = e.target.value;
//                                                         setFormData(copy);
//                                                     }}
//                                                 />
//                                             </td>
//                                             <td>
//                                                 <input
//                                                     className="form-control form-control-sm"
//                                                     value={li.uom || ""}
//                                                     onChange={(e) => {
//                                                         const copy = { ...formData };
//                                                         copy.lineItems[idx].uom = e.target.value;
//                                                         setFormData(copy);
//                                                     }}
//                                                 />
//                                             </td>
//                                             <td>
//                                                 <input
//                                                     type="number"
//                                                     className="form-control form-control-sm"
//                                                     value={li.quantity || ""}
//                                                     onChange={(e) => {
//                                                         const copy = { ...formData };
//                                                         copy.lineItems[idx].quantity = e.target.value;
//                                                         setFormData(copy);
//                                                     }}
//                                                 />
//                                             </td>
//                                             <td>
//                                                 <input
//                                                     type="number"
//                                                     className="form-control form-control-sm"
//                                                     value={li.rate || ""}
//                                                     onChange={(e) => {
//                                                         const copy = { ...formData };
//                                                         copy.lineItems[idx].rate = e.target.value;
//                                                         setFormData(copy);
//                                                     }}
//                                                 />
//                                             </td>
//                                             <td>
//                                                 <input
//                                                     type="number"
//                                                     className="form-control form-control-sm"
//                                                     value={li.amount || ""}
//                                                     onChange={(e) => {
//                                                         const copy = { ...formData };
//                                                         copy.lineItems[idx].amount = e.target.value;
//                                                         setFormData(copy);
//                                                     }}
//                                                 />
//                                             </td>

//                                             {/* ✅ Delete Button (after Amount column) */}
//                                             <td style={{ textAlign: "center" }}>
//                                                 <Button
//                                                     size="small"
//                                                     themeColor="error"
//                                                     fillMode="outline"
//                                                     onClick={() => {
//                                                         const copy = { ...formData };
//                                                         copy.lineItems = copy.lineItems.filter((_, i) => i !== idx);
//                                                         setFormData(copy);
//                                                     }}
//                                                 >
//                                                     🗑️
//                                                 </Button>
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     ) : (
//                         <div className="text-muted">No line items</div>
//                     )}
//                 </div>


//                 {/* Tax & Totals */}
//                 <div className="mt-4 row">
//                     <div className="col-md-6">
//                         <h6 className="fw-bold mb-2">Tax</h6>

//                         {/* IGST */}
//                         <div className="d-flex gap-2 align-items-center mb-2">
//                             <label className="fw-semibold" style={{ minWidth: 80 }}>
//                                 IGST
//                             </label>
//                             <input
//                                 name="igstPercent"
//                                 value={formData.igstPercent ?? ""}
//                                 onChange={handleNumberChange}
//                                 className="form-control"
//                                 placeholder="%"
//                                 style={{ width: 100 }}
//                                 type="number"
//                             />
//                         </div>

//                         {/* CGST */}
//                         <div className="d-flex gap-2 align-items-center mb-2">
//                             <label className="fw-semibold" style={{ minWidth: 80 }}>
//                                 CGST
//                             </label>
//                             <input
//                                 name="cgstPercent"
//                                 value={formData.cgstPercent ?? ""}
//                                 onChange={handleNumberChange}
//                                 className="form-control"
//                                 placeholder="%"
//                                 style={{ width: 100 }}
//                                 type="number"
//                             />
//                         </div>

//                         {/* SGST */}
//                         <div className="d-flex gap-2 align-items-center">
//                             <label className="fw-semibold" style={{ minWidth: 80 }}>
//                                 SGST
//                             </label>
//                             <input
//                                 name="sgstPercent"
//                                 value={formData.sgstPercent ?? ""}
//                                 onChange={handleNumberChange}
//                                 className="form-control"
//                                 placeholder="%"
//                                 style={{ width: 100 }}
//                                 type="number"
//                             />
//                         </div>
//                     </div>


//                     <div className="col-md-6">
//                         <h6 className="fw-bold mb-2">Total</h6>
//                         <div className="d-flex justify-content-between mb-2">
//                             <span>Net Total:</span>
//                             <input
//                                 type="number"
//                                 name="netTotal"
//                                 className="form-control w-25"
//                                 value={formData.netTotal ?? ""}
//                                 onChange={handleNumberChange}
//                             />
//                         </div>
//                         <div className="d-flex justify-content-between mb-2">
//                             <span>Tax Total:</span>
//                             <input
//                                 type="number"
//                                 name="igst"
//                                 className="form-control w-25"
//                                 value={formData.igst ?? ""}
//                                 onChange={handleNumberChange}
//                             />
//                         </div>
//                         <div className="d-flex justify-content-between mb-2">
//                             <span>Round Off:</span>
//                             <input
//                                 type="number"
//                                 name="roundOff"
//                                 className="form-control w-25"
//                                 value={formData.roundOff ?? ""}
//                                 onChange={handleNumberChange}
//                             />
//                         </div>
//                         <div className="d-flex justify-content-between fw-bold border-top pt-2 mb-3">
//                             <span>Grand Total:</span>
//                             <input
//                                 type="number"
//                                 name="grandTotal"
//                                 className="form-control w-25"
//                                 value={formData.grandTotal ?? ""}
//                                 onChange={handleNumberChange}
//                             />
//                         </div>
//                     </div>
//                 </div>

//                 {/* Message */}
//                 {message.text && (
//                     <div
//                         className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"} mt-3`}
//                         style={{
//                             fontWeight: 600,
//                             borderRadius: "8px",
//                             padding: "10px 15px",
//                             alignContent: "center",
//                         }}
//                     >
//                         {message.text}
//                     </div>
//                 )}

//                 {/* Buttons */}
//                 <div className="button-group mt-3 mb-4">
//                     <Button themeColor="primary" onClick={handleSave}>
//                         Save
//                     </Button>
//                     <Button type="button" onClick={handleCancel}>
//                         Cancel
//                     </Button>
//                 </div>

//             </div>
//         </div>
//     );
// };

// export default AllBillings_Simple;

import React, { useEffect, useState } from "react";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { Button } from "@progress/kendo-react-buttons";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import "bootstrap/dist/css/bootstrap.min.css";
import BillingNew from "./Billing";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";


const AllBillings_Simple = () => {
    const API_BASE = import.meta.env.VITE_API_BASE_URL;
    const [billings, setBillings] = useState([]);
    const [projects, setProjects] = useState([]);
    const [editingBilling, setEditingBilling] = useState(null);
    const [formData, setFormData] = useState({});
    const [message, setMessage] = useState({ text: "", type: "" });
    const [page, setPage] = useState({ skip: 0, take: 7 });
    const [showAdd, setShowAdd] = useState(false);
    const [isUserEditing, setIsUserEditing] = useState(false);

    // ✅ Normalize billing data so projectName is always available
    const normalizeBillings = (data) =>
        data.map(b => ({
            ...b,
            projectName: b.project?.projectName ?? (b.projectName ?? "")
        }));







    // <-- MODIFIED: This now only auto-clears error messages.
    // The success message is "cleared" by the navigation itself.
    useEffect(() => {
        if (!message.text || message.type === "success") return;
        const t = setTimeout(() => setMessage({ text: "", type: "" }), 5000);
        return () => clearTimeout(t);
    }, [message]);

    // ✅ Load billings + projects
    // useEffect(() => {
    //     fetch(`${API_BASE}/api/Billing`)
    //         .then((res) => res.json())
    //         .then((data) => setBillings(data))
    //         .catch(() => setMessage({ text: "❌ Failed to load billings", type: "error" }));

    //     fetch(`${API_BASE}/projects`)
    //         .then((res) => res.json())
    //         .then((data) => setProjects(data))
    //         .catch(console.error);
    // }, []);
    useEffect(() => {
        // load billings
        fetch(`${API_BASE}/api/Billing`)
            .then((res) => res.json())
            .then((data) => setBillings(normalizeBillings(data)))
            .catch(() =>
                setMessage({ text: "❌ Failed to load billings", type: "error" })
            );

        // load projects
        fetch(`${API_BASE}/api/projects`)
            .then((res) => res.json())
            .then((data) => setProjects(data))
            .catch(console.error);
    }, []);


    // --- ADDED ---
    // This useEffect automatically calculates all totals whenever
    // line items or tax percentages change.
    useEffect(() => {
        // Ensure formData and lineItems exist before calculating
        if (!formData || !formData.lineItems) return;

        const items = formData.lineItems || [];

        // 1. Calculate Net Total (Subtotal)
        const subtotal = items.reduce((acc, li) => {
            return acc + (parseFloat(li.amount || 0));
        }, 0);

        // 2. Parse Tax Percentages
        const igstPercent = parseFloat(formData.igstPercent || 0);
        const cgstPercent = parseFloat(formData.cgstPercent || 0);
        const sgstPercent = parseFloat(formData.sgstPercent || 0);

        // 3. Calculate Tax Amounts
        const igstAmount = subtotal * (igstPercent / 100);
        const cgstAmount = subtotal * (cgstPercent / 100);
        const sgstAmount = subtotal * (sgstPercent / 100);

        // 4. Calculate Total Tax
        // The 'igst' field in your form is used for "Total Tax"
        const totalTax = igstAmount + cgstAmount + sgstAmount;

        // 5. Parse Round Off
        const roundOff = parseFloat(formData.roundOff || 0);

        // 6. Calculate Grand Total
        const grandTotal = subtotal + totalTax + roundOff;

        // 7. Update state with all calculated values
        // We use a functional update to avoid stale state
        setFormData(prev => ({
            ...prev,
            netTotal: subtotal,
            igst: igstAmount,
            cgst: cgstAmount,
            sgst: sgstAmount,
            totalTax: totalTax,
            grandTotal: grandTotal,
        }));


    }, [formData.lineItems, formData.igstPercent, formData.cgstPercent, formData.sgstPercent, formData.roundOff]);
    // This effect re-runs when any of these dependencies change


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
    const handleBack = () => {
        setShowAdd(false);
        try {
            window.history.replaceState({}, "");
        } catch { }
    };

    // ✅ DELETE handler
    // ... inside AllBillings_Simple component ...

    // 1. STATE for the delete dialog
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [billingToDelete, setBillingToDelete] = useState(null);

    // 2. TRIGGER - The function attached to the Trash Icon
    const handleDelete = (billing) => {
        setBillingToDelete(billing);
        setShowDeleteConfirm(true);
    };

    // 3. CONFIRM - The function attached to "Yes" in the dialog
    const confirmDelete = async () => {
        if (!billingToDelete) return;

        try {
            const res = await fetch(`${API_BASE}/api/Billing/${billingToDelete.billingId}`, {
                method: "DELETE"
            });

            if (!res.ok) throw new Error("Delete failed");

            // Update UI
            setBillings(prev =>
                prev.filter(b => b.billingId !== billingToDelete.billingId)
            );

            setMessage({ text: "✅ Deleted successfully!", type: "success" });
            setTimeout(() => setMessage({ text: "", type: "" }), 3000);

        } catch (err) {
            console.error(err);
            setMessage({ text: "❌ Failed to delete", type: "error" });
        }

        // Close Dialog
        setShowDeleteConfirm(false);
        setBillingToDelete(null);
    };

    // 4. CANCEL - The function attached to "No"
    const cancelDelete = () => {
        setShowDeleteConfirm(false);
        setBillingToDelete(null);
    };

    // ✅ EDIT handler
   const handleEdit = async (billing) => {
    try {
        setIsUserEditing(false); // 🚫 prevent auto recalculation

        const res = await fetch(`${API_BASE}/api/Billing/${billing.billingId}`);
        const fullBilling = await res.json();

        setEditingBilling(fullBilling);
        setFormData({
            ...fullBilling,
            billDate: toDateInputValue(fullBilling.billDate),
            dateOfEstimate: toDateInputValue(fullBilling.dateOfEstimate),
            poDate: toDateInputValue(fullBilling.poDate),
            lineItems: fullBilling.lineItems || [],
        });
    } catch (err) {
        console.error(err);
        setMessage({ text: "❌ Failed to load billing details", type: "error" });
    }


};

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleNumberChange = (e) => {
        const { name, value } = e.target;
        const parsed = value === "" ? "" : parseFloat(value);
        setFormData((prev) => ({ ...prev, [name]: parsed }));
    };

    const handleProjectChange = (e) =>
        setFormData((prev) => ({ ...prev, projectName: e.value }));


    // --- ADDED ---
    // This function updates a specific line item and recalculates its amount
    const handleLineItemChange = (index, field, value) => {
        setFormData((prev) => {
            // Create a deep copy of the line items array
            const updatedLineItems = prev.lineItems.map((item, idx) => {
                if (idx === index) {
                    // Create a copy of the item and update the field
                    const updatedItem = { ...item, [field]: value };

                    // Now, recalculate the amount for this item
                    const quantity = parseFloat(updatedItem.quantity || 0);
                    const rate = parseFloat(updatedItem.rate || 0);
                    updatedItem.amount = (quantity * rate).toFixed(2); // Auto-calculate amount

                    return updatedItem;
                }
                return item; // Return unchanged item
            });

            // Return the new state with the updated line items
            return {
                ...prev,
                lineItems: updatedLineItems,
            };
        });
    };


    // ✅ SAVE handler (PUT)
    // --- MODIFIED ---
    const handleSave = async () => {
        try {
            if (!formData || !formData.billingId) {
                setMessage({ text: "❌ Missing billing id.", type: "error" });
                return;
            }

            const currentTime = new Date().toISOString();

            // --- MODIFIED PAYLOAD ---
            // Added all tax percentages and calculated totals
            // to ensure they are saved to the database.
            const payload = {
                ...formData,
                billDate: formData.billDate ? new Date(formData.billDate).toISOString() : null,
                dateOfEstimate: formData.dateOfEstimate ? new Date(formData.dateOfEstimate).toISOString() : null,
                poDate: formData.poDate ? new Date(formData.poDate).toISOString() : null,
                updatedDate: currentTime,
                GSTNumber: formData.gstNumber,

                // Save Tax Percentages
                igstPercent: formData.igstPercent ?? 0,
                cgstPercent: formData.cgstPercent ?? 0,
                sgstPercent: formData.sgstPercent ?? 0,

                // Save Calculated Totals
                // Save Calculated Totals
                netTotal: formData.netTotal ?? 0,
                igst: formData.igst ?? 0,
                cgst: formData.cgst ?? 0,
                sgst: formData.sgst ?? 0,
                totalTax: formData.totalTax ?? 0,
                roundOff: formData.roundOff ?? 0,
                grandTotal: formData.grandTotal ?? 0,

                LineItems: (formData.lineItems || []).map((li) => ({
                    LineItemId: li.lineItemId || 0,
                    MaterialCode: li.materialCode,
                    HSNCode: li.hsnCode,
                    Description: li.description,
                    UOM: li.uom,
                    Quantity: parseFloat(li.quantity || 0),
                    Rate: parseFloat(li.rate || 0),
                    Amount: parseFloat(li.amount || 0),
                })),
            };
            // --- END MODIFICATION ---

            const res = await fetch(`${API_BASE}/api/Billing/${formData.billingId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("API PUT failed");

            setBillings((prev) =>
                prev.map((b) =>
                    b.billingId === formData.billingId ? { ...b, ...payload } : b
                )
            );

            setFormData((prev) => ({ ...prev, updatedDate: currentTime }));

            // <-- MODIFIED: Updated message text
            setMessage({ text: "✅ Billing updated! Returning to list...", type: "success" });

            // <-- ADDED: Automatically go back to the list after 5 seconds
            setTimeout(() => {
                handleCancel(); // This function resets the view to the list
            }, 5000);

        } catch (err) {
            console.error(err);
            setMessage({ text: "❌ Failed to update billing", type: "error" });
        }
    };


    const handleCancel = () => {
        setEditingBilling(null);
        setFormData({});
        setMessage({ text: "", type: "" });
    };

    const handlePageChange = (event) => setPage(event.page);
    const pagedData = billings.slice(page.skip, page.skip + page.take);

    if (showAdd) {
        return (
            <>
                <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
                    <Button
                        icon="arrow-left"
                        size="small"
                        onClick={handleBack}
                        className="action-btn back-btn"
                        style={{ marginRight: 8 }}
                    >
                        <span className="tieup-action-btn-text">Back</span>
                    </Button>
                </div>
                {/* This component (BillingNew) will use its *own* 5-second timer 
                    and then call `onAdded` (which is `handleBack`) when done.
                */}
                <BillingNew onBack={handleBack} />
            </>
        );
    }

    // ✅ LIST VIEW
    if (!editingBilling) {
        return (
            <div className="container py-4">
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }} className="billing-action-bar">
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                        <Button
                            icon="refresh"
                            size="small"
                            onClick={() => {
                                fetch(`${API_BASE}/api/Billing`)
                                    .then((res) => res.json())
                                    .then((data) => setBillings(normalizeBillings(data)))
                                    .catch(() =>
                                        setMessage({
                                            text: "❌ Failed to refresh billings",
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
                            onClick={() => {
                                setShowAdd(true);
                                try {
                                    window.history.pushState({ view: "addBilling" }, "");
                                } catch { }
                            }}
                            themeColor="primary"
                            className="action-btn add-btn"
                        >
                            <span className="tieup-action-btn-text">New Billing</span>
                        </Button>
                    </div>
                </div>


                {/* This will show error messages on the list page if they exist */}
                {message.text && message.type === 'error' && (
                    <div className={`mt-3 mb-3 text-center fw-semibold text-danger`}>
                        {message.text}
                    </div>
                )}

                {billings.length === 0 ? (
                    <p className="text-muted text-center">No billings found.</p>
                ) : (
                    <div className="quotation-grid-wrapper" style={{ overflowX: "auto", paddingBottom: "10px" }}>
                        <div className="quotation-grid-inner" style={{ minWidth: "900px", overflowX: "auto" }}>
                            <Grid
                                data={pagedData}
                                pageable={true}
                                total={billings.length}
                                skip={page.skip}
                                take={page.take}
                                onPageChange={handlePageChange}
                            >
                                <GridColumn field="projectName" title="Project Name" width="150px" cell={(props) => (
                                    <td style={{ textAlign: 'left' }}>
                                        {props.dataItem[props.field]}
                                    </td>
                                )} />
                                <GridColumn
                                    field="updatedDate"      // <-- change this
                                    title="Last Modified At"
                                    width="180px"
                                    cell={(props) => (
                                        <td>
                                            {props.dataItem.updatedDate
                                                ? new Date(props.dataItem.updatedDate).toLocaleString()
                                                : "-"}
                                        </td>
                                    )}
                                />

                                {/* <GridColumn
                                    title="Actions"
                                    width="120px"
                                    cell={(props) => (
                                        <td style={{ textAlign: "center" }}>
                                            <Button
                                                size="small"
                                                themeColor="primary"
                                                onClick={() => handleEdit(props.dataItem)}
                                                style={{ whiteSpace: "nowrap", padding: "4px 12px" }}
                                            >
                                                Edit
                                            </Button>
                                        </td>
                                    )}
                                /> */}
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
                {/* ... existing Grid code ... */}

                {/* PASTE THIS DIALOG CODE HERE, AT THE BOTTOM OF THE LIST VIEW */}
                {showDeleteConfirm && (
                    <Dialog title={"Delete Confirmation"} onClose={cancelDelete} minWidth={300}>
                        <p style={{ margin: "25px", textAlign: "center" }}>
                            Are you sure you want to delete the billing for project <strong>{billingToDelete?.projectName}</strong>?
                        </p>
                        <DialogActionsBar>
                            <button
                                className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
                                onClick={cancelDelete}
                            >
                                No
                            </button>
                            <button
                                className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-error"
                                onClick={confirmDelete}
                            >
                                Yes
                            </button>
                        </DialogActionsBar>
                    </Dialog>
                )}
            </div>
        );
    }


    // ✅ EDIT VIEW (same structure reused)
    return (
        <div className="container-fluid py-3">
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
                <h4 className="fw-bold mb-3">Edit Bill</h4>

                {/* Projects */}
                <div className="mb-4">
                    <label className="form-label fw-bold">
                        Projects <span className="text-danger">*</span>
                    </label>
                    <div style={{ maxWidth: "320px" }}>
                        {/* <DropDownList
                            data={projects.map((p) => p.projectName)}
                            value={formData.projectName}
                            onChange={handleProjectChange}
                            defaultItem="Select Option"
                        /> */}
                        <DropDownList
                            data={projects}                      // pass full objects
                            dataItemKey="id"                     // the unique id field
                            textField="projectName"              // what to show
                            value={projects.find(p => p.id === formData.projectId) ?? null}
                            defaultItem={{ id: null, projectName: "Select Project" }}
                            onChange={(e) => {
                                const project = e.value;
                                setFormData(prev => ({
                                    ...prev,
                                    projectId: project?.id ?? null,
                                    projectName: project?.projectName ?? ""
                                }));
                            }}
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
                                    <div className="col-md-4">
                                        <label className="form-label">State</label>

                                        <input
                                            name="billingFromState"
                                            value={formData.billingFromState || ""}
                                            onChange={handleChange}
                                            className="form-control"
                                            placeholder="State"
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">State Code</label>

                                        <input
                                            name="billingFromStateCode"
                                            value={formData.billingFromStateCode || ""}
                                            onChange={handleChange}
                                            className="form-control"
                                            placeholder="State Code"
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">GSTIN</label>

                                        <input
                                            name="billingFromGSTIN"
                                            value={formData.billingFromGSTIN || ""}
                                            onChange={handleChange}
                                            className="form-control"
                                            placeholder="GSTIN"
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Brand</label>

                                        <input
                                            name="billingFromBrand"
                                            value={formData.billingFromBrand || ""}
                                            onChange={handleChange}
                                            className="form-control"
                                            placeholder="Brand"
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Contact Email / Phone (Optional)</label>

                                        <input
                                            name="billingFromContact"
                                            value={formData.billingFromContact || ""}
                                            onChange={handleChange}
                                            className="form-control"
                                            placeholder="ContactEmailorPhone"
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
                                    <div className="col-md-4">
                                        <label className="form-label">State</label>

                                        <input
                                            name="shippingState"
                                            value={formData.shippingState || ""}
                                            onChange={handleChange}
                                            className="form-control"
                                            placeholder="State"
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">State Code</label>

                                        <input
                                            name="shippingStateCode"
                                            value={formData.shippingStateCode || ""}
                                            onChange={handleChange}
                                            className="form-control"
                                            placeholder="State Code"
                                        />
                                    </div>
                                    <div className="col-md-4">
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
                                        <label className="form-label">Brand</label>

                                        <input
                                            name="shippingBrand"
                                            value={formData.shippingBrand || ""}
                                            onChange={handleChange}
                                            className="form-control"
                                            placeholder="Brand"
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Contact Email / Phone (Optional)</label>

                                        <input
                                            name="shippingContact"
                                            value={formData.shippingContact || ""}
                                            onChange={handleChange}
                                            className="form-control"
                                            placeholder="ContactEmailorPhone"
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
                                    <div className="col-md-4">
                                        <label className="form-label">State</label>

                                        <input
                                            name="billingToState"
                                            value={formData.billingToState || ""}
                                            onChange={handleChange}
                                            className="form-control"
                                            placeholder="State"
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">State Code</label>

                                        <input
                                            name="billingToStateCode"
                                            value={formData.billingToStateCode || ""}
                                            onChange={handleChange}
                                            className="form-control"
                                            placeholder="State Code"
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">GSTIN</label>

                                        <input
                                            name="billingToGSTIN"
                                            value={formData.billingToGSTIN || ""}
                                            onChange={handleChange}
                                            className="form-control"
                                            placeholder="GSTIN"
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

                        {/* Bill Number */}
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

                        {/* Bill Date */}
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

                        {/* Estimate No */}
                        <div className="col-md-3 col-sm-6">
                            <label className="form-label">Invoice No</label>
                            <input
                                name="estimateNo"
                                value={formData.estimateNo || ""}
                                onChange={handleChange}
                                className="form-control"
                                type="text"
                            />
                        </div>

                        {/* Date of Estimate */}
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

                        {/* Project ID */}
                        <div className="col-md-3 col-sm-6">
                            <label className="form-label">Project ID</label>
                            <input
                                name="projectId"
                                value={formData.projectId || ""}
                                onChange={handleChange}
                                className="form-control"
                                type="text"
                            />
                        </div>

                        {/* GST Number */}
                        <div className="col-md-3 col-sm-6">
                            <label className="form-label">GST Number</label>
                            <input
                                name="gstNumber"
                                value={formData.gstNumber || ""}
                                onChange={handleChange}
                                className="form-control"
                                type="text"
                            />
                        </div>

                        {/* PAN */}
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

                        {/* PO Number */}
                        <div className="col-md-3 col-sm-6">
                            <label className="form-label">PO Number</label>
                            <input
                                name="poNumber"
                                value={formData.poNumber || ""}
                                onChange={handleChange}
                                className="form-control"
                                type="text"
                            />
                        </div>

                        {/* PO Date */}
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

                        {/* PO Type */}
                        <div className="col-md-3 col-sm-6">
                            <label className="form-label">PO Type</label>
                            <input
                                name="poType"
                                value={formData.poType || ""}
                                onChange={handleChange}
                                className="form-control"
                                type="text"
                            />
                        </div>

                        {/* Sub(work Description) */}
                        <div className="col-md-6 col-sm-12">
                            <label className="form-label">Sub(work Description)</label>
                            <input
                                name="subWorkDescription"
                                value={formData.subWorkDescription || ""}
                                onChange={handleChange}
                                className="form-control"
                                type="text"
                            />
                        </div>

                        {/* Invoice Title / Subject */}
                        <div className="col-md-6 col-sm-12">
                            <label className="form-label">Invoice Title / Subject</label>
                            <input
                                name="invoiceTitle"
                                value={formData.invoiceTitle || ""}
                                onChange={handleChange}
                                className="form-control"
                                type="text"
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
                                            lineItemId: 0,
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
                                    {/* --- MODIFIED LINE ITEM INPUTS --- */}
                                    {formData.lineItems.map((li, idx) => (
                                        <tr key={idx}>
                                            <td>
                                                <input
                                                    className="form-control form-control-sm"
                                                    value={li.materialCode || ""}
                                                    onChange={(e) => handleLineItemChange(idx, "materialCode", e.target.value)}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    className="form-control form-control-sm"
                                                    value={li.hsnCode || ""}
                                                    onChange={(e) => handleLineItemChange(idx, "hsnCode", e.target.value)}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    className="form-control form-control-sm"
                                                    value={li.description || ""}
                                                    onChange={(e) => handleLineItemChange(idx, "description", e.target.value)}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    className="form-control form-control-sm"
                                                    value={li.uom || ""}
                                                    onChange={(e) => handleLineItemChange(idx, "uom", e.target.value)}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    className="form-control form-control-sm"
                                                    value={li.quantity || ""}
                                                    onChange={(e) => handleLineItemChange(idx, "quantity", e.target.value)}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    className="form-control form-control-sm"
                                                    value={li.rate || ""}
                                                    onChange={(e) => handleLineItemChange(idx, "rate", e.target.value)}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    className="form-control form-control-sm"
                                                    value={li.amount || ""}
                                                    readOnly // Make this read-only
                                                    style={{ backgroundColor: "#f8f9fa" }} // Optional: grey out
                                                />
                                            </td>

                                            {/* ✅ Delete Button (after Amount column) */}
                                            <td style={{ textAlign: "center" }}>
                                                <Button
                                                    size="small"
                                                    themeColor="error"
                                                    fillMode="outline"
                                                    onClick={() => {
                                                        const copy = { ...formData };
                                                        copy.lineItems = copy.lineItems.filter((_, i) => i !== idx);
                                                        setFormData(copy);
                                                    }}
                                                >
                                                    🗑️
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                    {/* --- END OF MODIFIED INPUTS --- */}
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
                        <div className="d-flex gap-2 align-items-center mb-2">
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
                        <div className="d-flex gap-2 align-items-center mb-2">
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


                    {/* --- MODIFIED TOTALS SECTION --- */}
                    <div className="col-md-6">
                        <h6 className="fw-bold mb-2">Total</h6>
                        <div className="d-flex justify-content-between mb-2">
                            <span>Net Total:</span>
                            <input
                                type="number"
                                name="netTotal"
                                className="form-control w-25"
                                value={formData.netTotal ?? ""}
                                readOnly // Make read-only
                                style={{ backgroundColor: "#f8f9fa" }} // Optional: grey out
                            />
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                            <span>Tax Total:</span>
                            <input
                                type="number"
                                name="totalTax"
                                className="form-control w-25"
                                value={formData.totalTax ?? 0}
                                readOnly
                                style={{ backgroundColor: "#f8f9fa" }}
                            />

                        </div>
                        <div className="d-flex justify-content-between mb-2">
                            <span>Round Off:</span>
                            <input
                                type="number"
                                name="roundOff"
                                className="form-control w-25"
                                value={formData.roundOff ?? ""}
                                onChange={handleNumberChange} // This remains editable
                            />
                        </div>
                        <div className="d-flex justify-content-between fw-bold border-top pt-2 mb-3">
                            <span>Grand Total:</span>
                            <input
                                type="number"
                                name="grandTotal"
                                className="form-control w-25"
                                value={formData.grandTotal ?? ""}
                                readOnly // Make read-only
                                style={{ backgroundColor: "#f8f9fa" }} // Optional: grey out
                            />
                        </div>
                    </div>
                    {/* --- END OF MODIFIED TOTALS --- */}
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

export default AllBillings_Simple;