// import React from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { Form, Field, FormElement } from "@progress/kendo-react-form";
// import { Button } from "@progress/kendo-react-buttons";
// import FormInput from "../components/Form/FormInput"; // adjust path if needed

// const Quotation = () => {
//   const handleSubmit = (dataItem) => {
//     console.log("Quotation Form Submitted:", dataItem);
//   };

//   return (
//     <div className="container-fluid py-3">
//       {/* Header */}
//       {/* Header */}
// <div className="d-flex justify-content-end align-items-center mb-3">
//   <Button themeColor="primary">Download PDF</Button>
// </div>


//       <Form
//         onSubmit={handleSubmit}
//         render={(formRenderProps) => (
//           <FormElement>
//             {/* Parties and Addresses */}
//             <div>
//               <h6 className="fw-bold mb-3">Parties and Addresses</h6>
//               <div className="row g-3">
//                 {/* Billing From */}
//                 <div className="col-md-6">
//                   <div className="border rounded p-3 h-100">
//                     <h6 className="fw-bold mb-2">
//                       Billing From (Bilva Interiors)
//                     </h6>
//                     <textarea
//                       name="billingFromAddress"
//                       className="form-control mb-2"
//                       placeholder="Address"
//                       style={{ height: "100px" }}
//                     ></textarea>

//                     <div className="row g-2 mt-2">
//                       <div className="col-md-6">
//                         <Field
//                           name="billingFromStateCode"
//                           label="State Code"
//                           component={FormInput}
//                         />
//                       </div>
//                       <div className="col-md-6">
//                         <Field
//                           name="billingFromGSTIN"
//                           label="GSTIN"
//                           component={FormInput}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Shipping Address */}
//                 <div className="col-md-6">
//                   <div className="border rounded p-3 h-100">
//                     <h6 className="fw-bold mb-2">Shipping Address</h6>
//                     <textarea
//                       name="shippingAddress"
//                       className="form-control mb-2"
//                       placeholder="Address"
//                       style={{ height: "100px" }}
//                     ></textarea>

//                     <div className="row g-2 mt-2">
//                       <div className="col-md-6">
//                         <Field
//                           name="shippingGSTIN"
//                           label="GSTIN"
//                           component={FormInput}
//                         />
//                       </div>
//                       <div className="col-md-6">
//                         <Field
//                           name="shippingBrand"
//                           label="Brand / Sub-brand"
//                           component={FormInput}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Billing To */}
//                 <div className="col-md-6">
//                   <div className="border rounded p-3 h-100">
//                     <h6 className="fw-bold mb-2">Billing To</h6>
//                     <textarea
//                       name="billingToAddress"
//                       className="form-control mb-2"
//                       placeholder="Address"
//                       style={{ height: "100px" }}
//                     ></textarea>

//                     <div className="row g-2 mt-2">
//                       <div className="col-md-6">
//                         <Field
//                           name="billingToConsigneeGSTIN"
//                           label="GSTIN (Consignee)"
//                           component={FormInput}
//                         />
//                       </div>
//                       <div className="col-md-6">
//                         <Field
//                           name="billingToBuyerGSTIN"
//                           label="GSTIN (Buyer)"
//                           component={FormInput}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Delivery Address */}
//                 <div className="col-md-6">
//                   <div className="border rounded p-3 h-100">
//                     <h6 className="fw-bold mb-2">Delivery Address</h6>
//                     <textarea
//                       name="deliveryAddress"
//                       className="form-control mb-2"
//                       placeholder="Address"
//                       style={{ height: "100px" }}
//                     ></textarea>

//                     <div className="row g-2 mt-2">
//                       <div className="col-md-4">
//                         <Field
//                           name="storeCode"
//                           label="Store Code"
//                           component={FormInput}
//                         />
//                       </div>
//                       <div className="col-md-4">
//                         <Field
//                           name="sapCode"
//                           label="SAP Code"
//                           component={FormInput}
//                         />
//                       </div>
//                       <div className="col-md-4">
//                         <Field
//                           name="vendorCode"
//                           label="Vendor Code"
//                           component={FormInput}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Document Details */}
//             <div className="mt-4">
//               <h6 className="fw-bold mb-3">Document Details</h6>
//               <div className="row g-3 align-items-end">
//                 {[
//                   "Bill Number",
//                   "Bill Date",
//                   "GST Number",
//                   "PAN",
//                   "Estimate No",
//                   "Date of Estimate",
//                   "Project ID",
//                   "PO Number",
//                   "PO Date",
//                   "PO Type",
//                   "Brand Name / Sub-brand",
//                   "Sub(work Description)",
//                 ].map((label, i) => (
//                   <div key={i} className="col-md-3 col-sm-6">
//                     {["Bill Date", "Date of Estimate", "PO Date"].includes(
//                       label
//                     ) ? (
//                       <div className="mb-2 mt-1">
//                         <label
//                           className="form-label fw-semibold"
//                           style={{ fontSize: "0.9rem", marginBottom: "4px" }}
//                         >
//                           {label}
//                         </label>
//                         <input
//                           type="date"
//                           className="form-control"
//                           style={{ height: "38px" }}
//                           name={label.replace(/\s+/g, "").toLowerCase()}
//                         />
//                       </div>
//                     ) : (
//                       <Field
//                         name={label.replace(/\s+/g, "").toLowerCase()}
//                         label={label}
//                         component={FormInput}
//                         type="text"
//                       />
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Tax and Total Section */}
//             <div className="mt-4">
//               <div className="row align-items-start">
//                 {/* Tax Options Section */}
//                <div className="col-md-6">
//   <h6 className="fw-bold mb-3">Tax Options</h6>

//   <div className="container-fluid px-0">
//   {/* First Row */}
//   <div className="row g-3 mb-2">
//     <div className="col-md-8">
//       <div className="d-flex gap-2">
//         <select className="form-select flex-fill">
//           <option>IGST</option>
//           <option>CGST</option>
//           <option>SGST</option>
//         </select>
//         <input
//           type="number"
//           className="form-control flex-fill"
//           placeholder="%"
//         />
//       </div>
//     </div>
//   </div>

//   {/* Second Row */}
//   <div className="row g-3">
//     <div className="col-md-8">
//       <div className="d-flex gap-2">
//         <select className="form-select flex-fill">
//           <option></option>
//           <option>IGST</option>
//           <option>CGST</option>
//           <option>SGST</option>
//         </select>
//         <input
//           type="number"
//           className="form-control flex-fill"
//           placeholder="%"
//         />
//       </div>
//     </div>
//   </div>
// </div>
// </div>



//                 {/* Total Section */}
//                 <div className="col-md-6">
//                   <h6 className="fw-bold mb-3">Total</h6>
//                   <div className="d-flex justify-content-between mb-2">
//                     <span>Net Total:</span>
//                   </div>
//                   <div className="d-flex justify-content-between mb-2">
//                     <span>IGST:</span>
//                   </div>
//                   <div className="d-flex justify-content-between mb-2">
//                     <span>Round Off:</span>
//                   </div>
//                   <div className="d-flex justify-content-between fw-bold border-top pt-2 mb-3">
//                     <span>Grand Total:</span>
//                   </div>
//                 </div>

//                 {/* Buttons aligned LEFT */}
//                 <div className="d-flex justify-content-start gap-2">
//                   <Button themeColor="primary">Save</Button>
//                   <Button>Cancel</Button>
//                 </div>
//               </div>
//             </div>

//           </FormElement>
//         )}
//       />
//     </div>
//   );
// };

// export default Quotation;




//projects drop down
// import React, { useEffect, useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { Form, Field, FormElement } from "@progress/kendo-react-form";
// import { Button } from "@progress/kendo-react-buttons";
// import FormInput from "../components/Form/FormInput"; // adjust path if needed

// const Quotation = () => {
//   const [projects, setProjects] = useState([]);
//   const API_BASE = "https://localhost:7142/api"; // ✅ change if your backend URL differs

//   useEffect(() => {
//     // Fetch Projects from backend
//     fetch(`${API_BASE}/projects`)
//       .then((res) => res.json())
//       .then((data) => setProjects(data))
//       .catch((err) => console.error("Error fetching projects:", err));
//   }, []);

//   // ✅ Handle form submit
//   const handleSubmit = async (dataItem) => {
//     console.log("Quotation Form Submitted:", dataItem);

//     // Prepare object for backend
//     const quotationData = {
//       quotationName: dataItem.projectName || "New Quotation",
//       clientName: dataItem.billingToAddress || "",
//       projectName: dataItem.projectId || "",
//       amount: dataItem.amount || 0,
//     };

//     try {
//       const response = await fetch(`${API_BASE}/quotations`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(quotationData),
//       });

//       if (response.ok) {
//         const result = await response.json();
//         alert("✅ Quotation saved successfully!");
//         console.log("Saved Quotation:", result);
//       } else {
//         const errText = await response.text();
//         alert("❌ Failed to save quotation: " + errText);
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       alert("❌ Error saving quotation. Check backend connection.");
//     }
//   };

//   return (
//     <div className="container-fluid py-3">
//       {/* Header */}
//       <div className="d-flex justify-content-end align-items-center mb-3">
//         <Button themeColor="primary">Download PDF</Button>
//       </div>

//       <Form
//         onSubmit={handleSubmit}
//         render={(formRenderProps) => (
//           <FormElement>
//             {/* 🔹 Projects Dropdown */}
//             <div className="mb-4">
//               <label
//                 htmlFor="projectSelect"
//                 className="form-label fw-bold"
//                 style={{ fontSize: "1rem" }}
//               >
//                 Projects
//               </label>
//               <Field
//                 name="projectId"
//                 component="select"
//                 className="form-select"
//                 style={{ maxWidth: "400px" }}
//               >
//                 <option value="">Select Project</option>
//                 {projects.map((proj, index) => (
//                   <option key={index} value={proj.projectName}>
//                     {proj.projectName}
//                   </option>
//                 ))}
//               </Field>
//             </div>

//             {/* Parties and Addresses */}
//             <div>
//               <h6 className="fw-bold mb-3">Parties and Addresses</h6>
//               <div className="row g-3">
//                 {/* Billing From */}
//                 <div className="col-md-6">
//                   <div className="border rounded p-3 h-100">
//                     <h6 className="fw-bold mb-2">
//                       Billing From (Bilva Interiors)
//                     </h6>
//                     <textarea
//                       name="billingFromAddress"
//                       className="form-control mb-2"
//                       placeholder="Address"
//                       style={{ height: "100px" }}
//                     ></textarea>

//                     <div className="row g-2 mt-2">
//                       <div className="col-md-6">
//                         <Field
//                           name="billingFromStateCode"
//                           label="State Code"
//                           component={FormInput}
//                         />
//                       </div>
//                       <div className="col-md-6">
//                         <Field
//                           name="billingFromGSTIN"
//                           label="GSTIN"
//                           component={FormInput}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Shipping Address */}
//                 <div className="col-md-6">
//                   <div className="border rounded p-3 h-100">
//                     <h6 className="fw-bold mb-2">Shipping Address</h6>
//                     <textarea
//                       name="shippingAddress"
//                       className="form-control mb-2"
//                       placeholder="Address"
//                       style={{ height: "100px" }}
//                     ></textarea>

//                     <div className="row g-2 mt-2">
//                       <div className="col-md-6">
//                         <Field
//                           name="shippingGSTIN"
//                           label="GSTIN"
//                           component={FormInput}
//                         />
//                       </div>
//                       <div className="col-md-6">
//                         <Field
//                           name="shippingBrand"
//                           label="Brand / Sub-brand"
//                           component={FormInput}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Billing To */}
//                 <div className="col-md-6">
//                   <div className="border rounded p-3 h-100">
//                     <h6 className="fw-bold mb-2">Billing To</h6>
//                     <textarea
//                       name="billingToAddress"
//                       className="form-control mb-2"
//                       placeholder="Address"
//                       style={{ height: "100px" }}
//                     ></textarea>

//                     <div className="row g-2 mt-2">
//                       <div className="col-md-6">
//                         <Field
//                           name="billingToConsigneeGSTIN"
//                           label="GSTIN (Consignee)"
//                           component={FormInput}
//                         />
//                       </div>
//                       <div className="col-md-6">
//                         <Field
//                           name="billingToBuyerGSTIN"
//                           label="GSTIN (Buyer)"
//                           component={FormInput}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Delivery Address */}
//                 <div className="col-md-6">
//                   <div className="border rounded p-3 h-100">
//                     <h6 className="fw-bold mb-2">Delivery Address</h6>
//                     <textarea
//                       name="deliveryAddress"
//                       className="form-control mb-2"
//                       placeholder="Address"
//                       style={{ height: "100px" }}
//                     ></textarea>

//                     <div className="row g-2 mt-2">
//                       <div className="col-md-4">
//                         <Field
//                           name="storeCode"
//                           label="Store Code"
//                           component={FormInput}
//                         />
//                       </div>
//                       <div className="col-md-4">
//                         <Field
//                           name="sapCode"
//                           label="SAP Code"
//                           component={FormInput}
//                         />
//                       </div>
//                       <div className="col-md-4">
//                         <Field
//                           name="vendorCode"
//                           label="Vendor Code"
//                           component={FormInput}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Document Details */}
//             <div className="mt-4">
//               <h6 className="fw-bold mb-3">Document Details</h6>
//               <div className="row g-3 align-items-end">
//                 {[
//                   "Bill Number",
//                   "Bill Date",
//                   "GST Number",
//                   "PAN",
//                   "Estimate No",
//                   "Date of Estimate",
//                   "Project ID",
//                   "PO Number",
//                   "PO Date",
//                   "PO Type",
//                   "Brand Name / Sub-brand",
//                   "Sub(work Description)",
//                 ].map((label, i) => (
//                   <div key={i} className="col-md-3 col-sm-6">
//                     {["Bill Date", "Date of Estimate", "PO Date"].includes(
//                       label
//                     ) ? (
//                       <div className="mb-2 mt-1">
//                         <label
//                           className="form-label fw-semibold"
//                           style={{ fontSize: "0.9rem", marginBottom: "4px" }}
//                         >
//                           {label}
//                         </label>
//                         <input
//                           type="date"
//                           className="form-control"
//                           style={{ height: "38px" }}
//                           name={label.replace(/\s+/g, "").toLowerCase()}
//                         />
//                       </div>
//                     ) : (
//                       <Field
//                         name={label.replace(/\s+/g, "").toLowerCase()}
//                         label={label}
//                         component={FormInput}
//                         type="text"
//                       />
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Tax and Total Section */}
//             <div className="mt-4">
//               <div className="row align-items-start">
//                 <div className="col-md-6">
//                   <h6 className="fw-bold mb-3">Tax Options</h6>
//                   <div className="container-fluid px-0">
//                     <div className="row g-3 mb-2">
//                       <div className="col-md-8">
//                         <div className="d-flex gap-2">
//                           <select className="form-select flex-fill">
//                             <option>IGST</option>
//                             <option>CGST</option>
//                             <option>SGST</option>
//                           </select>
//                           <input
//                             type="number"
//                             className="form-control flex-fill"
//                             placeholder="%"
//                           />
//                         </div>
//                       </div>
//                     </div>
//                     <div className="row g-3">
//                       <div className="col-md-8">
//                         <div className="d-flex gap-2">
//                           <select className="form-select flex-fill">
//                             <option></option>
//                             <option>IGST</option>
//                             <option>CGST</option>
//                             <option>SGST</option>
//                           </select>
//                           <input
//                             type="number"
//                             className="form-control flex-fill"
//                             placeholder="%"
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Total Section */}
//                 <div className="col-md-6">
//                   <h6 className="fw-bold mb-3">Total</h6>
//                   <div className="d-flex justify-content-between mb-2">
//                     <span>Net Total:</span>
//                   </div>
//                   <div className="d-flex justify-content-between mb-2">
//                     <span>IGST:</span>
//                   </div>
//                   <div className="d-flex justify-content-between mb-2">
//                     <span>Round Off:</span>
//                   </div>
//                   <div className="d-flex justify-content-between fw-bold border-top pt-2 mb-3">
//                     <span>Grand Total:</span>
//                   </div>
//                 </div>

//                 {/* Buttons aligned LEFT */}
//                 <div className="d-flex justify-content-start gap-2">
//                   <Button
//                     themeColor="primary"
//                     onClick={formRenderProps.onSubmit}
//                   >
//                     Save
//                   </Button>
//                   <Button type="button">Cancel</Button>
//                 </div>
//               </div>
//             </div>
//           </FormElement>
//         )}
//       />
//     </div>
//   );
// };

// export default Quotation;
//correct code
// import React, { useEffect, useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { Form, Field, FormElement } from "@progress/kendo-react-form";
// import { Button } from "@progress/kendo-react-buttons";
// import { DropDownList } from "@progress/kendo-react-dropdowns";
// import FormInput from "../components/Form/FormInput"; // adjust path if needed

// const Quotation = () => {
//   const [projects, setProjects] = useState([]);
//   const [message, setMessage] = useState({ text: "", type: "" });
//   const API_BASE = "https://localhost:7142/api";

//   useEffect(() => {
//     fetch(`${API_BASE}/projects`)
//       .then((res) => res.json())
//       .then((data) => setProjects(data))
//       .catch((err) => console.error("Error fetching projects:", err));
//   }, []);

//   // ✅ Auto-clear success message after 5 seconds
//   useEffect(() => {
//     if (message.type === "success") {
//       const timer = setTimeout(() => setMessage({ text: "", type: "" }), 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [message]);

//   const handleSubmit = async (dataItem) => {
//     setMessage({ text: "", type: "" });

//     const formElements = document.querySelectorAll("input, textarea, .k-input-inner");
//     let isValid = true;
//     formElements.forEach((el) => {
//       if (el.offsetParent !== null && !el.value.trim()) {
//         isValid = false;
//       }
//     });

//     if (!isValid) {
//       setMessage({
//         text: "❌ Please fill all the required fields before saving.",
//         type: "error",
//       });
//       return;
//     }

//     const quotationData = {
//       quotationName: dataItem.projectName || "New Quotation",
//       clientName: dataItem.billingToAddress || "",
//       projectName: dataItem.projectId || "",
//       amount: dataItem.amount || 0,
//     };

//     try {
//       const response = await fetch(`${API_BASE}/quotations`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(quotationData),
//       });

//       if (response.ok) {
//         const result = await response.json();
//         setMessage({
//           text: "✅ Quotation saved successfully!",
//           type: "success",
//         });
//         console.log("Saved Quotation:", result);
//       } else {
//         const errText = await response.text();
//         setMessage({
//           text: "❌ Failed to save quotation: " + errText,
//           type: "error",
//         });
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       setMessage({
//         text: "❌ Error saving quotation. Check backend connection.",
//         type: "error",
//       });
//     }
//   };

//   // ✅ Dropdown Data
//   const taxOptions = ["IGST", "CGST", "SGST"];

//   // ✅ Custom Kendo Dropdown Field (fixed width)
//   const DropDownField = (fieldRenderProps) => (
//     <div style={{ width: "200px" }}>
//       <DropDownList
//         data={fieldRenderProps.data}
//         value={fieldRenderProps.value}
//         onChange={(e) => fieldRenderProps.onChange({ value: e.value })}
//         defaultItem="Select Option"
//         style={{ width: "100%" }}
//       />
//     </div>
//   );

//   return (
//     <div className="container-fluid py-3">
//       <div className="d-flex justify-content-end align-items-center mb-3">
//         <Button themeColor="primary">Download PDF</Button>
//       </div>

//       <Form
//         onSubmit={handleSubmit}
//         render={(formRenderProps) => (
//           <FormElement>
//             {/* ✅ Project Dropdown */}
//             <div className="mb-4">
//               <label
//                 htmlFor="projectSelect"
//                 className="form-label fw-bold"
//                 style={{ fontSize: "1rem" }}
//               >
//                 Projects
//               </label>
//               <div style={{ maxWidth: "320px" }}>
//                 <Field
//                   name="projectId"
//                   component={DropDownField}
//                   data={projects.map((proj) => proj.projectName)}
//                 />
//               </div>
//             </div>

            // {/* Parties and Addresses */}
            // <div>
            //   <h6 className="fw-bold mb-3">Parties and Addresses</h6>
            //   <div className="row g-3">
            //     {/* Billing From */}
            //     <div className="col-md-6">
            //       <div className="border rounded p-3 h-100">
            //         <h6 className="fw-bold mb-2">Billing From (Bilva Interiors)</h6>
            //         <textarea
            //           name="billingFromAddress"
            //           className="form-control mb-2"
            //           placeholder="Address"
            //           style={{ height: "100px" }}
            //           required
            //         ></textarea>

            //         <div className="row g-2 mt-2">
            //           <div className="col-md-6">
            //             <Field
            //               name="billingFromStateCode"
            //               label="State Code"
            //               component={FormInput}
            //             />
            //           </div>
            //           <div className="col-md-6">
            //             <Field
            //               name="billingFromGSTIN"
            //               label="GSTIN"
            //               component={FormInput}
            //             />
            //           </div>
            //         </div>
            //       </div>
            //     </div>

            //     {/* Shipping Address */}
            //     <div className="col-md-6">
            //       <div className="border rounded p-3 h-100">
            //         <h6 className="fw-bold mb-2">Shipping Address</h6>
            //         <textarea
            //           name="shippingAddress"
            //           className="form-control mb-2"
            //           placeholder="Address"
            //           style={{ height: "100px" }}
            //           required
            //         ></textarea>

            //         <div className="row g-2 mt-2">
            //           <div className="col-md-6">
            //             <Field
            //               name="shippingGSTIN"
            //               label="GSTIN"
            //               component={FormInput}
            //             />
            //           </div>
            //           <div className="col-md-6">
            //             <Field
            //               name="shippingBrand"
            //               label="Brand / Sub-brand"
            //               component={FormInput}
            //             />
            //           </div>
            //         </div>
            //       </div>
            //     </div>

            //     {/* Billing To */}
            //     <div className="col-md-6">
            //       <div className="border rounded p-3 h-100">
            //         <h6 className="fw-bold mb-2">Billing To</h6>
            //         <textarea
            //           name="billingToAddress"
            //           className="form-control mb-2"
            //           placeholder="Address"
            //           style={{ height: "100px" }}
            //           required
            //         ></textarea>

            //         <div className="row g-2 mt-2">
            //           <div className="col-md-6">
            //             <Field
            //               name="billingToConsigneeGSTIN"
            //               label="GSTIN (Consignee)"
            //               component={FormInput}
            //             />
            //           </div>
            //           <div className="col-md-6">
            //             <Field
            //               name="billingToBuyerGSTIN"
            //               label="GSTIN (Buyer)"
            //               component={FormInput}
            //             />
            //           </div>
            //         </div>
            //       </div>
            //     </div>

            //     {/* Delivery Address */}
            //     <div className="col-md-6">
            //       <div className="border rounded p-3 h-100">
            //         <h6 className="fw-bold mb-2">Delivery Address</h6>
            //         <textarea
            //           name="deliveryAddress"
            //           className="form-control mb-2"
            //           placeholder="Address"
            //           style={{ height: "100px" }}
            //           required
            //         ></textarea>

            //         <div className="row g-2 mt-2">
            //           <div className="col-md-4">
            //             <Field
            //               name="storeCode"
            //               label="Store Code"
            //               component={FormInput}
            //             />
            //           </div>
            //           <div className="col-md-4">
            //             <Field
            //               name="sapCode"
            //               label="SAP Code"
            //               component={FormInput}
            //             />
            //           </div>
            //           <div className="col-md-4">
            //             <Field
            //               name="vendorCode"
            //               label="Vendor Code"
            //               component={FormInput}
            //             />
            //           </div>
            //         </div>
            //       </div>
            //     </div>
            //   </div>
            // </div>

            // {/* Document Details */}
            // <div className="mt-4">
            //   <h6 className="fw-bold mb-3">Document Details</h6>
            //   <div className="row g-3 align-items-end">
            //     {[
            //       "Bill Number",
            //       "Bill Date",
            //       "GST Number",
            //       "PAN",
            //       "Estimate No",
            //       "Date of Estimate",
            //       "Project ID",
            //       "PO Number",
            //       "PO Date",
            //       "PO Type",
            //       "Brand Name / Sub-brand",
            //       "Sub(work Description)",
            //     ].map((label, i) => (
            //       <div key={i} className="col-md-3 col-sm-6">
            //         {["Bill Date", "Date of Estimate", "PO Date"].includes(label) ? (
            //           <div className="mb-2 mt-1">
            //             <label className="form-label fw-semibold" style={{ fontSize: "0.9rem" }}>
            //               {label}
            //             </label>
            //             <input
            //               type="date"
            //               className="form-control"
            //               style={{ height: "38px" }}
            //               name={label.replace(/\s+/g, "").toLowerCase()}
            //               required
            //             />
            //           </div>
            //         ) : (
            //           <Field
            //             name={label.replace(/\s+/g, "").toLowerCase()}
            //             label={label}
            //             component={FormInput}
            //             type="text"
            //           />
            //         )}
            //       </div>
            //     ))}
            //   </div>
            // </div>

//             {/* ✅ Tax and Total Section */}
//             <div className="mt-4">
//               <div className="row align-items-start">
//                 <div className="col-md-6">
//                   <h6 className="fw-bold mb-3">Tax Options</h6>
//                   <div className="container-fluid px-0">
//                     {[1, 3].map((num) => (
//                       <div className="row g-3 mb-2" key={num}>
//                         <div className="col-md-6 d-flex gap-2 align-items-center">
//                           <Field
//                             name={`taxOption${num}`}
//                             component={DropDownField}
//                             data={taxOptions}
//                           />
//                           <input
//                             type="number"
//                             className="form-control"
//                             style={{ width: "100px" }}
//                             placeholder="%"
//                             required
//                           />
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Total Section */}
//                 <div className="col-md-6">
//                   <h6 className="fw-bold mb-3">Total</h6>
//                   <div className="d-flex justify-content-between mb-2">
//                     <span>Net Total:</span>
//                   </div>
//                   <div className="d-flex justify-content-between mb-2">
//                     <span>IGST:</span>
//                   </div>
//                   <div className="d-flex justify-content-between mb-2">
//                     <span>Round Off:</span>
//                   </div>
//                   <div className="d-flex justify-content-between fw-bold border-top pt-2 mb-3">
//                     <span>Grand Total:</span>
//                   </div>
//                 </div>

//                 {/* ✅ Error/Success Message */}
//                 {message.text && (
//                   <div
//                     className={`mt-2 mb-3 text-center fw-semibold ${
//                       message.type === "success" ? "text-success" : "text-danger"
//                     }`}
//                   >
//                     {message.text}
//                   </div>
//                 )}

//                 {/* Buttons */}
//                 <div className="d-flex justify-content-start gap-2 mb-4">
//                   <Button themeColor="primary" onClick={formRenderProps.onSubmit}>
//                     Save
//                   </Button>
//                   <Button type="button">Cancel</Button>
//                 </div>
//               </div>
//             </div>
//           </FormElement>
//         )}
//       />
//     </div>
//   );
// };

// export default Quotation;




// import React, { useEffect, useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { Form, Field, FormElement } from "@progress/kendo-react-form";
// import { Button } from "@progress/kendo-react-buttons";
// import { DropDownList } from "@progress/kendo-react-dropdowns";
// import { Grid, GridColumn } from "@progress/kendo-react-grid"; // ✅ Added for Line Items Grid
// import FormInput from "../components/Form/FormInput"; // adjust path if needed

// const Quotation = () => {
//   const [projects, setProjects] = useState([]);
//   const [message, setMessage] = useState({ text: "", type: "" });
//   const [lineItems, setLineItems] = useState([]); // ✅ Added for Line Items
//   const API_BASE = "https://localhost:7142/api";

//   useEffect(() => {
//     fetch(`${API_BASE}/projects`)
//       .then((res) => res.json())
//       .then((data) => setProjects(data))
//       .catch((err) => console.error("Error fetching projects:", err));
//   }, []);

//   useEffect(() => {
//     if (message.type === "success") {
//       const timer = setTimeout(() => setMessage({ text: "", type: "" }), 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [message]);

//   const handleSubmit = async (dataItem) => {
//     setMessage({ text: "", type: "" });

//     // ✅ Validate Project Dropdown (Mandatory)
//     if (!dataItem.projectId || dataItem.projectId === "Select Option") {
//       setMessage({
//         text: "❌ Please select a project before saving.",
//         type: "error",
//       });
//       return;
//     }

//     // ✅ Validate other visible fields
//     const formElements = document.querySelectorAll("input, textarea, select");
//     let isValid = true;
//     formElements.forEach((el) => {
//       if (el.offsetParent !== null) {
//         const value = el.value ? el.value.trim() : "";
//         if (value === "") {
//           isValid = false;
//         }
//       }
//     });

//     if (!isValid) {
//       setMessage({
//         text: "❌ Please fill all the required fields before saving.",
//         type: "error",
//       });
//       return;
//     }

//     const quotationData = {
//       quotationName: dataItem.projectName || "New Quotation",
//       clientName: dataItem.billingToAddress || "",
//       projectName: dataItem.projectId || "",
//       amount: dataItem.amount || 0,
//       lineItems: lineItems,
//     };

//     try {
//       const response = await fetch(`${API_BASE}/quotations`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(quotationData),
//       });

//       if (response.ok) {
//         const result = await response.json();
//         setMessage({
//           text: "✅ Quotation saved successfully!",
//           type: "success",
//         });
//         console.log("Saved Quotation:", result);
//       } else {
//         const errText = await response.text();
//         setMessage({
//           text: "❌ Failed to save quotation: " + errText,
//           type: "error",
//         });
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       setMessage({
//         text: "❌ Error saving quotation. Check backend connection.",
//         type: "error",
//       });
//     }
//   };

//   // ✅ Dropdown Data
//   const taxOptions = ["IGST", "CGST", "SGST"];

//   // ✅ Custom Kendo Dropdown Field (fixed width)
//   const DropDownField = (fieldRenderProps) => (
//     <div style={{ width: "200px" }}>
//       <DropDownList
//         data={fieldRenderProps.data}
//         value={fieldRenderProps.value}
//         onChange={(e) => fieldRenderProps.onChange({ value: e.value })}
//         defaultItem="Select Option"
//         style={{ width: "100%" }}
//       />
//     </div>
//   );

//   // ✅ Add Line Item Handler
//   const addLineItem = () => {
//     const newItem = {
//       materialCode: "",
//       hsnCode: "",
//       description: "",
//       uom: "",
//       quantity: 0,
//       rate: 0,
//       amount: 0,
//     };
//     setLineItems([...lineItems, newItem]);
//   };

//   return (
//     <div className="container-fluid py-3">
//       <div className="d-flex justify-content-end align-items-center mb-3">
//         <Button themeColor="primary">Download PDF</Button>
//       </div>

//       <Form
//         onSubmit={handleSubmit}
//         render={(formRenderProps) => (
//           <FormElement>
//             {/* ✅ Project Dropdown (Now Mandatory) */}
//             <div className="mb-4">
//               <label
//                 htmlFor="projectSelect"
//                 className="form-label fw-bold"
//                 style={{ fontSize: "1rem" }}
//               >
//                 Projects <span className="text-danger">*</span>
//               </label>
//               <div style={{ maxWidth: "320px" }}>
//                 <Field
//                   name="projectId"
//                   component={DropDownField}
//                   data={projects.map((proj) => proj.projectName)}
//                 />
//               </div>
//             </div>

//             {/* Parties and Addresses */}
//             <div>
//               <h6 className="fw-bold mb-3">Parties and Addresses</h6>
//               <div className="row g-3">
//                 {/* Billing From */}
//                 <div className="col-md-6">
//                   <div className="border rounded p-3 h-100">
//                     <h6 className="fw-bold mb-2">Billing From (Bilva Interiors)</h6>
//                     <textarea
//                       name="billingFromAddress"
//                       className="form-control mb-2"
//                       placeholder="Address"
//                       style={{ height: "100px" }}
//                       required
//                     ></textarea>

//                     <div className="row g-2 mt-2">
//                       <div className="col-md-6">
//                         <Field
//                           name="billingFromStateCode"
//                           label="State Code"
//                           component={FormInput}
//                         />
//                       </div>
//                       <div className="col-md-6">
//                         <Field
//                           name="billingFromGSTIN"
//                           label="GSTIN"
//                           component={FormInput}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Shipping Address */}
//                 <div className="col-md-6">
//                   <div className="border rounded p-3 h-100">
//                     <h6 className="fw-bold mb-2">Shipping Address</h6>
//                     <textarea
//                       name="shippingAddress"
//                       className="form-control mb-2"
//                       placeholder="Address"
//                       style={{ height: "100px" }}
//                       required
//                     ></textarea>

//                     <div className="row g-2 mt-2">
//                       <div className="col-md-6">
//                         <Field
//                           name="shippingGSTIN"
//                           label="GSTIN"
//                           component={FormInput}
//                         />
//                       </div>
//                       <div className="col-md-6">
//                         <Field
//                           name="shippingBrand"
//                           label="Brand / Sub-brand"
//                           component={FormInput}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Billing To */}
//                 <div className="col-md-6">
//                   <div className="border rounded p-3 h-100">
//                     <h6 className="fw-bold mb-2">Billing To</h6>
//                     <textarea
//                       name="billingToAddress"
//                       className="form-control mb-2"
//                       placeholder="Address"
//                       style={{ height: "100px" }}
//                       required
//                     ></textarea>

//                     <div className="row g-2 mt-2">
//                       <div className="col-md-6">
//                         <Field
//                           name="billingToConsigneeGSTIN"
//                           label="GSTIN (Consignee)"
//                           component={FormInput}
//                         />
//                       </div>
//                       <div className="col-md-6">
//                         <Field
//                           name="billingToBuyerGSTIN"
//                           label="GSTIN (Buyer)"
//                           component={FormInput}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Delivery Address */}
//                 <div className="col-md-6">
//                   <div className="border rounded p-3 h-100">
//                     <h6 className="fw-bold mb-2">Delivery Address</h6>
//                     <textarea
//                       name="deliveryAddress"
//                       className="form-control mb-2"
//                       placeholder="Address"
//                       style={{ height: "100px" }}
//                       required
//                     ></textarea>

//                     <div className="row g-2 mt-2">
//                       <div className="col-md-4">
//                         <Field
//                           name="storeCode"
//                           label="Store Code"
//                           component={FormInput}
//                         />
//                       </div>
//                       <div className="col-md-4">
//                         <Field
//                           name="sapCode"
//                           label="SAP Code"
//                           component={FormInput}
//                         />
//                       </div>
//                       <div className="col-md-4">
//                         <Field
//                           name="vendorCode"
//                           label="Vendor Code"
//                           component={FormInput}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Document Details */}
//             <div className="mt-4">
//               <h6 className="fw-bold mb-3">Document Details</h6>
//               <div className="row g-3 align-items-end">
//                 {[
//                   "Bill Number",
//                   "Bill Date",
//                   "GST Number",
//                   "PAN",
//                   "Estimate No",
//                   "Date of Estimate",
//                   "Project ID",
//                   "PO Number",
//                   "PO Date",
//                   "PO Type",
//                   "Brand Name / Sub-brand",
//                   "Sub(work Description)",
//                 ].map((label, i) => (
//                   <div key={i} className="col-md-3 col-sm-6">
//                     {["Bill Date", "Date of Estimate", "PO Date"].includes(label) ? (
//                       <div className="mb-2 mt-1">
//                         <label className="form-label fw-semibold" style={{ fontSize: "0.9rem" }}>
//                           {label}
//                         </label>
//                         <input
//                           type="date"
//                           className="form-control"
//                           style={{ height: "38px" }}
//                           name={label.replace(/\s+/g, "").toLowerCase()}
//                           required
//                         />
//                       </div>
//                     ) : (
//                       <Field
//                         name={label.replace(/\s+/g, "").toLowerCase()}
//                         label={label}
//                         component={FormInput}
//                         type="text"
//                       />
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Line Items */}
//             <div className="mt-4 border rounded p-3">
//               <div className="d-flex justify-content-between align-items-center mb-2">
//                 <h6 className="fw-bold mb-0">Line Items</h6>
//                 <Button
//                   themeColor="primary"
//                   size="small"
//                   onClick={addLineItem}
//                 >
//                   + Add Item
//                 </Button>
//               </div>

//               <Grid
//                 data={lineItems}
//                 style={{
//                   height: "auto",
//                   backgroundColor: "white",
//                   borderRadius: "8px",
//                 }}
//               >
//                 <GridColumn field="materialCode" title="Material Code" />
//                 <GridColumn field="hsnCode" title="HSN Code" />
//                 <GridColumn field="description" title="Description" />
//                 <GridColumn field="uom" title="UOM" />
//                 <GridColumn field="quantity" title="Quantity" />
//                 <GridColumn field="rate" title="Rate" />
//                 <GridColumn field="amount" title="Amount" />
//               </Grid>
//               {lineItems.length === 0 && (
//                 <div className="text-muted small mt-2">
//                   No expense items added.
//                 </div>
//               )}
//             </div>

//             {/* Tax and Total Section */}
//             <div className="mt-4">
//               <div className="row align-items-start">
//                 <div className="col-md-6">
//                   <h6 className="fw-bold mb-3">Tax Options</h6>
//                   <div className="container-fluid px-0">
//                     <div className="row g-3 mb-2">
//                       <div className="col-md-6 d-flex gap-2 align-items-center">
//                         <Field name="taxOption1" component={DropDownField} data={taxOptions} />
//                         <input type="number" className="form-control" placeholder="%" required style={{ width: "100px" }} />
//                       </div>
//                     </div>
//                     <div className="row g-3">
//                       <div className="col-md-6 d-flex gap-2 align-items-center">
//                         <Field name="taxOption3" component={DropDownField} data={taxOptions} />
//                         <input type="number" className="form-control" placeholder="%" required style={{ width: "100px" }} />
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Total Section */}
//                 <div className="col-md-6">
//                   <h6 className="fw-bold mb-3">Total</h6>
//                   <div className="d-flex justify-content-between mb-2">
//                     <span>Net Total:</span>
//                   </div>
//                   <div className="d-flex justify-content-between mb-2">
//                     <span>IGST:</span>
//                   </div>
//                   <div className="d-flex justify-content-between mb-2">
//                     <span>Round Off:</span>
//                   </div>
//                   <div className="d-flex justify-content-between fw-bold border-top pt-2 mb-3">
//                     <span>Grand Total:</span>
//                   </div>
//                 </div>

//                 {/* ✅ Error/Success Message */}
//                 {message.text && (
//                   <div
//                     className={`mt-2 mb-3 text-center fw-semibold ${
//                       message.type === "success" ? "text-success" : "text-danger"
//                     }`}
//                   >
//                     {message.text}
//                   </div>
//                 )}

//                 {/* Buttons */}
//                 <div className="d-flex justify-content-start gap-2 mb-4">
//                   <Button themeColor="primary" onClick={formRenderProps.onSubmit}>
//                     Save
//                   </Button>
//                   <Button type="button">Cancel</Button>
//                 </div>
//               </div>
//             </div>
//           </FormElement>
//         )}
//       />
//     </div>
//   );
// };

// export default Quotation;


// import React, { useEffect, useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { Form, Field, FormElement } from "@progress/kendo-react-form";
// import { Button } from "@progress/kendo-react-buttons";
// import { DropDownList } from "@progress/kendo-react-dropdowns";
// import { Grid, GridColumn } from "@progress/kendo-react-grid";
// import FormInput from "../components/Form/FormInput"; // adjust path if needed

// const Quotation = () => {
//   const [projects, setProjects] = useState([]);
//   const [message, setMessage] = useState({ text: "", type: "" });
//   const [lineItems, setLineItems] = useState([]);
//   const API_BASE = "https://localhost:7142/api";

//   useEffect(() => {
//     fetch(`${API_BASE}/projects`)
//       .then((res) => res.json())
//       .then((data) => setProjects(data))
//       .catch((err) => console.error("Error fetching projects:", err));
//   }, []);

//   useEffect(() => {
//     if (message.type === "success") {
//       const timer = setTimeout(() => setMessage({ text: "", type: "" }), 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [message]);

//   const handleSubmit = async (dataItem) => {
//     setMessage({ text: "", type: "" });

//     // ✅ Validate Project Dropdown (Mandatory)
//     if (!dataItem.projectId || dataItem.projectId === "Select Option") {
//       setMessage({
//         text: "❌ Please select a project before saving.",
//         type: "error",
//       });
//       return;
//     }

//     // ✅ Validate other visible fields
//     const formElements = document.querySelectorAll("input, textarea, select");
//     let isValid = true;
//     formElements.forEach((el) => {
//       if (el.offsetParent !== null) {
//         const value = el.value ? el.value.trim() : "";
//         if (value === "") {
//           isValid = false;
//         }
//       }
//     });

//     if (!isValid) {
//       setMessage({
//         text: "❌ Please fill all the required fields before saving.",
//         type: "error",
//       });
//       return;
//     }

//     // ✅ Removed quotationName field
//     const quotationData = {
//       clientName: dataItem.billingToAddress || "",
//       projectName: dataItem.projectId || "",
//       amount: dataItem.amount || 0,
//       lineItems: lineItems,
//     };

//     try {
//       const response = await fetch(`${API_BASE}/quotations`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(quotationData),
//       });

//       if (response.ok) {
//         const result = await response.json();
//         setMessage({
//           text: "✅ Quotation saved successfully!",
//           type: "success",
//         });
//         console.log("Saved Quotation:", result);
//       } else {
//         const errText = await response.text();
//         setMessage({
//           text: "❌ Failed to save quotation: " + errText,
//           type: "error",
//         });
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       setMessage({
//         text: "❌ Error saving quotation. Check backend connection.",
//         type: "error",
//       });
//     }
//   };

//   const taxOptions = ["IGST", "CGST", "SGST"];

//   const DropDownField = (fieldRenderProps) => (
//     <div style={{ width: "200px" }}>
//       <DropDownList
//         data={fieldRenderProps.data}
//         value={fieldRenderProps.value}
//         onChange={(e) => fieldRenderProps.onChange({ value: e.value })}
//         defaultItem="Select Option"
//         style={{ width: "100%" }}
//       />
//     </div>
//   );

//   const addLineItem = () => {
//     const newItem = {
//       materialCode: "",
//       hsnCode: "",
//       description: "",
//       uom: "",
//       quantity: 0,
//       rate: 0,
//       amount: 0,
//     };
//     setLineItems([...lineItems, newItem]);
//   };

//   return (
//     <div className="container-fluid py-3">
//       <div className="d-flex justify-content-end align-items-center mb-3">
//         <Button themeColor="primary">Download PDF</Button>
//       </div>

//       <Form
//         onSubmit={handleSubmit}
//         render={(formRenderProps) => (
//           <FormElement>
//             {/* ✅ Project Dropdown */}
//             <div className="mb-4">
//               <label
//                 htmlFor="projectSelect"
//                 className="form-label fw-bold"
//                 style={{ fontSize: "1rem" }}
//               >
//                 Projects <span className="text-danger">*</span>
//               </label>
//               <div style={{ maxWidth: "320px" }}>
//                 <Field
//                   name="projectId"
//                   component={DropDownField}
//                   data={projects.map((proj) => proj.projectName)}
//                 />
//               </div>
//             </div>

//             {/* Parties and Addresses */}
//             <div>
//               <h6 className="fw-bold mb-3">Parties and Addresses</h6>
//               <div className="row g-3">
//                 {/* Billing From */}
//                 <div className="col-md-6">
//                   <div className="border rounded p-3 h-100">
//                     <h6 className="fw-bold mb-2">
//                       Billing From (Bilva Interiors)
//                     </h6>
//                     <textarea
//                       name="billingFromAddress"
//                       className="form-control mb-2"
//                       placeholder="Address"
//                       style={{ height: "100px" }}
//                       required
//                     ></textarea>

//                     <div className="row g-2 mt-2">
//                       <div className="col-md-6">
//                         <Field
//                           name="billingFromStateCode"
//                           label="State Code"
//                           component={FormInput}
//                         />
//                       </div>
//                       <div className="col-md-6">
//                         <Field
//                           name="billingFromGSTIN"
//                           label="GSTIN"
//                           component={FormInput}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Shipping Address */}
//                 <div className="col-md-6">
//                   <div className="border rounded p-3 h-100">
//                     <h6 className="fw-bold mb-2">Shipping Address</h6>
//                     <textarea
//                       name="shippingAddress"
//                       className="form-control mb-2"
//                       placeholder="Address"
//                       style={{ height: "100px" }}
//                       required
//                     ></textarea>

//                     <div className="row g-2 mt-2">
//                       <div className="col-md-6">
//                         <Field
//                           name="shippingGSTIN"
//                           label="GSTIN"
//                           component={FormInput}
//                         />
//                       </div>
//                       <div className="col-md-6">
//                         <Field
//                           name="shippingBrand"
//                           label="Brand / Sub-brand"
//                           component={FormInput}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Billing To */}
//                 <div className="col-md-6">
//                   <div className="border rounded p-3 h-100">
//                     <h6 className="fw-bold mb-2">Billing To</h6>
//                     <textarea
//                       name="billingToAddress"
//                       className="form-control mb-2"
//                       placeholder="Address"
//                       style={{ height: "100px" }}
//                       required
//                     ></textarea>

//                     <div className="row g-2 mt-2">
//                       <div className="col-md-6">
//                         <Field
//                           name="billingToConsigneeGSTIN"
//                           label="GSTIN (Consignee)"
//                           component={FormInput}
//                         />
//                       </div>
//                       <div className="col-md-6">
//                         <Field
//                           name="billingToBuyerGSTIN"
//                           label="GSTIN (Buyer)"
//                           component={FormInput}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Delivery Address */}
//                 <div className="col-md-6">
//                   <div className="border rounded p-3 h-100">
//                     <h6 className="fw-bold mb-2">Delivery Address</h6>
//                     <textarea
//                       name="deliveryAddress"
//                       className="form-control mb-2"
//                       placeholder="Address"
//                       style={{ height: "100px" }}
//                       required
//                     ></textarea>

//                     <div className="row g-2 mt-2">
//                       <div className="col-md-4">
//                         <Field
//                           name="storeCode"
//                           label="Store Code"
//                           component={FormInput}
//                         />
//                       </div>
//                       <div className="col-md-4">
//                         <Field
//                           name="sapCode"
//                           label="SAP Code"
//                           component={FormInput}
//                         />
//                       </div>
//                       <div className="col-md-4">
//                         <Field
//                           name="vendorCode"
//                           label="Vendor Code"
//                           component={FormInput}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Document Details */}
//             <div className="mt-4">
//               <h6 className="fw-bold mb-3">Document Details</h6>
//               <div className="row g-3 align-items-end">
//                 {[
//                   "Bill Number",
//                   "Bill Date",
//                   "GST Number",
//                   "PAN",
//                   "Estimate No",
//                   "Date of Estimate",
//                   "Project ID",
//                   "PO Number",
//                   "PO Date",
//                   "PO Type",
//                   "Brand Name / Sub-brand",
//                   "Sub(work Description)",
//                 ].map((label, i) => (
//                   <div key={i} className="col-md-3 col-sm-6">
//                     {["Bill Date", "Date of Estimate", "PO Date"].includes(
//                       label
//                     ) ? (
//                       <div className="mb-2 mt-1">
//                         <label
//                           className="form-label fw-semibold"
//                           style={{ fontSize: "0.9rem" }}
//                         >
//                           {label}
//                         </label>
//                         <input
//                           type="date"
//                           className="form-control"
//                           style={{ height: "38px" }}
//                           name={label.replace(/\s+/g, "").toLowerCase()}
//                           required
//                         />
//                       </div>
//                     ) : (
//                       <Field
//                         name={label.replace(/\s+/g, "").toLowerCase()}
//                         label={label}
//                         component={FormInput}
//                         type="text"
//                       />
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Line Items */}
//             <div className="mt-4 border rounded p-3">
//               <div className="d-flex justify-content-between align-items-center mb-2">
//                 <h6 className="fw-bold mb-0">Line Items</h6>
//                 <Button themeColor="primary" size="small" onClick={addLineItem}>
//                   + Add Item
//                 </Button>
//               </div>

//               <Grid
//                 data={lineItems}
//                 style={{
//                   height: "auto",
//                   backgroundColor: "white",
//                   borderRadius: "8px",
//                 }}
//               >
//                 <GridColumn field="materialCode" title="Material Code" />
//                 <GridColumn field="hsnCode" title="HSN Code" />
//                 <GridColumn field="description" title="Description" />
//                 <GridColumn field="uom" title="UOM" />
//                 <GridColumn field="quantity" title="Quantity" />
//                 <GridColumn field="rate" title="Rate" />
//                 <GridColumn field="amount" title="Amount" />
//               </Grid>
//               {lineItems.length === 0 && (
//                 <div className="text-muted small mt-2">
//                   No expense items added.
//                 </div>
//               )}
//             </div>

//             {/* Tax and Total Section */}
//             <div className="mt-4">
//               <div className="row align-items-start">
//                 <div className="col-md-6">
//                   <h6 className="fw-bold mb-3">Tax Options</h6>
//                   <div className="container-fluid px-0">
//                     <div className="row g-3 mb-2">
//                       <div className="col-md-6 d-flex gap-2 align-items-center">
//                         <Field
//                           name="taxOption1"
//                           component={DropDownField}
//                           data={taxOptions}
//                         />
//                         <input
//                           type="number"
//                           className="form-control"
//                           placeholder="%"
//                           required
//                           style={{ width: "100px" }}
//                         />
//                       </div>
//                     </div>
//                     <div className="row g-3">
//                       <div className="col-md-6 d-flex gap-2 align-items-center">
//                         <Field
//                           name="taxOption3"
//                           component={DropDownField}
//                           data={taxOptions}
//                         />
//                         <input
//                           type="number"
//                           className="form-control"
//                           placeholder="%"
//                           required
//                           style={{ width: "100px" }}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Total Section */}
//                 <div className="col-md-6">
//                   <h6 className="fw-bold mb-3">Total</h6>
//                   <div className="d-flex justify-content-between mb-2">
//                     <span>Net Total:</span>
//                   </div>
//                   <div className="d-flex justify-content-between mb-2">
//                     <span>IGST:</span>
//                   </div>
//                   <div className="d-flex justify-content-between mb-2">
//                     <span>Round Off:</span>
//                   </div>
//                   <div className="d-flex justify-content-between fw-bold border-top pt-2 mb-3">
//                     <span>Grand Total:</span>
//                   </div>
//                 </div>

//                 {/* ✅ Error/Success Message */}
//                 {message.text && (
//                   <div
//                     className={`mt-2 mb-3 text-center fw-semibold ${
//                       message.type === "success"
//                         ? "text-success"
//                         : "text-danger"
//                     }`}
//                   >
//                     {message.text}
//                   </div>
//                 )}

//                 {/* Buttons */}
//                 <div className="d-flex justify-content-start gap-2 mb-4">
//                   <Button
//                     themeColor="primary"
//                     onClick={formRenderProps.onSubmit}
//                   >
//                     Save
//                   </Button>
//                   <Button type="button">Cancel</Button>
//                 </div>
//               </div>
//             </div>
//           </FormElement>
//         )}
//       />
//     </div>
//   );
// };

// export default Quotation;

import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, Field, FormElement } from "@progress/kendo-react-form";
import { Button } from "@progress/kendo-react-buttons";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import FormInput from "../components/Form/FormInput"; // adjust path if needed

const Quotation = () => {
  const [projects, setProjects] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [lineItems, setLineItems] = useState([]);
  const [addresses, setAddresses] = useState({
    billingFromAddress: "",
    billingToAddress: "",
    shippingAddress: "",
    deliveryAddress: "",
  });

  const API_BASE = "https://localhost:7142/api";

  useEffect(() => {
    fetch(`${API_BASE}/projects`)
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error("Error fetching projects:", err));
  }, []);

  useEffect(() => {
    if (message.type === "success") {
      const timer = setTimeout(() => setMessage({ text: "", type: "" }), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // ✅ Update address state on textarea change
  const handleAddressChange = (e) => {
    setAddresses({ ...addresses, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (dataItem) => {
    setMessage({ text: "", type: "" });

    // ✅ Validate Project Dropdown (Mandatory)
    if (!dataItem.projectId || dataItem.projectId === "Select Option") {
      setMessage({
        text: "❌ Please select a project before saving.",
        type: "error",
      });
      return;
    }

    // ✅ Validate required textareas
    for (const [key, value] of Object.entries(addresses)) {
      if (!value.trim()) {
        setMessage({
          text: `❌ Please fill the ${key.replace(/([A-Z])/g, " $1")} field.`,
          type: "error",
        });
        return;
      }
    }

    // ✅ Prepare correct data for backend
    const quotationData = {
      clientName: addresses.billingToAddress, // ✅ Backend expects this
      projectName: dataItem.projectId || "",
      amount: dataItem.amount || 0,
      lineItems: lineItems,
      billingFromAddress: addresses.billingFromAddress,
      billingToAddress: addresses.billingToAddress,
      shippingAddress: addresses.shippingAddress,
      deliveryAddress: addresses.deliveryAddress,
    };

    try {
      const response = await fetch(`${API_BASE}/quotations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quotationData),
      });

      if (response.ok) {
        const result = await response.json();
        setMessage({
          text: "✅ Quotation saved successfully!",
          type: "success",
        });
        console.log("Saved Quotation:", result);
      } else {
        const errText = await response.text();
        setMessage({
          text: "❌ Failed to save quotation: " + errText,
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage({
        text: "❌ Error saving quotation. Check backend connection.",
        type: "error",
      });
    }
  };

  const taxOptions = ["IGST", "CGST", "SGST"];

  const DropDownField = (fieldRenderProps) => (
    <div style={{ width: "200px" }}>
      <DropDownList
        data={fieldRenderProps.data}
        value={fieldRenderProps.value}
        onChange={(e) => fieldRenderProps.onChange({ value: e.value })}
        defaultItem="Select Option"
        style={{ width: "100%" }}
      />
    </div>
  );

  const addLineItem = () => {
    const newItem = {
      materialCode: "",
      hsnCode: "",
      description: "",
      uom: "",
      quantity: 0,
      rate: 0,
      amount: 0,
    };
    setLineItems([...lineItems, newItem]);
  };

  return (
    <div className="container-fluid py-3">
      <div className="d-flex justify-content-end align-items-center mb-3">
        <Button themeColor="primary">Download PDF</Button>
      </div>

      <Form
        onSubmit={handleSubmit}
        render={(formRenderProps) => (
          <FormElement>
            {/* ✅ Project Dropdown */}
            <div className="mb-4">
              <label
                htmlFor="projectSelect"
                className="form-label fw-bold"
                style={{ fontSize: "1rem" }}
              >
                Projects <span className="text-danger">*</span>
              </label>
              <div style={{ maxWidth: "320px" }}>
                <Field
                  name="projectId"
                  component={DropDownField}
                  data={projects.map((proj) => proj.projectName)}
                />
              </div>
            </div>

            {/* Parties and Addresses */}
            <div>
              <h6 className="fw-bold mb-3">Parties and Addresses</h6>
              <div className="row g-3">
                {/* Billing From */}
                <div className="col-md-6">
                  <div className="border rounded p-3 h-100">
                    <h6 className="fw-bold mb-2">
                      Billing From (Bilva Interiors)
                    </h6>
                    <textarea
                      name="billingFromAddress"
                      value={addresses.billingFromAddress}
                      onChange={handleAddressChange}
                      className="form-control mb-2"
                      placeholder="Address"
                      style={{ height: "100px" }}
                      required
                    ></textarea>

                    <div className="row g-2 mt-2">
                      <div className="col-md-6">
                        <Field
                          name="billingFromStateCode"
                          label="State Code"
                          component={FormInput}
                        />
                      </div>
                      <div className="col-md-6">
                        <Field
                          name="billingFromGSTIN"
                          label="GSTIN"
                          component={FormInput}
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
                      value={addresses.shippingAddress}
                      onChange={handleAddressChange}
                      className="form-control mb-2"
                      placeholder="Address"
                      style={{ height: "100px" }}
                      required
                    ></textarea>

                    <div className="row g-2 mt-2">
                      <div className="col-md-6">
                        <Field
                          name="shippingGSTIN"
                          label="GSTIN"
                          component={FormInput}
                        />
                      </div>
                      <div className="col-md-6">
                        <Field
                          name="shippingBrand"
                          label="Brand / Sub-brand"
                          component={FormInput}
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
                      value={addresses.billingToAddress}
                      onChange={handleAddressChange}
                      className="form-control mb-2"
                      placeholder="Address"
                      style={{ height: "100px" }}
                      required
                    ></textarea>

                    <div className="row g-2 mt-2">
                      <div className="col-md-6">
                        <Field
                          name="billingToConsigneeGSTIN"
                          label="GSTIN (Consignee)"
                          component={FormInput}
                        />
                      </div>
                      <div className="col-md-6">
                        <Field
                          name="billingToBuyerGSTIN"
                          label="GSTIN (Buyer)"
                          component={FormInput}
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
                      value={addresses.deliveryAddress}
                      onChange={handleAddressChange}
                      className="form-control mb-2"
                      placeholder="Address"
                      style={{ height: "100px" }}
                      required
                    ></textarea>

                    <div className="row g-2 mt-2">
                      <div className="col-md-4">
                        <Field
                          name="storeCode"
                          label="Store Code"
                          component={FormInput}
                        />
                      </div>
                      <div className="col-md-4">
                        <Field
                          name="sapCode"
                          label="SAP Code"
                          component={FormInput}
                        />
                      </div>
                      <div className="col-md-4">
                        <Field
                          name="vendorCode"
                          label="Vendor Code"
                          component={FormInput}
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
                {[
                  "Bill Number",
                  "Bill Date",
                  "GST Number",
                  "PAN",
                  "Estimate No",
                  "Date of Estimate",
                  "Project ID",
                  "PO Number",
                  "PO Date",
                  "PO Type",
                  "Brand Name / Sub-brand",
                  "Sub(work Description)",
                ].map((label, i) => (
                  <div key={i} className="col-md-3 col-sm-6">
                    {["Bill Date", "Date of Estimate", "PO Date"].includes(
                      label
                    ) ? (
                      <div className="mb-2 mt-1">
                        <label className="form-label fw-semibold">
                          {label}
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          name={label.replace(/\s+/g, "").toLowerCase()}
                          required
                        />
                      </div>
                    ) : (
                      <Field
                        name={label.replace(/\s+/g, "").toLowerCase()}
                        label={label}
                        component={FormInput}
                        type="text"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Line Items */}
            <div className="mt-4 border rounded p-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="fw-bold mb-0">Line Items</h6>
                <Button themeColor="primary" size="small" onClick={addLineItem}>
                  + Add Item
                </Button>
              </div>

              <Grid
                data={lineItems}
                style={{
                  height: "auto",
                  backgroundColor: "white",
                  borderRadius: "8px",
                }}
              >
                <GridColumn field="materialCode" title="Material Code" />
                <GridColumn field="hsnCode" title="HSN Code" />
                <GridColumn field="description" title="Description" />
                <GridColumn field="uom" title="UOM" />
                <GridColumn field="quantity" title="Quantity" />
                <GridColumn field="rate" title="Rate" />
                <GridColumn field="amount" title="Amount" />
              </Grid>
              {lineItems.length === 0 && (
                <div className="text-muted small mt-2">
                  No expense items added.
                </div>
              )}
            </div>

            {/* Tax and Total Section */}
            <div className="mt-4">
              <div className="row align-items-start">
                <div className="col-md-6">
                  <h6 className="fw-bold mb-3">Tax Options</h6>
                  <div className="container-fluid px-0">
                    <div className="row g-3 mb-2">
                      <div className="col-md-6 d-flex gap-2 align-items-center">
                        <Field
                          name="taxOption1"
                          component={DropDownField}
                          data={taxOptions}
                        />
                        <input
                          type="number"
                          className="form-control"
                          placeholder="%"
                          required
                          style={{ width: "100px" }}
                        />
                      </div>
                    </div>
                    <div className="row g-3">
                      <div className="col-md-6 d-flex gap-2 align-items-center">
                        <Field
                          name="taxOption3"
                          component={DropDownField}
                          data={taxOptions}
                        />
                        <input
                          type="number"
                          className="form-control"
                          placeholder="%"
                          required
                          style={{ width: "100px" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Total Section */}
                <div className="col-md-6">
                  <h6 className="fw-bold mb-3">Total</h6>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Net Total:</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>IGST:</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Round Off:</span>
                  </div>
                  <div className="d-flex justify-content-between fw-bold border-top pt-2 mb-3">
                    <span>Grand Total:</span>
                  </div>
                </div>

                {/* ✅ Error/Success Message */}
                {message.text && (
                  <div
                    className={`mt-2 mb-3 text-center fw-semibold ${
                      message.type === "success"
                        ? "text-success"
                        : "text-danger"
                    }`}
                  >
                    {message.text}
                  </div>
                )}

                {/* Buttons */}
                <div className="d-flex justify-content-start gap-2 mb-4">
                  <Button
                    themeColor="primary"
                    onClick={formRenderProps.onSubmit}
                  >
                    Save
                  </Button>
                  <Button type="button" onClick={() => window.location.reload()}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </FormElement>
        )}
      />
    </div>
  );
};

export default Quotation;
