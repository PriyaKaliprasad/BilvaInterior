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


import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, Field, FormElement } from "@progress/kendo-react-form";
import { Button } from "@progress/kendo-react-buttons";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { DatePicker } from "@progress/kendo-react-dateinputs";
import FormInput from "../../components/Form/FormInput";
import FloatingLabelWrapper from "../../components/Form/FloatingLabelWrapper/FloatingLabelWrapper";
import EditableLineItemsGrid from "../../components/EditableLineItemsGrid";
import QuotationPDF from "./QuotationPdf";
import "./Quotation.css";

const Quotation = () => {
  const [projects, setProjects] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [lineItems, setLineItems] = useState([]);
  const [tax1, setTax1] = useState({ option: "", percent: 0 });
  const [tax2, setTax2] = useState({ option: "", percent: 0 });
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

  // ✅ Regex for validation
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  const billNumberRegex = /^[0-9]+$/;

  // ✅ Fetch projects
  useEffect(() => {
    fetch(`${API_BASE}/projects`)
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error("Error fetching projects:", err));
  }, []);

  // ✅ Auto-clear success message
  useEffect(() => {
    if (message.type === "success") {
      const timer = setTimeout(() => setMessage({ text: "", type: "" }), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // ✅ Ensure at least one blank line item
  useEffect(() => {
    if (lineItems.length === 0) {
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

  const taxOptions = ["IGST", "CGST", "SGST"];

  // ✅ Handle Form Submit
  const handleSubmit = async (dataItem) => {
    setMessage({ text: "", type: "" });

    // Project Validation
    if (!dataItem.projectId || dataItem.projectId === "Select Option") {
      setMessage({ text: "❌ Please select a project.", type: "error" });
      return;
    }

    // Address Validation
    for (const [key, value] of Object.entries(addresses)) {
      if (!value.trim()) {
        setMessage({
          text: `❌ Please fill ${key.replace(/([A-Z])/g, " $1")}`,
          type: "error",
        });
        return;
      }
    }

    // GST Validation
    if (dataItem.gstnumber && !gstRegex.test(dataItem.gstnumber.toUpperCase())) {
      setMessage({ text: "❌ Invalid GST Number format.", type: "error" });
      return;
    }

    // PAN Validation
    if (dataItem.pan && !panRegex.test(dataItem.pan.toUpperCase())) {
      setMessage({ text: "❌ Invalid PAN Number format.", type: "error" });
      return;
    }

    // Bill Number Validation
    if (dataItem.billnumber && !billNumberRegex.test(dataItem.billnumber)) {
      setMessage({ text: "❌ Bill Number must contain only numbers.", type: "error" });
      return;
    }

    // Generate bill number if empty
    const billNumber =
      dataItem.billnumber && dataItem.billnumber.trim() !== ""
        ? dataItem.billnumber
        : `BILL-${Date.now()}`;

    // Clean Line Items
    const cleanedLineItems = lineItems
      .filter(
        (item) =>
          item.materialCode?.trim() !== "" ||
          item.hsnCode?.trim() !== "" ||
          item.description?.trim() !== "" ||
          item.uom?.trim() !== "" ||
          (item.quantity && item.quantity !== 0) ||
          (item.rate && item.rate !== 0)
      )
      .map((item, idx) => ({
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

    // Build Payload
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

    // POST to API
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

  // ✅ Auto-calculate totals
  useEffect(() => {
    if (lineItems.length === 0) return;

    const netTotal = lineItems.reduce((sum, item) => {
      const qty = parseFloat(item.quantity) || 0;
      const rate = parseFloat(item.rate) || 0;
      return sum + qty * rate;
    }, 0);

    const tax1Amount = (netTotal * (parseFloat(tax1.percent) || 0)) / 100;
    const tax2Amount = (netTotal * (parseFloat(tax2.percent) || 0)) / 100;
    const grandTotal = netTotal + tax1Amount + tax2Amount + (totals.roundOff || 0);

    setTotals({
      netTotal: parseFloat(netTotal.toFixed(2)),
      igst: parseFloat((tax1Amount + tax2Amount).toFixed(2)),
      roundOff: parseFloat(totals.roundOff.toFixed(2)),
      grandTotal: parseFloat(grandTotal.toFixed(2)),
    });
  }, [lineItems, tax1, tax2, totals.roundOff]);

  return (
    <div className="container-fluid py-3">
      <h4 className="mb-4">Add  Quotation</h4>

      <Form
        onSubmit={handleSubmit}
        render={(formRenderProps) => (
          <FormElement>
            {/* ✅ PDF Download Button - place at top */}
            {/* ✅ PDF Download Button - place at top */}
            <div className="d-flex justify-content-end align-items-center mb-3">
              {(() => {
                const pdfData = {
                  // 🏗️ Project + Parties
                  projectName: formRenderProps.valueGetter?.("projectId") || "",
                  billingFromAddress: addresses.billingFromAddress,
                  billingFromGSTIN: formRenderProps.valueGetter?.("billingFromGSTIN") || "",
                  billingFromStateCode: formRenderProps.valueGetter?.("billingFromStateCode") || "",
                  billingToAddress: addresses.billingToAddress,
                  gstinBuyer: formRenderProps.valueGetter?.("billingToBuyerGSTIN") || "",
                  gstinConsignee: formRenderProps.valueGetter?.("billingToConsigneeGSTIN") || "",
                  shippingAddress: addresses.shippingAddress,
                  shippingGSTIN: formRenderProps.valueGetter?.("shippingGSTIN") || "",
                  deliveryAddress: addresses.deliveryAddress,

                  // 📄 Document Details
                  billNumber: formRenderProps.valueGetter?.("billnumber") || "",
                  billDate: formRenderProps.valueGetter?.("billdate") || "",
                  gstNumber: formRenderProps.valueGetter?.("gstnumber") || "",
                  pan: formRenderProps.valueGetter?.("pan") || "",
                  estimateNo: formRenderProps.valueGetter?.("estimateno") || "",
                  dateOfEstimate: formRenderProps.valueGetter?.("dateofestimate") || "",
                  projectId: formRenderProps.valueGetter?.("projectid") || "",
                  poNumber: formRenderProps.valueGetter?.("ponumber") || "",
                  poDate: formRenderProps.valueGetter?.("podate") || "",
                  poType: formRenderProps.valueGetter?.("potype") || "",
                  brandName: formRenderProps.valueGetter?.("brandname/sub-brand") || "",
                  subBrand: formRenderProps.valueGetter?.("subworkdescription") || "",
                  workDescription: formRenderProps.valueGetter?.("subworkdescription") || "",

                  // 📦 Line items
                  lineItems,

                  // 💰 Totals
                  netTotal: totals.netTotal,
                  igst: totals.igst,
                  roundOff: totals.roundOff,
                  grandTotal: totals.grandTotal,
                };

                console.log("📦 Data passed to QuotationPDF:", pdfData);

                return <QuotationPDF quotation={pdfData} />;
              })()}
            </div>


            {/* Project Dropdown */}
            <div className="mb-4">
              <label className="form-label fw-bold">
                Projects <span className="text-danger">*</span>
              </label>
              <div style={{ maxWidth: "320px" }}>
                <Field
                  name="projectId"
                  component={DropDownField}
                  data={projects.map((p) => p.projectName)}
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
                    <h6 className="fw-bold mb-2">Billing From (Bilva Interiors)</h6>
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
            </div>

            {/* ✅ Editable Line Items Grid */}
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
            {/* Tax & Totals section */}
            <div className="mt-4">
              <div className="row align-items-start">
                <div className="col-md-6">
                  <h6 className="fw-bold mb-3">Tax Options</h6>
                  <div className="container-fluid px-0">
                    <div className="row g-3 mb-2">
                      <div className="col-md-6 d-flex gap-2 align-items-center">
                        <DropDownList

                          data={taxOptions}
                          value={tax1.option}
                          onChange={(e) => setTax1({ ...tax1, option: e.value })}
                          defaultItem="Select Option"
                        />
                        <input
                          type="number"
                          className="form-control"
                          placeholder="%"
                          value={tax1.percent}
                          onChange={(e) => setTax1({ ...tax1, percent: e.target.value })}
                          style={{ width: "100px" }}
                        />
                      </div>
                    </div>
                    <div className="row g-3">
                      <div className="col-md-6 d-flex gap-2 align-items-center">
                        <DropDownList
                          data={taxOptions}
                          value={tax2.option}
                          onChange={(e) => setTax2({ ...tax2, option: e.value })}
                          defaultItem="Select Option"
                        />
                        <input
                          type="number"
                          className="form-control"
                          placeholder="%"
                          value={tax2.percent}
                          onChange={(e) => setTax2({ ...tax2, percent: e.target.value })}
                          style={{ width: "100px" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Totals */}
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
                    />
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>IGST:</span>
                    <input
                      type="number"
                      className="form-control w-25"
                      value={totals.igst}
                      onChange={(e) =>
                        setTotals({ ...totals, igst: parseFloat(e.target.value) })
                      }
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
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Message */}
            {message.text && (
              <div
                className={`mt-3 text-center fw-semibold ${message.type === "success" ? "text-success" : "text-danger"
                  }`}
              >
                {message.text}
              </div>
            )}

            <div className="d-flex justify-content-start gap-2 mt-3 mb-4">
              <Button themeColor="primary" onClick={formRenderProps.onSubmit}>
                Save
              </Button>
              <Button type="button" onClick={() => window.location.reload()}>
                Cancel
              </Button>
            </div>
          </FormElement>
        )}
      />
    </div>
  );
};

export default Quotation;
