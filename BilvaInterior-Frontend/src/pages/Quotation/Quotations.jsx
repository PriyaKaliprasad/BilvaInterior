// import React, { useEffect, useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { Form, Field, FormElement } from "@progress/kendo-react-form";
// import { Button } from "@progress/kendo-react-buttons";
// import { DropDownList } from "@progress/kendo-react-dropdowns";
// import { DatePicker } from "@progress/kendo-react-dateinputs";
// import FormInput from "../../components/Form/FormInput";
// import FloatingLabelWrapper from "../../components/Form/FloatingLabelWrapper/FloatingLabelWrapper";
// import EditableLineItemsGrid from "../../components/EditableLineItemsGrid";
// import QuotationPDF from "./QuotationPdf";
// import "./Quotation.css";


// const Quotation = () => {
//   const [projects, setProjects] = useState([]);
//   const [message, setMessage] = useState({ text: "", type: "" });
//   const [lineItems, setLineItems] = useState([]); // ✅ start empty
//   const [tax1, setTax1] = useState({ option: "", percent: 0 });
//   const [tax2, setTax2] = useState({ option: "", percent: 0 });
//   const [totals, setTotals] = useState({
//     netTotal: 0,
//     igst: 0,
//     roundOff: 0,
//     grandTotal: 0,
//   });

//   const [addresses, setAddresses] = useState({
//     billingFromAddress: "",
//     billingToAddress: "",
//     shippingAddress: "",
//     deliveryAddress: "",
//   });

//   const API_BASE = "https://localhost:7142/api";

//   // ✅ Fetch projects
//   useEffect(() => {
//     fetch(`${API_BASE}/projects`)
//       .then((res) => res.json())
//       .then((data) => setProjects(data))
//       .catch((err) => console.error("Error fetching projects:", err));
//   }, []);

//   // ✅ Auto-clear success message after 5s
//   useEffect(() => {
//     if (message.type === "success") {
//       const timer = setTimeout(() => setMessage({ text: "", type: "" }), 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [message]);

//   // ✅ Ensure at least one blank line item on Add Page
//   useEffect(() => {
//     if (lineItems.length === 0) {
//       setLineItems([
//         {
//           id: 1,
//           materialCode: "",
//           hsnCode: "",
//           description: "",
//           uom: "",
//           quantity: "",
//           rate: "",
//           amount: "",
//         },
//       ]);
//     }
//   }, [lineItems]);

//   const handleAddressChange = (e) => {
//     setAddresses({ ...addresses, [e.target.name]: e.target.value });
//   };

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

//   const taxOptions = ["IGST", "CGST", "SGST"];

//   // ✅ Submit handler
//   const handleSubmit = async (dataItem) => {
//     setMessage({ text: "", type: "" });

//     // Validation
//     if (!dataItem.projectId || dataItem.projectId === "Select Option") {
//       setMessage({ text: "❌ Please select a project.", type: "error" });
//       return;
//     }

//     for (const [key, value] of Object.entries(addresses)) {
//       if (!value.trim()) {
//         setMessage({
//           text: `❌ Please fill ${key.replace(/([A-Z])/g, " $1")}`,
//           type: "error",
//         });
//         return;
//       }
//     }

//     const billNumber =
//       dataItem.billnumber && dataItem.billnumber.trim() !== ""
//         ? dataItem.billnumber
//         : `BILL-${Date.now()}`;

//     // ✅ Clean Line Items
//     const cleanedLineItems = lineItems
//       .filter(
//         (item) =>
//           item.materialCode?.trim() !== "" ||
//           item.hsnCode?.trim() !== "" ||
//           item.description?.trim() !== "" ||
//           item.uom?.trim() !== "" ||
//           (item.quantity && item.quantity !== 0) ||
//           (item.rate && item.rate !== 0)
//       )
//       .map((item, idx) => ({
//         materialCode: item.materialCode || `ITEM-${idx + 1}`,
//         hsnCode: item.hsnCode || "",
//         description: item.description || "",
//         uom: item.uom || "",
//         quantity: item.quantity ? Number(item.quantity) : 0,
//         rate: item.rate ? Number(item.rate) : 0,
//         amount:
//           item.amount ||
//           (item.quantity && item.rate
//             ? Number(item.quantity) * Number(item.rate)
//             : 0),
//       }));


//     // ✅ Build Payload
//     const quotationData = {
//       projectName: dataItem.projectId,
//       billingFromAddress: addresses.billingFromAddress,
//       billNumber,
//       billingFromStateCode: dataItem.billingFromStateCode || "",
//       billingFromGSTIN: dataItem.billingFromGSTIN || "",
//       shippingAddress: addresses.shippingAddress,
//       shippingGSTIN: dataItem.shippingGSTIN || "",
//       brandOrSubBrand: dataItem.shippingBrand || "",
//       billingToAddress: addresses.billingToAddress,
//       gstinConsignee: dataItem.billingToConsigneeGSTIN || "",
//       gstinBuyer: dataItem.billingToBuyerGSTIN || "",
//       deliveryAddress: addresses.deliveryAddress,
//       storeCode: dataItem.storeCode || "",
//       sapCode: dataItem.sapCode || "",
//       vendorCode: dataItem.vendorCode || "",
//       billDate: dataItem.billdate || null,
//       gstNumber: dataItem.gstnumber || "",
//       pan: dataItem.pan || "",
//       estimateNo: dataItem.estimateno || "",
//       dateOfEstimate: dataItem.dateofestimate || null,
//       projectID: dataItem.projectid || "",
//       poNumber: dataItem.ponumber || "",
//       poDate: dataItem.podate || null,
//       poType: dataItem.potype || "",
//       brandNameSubBrand: dataItem["brandname/sub-brand"] || "",
//       subWorkDescription: dataItem.subworkdescription || "",
//       taxOption1: tax1.option || "",
//       taxPercent1: parseFloat(tax1.percent) || 0,
//       taxOption2: tax2.option || "",
//       taxPercent2: parseFloat(tax2.percent) || 0,
//       netTotal: totals.netTotal || 0,
//       igst: totals.igst || 0,
//       roundOff: totals.roundOff || 0,
//       grandTotal: totals.grandTotal || 0,
//       createdDate: new Date().toISOString(),
//       lineItems: cleanedLineItems,
//     };

//     try {
//       const res = await fetch(`${API_BASE}/quotations`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(quotationData),
//       });

//       if (res.ok) {
//         setMessage({
//           text: "✅ Quotation saved successfully!",
//           type: "success",
//         });
//         console.log("Saved Quotation:", quotationData);
//       } else {
//         const err = await res.text();
//         setMessage({ text: "❌ Failed to save: " + err, type: "error" });
//       }
//     } catch (err) {
//       console.error("Error:", err);
//       setMessage({ text: "❌ Error saving quotation.", type: "error" });
//     }
//   };
//   // ✅ Auto-calculate totals whenever lineItems or tax changes
//   useEffect(() => {
//     if (lineItems.length === 0) return;

//     // Calculate Net Total
//     const netTotal = lineItems.reduce((sum, item) => {
//       const qty = parseFloat(item.quantity) || 0;
//       const rate = parseFloat(item.rate) || 0;
//       return sum + qty * rate;
//     }, 0);

//     // Calculate Tax 1 and Tax 2 amounts
//     const tax1Amount = (netTotal * (parseFloat(tax1.percent) || 0)) / 100;
//     const tax2Amount = (netTotal * (parseFloat(tax2.percent) || 0)) / 100;

//     // Calculate Grand Total
//     const grandTotal = netTotal + tax1Amount + tax2Amount + (totals.roundOff || 0);

//     setTotals({
//       netTotal: parseFloat(netTotal.toFixed(2)),
//       igst: parseFloat((tax1Amount + tax2Amount).toFixed(2)), // combined tax
//       roundOff: parseFloat(totals.roundOff.toFixed(2)),
//       grandTotal: parseFloat(grandTotal.toFixed(2)),
//     });
//   }, [lineItems, tax1, tax2, totals.roundOff]);


//   return (
//     <div className="container-fluid py-3">
//       <h4 className="mb-4">Add  Quotation</h4>

//       <Form
//         onSubmit={handleSubmit}
//         render={(formRenderProps) => (
//           <FormElement>
//             {/* ✅ PDF Download Button - place at top */}
//             {/* ✅ PDF Download Button - place at top */}
//             <div className="d-flex justify-content-end align-items-center mb-3">
//               {(() => {
//                 const pdfData = {
//                   // 🏗️ Project + Parties
//                   projectName: formRenderProps.valueGetter?.("projectId") || "",
//                   billingFromAddress: addresses.billingFromAddress,
//                   billingFromGSTIN: formRenderProps.valueGetter?.("billingFromGSTIN") || "",
//                   billingFromStateCode: formRenderProps.valueGetter?.("billingFromStateCode") || "",
//                   billingToAddress: addresses.billingToAddress,
//                   gstinBuyer: formRenderProps.valueGetter?.("billingToBuyerGSTIN") || "",
//                   gstinConsignee: formRenderProps.valueGetter?.("billingToConsigneeGSTIN") || "",
//                   shippingAddress: addresses.shippingAddress,
//                   shippingGSTIN: formRenderProps.valueGetter?.("shippingGSTIN") || "",
//                   deliveryAddress: addresses.deliveryAddress,

//                   // 📄 Document Details
//                   billNumber: formRenderProps.valueGetter?.("billnumber") || "",
//                   billDate: formRenderProps.valueGetter?.("billdate") || "",
//                   gstNumber: formRenderProps.valueGetter?.("gstnumber") || "",
//                   pan: formRenderProps.valueGetter?.("pan") || "",
//                   estimateNo: formRenderProps.valueGetter?.("estimateno") || "",
//                   dateOfEstimate: formRenderProps.valueGetter?.("dateofestimate") || "",
//                   projectId: formRenderProps.valueGetter?.("projectid") || "",
//                   poNumber: formRenderProps.valueGetter?.("ponumber") || "",
//                   poDate: formRenderProps.valueGetter?.("podate") || "",
//                   poType: formRenderProps.valueGetter?.("potype") || "",
//                   brandName: formRenderProps.valueGetter?.("brandname/sub-brand") || "",
//                   subBrand: formRenderProps.valueGetter?.("subworkdescription") || "",
//                   workDescription: formRenderProps.valueGetter?.("subworkdescription") || "",

//                   // 📦 Line items
//                   lineItems,

//                   // 💰 Totals
//                   netTotal: totals.netTotal,
//                   igst: totals.igst,
//                   roundOff: totals.roundOff,
//                   grandTotal: totals.grandTotal,
//                 };

//                 console.log("📦 Data passed to QuotationPDF:", pdfData);

//                 return <QuotationPDF quotation={pdfData} />;
//               })()}
//             </div>


//             {/* Project Dropdown */}
//             <div className="mb-4">
//               <label className="form-label fw-bold">
//                 Projects <span className="text-danger">*</span>
//               </label>
//               <div style={{ maxWidth: "320px" }}>
//                 <Field
//                   name="projectId"
//                   component={DropDownField}
//                   data={projects.map((p) => p.projectName)}
//                 />
//               </div>
//             </div>

//             {/* Parties & Addresses */}
//             <div>
//               <h6 className="fw-bold mb-3">Parties and Addresses</h6>
//               <div className="row g-3">
//                 {/* Billing From */}
//                 <div className="col-md-6">
//                   <div className="border rounded p-3 h-100">
//                     <h6 className="fw-bold mb-2">Billing From (Bilva Interiors)</h6>
//                     <textarea
//                       name="billingFromAddress"
//                       value={addresses.billingFromAddress}
//                       onChange={handleAddressChange}
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
//                       value={addresses.shippingAddress}
//                       onChange={handleAddressChange}
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
//                       value={addresses.billingToAddress}
//                       onChange={handleAddressChange}
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
//                       value={addresses.deliveryAddress}
//                       onChange={handleAddressChange}
//                       className="form-control mb-2"
//                       placeholder="Address"
//                       style={{ height: "100px" }}
//                     ></textarea>
//                     <div className="row g-2 mt-2">
//                       <div className="col-md-4">
//                         <Field name="storeCode" label="Store Code" component={FormInput} />
//                       </div>
//                       <div className="col-md-4">
//                         <Field name="sapCode" label="SAP Code" component={FormInput} />
//                       </div>
//                       <div className="col-md-4">
//                         <Field name="vendorCode" label="Vendor Code" component={FormInput} />
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
//                       <FloatingLabelWrapper label={label}>
//                         <Field
//                           name={label.replace(/\s+/g, "").toLowerCase()}
//                           component={(fieldRenderProps) => (
//                             <DatePicker
//                               {...fieldRenderProps}
//                               format="yyyy-MM-dd"
//                               size="large"
//                               className="form-control"
//                             />
//                           )}
//                         />
//                       </FloatingLabelWrapper>
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

//             {/* ✅ Editable Line Items Grid */}
//             <div className="mt-4 border rounded p-3">
//               <div className="d-flex justify-content-between align-items-center mb-2">
//                 <h6 className="fw-bold mb-0">Line Items</h6>
//               </div>
//               <EditableLineItemsGrid
//                 value={lineItems}
//                 onChange={setLineItems}
//                 columns={[
//                   { field: "materialCode", title: "Material Code" },
//                   { field: "hsnCode", title: "HSN Code" },
//                   { field: "description", title: "Description" },
//                   { field: "uom", title: "UOM" },
//                   { field: "quantity", title: "Quantity", type: "numeric" },
//                   { field: "rate", title: "Rate", type: "numeric" },
//                   { field: "amount", title: "Amount", type: "numeric" },
//                 ]}
//               />
//             </div>
//             {/* Tax & Totals section */}
//             <div className="mt-4">
//               <div className="row align-items-start">
//                 <div className="col-md-6">
//                   <h6 className="fw-bold mb-3">Tax Options</h6>
//                   <div className="container-fluid px-0">
//                     <div className="row g-3 mb-2">
//                       <div className="col-md-6 d-flex gap-2 align-items-center">
//                         <DropDownList

//                           data={taxOptions}
//                           value={tax1.option}
//                           onChange={(e) => setTax1({ ...tax1, option: e.value })}
//                           defaultItem="Select Option"
//                         />
//                         <input
//                           type="number"
//                           className="form-control"
//                           placeholder="%"
//                           value={tax1.percent}
//                           onChange={(e) => setTax1({ ...tax1, percent: e.target.value })}
//                           style={{ width: "100px" }}
//                         />
//                       </div>
//                     </div>
//                     <div className="row g-3">
//                       <div className="col-md-6 d-flex gap-2 align-items-center">
//                         <DropDownList
//                           data={taxOptions}
//                           value={tax2.option}
//                           onChange={(e) => setTax2({ ...tax2, option: e.value })}
//                           defaultItem="Select Option"
//                         />
//                         <input
//                           type="number"
//                           className="form-control"
//                           placeholder="%"
//                           value={tax2.percent}
//                           onChange={(e) => setTax2({ ...tax2, percent: e.target.value })}
//                           style={{ width: "100px" }}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Totals */}
//                 <div className="col-md-6">
//                   <h6 className="fw-bold mb-3">Total</h6>
//                   <div className="d-flex justify-content-between mb-2">
//                     <span>Net Total:</span>
//                     <input
//                       type="number"
//                       className="form-control w-25"
//                       value={totals.netTotal}
//                       onChange={(e) =>
//                         setTotals({ ...totals, netTotal: parseFloat(e.target.value) })
//                       }
//                     />
//                   </div>
//                   <div className="d-flex justify-content-between mb-2">
//                     <span>IGST:</span>
//                     <input
//                       type="number"
//                       className="form-control w-25"
//                       value={totals.igst}
//                       onChange={(e) =>
//                         setTotals({ ...totals, igst: parseFloat(e.target.value) })
//                       }
//                     />
//                   </div>
//                   <div className="d-flex justify-content-between mb-2">
//                     <span>Round Off:</span>
//                     <input
//                       type="number"
//                       className="form-control w-25"
//                       value={totals.roundOff}
//                       onChange={(e) =>
//                         setTotals({ ...totals, roundOff: parseFloat(e.target.value) })
//                       }
//                     />
//                   </div>
//                   <div className="d-flex justify-content-between fw-bold border-top pt-2 mb-3">
//                     <span>Grand Total:</span>
//                     <input
//                       type="number"
//                       className="form-control w-25"
//                       value={totals.grandTotal}
//                       onChange={(e) =>
//                         setTotals({ ...totals, grandTotal: parseFloat(e.target.value) })
//                       }
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Message */}
//             {message.text && (
//               <div
//                 className={`mt-3 text-center fw-semibold ${message.type === "success" ? "text-success" : "text-danger"
//                   }`}
//               >
//                 {message.text}
//               </div>
//             )}

//             <div className="d-flex justify-content-start gap-2 mt-3 mb-4">
//               <Button themeColor="primary" onClick={formRenderProps.onSubmit}>
//                 Save
//               </Button>
//               <Button type="button" onClick={() => window.location.reload()}>
//                 Cancel
//               </Button>
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
// import { DatePicker } from "@progress/kendo-react-dateinputs";
// import FormInput from "../../components/Form/FormInput";
// import FloatingLabelWrapper from "../../components/Form/FloatingLabelWrapper/FloatingLabelWrapper";
// import EditableLineItemsGrid from "../../components/EditableLineItemsGrid";
// import { generateQuotationPDF } from "./QuotationPdf";
// import "./Quotation.css";

// const Quotation = () => {
//   const [projects, setProjects] = useState([]);
//   const [message, setMessage] = useState({ text: "", type: "" });
//   const [lineItems, setLineItems] = useState([]);
//   // ADD this ABOVE your first use of getNonEmptyLineItems()
//   const getNonEmptyLineItems = () =>
//     lineItems.filter(
//       (item) =>
//         item.materialCode?.trim() !== "" ||
//         item.hsnCode?.trim() !== "" ||
//         item.description?.trim() !== "" ||
//         item.uom?.trim() !== "" ||
//         (item.quantity && item.quantity !== 0) ||
//         (item.rate && item.rate !== 0)
//     );
//   const [tax1, setTax1] = useState({ option: "", percent: 0 });
//   const [tax2, setTax2] = useState({ option: "", percent: 0 });
//   const [tax3, setTax3] = useState({ option: "", percent: 0 });

//   const [totals, setTotals] = useState({
//     netTotal: 0,
//     igst: 0,
//     roundOff: 0,
//     grandTotal: 0,
//   });
//   const [addresses, setAddresses] = useState({
//     billingFromAddress: "",
//     billingToAddress: "",
//     shippingAddress: "",
//     deliveryAddress: "",
//   });

//   const API_BASE = "https://localhost:7142/api";

//   // ✅ Regex for validation
//   const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
//   const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
//   const billNumberRegex = /^[0-9]+$/;

//   // ✅ Fetch projects
//   useEffect(() => {
//     fetch(`${API_BASE}/projects`)
//       .then((res) => res.json())
//       .then((data) => setProjects(data))
//       .catch((err) => console.error("Error fetching projects:", err));
//   }, []);

//   // ✅ Auto-clear success message
//   useEffect(() => {
//     if (message.type === "success") {
//       const timer = setTimeout(() => setMessage({ text: "", type: "" }), 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [message]);

//   // ✅ Ensure at least one blank line item
//   useEffect(() => {
//     if (lineItems.length === 0) {
//       setLineItems([
//         {
//           id: 1,
//           materialCode: "",
//           hsnCode: "",
//           description: "",
//           uom: "",
//           quantity: "",
//           rate: "",
//           amount: "",
//         },
//       ]);
//     }
//   }, [lineItems]);

//   const handleAddressChange = (e) => {
//     setAddresses({ ...addresses, [e.target.name]: e.target.value });
//   };

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

//   const taxOptions = ["IGST", "CGST", "SGST"];

//   // ✅ Handle Form Submit
//   const handleSubmit = async (dataItem) => {
//     setMessage({ text: "", type: "" });

//     // Project Validation
//     if (!dataItem.projectId || dataItem.projectId === "Select Option") {
//       setMessage({ text: "❌ Please select a project.", type: "error" });
//       return;
//     }

//     // Address Validation
//     for (const [key, value] of Object.entries(addresses)) {
//       if (!value.trim()) {
//         setMessage({
//           text: `❌ Please fill ${key.replace(/([A-Z])/g, " $1")}`,
//           type: "error",
//         });
//         return;
//       }
//     }

//     // GST Validation (mandatory)
//     // ✅ GST Validation for all GST fields
//     const gstFields = {
//       "Billing From GSTIN": dataItem.billingFromGSTIN,
//       "Shipping GSTIN": dataItem.shippingGSTIN,
//       "Billing To Consignee GSTIN": dataItem.billingToConsigneeGSTIN,
//       "Billing To Buyer GSTIN": dataItem.billingToBuyerGSTIN,
//       "Document GST Number": dataItem.gstnumber,
//     };

//     for (const [label, gstValue] of Object.entries(gstFields)) {
//       if (!gstValue || gstValue.trim() === "") {
//         setMessage({ text: `❌ ${label} is required.`, type: "error" });
//         return;
//       }
//       if (gstValue.length !== 15 || !gstRegex.test(gstValue.toUpperCase())) {
//         setMessage({
//           text: `❌ ${label} must be a valid 15-character GST number.`,
//           type: "error",
//         });
//         return;
//       }
//     }

//     // PAN Validation (mandatory)
//     if (!dataItem.pan || !panRegex.test(dataItem.pan.toUpperCase())) {
//       setMessage({ text: "❌ Please enter a valid PAN Number.", type: "error" });
//       return;
//     }

//     // Bill Number Validation (mandatory)
//     if (!dataItem.billnumber || !billNumberRegex.test(dataItem.billnumber)) {
//       setMessage({ text: "❌ Please enter a valid Bill Number.", type: "error" });
//       return;
//     }


//     // --- Line Items Validation ---
//     if (lineItems.length === 0 || lineItems.every(item => !item.materialCode && !item.description)) {
//       setMessage({ text: "❌ Please add at least one line item.", type: "error" });
//       return;
//     }

//     for (const [index, item] of lineItems.entries()) {
//       const hasFirstFour =
//         item.materialCode?.trim() ||
//         item.hsnCode?.trim() ||
//         item.description?.trim() ||
//         item.uom?.trim();

//       if (hasFirstFour) {
//         const qty = Number(item.quantity);
//         const rate = Number(item.rate);
//         if (isNaN(qty) || qty < 1 || isNaN(rate) || rate < 1) {
//           setMessage({
//             text: `❌ Quantity and Rate must be at least 1 for line item ${index + 1}.`,
//             type: "error",
//           });
//           return;
//         }
//       }
//     }

//     // Generate bill number if empty
//     const billNumber =
//       dataItem.billnumber && dataItem.billnumber.trim() !== ""
//         ? dataItem.billnumber
//         : `BILL-${Date.now()}`;

//     // Clean Line Items
//     const cleanedLineItems = getNonEmptyLineItems().map((item, idx) => ({
//       materialCode: item.materialCode || `ITEM-${idx + 1}`,
//       hsnCode: item.hsnCode || "",
//       description: item.description || "",
//       uom: item.uom || "",
//       quantity: item.quantity ? Number(item.quantity) : 0,
//       rate: item.rate ? Number(item.rate) : 0,
//       amount: item.amount || (item.quantity && item.rate ? Number(item.quantity) * Number(item.rate) : 0),
//     }));


//     // Build Payload
//     const quotationData = {
//       projectName: dataItem.projectId,
//       billingFromAddress: addresses.billingFromAddress,
//       billNumber,
//       billingFromStateCode: dataItem.billingFromStateCode || "",
//       billingFromGSTIN: dataItem.billingFromGSTIN || "",
//       shippingAddress: addresses.shippingAddress,
//       shippingGSTIN: dataItem.shippingGSTIN || "",
//       brandOrSubBrand: dataItem.shippingBrand || "",
//       billingToAddress: addresses.billingToAddress,
//       gstinConsignee: dataItem.billingToConsigneeGSTIN || "",
//       gstinBuyer: dataItem.billingToBuyerGSTIN || "",
//       deliveryAddress: addresses.deliveryAddress,
//       storeCode: dataItem.storeCode || "",
//       sapCode: dataItem.sapCode || "",
//       vendorCode: dataItem.vendorCode || "",
//       billDate: dataItem.billdate || null,
//       gstNumber: dataItem.gstnumber || "",
//       pan: dataItem.pan || "",
//       estimateNo: dataItem.estimateno || "",
//       dateOfEstimate: dataItem.dateofestimate || null,
//       projectID: dataItem.projectid || "",
//       poNumber: dataItem.ponumber || "",
//       poDate: dataItem.podate || null,
//       poType: dataItem.potype || "",
//       brandNameSubBrand: dataItem["brandname/sub-brand"] || "",
//       subWorkDescription: dataItem.subworkdescription || "",
//       taxOption1: tax1.option || "",
//       taxPercent1: parseFloat(tax1.percent) || 0,
//       taxOption2: tax2.option || "",
//       taxPercent2: parseFloat(tax2.percent) || 0,
//       netTotal: totals.netTotal || 0,
//       igst: totals.igst || 0,
//       roundOff: totals.roundOff || 0,
//       grandTotal: totals.grandTotal || 0,
//       createdDate: new Date().toISOString(),
//       lineItems: cleanedLineItems,
//     };

//     // POST to API
//     try {
//       const res = await fetch(`${API_BASE}/quotations`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(quotationData),
//       });

//       if (res.ok) {
//         setMessage({ text: "✅ Quotation saved successfully!", type: "success" });
//         console.log("Saved Quotation:", quotationData);
//       } else {
//         const err = await res.text();
//         setMessage({ text: "❌ Failed to save: " + err, type: "error" });
//       }
//     } catch (err) {
//       console.error("Error:", err);
//       setMessage({ text: "❌ Error saving quotation.", type: "error" });
//     }
//   };

//   // ✅ Auto-calculate totals
//   useEffect(() => {
//     if (lineItems.length === 0) return;

//     const netTotal = lineItems.reduce((sum, item) => {
//       const qty = parseFloat(item.quantity) || 0;
//       const rate = parseFloat(item.rate) || 0;
//       return sum + qty * rate;
//     }, 0);

//     const tax1Amount = (netTotal * (parseFloat(tax1.percent) || 0)) / 100;
//     const tax2Amount = (netTotal * (parseFloat(tax2.percent) || 0)) / 100;
//     const roundOff = parseFloat(totals.roundOff) || 0;
//     const grandTotal = netTotal + tax1Amount + tax2Amount + roundOff;

//     setTotals({
//       netTotal: parseFloat(netTotal.toFixed(2)),
//       igst: parseFloat((tax1Amount + tax2Amount).toFixed(2)),
//       roundOff: roundOff,
//       grandTotal: parseFloat(grandTotal.toFixed(2)),
//     });

//   }, [lineItems, tax1, tax2, totals.roundOff]);

//   // Inside Quotation component, above 'return'
//   const validateForPDF = (formValues) => {
//     // Project check
//     if (!formValues.projectId || formValues.projectId === "Select Option") {
//       setMessage({ text: "❌ Please select a project.", type: "error" });
//       return false;
//     }

//     // Address check
//     for (const [key, value] of Object.entries(addresses)) {
//       if (!value.trim()) {
//         setMessage({
//           text: `❌ Please fill ${key.replace(/([A-Z])/g, " $1")}`,
//           type: "error",
//         });
//         return false;
//       }
//     }

//     // ✅ Collect all GST fields
//     const gstFields = {
//       "Billing From GSTIN": formValues.billingFromGSTIN,
//       "Shipping GSTIN": formValues.shippingGSTIN,
//       "Billing To Consignee GSTIN": formValues.billingToConsigneeGSTIN,
//       "Billing To Buyer GSTIN": formValues.billingToBuyerGSTIN,
//       "Document GST Number": formValues.gstnumber,
//     };

//     // ✅ Validate each GST field strictly
//     for (const [label, gstValue] of Object.entries(gstFields)) {
//       if (!gstValue || gstValue.trim() === "") {
//         setMessage({ text: `❌ ${label} is required.`, type: "error" });
//         return false;
//       }
//       if (gstValue.length !== 15 || !gstRegex.test(gstValue.toUpperCase())) {
//         setMessage({
//           text: `❌ ${label} must be a valid 15-character GST number.`,
//           type: "error",
//         });
//         return false;
//       }
//     }

//     // PAN Validation
//     if (!formValues.pan || !panRegex.test(formValues.pan.toUpperCase())) {
//       setMessage({ text: "❌ Please enter a valid PAN Number.", type: "error" });
//       return false;
//     }

//     // Bill Number Validation
//     if (!formValues.billnumber || !billNumberRegex.test(formValues.billnumber)) {
//       setMessage({ text: "❌ Please enter a valid Bill Number.", type: "error" });
//       return false;
//     }

//     // --- Line Items Validation ---
//     const nonEmptyLineItems = lineItems.filter(
//       (item) =>
//         item.materialCode?.trim() !== "" ||
//         item.hsnCode?.trim() !== "" ||
//         item.description?.trim() !== "" ||
//         item.uom?.trim() !== "" ||
//         (item.quantity && item.quantity !== 0) ||
//         (item.rate && item.rate !== 0)
//     );

//     if (nonEmptyLineItems.length === 0) {
//       setMessage({ text: "❌ Please add at least one line item.", type: "error" });
//       return false;
//     }

//     for (const [index, item] of nonEmptyLineItems.entries()) {
//       const qty = Number(item.quantity);
//       const rate = Number(item.rate);
//       if (isNaN(qty) || qty < 1 || isNaN(rate) || rate < 1) {
//         setMessage({
//           text: `❌ Quantity and Rate must be ≥ 1 for line item ${index + 1}.`,
//           type: "error",
//         });
//         return false;
//       }
//     }

//     setMessage({ text: "", type: "" });
//     return true;
//   };



//   return (
//     <div className="container-fluid py-3">
//       <h4 className="mb-4">Add  Quotation</h4>

//       <Form
//         onSubmit={handleSubmit}
//         render={(formRenderProps) => (
//           <FormElement>
//             {/* ✅ PDF Download Button - place at top */}
//             <div className="d-flex justify-content-end align-items-center mb-3">
//               <Button
//   themeColor="primary"
//   className="ms-2"
//   onClick={async () => {
//     // ✅ Get current form values directly from Kendo form
//     const formValues = formRenderProps.value || {};
//     console.log("✅ Current formValues:", formValues);

//     // ✅ Check if form is empty
//     if (!formValues || Object.keys(formValues).length === 0) {
//       setMessage({
//         text: "❌ Please fill in the form before downloading PDF.",
//         type: "error",
//       });
//       return;
//     }

//     // ✅ Run validation before generating PDF
//     if (validateForPDF(formValues)) {
//       const cleanedLineItems = lineItems.filter(
//         (item) =>
//           item.materialCode?.trim() !== "" ||
//           item.hsnCode?.trim() !== "" ||
//           item.description?.trim() !== "" ||
//           item.uom?.trim() !== "" ||
//           (item.quantity && item.quantity > 0) ||
//           (item.rate && item.rate > 0)
//       );

//       // ✅ Prepare data for PDF
//       const pdfData = {
//         projectName: formValues.projectId,
//         billingFromAddress: addresses.billingFromAddress,
//         billingFromGSTIN: formValues.billingFromGSTIN || "",
//         billingFromStateCode: formValues.billingFromStateCode || "",
//         billingToAddress: addresses.billingToAddress,
//         gstinBuyer: formValues.billingToBuyerGSTIN || "",
//         gstinConsignee: formValues.billingToConsigneeGSTIN || "",
//         shippingAddress: addresses.shippingAddress,
//         shippingGSTIN: formValues.shippingGSTIN || "",
//         deliveryAddress: addresses.deliveryAddress,
//         billNumber: formValues.billnumber || "",
//         billDate: formValues.billdate || "",
//         gstNumber: formValues.gstnumber || "",
//         pan: formValues.pan || "",
//         lineItems: cleanedLineItems,
//         netTotal: totals.netTotal,
//         igst: totals.igst,
//         roundOff: totals.roundOff,
//         grandTotal: totals.grandTotal,
//       };

//       // ✅ Generate PDF
//       await generateQuotationPDF(pdfData);
//     }
//   }}
// >
//   Download PDF
// </Button>


//             </div>

//             {/* Project Dropdown */}
//             <div className="mb-4">
//               <label className="form-label fw-bold">
//                 Projects <span className="text-danger">*</span>
//               </label>
//               <div style={{ maxWidth: "320px" }}>
//                 <Field
//                   name="projectId"
//                   component={DropDownField}
//                   data={projects.map((p) => p.projectName)}
//                 />
//               </div>
//             </div>

//             {/* Parties & Addresses */}
//             <div>
//               <h6 className="fw-bold mb-3">Parties and Addresses</h6>
//               <div className="row g-3">
//                 {/* Billing From */}
//                 <div className="col-md-6">
//                   <div className="border rounded p-3 h-100">
//                     <h6 className="fw-bold mb-2">Billing From - Bilva Interiors</h6>
//                     <textarea
//                       name="billingFromAddress"
//                       value={addresses.billingFromAddress}
//                       onChange={handleAddressChange}
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
//                       value={addresses.shippingAddress}
//                       onChange={handleAddressChange}
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
//                       value={addresses.billingToAddress}
//                       onChange={handleAddressChange}
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
//                       value={addresses.deliveryAddress}
//                       onChange={handleAddressChange}
//                       className="form-control mb-2"
//                       placeholder="Address"
//                       style={{ height: "100px" }}
//                     ></textarea>
//                     <div className="row g-2 mt-2">
//                       <div className="col-md-4">
//                         <Field name="storeCode" label="Store Code" component={FormInput} />
//                       </div>
//                       <div className="col-md-4">
//                         <Field name="sapCode" label="SAP Code" component={FormInput} />
//                       </div>
//                       <div className="col-md-4">
//                         <Field name="vendorCode" label="Vendor Code" component={FormInput} />
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
//                       <FloatingLabelWrapper label={label}>
//                         <Field
//                           name={label.replace(/\s+/g, "").toLowerCase()}
//                           component={(fieldRenderProps) => (
//                             <DatePicker
//                               {...fieldRenderProps}
//                               format="yyyy-MM-dd"
//                               size="large"
//                               className="form-control"
//                             />
//                           )}
//                         />
//                       </FloatingLabelWrapper>
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

//             {/* ✅ Editable Line Items Grid */}
//             <div className="mt-4 border rounded p-3">
//               <div className="d-flex justify-content-between align-items-center mb-2">
//                 <h6 className="fw-bold mb-0">Line Items</h6>
//               </div>
//               <EditableLineItemsGrid
//                 value={lineItems}
//                 onChange={setLineItems}
//                 columns={[
//                   { field: "materialCode", title: "Material Code" },
//                   { field: "hsnCode", title: "HSN Code" },
//                   { field: "description", title: "Description" },
//                   { field: "uom", title: "UOM" },
//                   { field: "quantity", title: "Quantity", type: "numeric" },
//                   { field: "rate", title: "Rate", type: "numeric" },
//                   { field: "amount", title: "Amount", type: "numeric" },
//                 ]}
//               />
//             </div>
//             {/* Tax & Totals section */}
//             <div className="mt-4">
//               <div className="row align-items-start">
//                 <div className="col-md-6">
//                   <h6 className="fw-bold mb-3">Tax</h6>
//                   <div className="container-fluid px-0">

//                     {/* IGST */}
//                     <div className="row g-3 mb-2">
//                       <div className="col-md-6 d-flex gap-2 align-items-center">
//                         <label className="fw-semibold" style={{ minWidth: "60px" }}>
//                           IGST
//                         </label>
//                         <input
//                           type="number"
//                           className="form-control"
//                           placeholder="%"
//                           value={tax1.percent}
//                           onChange={(e) => setTax1({ ...tax1, percent: e.target.value })}
//                           style={{ width: "100px" }}
//                         />
//                       </div>
//                     </div>

//                     {/* CGST */}
//                     <div className="row g-3 mb-2">
//                       <div className="col-md-6 d-flex gap-2 align-items-center">
//                         <label className="fw-semibold" style={{ minWidth: "60px" }}>
//                           CGST
//                         </label>
//                         <input
//                           type="number"
//                           className="form-control"
//                           placeholder="%"
//                           value={tax2.percent}
//                           onChange={(e) => setTax2({ ...tax2, percent: e.target.value })}
//                           style={{ width: "100px" }}
//                         />
//                       </div>
//                     </div>

//                     {/* SGST */}
//                     <div className="row g-3">
//                       <div className="col-md-6 d-flex gap-2 align-items-center">
//                         <label className="fw-semibold" style={{ minWidth: "60px" }}>
//                           SGST
//                         </label>
//                         <input
//                           type="number"
//                           className="form-control"
//                           placeholder="%"
//                           value={tax3?.percent || ""}
//                           onChange={(e) => setTax3({ ...tax3, percent: e.target.value })}
//                           style={{ width: "100px" }}
//                         />
//                       </div>
//                     </div>

//                   </div>
//                 </div>


//                 {/* Totals */}
//                 <div className="col-md-6">
//                   <h6 className="fw-bold mb-3">Total</h6>
//                   <div className="d-flex justify-content-between mb-2">
//                     <span>Net Total:</span>
//                     <input
//                       type="number"
//                       className="form-control w-25"
//                       value={totals.netTotal}
//                       onChange={(e) =>
//                         setTotals({ ...totals, netTotal: parseFloat(e.target.value) })
//                       }
//                     />
//                   </div>
//                   <div className="d-flex justify-content-between mb-2">
//                     <span>Tax Total:</span>
//                     <input
//                       type="number"
//                       className="form-control w-25"
//                       value={totals.igst}
//                       onChange={(e) =>
//                         setTotals({ ...totals, igst: parseFloat(e.target.value) })
//                       }
//                     />
//                   </div>
//                   <div className="d-flex justify-content-between mb-2">
//                     <span>Round Off:</span>
//                     <input
//                       type="number"
//                       className="form-control w-25"
//                       value={totals.roundOff}
//                       onChange={(e) =>
//                         setTotals({ ...totals, roundOff: parseFloat(e.target.value) })
//                       }
//                     />
//                   </div>
//                   <div className="d-flex justify-content-between fw-bold border-top pt-2 mb-3">
//                     <span>Grand Total:</span>
//                     <input
//                       type="number"
//                       className="form-control w-25"
//                       value={totals.grandTotal}
//                       onChange={(e) =>
//                         setTotals({ ...totals, grandTotal: parseFloat(e.target.value) })
//                       }
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Message */}
//             {message.text && (
//               <div
//                 className={`mt-3 text-center fw-semibold ${message.type === "success" ? "text-success" : "text-danger"
//                   }`}
//               >
//                 {message.text}
//               </div>
//             )}

//             <div className="d-flex justify-content-start gap-2 mt-3 mb-4">
//               <Button themeColor="primary" onClick={formRenderProps.onSubmit}>
//                 Save
//               </Button>
//               <Button type="button" onClick={() => window.location.reload()}>
//                 Cancel
//               </Button>
//             </div>
//           </FormElement>
//         )}
//       />
//     </div>
//   );
// };

// export default Quotation;

import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, Field, FormElement } from "@progress/kendo-react-form";
import { Button } from "@progress/kendo-react-buttons";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { DatePicker } from "@progress/kendo-react-dateinputs";
import FormInput from "../../components/Form/FormInput";
import FloatingLabelWrapper from "../../components/Form/FloatingLabelWrapper/FloatingLabelWrapper";
import EditableLineItemsGrid from "../../components/EditableLineItemsGrid";
import { generateQuotationPDF } from "./QuotationPdf";
import "./Quotation.css";

const Quotation = () => {
  const [projects, setProjects] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [lineItems, setLineItems] = useState([]);
  const formDomRef = useRef(null); // <-- ref to read form DOM values
  const [selectedProject, setSelectedProject] = useState(null);
  // helper to get only real line items
  const getNonEmptyLineItems = () =>
    lineItems.filter(
      (item) =>
        item &&
        (item.materialCode?.toString().trim() !== "" ||
          item.hsnCode?.toString().trim() !== "" ||
          item.description?.toString().trim() !== "" ||
          item.uom?.toString().trim() !== "" ||
          (item.quantity && Number(item.quantity) !== 0) ||
          (item.rate && Number(item.rate) !== 0))
    );

  const [tax1, setTax1] = useState({ option: "", percent: 0 });
  const [tax2, setTax2] = useState({ option: "", percent: 0 });
  const [tax3, setTax3] = useState({ option: "", percent: 0 });

  const [totals, setTotals] = useState({
    netTotal: 0,
    igst: 0,
    roundOff: 0,
    grandTotal: 0,
  });
  const [addresses, setAddresses] = useState({
    billingFromAddress: "",
    billingToAddress: "",
    shippingAddress: "",
    deliveryAddress: "",
  });

  const API_BASE = "https://localhost:7142/api";

  // Regex for validation
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  const billNumberRegex = /^[0-9]+$/;

  // Fetch projects
  useEffect(() => {
    fetch(`${API_BASE}/projects`)
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error("Error fetching projects:", err));
  }, []);

  // Auto-clear success message
  useEffect(() => {
    if (message.type === "success") {
      const timer = setTimeout(() => setMessage({ text: "", type: "" }), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Ensure at least one blank line item
  useEffect(() => {
    if (!lineItems || lineItems.length === 0) {
      setLineItems([
        {
          id: 1,
          materialCode: "",
          hsnCode: "",
          description: "",
          uom: "",
          quantity: "",
          rate: "",
          amount: "",
        },
      ]);
    }
  }, [lineItems]);

  const handleAddressChange = (e) => {
    setAddresses({ ...addresses, [e.target.name]: e.target.value });
  };

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

  // Handle Save (existing)
  const handleSubmit = async (dataItem) => {
    setMessage({ text: "", type: "" });

    // Basic validations (same as before)
    if (!dataItem.projectId || dataItem.projectId === "Select Option") {
      setMessage({ text: "❌ Please select a project.", type: "error" });
      return;
    }

    for (const [key, value] of Object.entries(addresses)) {
      if (!value.trim()) {
        setMessage({
          text: `❌ Please fill ${key.replace(/([A-Z])/g, " $1")}`,
          type: "error",
        });
        return;
      }
    }

    const gstFields = {
      "Billing From GSTIN": dataItem.billingFromGSTIN,
      "Shipping GSTIN": dataItem.shippingGSTIN,
      "Billing To Consignee GSTIN": dataItem.billingToConsigneeGSTIN,
      "Billing To Buyer GSTIN": dataItem.billingToBuyerGSTIN,
      "Document GST Number": dataItem.gstnumber,
    };

    for (const [label, gstValue] of Object.entries(gstFields)) {
      if (!gstValue || gstValue.trim() === "") {
        setMessage({ text: `❌ ${label} is required.`, type: "error" });
        return;
      }
      if (gstValue.length !== 15 || !gstRegex.test(gstValue.toUpperCase())) {
        setMessage({
          text: `❌ ${label} must be a valid 15-character GST number.`,
          type: "error",
        });
        return;
      }
    }

    if (!dataItem.pan || !panRegex.test(dataItem.pan.toUpperCase())) {
      setMessage({ text: "❌ Please enter a valid PAN Number.", type: "error" });
      return;
    }

    if (!dataItem.billnumber || !billNumberRegex.test(dataItem.billnumber)) {
      setMessage({ text: "❌ Please enter a valid Bill Number.", type: "error" });
      return;
    }

    if (lineItems.length === 0 || lineItems.every((item) => !item.materialCode && !item.description)) {
      setMessage({ text: "❌ Please add at least one line item.", type: "error" });
      return;
    }

    for (const [index, item] of lineItems.entries()) {
      const hasFirstFour =
        item.materialCode?.trim() ||
        item.hsnCode?.trim() ||
        item.description?.trim() ||
        item.uom?.trim();

      if (hasFirstFour) {
        const qty = Number(item.quantity);
        const rate = Number(item.rate);
        if (isNaN(qty) || qty < 1 || isNaN(rate) || rate < 1) {
          setMessage({
            text: `❌ Quantity and Rate must be at least 1 for line item ${index + 1}.`,
            type: "error",
          });
          return;
        }
      }
    }

    // Build payload (same shape as before)
    const billNumber =
      dataItem.billnumber && dataItem.billnumber.trim() !== ""
        ? dataItem.billnumber
        : `BILL-${Date.now()}`;

    const cleanedLineItems = getNonEmptyLineItems().map((item, idx) => ({
      materialCode: item.materialCode || `ITEM-${idx + 1}`,
      hsnCode: item.hsnCode || "",
      description: item.description || "",
      uom: item.uom || "",
      quantity: item.quantity ? Number(item.quantity) : 0,
      rate: item.rate ? Number(item.rate) : 0,
      amount:
        item.amount ||
        (item.quantity && item.rate ? Number(item.quantity) * Number(item.rate) : 0),
    }));

    const quotationData = {
      projectName: dataItem.projectId,
      billingFromAddress: addresses.billingFromAddress,
      billNumber,
      billingFromStateCode: dataItem.billingFromStateCode || "",
      billingFromGSTIN: dataItem.billingFromGSTIN || "",
      shippingAddress: addresses.shippingAddress,
      shippingGSTIN: dataItem.shippingGSTIN || "",
      brandOrSubBrand: dataItem.shippingBrand || "",
      billingToAddress: addresses.billingToAddress,
      gstinConsignee: dataItem.billingToConsigneeGSTIN || "",
      gstinBuyer: dataItem.billingToBuyerGSTIN || "",
      deliveryAddress: addresses.deliveryAddress,
      storeCode: dataItem.storeCode || "",
      sapCode: dataItem.sapCode || "",
      vendorCode: dataItem.vendorCode || "",
      billDate: dataItem.billdate || null,
      gstNumber: dataItem.gstnumber || "",
      pan: dataItem.pan || "",
      estimateNo: dataItem.estimateno || "",
      dateOfEstimate: dataItem.dateofestimate || null,
      projectID: dataItem.projectid || "",
      poNumber: dataItem.ponumber || "",
      poDate: dataItem.podate || null,
      poType: dataItem.potype || "",
      brandNameSubBrand: dataItem["brandname/sub-brand"] || "",
      subWorkDescription: dataItem.subworkdescription || "",
      taxOption1: tax1.option || "",
      taxPercent1: parseFloat(tax1.percent) || 0,
      taxOption2: tax2.option || "",
      taxPercent2: parseFloat(tax2.percent) || 0,
      netTotal: totals.netTotal || 0,
      igst: totals.igst || 0,
      roundOff: totals.roundOff || 0,
      grandTotal: totals.grandTotal || 0,
      createdDate: new Date().toISOString(),
      lineItems: cleanedLineItems,
    };

    try {
      const res = await fetch(`${API_BASE}/quotations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quotationData),
      });

      if (res.ok) {
        setMessage({ text: "✅ Quotation saved successfully!", type: "success" });
        console.log("Saved Quotation:", quotationData);
      } else {
        const err = await res.text();
        setMessage({ text: "❌ Failed to save: " + err, type: "error" });
      }
    } catch (err) {
      console.error("Error:", err);
      setMessage({ text: "❌ Error saving quotation.", type: "error" });
    }
  };

  // Auto-calculate totals
  useEffect(() => {
    if (lineItems.length === 0) return;

    const netTotal = lineItems.reduce((sum, item) => {
      const qty = parseFloat(item.quantity) || 0;
      const rate = parseFloat(item.rate) || 0;
      return sum + qty * rate;
    }, 0);

    const tax1Amount = (netTotal * (parseFloat(tax1.percent) || 0)) / 100;
    const tax2Amount = (netTotal * (parseFloat(tax2.percent) || 0)) / 100;
    const roundOff = parseFloat(totals.roundOff) || 0;
    const grandTotal = netTotal + tax1Amount + tax2Amount + roundOff;

    setTotals({
      netTotal: parseFloat(netTotal.toFixed(2)),
      igst: parseFloat((tax1Amount + tax2Amount).toFixed(2)),
      roundOff: roundOff,
      grandTotal: parseFloat(grandTotal.toFixed(2)),
    });
  }, [lineItems, tax1, tax2, totals.roundOff]);

  // Validation used before PDF
  const validateForPDF = (formValues) => {
    if (!formValues.projectId || formValues.projectId === "Select Option") {
      setMessage({ text: "❌ Please select a project.", type: "error" });
      return false;
    }

    for (const [key, value] of Object.entries(addresses)) {
      if (!value.trim()) {
        setMessage({
          text: `❌ Please fill ${key.replace(/([A-Z])/g, " $1")}`,
          type: "error",
        });
        return false;
      }
    }

    const gstFields = {
      "Billing From GSTIN": formValues.billingFromGSTIN,
      "Shipping GSTIN": formValues.shippingGSTIN,
      "Billing To Consignee GSTIN": formValues.billingToConsigneeGSTIN,
      "Billing To Buyer GSTIN": formValues.billingToBuyerGSTIN,
      "Document GST Number": formValues.gstnumber,
    };

    for (const [label, gstValue] of Object.entries(gstFields)) {
      if (!gstValue || gstValue.toString().trim() === "") {
        setMessage({ text: `❌ ${label} is required.`, type: "error" });
        return false;
      }
      if (gstValue.toString().length !== 15 || !gstRegex.test(gstValue.toString().toUpperCase())) {
        setMessage({
          text: `❌ ${label} must be a valid 15-character GST number.`,
          type: "error",
        });
        return false;
      }
    }

    if (!formValues.pan || !panRegex.test(formValues.pan.toString().toUpperCase())) {
      setMessage({ text: "❌ Please enter a valid PAN Number.", type: "error" });
      return false;
    }

    if (!formValues.billnumber || !billNumberRegex.test(formValues.billnumber.toString())) {
      setMessage({ text: "❌ Please enter a valid Bill Number.", type: "error" });
      return false;
    }

    const nonEmptyLineItems = getNonEmptyLineItems();

    if (nonEmptyLineItems.length === 0) {
      setMessage({ text: "❌ Please add at least one line item.", type: "error" });
      return false;
    }

    for (const [index, item] of nonEmptyLineItems.entries()) {
      const qty = Number(item.quantity);
      const rate = Number(item.rate);
      if (isNaN(qty) || qty < 1 || isNaN(rate) || rate < 1) {
        setMessage({
          text: `❌ Quantity and Rate must be ≥ 1 for line item ${index + 1}.`,
          type: "error",
        });
        return false;
      }
    }

    setMessage({ text: "", type: "" });
    return true;
  };

  // ===== helper: read form values from the DOM inside the form wrapper =====
  const readFormValuesFromDom = () => {
    const root = formDomRef.current;
    if (!root) return {};
    const data = {};
    // query any element with a name attribute inside the root
    const elems = root.querySelectorAll("[name]");
    elems.forEach((el) => {
      const name = el.getAttribute("name");
      if (!name) return;
      // avoid overwriting when same name appears multiple times (radio groups etc.)
      if (el.type === "checkbox") {
        data[name] = el.checked;
      } else if (el.tagName === "SELECT") {
        data[name] = el.value;
      } else if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        data[name] = el.value;
      } else {
        // fallback
        data[name] = el.textContent || el.value || "";
      }
    });
    return data;
  };

  return (
    <div className="container-fluid py-3">
      <h4 className="mb-4">Add Quotation</h4>

      <Form
        onSubmit={handleSubmit}
        render={(formRenderProps) => (
          // wrap the FormElement in a container with a ref so we can query DOM inputs reliably
          <div ref={formDomRef}>
            <FormElement>
              <div className="d-flex justify-content-end align-items-center mb-3">
                {/* <Button
                  type="button"
                  themeColor="primary"
                  className="ms-2"
                  onClick={async () => {
                    // Combine all possible sources of data
                    let values = formRenderProps.value || {};
                    const domValues = readFormValuesFromDom(); // in case Kendo misses anything

                    // Merge them
                    values = { ...domValues, ...values };

                    // Add project selection if missing
                    if (!values.projectId && selectedProject) {
                      values.projectId = selectedProject;
                    }

                    if (!values.projectId) {
                      setMessage({
                        text: "❌ Please select a project before downloading PDF.",
                        type: "error",
                      });
                      return;
                    }

                    // Validate everything
                    if (validateForPDF(values)) {
                      const cleanedLineItems = getNonEmptyLineItems();

                      // 🔥 Build COMPLETE PDF data with all controlled states
                      const pdfData = {
                        // Project Information
                        projectName: selectedProject || values.projectId || "",
                        projectID: values.projectid || "",

                        // Codes
                        storeCode: values.storeCode || "",
                        sapCode: values.sapCode || "",
                        vendorCode: values.vendorCode || "",

                        // Billing From Details
                        billingFromAddress: addresses.billingFromAddress || "",
                        billingFromGSTIN: values.billingFromGSTIN || "",
                        billingFromStateCode: values.billingFromStateCode || "",

                        // Billing To / Buyer Details
                        billingToAddress: addresses.billingToAddress || "",
                        gstinBuyer: values.billingToBuyerGSTIN || "",
                        gstinConsignee: values.billingToConsigneeGSTIN || "",

                        // Shipping & Delivery
                        shippingAddress: addresses.shippingAddress || "",
                        shippingGSTIN: values.shippingGSTIN || "",
                        deliveryAddress: addresses.deliveryAddress || "",

                        // Bill / Estimate Details
                        billNumber: values.billnumber || "",
                        billDate: values.billdate || "",
                        estimateNo: values.estimateno || "",
                        dateOfEstimate: values.dateofestimate || "",

                        // PO Details
                        poNumber: values.ponumber || "",
                        poDate: values.podate || "",
                        poType: values.potype || "",

                        // Tax / Financial Details
                        taxPercent1: tax1.percent || 0,
                        taxPercent2: tax2.percent || 0,
                        taxPercent3: tax3.percent || 0,
                        netTotal: totals.netTotal || 0,
                        igst: totals.igst || 0,
                        roundOff: totals.roundOff || 0,
                        grandTotal: totals.grandTotal || 0,

                        // Identifiers
                        gstNumber: values.gstnumber || "",
                        pan: values.pan || "",

                        // Brand & Description
                        brandNameSubBrand: values.brandNameSubBrand || "",
                        subWorkDescription: values.subWorkDescription || "",


                        // Line Items
                        lineItems: cleanedLineItems || [],
                      };


                      console.log("📄 Sending full data to PDF:", pdfData);
                      await generateQuotationPDF(pdfData);
                    }
                  }}
                >
                  Download PDF
                </Button> */}



              </div>

              {/* Project Dropdown */}
              <div className="mb-4">
                <label className="form-label fw-bold">
                  Projects <span className="text-danger">*</span>
                </label>
                <div style={{ maxWidth: "320px" }}>
                  {/* <Field
                    name="projectId"
                    component={DropDownField}
                    data={projects.map((p) => p.projectName)}
                  /> */}
                  <Field
                    name="projectId"
                    label="Project"
                    component={DropDownList}
                    data={projects.map(p => p.projectName)}
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.value)}
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
                        value={addresses.billingFromAddress}
                        onChange={handleAddressChange}
                        className="form-control mb-2"
                        placeholder="Address"
                        style={{ height: "100px" }}
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
                      ></textarea>
                      <div className="row g-2 mt-2">
                        <div className="col-md-4">
                          <Field name="storeCode" label="Store Code" component={FormInput} />
                        </div>
                        <div className="col-md-4">
                          <Field name="sapCode" label="SAP Code" component={FormInput} />
                        </div>
                        <div className="col-md-4">
                          <Field name="vendorCode" label="Vendor Code" component={FormInput} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Document Details */}
              {/* <div className="mt-4">
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
                      {["Bill Date", "Date of Estimate", "PO Date"].includes(label) ? (
                        <FloatingLabelWrapper label={label}>
                          <Field
                            name={label.replace(/\s+/g, "").toLowerCase()}
                            component={(fieldRenderProps) => (
                              <DatePicker
                                {...fieldRenderProps}
                                format="yyyy-MM-dd"
                                size="large"
                                className="form-control"
                              />
                            )}
                          />
                        </FloatingLabelWrapper>
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
              </div> */}
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
                  ].map((label, i) => (
                    <div key={i} className="col-md-3 col-sm-6">
                      {["Bill Date", "Date of Estimate", "PO Date"].includes(label) ? (
                        <FloatingLabelWrapper label={label}>
                          <Field
                            name={label.replace(/\s+/g, "").toLowerCase()}
                            component={(fieldRenderProps) => (
                              <DatePicker
                                {...fieldRenderProps}
                                format="yyyy-MM-dd"
                                size="large"
                                className="form-control"
                              />
                            )}
                          />
                        </FloatingLabelWrapper>
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

                  {/* ✅ Manually added for clean naming */}
                  <div className="col-md-3 col-sm-6">
                    <Field
                      name="brandNameSubBrand"
                      label="Brand Name / Sub-brand"
                      component={FormInput}
                      type="text"
                    />
                  </div>

                  <div className="col-md-3 col-sm-6">
                    <Field
                      name="subWorkDescription"
                      label="Sub(work Description)"
                      component={FormInput}
                      type="text"
                    />
                  </div>
                </div>
              </div>


              {/* Editable Line Items Grid */}
              <div className="mt-4 border rounded p-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="fw-bold mb-0">Line Items</h6>
                </div>
                <EditableLineItemsGrid
                  value={lineItems}
                  onChange={setLineItems}
                  columns={[
                    { field: "materialCode", title: "Material Code" },
                    { field: "hsnCode", title: "HSN Code" },
                    { field: "description", title: "Description" },
                    { field: "uom", title: "UOM" },
                    { field: "quantity", title: "Quantity", type: "numeric" },
                    { field: "rate", title: "Rate", type: "numeric" },
                    { field: "amount", title: "Amount", type: "numeric" },
                  ]}
                />
              </div>

              {/* Tax & Totals */}
              <div className="mt-4">
                <div className="row align-items-start">
                  <div className="col-md-6">
                    <h6 className="fw-bold mb-3">Tax</h6>
                    <div className="container-fluid px-0">
                      <div className="row g-3 mb-2">
                        <div className="col-md-6 d-flex gap-2 align-items-center">
                          <label className="fw-semibold" style={{ minWidth: "60px" }}>
                            IGST
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            placeholder="%"
                            value={tax1.percent}
                            onChange={(e) => setTax1({ ...tax1, percent: e.target.value })}
                            style={{ width: "100px" }}
                            name="tax1_percent"
                          />
                        </div>
                      </div>

                      <div className="row g-3 mb-2">
                        <div className="col-md-6 d-flex gap-2 align-items-center">
                          <label className="fw-semibold" style={{ minWidth: "60px" }}>
                            CGST
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            placeholder="%"
                            value={tax2.percent}
                            onChange={(e) => setTax2({ ...tax2, percent: e.target.value })}
                            style={{ width: "100px" }}
                            name="tax2_percent"
                          />
                        </div>
                      </div>

                      <div className="row g-3">
                        <div className="col-md-6 d-flex gap-2 align-items-center">
                          <label className="fw-semibold" style={{ minWidth: "60px" }}>
                            SGST
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            placeholder="%"
                            value={tax3?.percent || ""}
                            onChange={(e) => setTax3({ ...tax3, percent: e.target.value })}
                            style={{ width: "100px" }}
                            name="tax3_percent"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <h6 className="fw-bold mb-3">Total</h6>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Net Total:</span>
                      <input
                        type="number"
                        className="form-control w-25"
                        value={totals.netTotal}
                        onChange={(e) =>
                          setTotals({ ...totals, netTotal: parseFloat(e.target.value) })
                        }
                        name="netTotal"
                      />
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Tax Total:</span>
                      <input
                        type="number"
                        className="form-control w-25"
                        value={totals.igst}
                        onChange={(e) =>
                          setTotals({ ...totals, igst: parseFloat(e.target.value) })
                        }
                        name="taxTotal"
                      />
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Round Off:</span>
                      <input
                        type="number"
                        className="form-control w-25"
                        value={totals.roundOff}
                        onChange={(e) =>
                          setTotals({ ...totals, roundOff: parseFloat(e.target.value) })
                        }
                        name="roundOff"
                      />
                    </div>
                    <div className="d-flex justify-content-between fw-bold border-top pt-2 mb-3">
                      <span>Grand Total:</span>
                      <input
                        type="number"
                        className="form-control w-25"
                        value={totals.grandTotal}
                        onChange={(e) =>
                          setTotals({ ...totals, grandTotal: parseFloat(e.target.value) })
                        }
                        name="grandTotal"
                      />
                    </div>
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

              <div className="d-flex flex-wrap justify-content-between align-items-center mt-3 mb-4">
                {/* Left side: Save + Cancel */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mt-3 mb-4 gap-2">
                  {/* Left side: Save + Cancel */}
                  <div className="d-flex flex-column flex-sm-row gap-2 w-100 w-md-auto">
                    <Button themeColor="primary" type="submit" className="w-100 w-sm-auto responsive-button">
                      Save
                    </Button>
                    <Button type="button" onClick={() => window.location.reload()} className="w-100 w-sm-auto responsive-button">
                      Cancel
                    </Button>
                  </div>

                  <div className="mt-2 mt-md-0 w-100 w-md-auto">
                    <Button
                      themeColor="primary"
                      type="button"
                      className="w-100 w-md-auto responsive-button"
                      onClick={async () => {
                        // Combine all possible sources of data
                        let values = formRenderProps.value || {};
                        const domValues = readFormValuesFromDom(); // in case Kendo misses anything

                        // Merge them
                        values = { ...domValues, ...values };

                        // Add project selection if missing
                        if (!values.projectId && selectedProject) {
                          values.projectId = selectedProject;
                        }

                        if (!values.projectId) {
                          setMessage({
                            text: "❌ Please select a project before downloading PDF.",
                            type: "error",
                          });
                          return;
                        }

                        // Validate everything
                        if (validateForPDF(values)) {
                          const cleanedLineItems = getNonEmptyLineItems();

                          // 🔥 Build COMPLETE PDF data with all controlled states
                          const pdfData = {
                            // Project Information
                            projectName: selectedProject || values.projectId || "",
                            projectID: values.projectid || "",

                            // Codes
                            storeCode: values.storeCode || "",
                            sapCode: values.sapCode || "",
                            vendorCode: values.vendorCode || "",

                            // Billing From Details
                            billingFromAddress: addresses.billingFromAddress || "",
                            billingFromGSTIN: values.billingFromGSTIN || "",
                            billingFromStateCode: values.billingFromStateCode || "",

                            // Billing To / Buyer Details
                            billingToAddress: addresses.billingToAddress || "",
                            gstinBuyer: values.billingToBuyerGSTIN || "",
                            gstinConsignee: values.billingToConsigneeGSTIN || "",

                            // Shipping & Delivery
                            shippingAddress: addresses.shippingAddress || "",
                            shippingGSTIN: values.shippingGSTIN || "",
                            deliveryAddress: addresses.deliveryAddress || "",

                            // Bill / Estimate Details
                            billNumber: values.billnumber || "",
                            billDate: values.billdate || "",
                            estimateNo: values.estimateno || "",
                            dateOfEstimate: values.dateofestimate || "",

                            // PO Details
                            poNumber: values.ponumber || "",
                            poDate: values.podate || "",
                            poType: values.potype || "",

                            // Tax / Financial Details
                            taxPercent1: tax1.percent || 0,
                            taxPercent2: tax2.percent || 0,
                            taxPercent3: tax3.percent || 0,
                            netTotal: totals.netTotal || 0,
                            igst: totals.igst || 0,
                            roundOff: totals.roundOff || 0,
                            grandTotal: totals.grandTotal || 0,

                            // Identifiers
                            gstNumber: values.gstnumber || "",
                            pan: values.pan || "",

                            // Brand & Description
                            brandNameSubBrand: values.brandNameSubBrand || "",
                            subWorkDescription: values.subWorkDescription || "",


                            // Line Items
                            lineItems: cleanedLineItems || [],
                          };


                          console.log("📄 Sending full data to PDF:", pdfData);
                          await generateQuotationPDF(pdfData);
                        }
                      }}
                    >
                      Download PDF
                    </Button>
                  </div>
                </div>
              </div>
            </FormElement>
          </div>
        )}
      />
    </div>
  );
};

export default Quotation;
