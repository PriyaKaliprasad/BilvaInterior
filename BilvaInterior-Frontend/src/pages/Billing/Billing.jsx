// import React, { useEffect, useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { Form, Field, FormElement } from "@progress/kendo-react-form";
// import { Button } from "@progress/kendo-react-buttons";
// import { DropDownList } from "@progress/kendo-react-dropdowns";
// import { DatePicker } from "@progress/kendo-react-dateinputs";
// import FormInput from "../../components/Form/FormInput";
// import FloatingLabelWrapper from "../../components/Form/FloatingLabelWrapper/FloatingLabelWrapper";
// import EditableLineItemsGrid from "../../components/EditableLineItemsGrid";
// import BillingPDF from "./BillingPdf";
// import { pdf } from "@react-pdf/renderer";
// import { BillingPDFDocument } from "./BillingPdf";


// const Billing = () => {
//     const [projects, setProjects] = useState([]);
//     const [message, setMessage] = useState({ text: "", type: "" });
//     const [lineItems, setLineItems] = useState([]);
//     const [tax1, setTax1] = useState({ option: "", percent: 0 });
//     const [tax2, setTax2] = useState({ option: "", percent: 0 });
//     const [tax3, setTax3] = useState({ option: "", percent: 0 });

//     const [totals, setTotals] = useState({
//         netTotal: 0,
//         igst: 0,
//         roundOff: 0,
//         grandTotal: 0,
//     });

//     // ----------------- All form fields state -----------------
//     const [addresses, setAddresses] = useState({
//         billingFromAddress: "",
//         billingToAddress: "",
//         shippingAddress: "",
//         deliveryAddress: "",
//     });

//     const [billingFromState, setBillingFromState] = useState("");
//     const [billingFromStateCode, setBillingFromStateCode] = useState("");
//     const [billingFromGSTIN, setBillingFromGSTIN] = useState("");
//     const [billingFromBrand, setBillingFromBrand] = useState("");
//     const [billingFromContact, setBillingFromContact] = useState("");

//     const [shippingState, setShippingState] = useState("");
//     const [shippingStateCode, setShippingStateCode] = useState("");
//     const [shippingGSTIN, setShippingGSTIN] = useState("");
//     const [shippingBrand, setShippingBrand] = useState("");
//     const [shippingContact, setShippingContact] = useState("");

//     const [billingToState, setBillingToState] = useState("");
//     const [billingToStateCode, setBillingToStateCode] = useState("");
//     const [billingToGSTIN, setBillingToGSTIN] = useState("");

//     const [storeCode, setStoreCode] = useState("");
//     const [sapCode, setSapCode] = useState("");
//     const [vendorCode, setVendorCode] = useState("");

//     const [billNumber, setBillNumber] = useState("");
//     const [billDate, setBillDate] = useState(null);
//     const [estimateNo, setEstimateNo] = useState("");
//     const [dateOfEstimate, setDateOfEstimate] = useState(null);
//     const [selectedProject, setSelectedProject] = useState(null);
//     const [gstNumber, setGSTNumber] = useState("");
//     const [pan, setPAN] = useState("");
//     const [poNumber, setPONumber] = useState("");
//     const [poDate, setPODate] = useState(null);
//     const [poType, setPOType] = useState("");
//     const [subWorkDescription, setSubWorkDescription] = useState("");
//     const [invoiceTitle, setInvoiceTitle] = useState("");
//     const [projectId, setProjectId] = useState("");


//     const API_BASE = "https://localhost:7142/api";
//     const taxOptions = ["IGST", "CGST", "SGST"];

//     useEffect(() => {
//         fetch(`${API_BASE}/projects`)
//             .then((res) => res.json())
//             .then((data) => setProjects(data))
//             .catch((err) => console.error("Error fetching projects:", err));
//     }, []);

//     useEffect(() => {
//         if (message.type === "success") {
//             const timer = setTimeout(() => setMessage({ text: "", type: "" }), 5000);
//             return () => clearTimeout(timer);
//         }
//     }, [message]);

//     useEffect(() => {
//         if (lineItems.length === 0) {
//             setLineItems([
//                 {
//                     id: 1,
//                     materialCode: "",
//                     hsnCode: "",
//                     description: "",
//                     uom: "",
//                     quantity: 1,
//                     rate: 1,
//                     amount: 1,
//                 },
//             ]);
//         }
//     }, []); // <-- only run once on mount


//     const handleAddressChange = (e) => {
//         setAddresses({ ...addresses, [e.target.name]: e.target.value });
//     };

//     // const DropDownField = (fieldRenderProps) => (
//     //     <div style={{ width: "200px" }}>
//     //         <DropDownList
//     //             data={projects}
//     //             dataItemKey="id"
//     //             textField="projectName"
//     //             value={selectedProject}
//     //             onChange={(e) => setSelectedProject(e.value)}
//     //             defaultItem={{ id: 0, projectName: "Select Project" }}
//     //             style={{ width: "100%" }}
//     //         />

//     //     </div>
//     // );
//     // const DropDownField = (fieldRenderProps) => (
//     //     <div style={{ width: "200px" }}>
//     //         <DropDownList
//     //             data={fieldRenderProps.data}
//     //             value={fieldRenderProps.value}
//     //             onChange={(e) => fieldRenderProps.onChange({ value: e.value })}
//     //             defaultItem="Select Option"
//     //             style={{ width: "100%" }}
//     //         />
//     //     </div>
//     // );
//     const DropDownField = ({ value, onChange, data, textField }) => (
//         <div style={{ width: "200px" }}>
//             <DropDownList
//                 data={data}
//                 textField={textField}
//                 value={value}                 // value should be the selected object
//                 onChange={(e) => onChange(e.value)}
//                 defaultItem={{ [textField]: "Select Project" }}
//                 style={{ width: "100%" }}
//             />
//         </div>
//     );


//     const handleSubmit = async (dataItem) => {
//         setMessage({ text: "", type: "" });

//         // ✅ Mandatory Fields Validation
//         const requiredFields = [
//             { name: "Billing From Address", value: addresses.billingFromAddress },
//             { name: "Billing To Address", value: addresses.billingToAddress },
//             { name: "Shipping Address", value: addresses.shippingAddress },
//             { name: "Delivery Address", value: addresses.deliveryAddress },
//             { name: "Billing From GSTIN", value: billingFromGSTIN },
//             { name: "Billing To GSTIN", value: billingToGSTIN },
//             { name: "Shipping GSTIN", value: shippingGSTIN },
//             { name: "GST Number", value: gstNumber },
//             { name: "PAN", value: pan },
//             { name: "Invoice Title", value: invoiceTitle },
//         ];

//         for (const field of requiredFields) {
//             if (!field.value || field.value.trim() === "") {
//                 setMessage({
//                     text: `❌ Please fill ${field.name}. All fields are mandatory.`,
//                     type: "error",
//                 });
//                 return;
//             }
//         }

//         // ✅ GSTIN Validation (15 alphanumeric)
//         // ✅ GSTIN Validation (15 alphanumeric, exact length)
//         const gstRegex = /^[A-Z0-9]{15}$/i;
//         const gstFields = [
//             { name: "Billing From GSTIN", value: billingFromGSTIN },
//             { name: "Billing To GSTIN", value: billingToGSTIN },
//             { name: "Shipping GSTIN", value: shippingGSTIN },
//             { name: "GST Number", value: gstNumber },
//         ];

//         for (const field of gstFields) {
//             if (!gstRegex.test(field.value?.trim())) {
//                 setMessage({
//                     text: `❌ Invalid ${field.name}! It must be exactly 15 alphanumeric characters (A–Z, 0–9).`,
//                     type: "error",
//                 });
//                 return;
//             }
//         }

//         // ✅ PAN Validation (10 alphanumeric)
//         const panRegex = /^[A-Z0-9]{10}$/i;
//         if (!panRegex.test(pan?.trim())) {
//             setMessage({
//                 text: "❌ Invalid PAN! It must be exactly 10 alphanumeric characters (A–Z, 0–9).",
//                 type: "error",
//             });
//             return;
//         }


//         // ✅ PAN Validation (10 alphanumeric)
//         // const panRegex = /^[A-Z0-9]{10}$/i;
//         // if (!panRegex.test(pan)) {
//         //     setMessage({
//         //         text: "❌ Invalid PAN! It must be exactly 10 alphanumeric characters.",
//         //         type: "error",
//         //     });
//         //     return;
//         // }

//         // ✅ At least one valid line item
//         const validItems = lineItems.filter(
//             (item) =>
//                 item.materialCode?.trim() ||
//                 item.hsnCode?.trim() ||
//                 item.description?.trim() ||
//                 item.uom?.trim()
//         );

//         if (validItems.length === 0) {
//             setMessage({
//                 text: "❌ Please add at least one line item before saving.",
//                 type: "error",
//             });
//             return;
//         }

//         // ✅ Prepare billing data
//         const billingData = {
//             projectName: selectedProject?.projectName || "Untitled Project",
//             billingFromAddress: addresses.billingFromAddress,
//             billingFromState,
//             billingFromStateCode,
//             billingFromGSTIN,
//             billingFromBrand,
//             billingFromContact,
//             shippingAddress: addresses.shippingAddress,
//             shippingState,
//             shippingStateCode,
//             shippingGSTIN,
//             shippingBrand,
//             shippingContact,
//             billingToAddress: addresses.billingToAddress,
//             billingToState,
//             billingToStateCode,
//             billingToGSTIN,
//             deliveryAddress: addresses.deliveryAddress,
//             storeCode,
//             sapCode,
//             vendorCode,
//             billNumber,
//             billDate,
//             estimateNo,
//             dateOfEstimate,
//             gstNumber,
//             pan,
//             poNumber,
//             poDate,
//             poType,
//             subWorkDescription,
//             invoiceTitle,
//             tax1Option: tax1.option,
//             tax1Percent: tax1.percent,
//             tax2Option: tax2.option,
//             tax2Percent: tax2.percent,
//             tax3Option: tax3?.option || "SGST",      // <-- ADD THIS
//             tax3Percent: tax3?.percent || 0,
//             netTotal: totals.netTotal,
//             igst: totals.igst,
//             roundOff: totals.roundOff,
//             grandTotal: totals.grandTotal,
//             lineItems: validItems,
//         };

//         try {
//             const res = await fetch(`${API_BASE}/billing`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(billingData),
//             });

//             if (res.ok) {
//                 setMessage({
//                     text: "✅ Billing information saved successfully!",
//                     type: "success",
//                 });
//             } else {
//                 const err = await res.text();
//                 setMessage({ text: "❌ Failed to save: " + err, type: "error" });
//             }
//         } catch (err) {
//             console.error("Error:", err);
//             setMessage({ text: "❌ Error saving billing info.", type: "error" });
//         }
//     };

//     useEffect(() => {
//         if (lineItems.length === 0) return;

//         // Only calculate totals, do NOT update lineItems state here
//         const netTotal = lineItems.reduce((sum, item) => {
//             const quantity = parseFloat(item.quantity) || 0;
//             const rate = parseFloat(item.rate) || 0;
//             const amount = quantity * rate;
//             return sum + amount;
//         }, 0);

//         // Calculate taxes
//         const tax1Amount = (netTotal * (parseFloat(tax1.percent) || 0)) / 100;
//         const tax2Amount = (netTotal * (parseFloat(tax2.percent) || 0)) / 100;
//         const tax3Amount = (netTotal * (parseFloat(tax3.percent) || 0)) / 100;
//         const totalTax = tax1Amount + tax2Amount + tax3Amount;

//         const grandTotal = netTotal + totalTax + (totals.roundOff || 0);

//         setTotals({
//             netTotal: parseFloat(netTotal.toFixed(2)),
//             igst: parseFloat(totalTax.toFixed(2)),
//             roundOff: parseFloat(totals.roundOff.toFixed(2)),
//             grandTotal: parseFloat(grandTotal.toFixed(2)),
//         });
//     }, [lineItems, tax1, tax2, tax3, totals.roundOff]);




//     const handleDownloadPDF = async () => {
//         const gstRegex = /^[A-Z0-9]{15}$/i;
//         const panRegex = /^[A-Z0-9]{10}$/i;

//         const requiredFields = [
//             { name: "Billing From Address", value: addresses.billingFromAddress },
//             { name: "Billing To Address", value: addresses.billingToAddress },
//             { name: "Shipping Address", value: addresses.shippingAddress },
//             { name: "Delivery Address", value: addresses.deliveryAddress },
//             { name: "Billing From GSTIN", value: billingFromGSTIN },
//             { name: "Billing To GSTIN", value: billingToGSTIN },
//             { name: "Shipping GSTIN", value: shippingGSTIN },
//             { name: "GST Number", value: gstNumber },
//             { name: "PAN", value: pan },
//             { name: "Invoice Title", value: invoiceTitle },
//             { name: "Billing From Brand", value: billingFromBrand },
//             { name: "Billing From Contact", value: billingFromContact },
//             { name: "Shipping Brand", value: shippingBrand },
//             { name: "Shipping Contact", value: shippingContact },
//         ];

//         for (const field of requiredFields) {
//             if (!field.value || field.value.trim() === "") {
//                 setMessage({
//                     text: `❌ Please fill ${field.name}. All fields are mandatory before downloading PDF.`,
//                     type: "error",
//                 });
//                 return;
//             }
//         }

//         const gstFields = [
//             { name: "Billing From GSTIN", value: billingFromGSTIN },
//             { name: "Billing To GSTIN", value: billingToGSTIN },
//             { name: "Shipping GSTIN", value: shippingGSTIN },
//             { name: "GST Number", value: gstNumber },
//         ];

//         for (const field of gstFields) {
//             if (!gstRegex.test(field.value?.trim())) {
//                 setMessage({
//                     text: `❌ Invalid ${field.name}! It must be exactly 15 alphanumeric characters (A–Z, 0–9).`,
//                     type: "error",
//                 });
//                 return;
//             }
//         }

//         if (!panRegex.test(pan?.trim())) {
//             setMessage({
//                 text: "❌ Invalid PAN! It must be exactly 10 alphanumeric characters (A–Z, 0–9).",
//                 type: "error",
//             });
//             return;
//         }

//         const validItems = lineItems.filter(
//             (item) =>
//                 item.materialCode?.trim() ||
//                 item.hsnCode?.trim() ||
//                 item.description?.trim() ||
//                 item.uom?.trim()
//         );

//         if (validItems.length === 0) {
//             setMessage({
//                 text: "❌ Please add at least one line item before downloading PDF.",
//                 type: "error",
//             });
//             return;
//         }

//         try {
//             const netTotal = lineItems.reduce((sum, item) => {
//                 const quantity = parseFloat(item.quantity) || 0;
//                 const rate = parseFloat(item.rate) || 0;
//                 return sum + quantity * rate;
//             }, 0);

//             const tax1Amount = (netTotal * (parseFloat(tax1.percent) || 0)) / 100;
//             const tax2Amount = (netTotal * (parseFloat(tax2.percent) || 0)) / 100;
//             const tax3Amount = (netTotal * (parseFloat(tax3.percent) || 0)) / 100;

//             const totalTax = tax1Amount + tax2Amount + tax3Amount;
//             const grandTotal = netTotal + totalTax + (totals.roundOff || 0);

//             const pdfData = {
//                 projectName: selectedProject?.projectName || "Untitled Project",
//                 billingFromAddress: addresses.billingFromAddress,
//                 billingFromState,
//                 billingFromStateCode,
//                 billingFromGSTIN,
//                 billingFromBrand,
//                 billingFromContact,
//                 billingToAddress: addresses.billingToAddress,
//                 billingToState,
//                 billingToStateCode,
//                 billingToGSTIN,
//                 shippingAddress: addresses.shippingAddress,
//                 shippingState,
//                 shippingStateCode,
//                 shippingGSTIN,
//                 shippingBrand,
//                 shippingContact,
//                 deliveryAddress: addresses.deliveryAddress,
//                 storeCode,
//                 sapCode,
//                 vendorCode,
//                 billNumber,
//                 billDate: billDate ? billDate.toISOString() : null,
//                 estimateNo,
//                 dateOfEstimate: dateOfEstimate ? dateOfEstimate.toISOString() : null,
//                 projectId: projectId || "-",
//                 gstNumber,
//                 pan,
//                 poNumber,
//                 poDate: poDate ? poDate.toISOString() : null,
//                 poType,
//                 workDescription: subWorkDescription,
//                 invoiceTitle,
//                 netTotal,
//                 totalTax,
//                 roundOff: totals.roundOff,
//                 grandTotal,
//                 tax1Option: tax1.option || "",
//                 tax1Percent: tax1.percent || 0,
//                 tax2Option: tax2.option || "",
//                 tax2Percent: tax2.percent || 0,
//                 tax3Option: tax3.option || "",
//                 tax3Percent: tax3.percent || 0,
//                 lineItems,
//             };

//             const blob = await pdf(<BillingPDFDocument billing={pdfData} />).toBlob();
//             const url = URL.createObjectURL(blob);
//             const link = document.createElement("a");
//             link.href = url;
//             link.download = `Billing_${pdfData.projectName}.pdf`;
//             link.click();
//             URL.revokeObjectURL(url);
//         } catch (error) {
//             console.error("❌ Error generating PDF:", error);
//             setMessage({ text: "❌ Error generating PDF.", type: "error" });
//         }
//     };



//     return (
//         <div className="container-fluid py-3">
//             {/* <div className="d-flex justify-content-end align-items-center mb-3">
//                 <Button
//                     themeColor="primary"
//                     type="button"   // 🔹 Add this line
//                     onClick={handleDownloadPDF}  // no need for "() => ..."
//                 >
//                     Download PDF
//                 </Button>
//             </div> */}

//             <Form
//                 onSubmit={handleSubmit}
//                 render={(formRenderProps) => (
//                     <FormElement>

//                         {/* PASTE THE DROPDOWN FROM QUOTATION.JSX HERE */}

//                         {/* <div className="mb-4">
//                             <label className="form-label fw-bold">
//                                 Projects <span className="text-danger">*</span>
//                             </label>
//                             <div style={{ maxWidth: "320px" }}>
//                                 <DropDownList
//                                     data={projects}
//                                     dataItemKey="projectId"
//                                     textField="projectName"
//                                     value={selectedProject}
//                                     onChange={(e) => setSelectedProject(e.value)}
//                                     defaultItem={{ projectId: 0, projectName: "Select Project" }}
//                                     style={{ width: "100%" }}
//                                 />
//                             </div>
//                         </div> */}
//                         <div className="mb-4">
//                             <label className="form-label fw-bold">
//                                 Projects <span className="text-danger">*</span>
//                             </label>
//                             <div style={{ maxWidth: "320px" }}>
//                                 <Field
//                                     name="projectId"
//                                     component={DropDownField}
//                                     data={projects}       // Pass full objects
//                                     textField="projectName"
//                                 />

//                             </div>
//                         </div>


//                         {/* Parties & Addresses */}
//                         <div>
//                             <h6 className="fw-bold mb-3">Parties and Addresses</h6>
//                             <div className="row g-3">

//                                 {/* Billing From */}
//                                 <div className="col-md-6">
//                                     <div className="border rounded p-3 h-100">
//                                         <h6 className="fw-bold mb-2">Billing From - Bilva Interiors</h6>
//                                         <textarea
//                                             name="billingFromAddress"
//                                             value={addresses.billingFromAddress}
//                                             onChange={(e) => setAddresses({ ...addresses, billingFromAddress: e.target.value })}
//                                             className="form-control mb-2"
//                                             placeholder="Address"
//                                             style={{ height: "100px" }}
//                                         />
//                                         <div className="row g-2 mt-2">
//                                             <div className="col-md-4">
//                                                 <Field
//                                                     name="billingFromState"
//                                                     label="State"
//                                                     value={billingFromState}
//                                                     onChange={(e) => setBillingFromState(e.value || e.target.value)}
//                                                     component={FormInput}
//                                                 />
//                                             </div>
//                                             <div className="col-md-4">
//                                                 <Field
//                                                     name="billingFromStateCode"
//                                                     label="State Code"
//                                                     value={billingFromStateCode}
//                                                     onChange={(e) => setBillingFromStateCode(e.value || e.target.value)}
//                                                     component={FormInput}
//                                                 />
//                                             </div>
//                                             <div className="col-md-4">
//                                                 <Field
//                                                     name="billingFromGSTIN"
//                                                     label="GSTIN"
//                                                     value={billingFromGSTIN}
//                                                     onChange={(e) => setBillingFromGSTIN(e.value || e.target.value)}
//                                                     component={FormInput}
//                                                 />
//                                             </div>
//                                         </div>
//                                         <div className="row g-2 mt-2">
//                                             <div className="col-md-6">
//                                                 <Field
//                                                     name="billingFromBrand"
//                                                     label="Brand"
//                                                     value={billingFromBrand}
//                                                     onChange={(e) => setBillingFromBrand(e.value || e.target.value)}
//                                                     component={FormInput}
//                                                 />
//                                             </div>
//                                             <div className="col-md-6">
//                                                 <Field
//                                                     name="billingFromContact"
//                                                     label="Contact Email / Phone (Optional)"
//                                                     value={billingFromContact}
//                                                     onChange={(e) => setBillingFromContact(e.value || e.target.value)}
//                                                     component={FormInput}
//                                                 />
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Shipping Address */}
//                                 <div className="col-md-6">
//                                     <div className="border rounded p-3 h-100">
//                                         <h6 className="fw-bold mb-2">Shipping Address</h6>
//                                         <textarea
//                                             name="shippingAddress"
//                                             value={addresses.shippingAddress}
//                                             onChange={(e) => setAddresses({ ...addresses, shippingAddress: e.target.value })}
//                                             className="form-control mb-2"
//                                             placeholder="Address"
//                                             style={{ height: "100px" }}
//                                         />
//                                         <div className="row g-2 mt-2">
//                                             <div className="col-md-4">
//                                                 <Field
//                                                     name="shippingState"
//                                                     label="State"
//                                                     value={shippingState}
//                                                     onChange={(e) => setShippingState(e.value || e.target.value)}
//                                                     component={FormInput}
//                                                 />
//                                             </div>
//                                             <div className="col-md-4">
//                                                 <Field
//                                                     name="shippingStateCode"
//                                                     label="State Code"
//                                                     value={shippingStateCode}
//                                                     onChange={(e) => setShippingStateCode(e.value || e.target.value)}
//                                                     component={FormInput}
//                                                 />
//                                             </div>
//                                             <div className="col-md-4">
//                                                 <Field
//                                                     name="shippingGSTIN"
//                                                     label="GSTIN"
//                                                     value={shippingGSTIN}
//                                                     onChange={(e) => setShippingGSTIN(e.value || e.target.value)}
//                                                     component={FormInput}
//                                                 />
//                                             </div>
//                                         </div>
//                                         <div className="row g-2 mt-2">
//                                             <div className="col-md-6">
//                                                 <Field
//                                                     name="shippingBrand"
//                                                     label="Brand"
//                                                     value={shippingBrand}
//                                                     onChange={(e) => setShippingBrand(e.value || e.target.value)}
//                                                     component={FormInput}
//                                                 />
//                                             </div>
//                                             <div className="col-md-6">
//                                                 <Field
//                                                     name="shippingContact"
//                                                     label="Contact Email / Phone (Optional)"
//                                                     value={shippingContact}
//                                                     onChange={(e) => setShippingContact(e.value || e.target.value)}
//                                                     component={FormInput}
//                                                 />
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Billing To */}
//                                 <div className="col-md-6">
//                                     <div className="border rounded p-3 h-100">
//                                         <h6 className="fw-bold mb-2">Billing To</h6>
//                                         <textarea
//                                             name="billingToAddress"
//                                             value={addresses.billingToAddress}
//                                             onChange={(e) => setAddresses({ ...addresses, billingToAddress: e.target.value })}
//                                             className="form-control mb-2"
//                                             placeholder="Address"
//                                             style={{ height: "100px" }}
//                                         />
//                                         <div className="row g-2 mt-2">
//                                             <div className="col-md-4">
//                                                 <Field
//                                                     name="billingToState"
//                                                     label="State"
//                                                     value={billingToState}
//                                                     onChange={(e) => setBillingToState(e.value || e.target.value)}
//                                                     component={FormInput}
//                                                 />
//                                             </div>
//                                             <div className="col-md-4">
//                                                 <Field
//                                                     name="billingToStateCode"
//                                                     label="State Code"
//                                                     value={billingToStateCode}
//                                                     onChange={(e) => setBillingToStateCode(e.value || e.target.value)}
//                                                     component={FormInput}
//                                                 />
//                                             </div>
//                                             <div className="col-md-4">
//                                                 <Field
//                                                     name="billingToGSTIN"
//                                                     label="GSTIN"
//                                                     value={billingToGSTIN}
//                                                     onChange={(e) => setBillingToGSTIN(e.value || e.target.value)}
//                                                     component={FormInput}
//                                                 />
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Delivery Address */}
//                                 <div className="col-md-6">
//                                     <div className="border rounded p-3 h-100">
//                                         <h6 className="fw-bold mb-2">Delivery Address</h6>
//                                         <textarea
//                                             name="deliveryAddress"
//                                             value={addresses.deliveryAddress}
//                                             onChange={(e) => setAddresses({ ...addresses, deliveryAddress: e.target.value })}
//                                             className="form-control mb-2"
//                                             placeholder="Address"
//                                             style={{ height: "100px" }}
//                                         />
//                                         <div className="row g-2 mt-2">
//                                             <div className="col-md-4">
//                                                 <Field
//                                                     name="storeCode"
//                                                     label="Store Code"
//                                                     value={storeCode}
//                                                     onChange={(e) => setStoreCode(e.value || e.target.value)}
//                                                     component={FormInput}
//                                                 />
//                                             </div>
//                                             <div className="col-md-4">
//                                                 <Field
//                                                     name="sapCode"
//                                                     label="SAP Code"
//                                                     value={sapCode}
//                                                     onChange={(e) => setSapCode(e.value || e.target.value)}
//                                                     component={FormInput}
//                                                 />
//                                             </div>
//                                             <div className="col-md-4">
//                                                 <Field
//                                                     name="vendorCode"
//                                                     label="Vendor Code"
//                                                     value={vendorCode}
//                                                     onChange={(e) => setVendorCode(e.value || e.target.value)}
//                                                     component={FormInput}
//                                                 />
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>

//                             </div>
//                         </div>

//                         {/* Document Details */}
//                         <div className="mt-4">
//                             <h6 className="fw-bold mb-3">Invoice Details</h6>
//                             <div className="row g-3 align-items-end">
//                                 {[
//                                     { label: "Bill Number", state: billNumber, setter: setBillNumber },
//                                     { label: "Bill Date", state: billDate, setter: setBillDate, type: "date" },
//                                     { label: "Invoice No", state: estimateNo, setter: setEstimateNo },
//                                     { label: "Date of Invoice", state: dateOfEstimate, setter: setDateOfEstimate, type: "date" },
//                                     { label: "Project ID", state: projectId, setter: setProjectId },
//                                     { label: "GST Number", state: gstNumber, setter: setGSTNumber },
//                                     { label: "PAN", state: pan, setter: setPAN },
//                                     { label: "PO Number", state: poNumber, setter: setPONumber },
//                                     { label: "PO Date", state: poDate, setter: setPODate, type: "date" },
//                                     { label: "PO Type", state: poType, setter: setPOType },
//                                     { label: "Sub(work Description)", state: subWorkDescription, setter: setSubWorkDescription },
//                                     { label: "Invoice Title / Subject", state: invoiceTitle, setter: setInvoiceTitle },
//                                 ].map((item, i) => (
//                                     <div key={i} className="col-md-3 col-sm-6">
//                                         {item.type === "date" ? (
//                                             <FloatingLabelWrapper label={item.label}>
//                                                 <DatePicker
//                                                     value={item.state}
//                                                     onChange={(e) => item.setter(e.value)}
//                                                     format="yyyy-MM-dd"
//                                                     size="large"
//                                                     className="form-control"
//                                                 />
//                                             </FloatingLabelWrapper>
//                                         ) : (
//                                             <Field
//                                                 name={item.label.replace(/\s+/g, "").toLowerCase()}
//                                                 label={item.label}
//                                                 value={item.state || ""}
//                                                 onChange={(e) => item.setter(e.value || e.target.value)}
//                                                 component={FormInput}
//                                                 type="text"
//                                             />
//                                         )}
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>

//                         {/* Line Items */}
//                         <div className="mt-4 border rounded p-3">
//                             <h6 className="fw-bold mb-2">Line Items</h6>
//                             <EditableLineItemsGrid
//                                 value={lineItems}
//                                 onChange={setLineItems}
//                                 columns={[
//                                     { field: "materialCode", title: "Material Code" },
//                                     { field: "hsnCode", title: "HSN Code" },
//                                     { field: "description", title: "Description" },
//                                     { field: "uom", title: "UOM" },
//                                     { field: "quantity", title: "Quantity", type: "numeric" },
//                                     { field: "rate", title: "Rate", type: "numeric" },
//                                     { field: "amount", title: "Amount", type: "numeric" },
//                                 ]}
//                             />
//                         </div>

//                         {/* Tax & Totals */}
//                         <div className="mt-4">
//                             <div className="row align-items-start">

//                                 {/* Tax Options */}
//                                 <div className="col-md-6">
//                                     <h6 className="fw-bold mb-3">Tax</h6>
//                                     <div className="container-fluid px-0">
//                                         {[
//                                             { label: "IGST", data: tax1, setData: setTax1 },
//                                             { label: "CGST", data: tax2, setData: setTax2 },
//                                             { label: "SGST", data: tax3, setData: setTax3 }
//                                         ].map((item, idx) => (
//                                             <div key={idx} className="row g-3 mb-2">
//                                                 <div className="col-md-6 d-flex gap-2 align-items-center">
//                                                     {/* ✅ Static label */}
//                                                     <label className="fw-semibold" style={{ minWidth: "60px" }}>
//                                                         {item.label}
//                                                     </label>

//                                                     {/* ✅ Percentage input */}
//                                                     <input
//                                                         type="number"
//                                                         className="form-control"
//                                                         placeholder="%"
//                                                         value={item.data.percent}
//                                                         onChange={(e) =>
//                                                             item.setData({ ...item.data, percent: e.target.value })
//                                                         }
//                                                         style={{ width: "100px" }}
//                                                     />
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>

//                                 {/* Totals */}
//                                 <div className="col-md-6">
//                                     <h6 className="fw-bold mb-3">Total</h6>
//                                     {[
//                                         { label: "Net Total", value: totals.netTotal, setter: val => setTotals({ ...totals, netTotal: val }) },
//                                         { label: "Total Tax", value: totals.igst, setter: val => setTotals({ ...totals, igst: val }) },
//                                         { label: "Round Off", value: totals.roundOff, setter: val => setTotals({ ...totals, roundOff: val }) },
//                                         { label: "Grand Total", value: totals.grandTotal, setter: val => setTotals({ ...totals, grandTotal: val }) },
//                                     ].map((item, idx) => (
//                                         <div key={idx} className={`d-flex justify-content-between mb-2 ${item.label === "Grand Total" ? "fw-bold border-top pt-2 mb-3" : ""}`}>
//                                             <span>{item.label}:</span>
//                                             <input
//                                                 type="number"
//                                                 className="form-control w-25"
//                                                 value={item.value}
//                                                 onChange={(e) => item.setter(parseFloat(e.target.value))}
//                                             />
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="d-flex justify-content-end align-items-center mb-3">
//                             <Button
//                                 themeColor="primary"
//                                 type="button"   // 🔹 Add this line
//                                 onClick={handleDownloadPDF}  // no need for "() => ..."
//                             >
//                                 Download PDF
//                             </Button>
//                         </div>

//                         {/* Message */}
//                         {/* {message.text && (
//                             <div className={`mt-3 text-center fw-semibold ${message.type === "success" ? "text-success" : "text-danger"}`}>
//                                 {message.text}
//                             </div>
//                         )} */}

//                         {/* ✅ Error/Success Message */}
//                         {message.text && (
//                             <div
//                                 className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"} mt-3`}
//                                 style={{
//                                     fontWeight: 600,
//                                     borderRadius: "8px",
//                                     padding: "10px 15px",
//                                     alignContent: "center",
//                                 }}
//                             >
//                                 {message.text}
//                             </div>
//                         )}


//                         {/* Buttons */}
//                         <div className="d-flex justify-content-start gap-2 mt-3 mb-4">
//                             {/* Make this button type="submit" so Form handles submission */}
//                             <Button themeColor="primary" type="submit">
//                                 Save
//                             </Button>

//                             <Button type="button" onClick={() => window.location.reload()}>
//                                 Cancel
//                             </Button>
//                         </div>


//                     </FormElement>
//                 )}
//             />
//         </div>
//     );
// };

// export default Billing;

// import React, { useEffect, useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { Form, Field, FormElement } from "@progress/kendo-react-form";
// import { Button } from "@progress/kendo-react-buttons";
// import { DropDownList } from "@progress/kendo-react-dropdowns";
// import { DatePicker } from "@progress/kendo-react-dateinputs";
// import FormInput from "../../components/Form/FormInput";
// import FloatingLabelWrapper from "../../components/Form/FloatingLabelWrapper/FloatingLabelWrapper";
// import EditableLineItemsGrid from "../../components/EditableLineItemsGrid";
// import { pdf } from "@react-pdf/renderer";
// import { BillingPDFDocument } from "./BillingPdf";
// import BillingPDF from "./BillingPdf";


// // -------------------- Responsive buttons CSS --------------------
// const responsiveButtonStyle = `
//   /* Mobile buttons */
//   @media (max-width: 768px) {
//     .responsive-button {
//       width: 100% !important;
//       margin-bottom: 10px;
//       font-size: 1rem;
//     }

//     /* Stack flex containers vertically on mobile */
//     .button-row {
//       flex-direction: column !important;
//       align-items: stretch !important;
//     }

//     /* Numeric inputs smaller on mobile */
//     .responsive-numeric-input {
//       width: 80px;
//     }
//   }

//   /* Desktop: fixed width for numeric inputs */
//   .responsive-numeric-input {
//     width: 100px;
//   }
// `;




// const Billing = () => {
//     const [projects, setProjects] = useState([]);
//     const [message, setMessage] = useState({ text: "", type: "" });
//     const [lineItems, setLineItems] = useState([]);
//     const [tax1, setTax1] = useState({ option: "IGST", percent: 0 });
//     const [tax2, setTax2] = useState({ option: "CGST", percent: 0 });
//     const [tax3, setTax3] = useState({ option: "SGST", percent: 0 });

//     const [totals, setTotals] = useState({
//         netTotal: 0,
//         totalTax: 0,
//         roundOff: 0,
//         grandTotal: 0,
//     });

//     // ----------------- All form fields state -----------------
//     const [addresses, setAddresses] = useState({
//         billingFromAddress: "",
//         billingToAddress: "",
//         shippingAddress: "",
//         deliveryAddress: "",
//     });

//     const [billingFromState, setBillingFromState] = useState("");
//     const [billingFromStateCode, setBillingFromStateCode] = useState("");
//     const [billingFromGSTIN, setBillingFromGSTIN] = useState("");
//     const [billingFromBrand, setBillingFromBrand] = useState("");
//     const [billingFromContact, setBillingFromContact] = useState("");

//     const [shippingState, setShippingState] = useState("");
//     const [shippingStateCode, setShippingStateCode] = useState("");
//     const [shippingGSTIN, setShippingGSTIN] = useState("");
//     const [shippingBrand, setShippingBrand] = useState("");
//     const [shippingContact, setShippingContact] = useState("");

//     const [billingToState, setBillingToState] = useState("");
//     const [billingToStateCode, setBillingToStateCode] = useState("");
//     const [billingToGSTIN, setBillingToGSTIN] = useState("");

//     const [storeCode, setStoreCode] = useState("");
//     const [sapCode, setSapCode] = useState("");
//     const [vendorCode, setVendorCode] = useState("");

//     const [billNumber, setBillNumber] = useState("");
//     const [billDate, setBillDate] = useState(null);
//     const [estimateNo, setEstimateNo] = useState("");
//     const [dateOfEstimate, setDateOfEstimate] = useState(null);
//     const [selectedProject, setSelectedProject] = useState(null);
//     const [gstNumber, setGSTNumber] = useState("");
//     const [pan, setPAN] = useState("");
//     const [poNumber, setPONumber] = useState("");
//     const [poDate, setPODate] = useState(null);
//     const [poType, setPOType] = useState("");
//     const [subWorkDescription, setSubWorkDescription] = useState("");
//     const [invoiceTitle, setInvoiceTitle] = useState("");
//     const [projectId, setProjectId] = useState("");

//     const API_BASE = "https://localhost:7142/api";

//     useEffect(() => {
//         fetch(`${API_BASE}/projects`)
//             .then((res) => res.json())
//             .then((data) => setProjects(data))
//             .catch((err) => console.error("Error fetching projects:", err));
//     }, []);

//     useEffect(() => {
//         if (message.type === "success") {
//             const timer = setTimeout(() => setMessage({ text: "", type: "" }), 5000);
//             return () => clearTimeout(timer);
//         }
//     }, [message]);

//     useEffect(() => {
//         if (lineItems.length === 0) {
//             setLineItems([
//                 {
//                     id: 1,
//                     materialCode: "",
//                     hsnCode: "",
//                     description: "",
//                     uom: "",
//                     quantity: "",
//                     rate: "",
//                     amount: "",
//                 },
//             ]);
//         }
//     }, []); // run once on mount

//     const handleAddressChange = (e) => {
//         setAddresses({ ...addresses, [e.target.name]: e.target.value });
//     };

//     const DropDownField = ({ value, onChange, data, textField }) => (
//         <div style={{ width: "200px" }}>
//             <DropDownList
//                 data={data}
//                 textField={textField}
//                 value={value}
//                 onChange={(e) => onChange(e.value)}
//                 defaultItem={{ [textField]: "Select Project" }}
//                 style={{ width: "100%" }}
//             />
//         </div>
//     );

//     // ---- Totals & tax calculation ----
//     useEffect(() => {
//         if (lineItems.length === 0) return;

//         // compute net total = sum(quantity * rate) for all items
//         const netTotal = lineItems.reduce((sum, item) => {
//             const quantity = parseFloat(item.quantity) || 0;
//             const rate = parseFloat(item.rate) || 0;
//             const amount = quantity * rate;
//             return sum + amount;
//         }, 0);

//         // compute individual tax amounts
//         const tax1Amount = (netTotal * (parseFloat(tax1.percent) || 0)) / 100;
//         const tax2Amount = (netTotal * (parseFloat(tax2.percent) || 0)) / 100;
//         const tax3Amount = (netTotal * (parseFloat(tax3.percent) || 0)) / 100;

//         const totalTax = tax1Amount + tax2Amount + tax3Amount;
//         const roundOff = parseFloat(totals.roundOff || 0);

//         const grandTotal = netTotal + totalTax + roundOff;

//         setTotals({
//             netTotal: parseFloat(netTotal.toFixed(2)),
//             totalTax: parseFloat(totalTax.toFixed(2)),
//             roundOff: parseFloat(roundOff.toFixed(2)),
//             grandTotal: parseFloat(grandTotal.toFixed(2)),
//         });
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [lineItems, tax1, tax2, tax3, totals.roundOff]);

//     // ---- Validation helpers ----
//     const isValidGSTIN = (value) => /^[A-Z0-9]{15}$/i.test((value || "").trim());
//     const isValidPAN = (value) => /^[A-Z0-9]{10}$/i.test((value || "").trim());

//     const validateCommonRequiredFields = () => {
//         // Common required fields (used for both Save and PDF)
//         const requiredFields = [
//             { name: "Billing From Address", value: addresses.billingFromAddress },
//             { name: "Billing To Address", value: addresses.billingToAddress },
//             { name: "Shipping Address", value: addresses.shippingAddress },
//             { name: "Delivery Address", value: addresses.deliveryAddress },
//             { name: "Billing From GSTIN", value: billingFromGSTIN },
//             { name: "Billing To GSTIN", value: billingToGSTIN },
//             { name: "Shipping GSTIN", value: shippingGSTIN },
//             { name: "GST Number", value: gstNumber },
//             { name: "PAN", value: pan },
//             { name: "Invoice Title", value: invoiceTitle },
//         ];

//         for (const field of requiredFields) {
//             if (!field.value || String(field.value).trim() === "") {
//                 setMessage({
//                     text: `❌ Please fill ${field.name}. All fields are mandatory.`,
//                     type: "error",
//                 });
//                 return false;
//             }
//         }
//         return true;
//     };

//     const validateLineItemsNumeric = (items) => {
//         for (const [idx, item] of items.entries()) {
//             const quantity = parseFloat(item.quantity);
//             const rate = parseFloat(item.rate);
//             if (Number.isNaN(quantity) || quantity <= 0) {
//                 setMessage({
//                     text: `❌ Line item ${idx + 1}: Quantity must be a number greater than 0.`,
//                     type: "error",
//                 });
//                 return false;
//             }
//             if (Number.isNaN(rate) || rate <= 0) {
//                 setMessage({
//                     text: `❌ Line item ${idx + 1}: Rate must be a number greater than 0.`,
//                     type: "error",
//                 });
//                 return false;
//             }
//         }
//         return true;
//     };

//     // ---- Submit (Save) ----
//     const handleSubmit = async (dataItem) => {
//         setMessage({ text: "", type: "" });

//         if (!validateCommonRequiredFields()) return;

//         if (!isValidGSTIN(billingFromGSTIN)) {
//             setMessage({
//                 text: `❌ Invalid Billing From GSTIN! It must be exactly 15 alphanumeric characters.`,
//                 type: "error",
//             });
//             return;
//         }
//         if (!isValidGSTIN(billingToGSTIN)) {
//             setMessage({
//                 text: `❌ Invalid Billing To GSTIN! It must be exactly 15 alphanumeric characters.`,
//                 type: "error",
//             });
//             return;
//         }
//         if (!isValidGSTIN(shippingGSTIN)) {
//             setMessage({
//                 text: `❌ Invalid Shipping GSTIN! It must be exactly 15 alphanumeric characters.`,
//                 type: "error",
//             });
//             return;
//         }
//         if (!isValidGSTIN(gstNumber)) {
//             setMessage({
//                 text: `❌ Invalid GST Number! It must be exactly 15 alphanumeric characters.`,
//                 type: "error",
//             });
//             return;
//         }

//         if (!isValidPAN(pan)) {
//             setMessage({
//                 text: "❌ Invalid PAN! It must be exactly 10 alphanumeric characters (A–Z, 0–9).",
//                 type: "error",
//             });
//             return;
//         }

//         const validItems = lineItems.filter(
//             (item) =>
//                 item.materialCode?.toString().trim() ||
//                 item.hsnCode?.toString().trim() ||
//                 item.description?.toString().trim() ||
//                 item.uom?.toString().trim()
//         );

//         if (validItems.length === 0) {
//             setMessage({
//                 text: "❌ Please add at least one line item before saving.",
//                 type: "error",
//             });
//             return;
//         }

//         if (!validateLineItemsNumeric(validItems)) return;

//         // Recompute totals locally to ensure accuracy
//         const netTotal = validItems.reduce((sum, item) => {
//             const quantity = parseFloat(item.quantity) || 0;
//             const rate = parseFloat(item.rate) || 0;
//             return sum + quantity * rate;
//         }, 0);
//         const tax1Amount = (netTotal * (parseFloat(tax1.percent) || 0)) / 100;
//         const tax2Amount = (netTotal * (parseFloat(tax2.percent) || 0)) / 100;
//         const tax3Amount = (netTotal * (parseFloat(tax3.percent) || 0)) / 100;
//         const totalTax = tax1Amount + tax2Amount + tax3Amount;
//         const grandTotal = netTotal + totalTax + (totals.roundOff || 0);

//         const billingData = {
//             projectName: selectedProject?.projectName || "Untitled Project",
//             billingFromAddress: addresses.billingFromAddress,
//             billingFromState,
//             billingFromStateCode,
//             billingFromGSTIN,
//             billingFromBrand,
//             billingFromContact,
//             shippingAddress: addresses.shippingAddress,
//             shippingState,
//             shippingStateCode,
//             shippingGSTIN,
//             shippingBrand,
//             shippingContact,
//             billingToAddress: addresses.billingToAddress,
//             billingToState,
//             billingToStateCode,
//             billingToGSTIN,
//             deliveryAddress: addresses.deliveryAddress,
//             storeCode,
//             sapCode,
//             vendorCode,
//             billNumber,
//             billDate,
//             estimateNo,
//             dateOfEstimate,
//             gstNumber,
//             pan,
//             poNumber,
//             poDate,
//             poType,
//             subWorkDescription,
//             invoiceTitle,
//             tax1Option: tax1.option,
//             tax1Percent: parseFloat(tax1.percent) || 0,
//             tax2Option: tax2.option,
//             tax2Percent: parseFloat(tax2.percent) || 0,
//             tax3Option: tax3.option,
//             tax3Percent: parseFloat(tax3.percent) || 0,
//             netTotal: parseFloat(netTotal.toFixed(2)),
//             totalTax: parseFloat(totalTax.toFixed(2)),
//             roundOff: parseFloat(totals.roundOff || 0),
//             grandTotal: parseFloat(grandTotal.toFixed(2)),
//             lineItems: validItems,
//         };

//         try {
//             const res = await fetch(`${API_BASE}/billing`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(billingData),
//             });

//             if (res.ok) {
//                 setMessage({
//                     text: "✅ Billing information saved successfully!",
//                     type: "success",
//                 });
//             } else {
//                 const err = await res.text();
//                 setMessage({ text: "❌ Failed to save: " + err, type: "error" });
//             }
//         } catch (err) {
//             console.error("Error:", err);
//             setMessage({ text: "❌ Error saving billing info.", type: "error" });
//         }
//     };

//     // ---- Download PDF (with validations + clean tax data) ----
//     const handleDownloadPDF = async () => {
//         setMessage({ text: "", type: "" });

//         if (!validateCommonRequiredFields()) return;

//         if (!isValidGSTIN(billingFromGSTIN) || !isValidGSTIN(billingToGSTIN) || !isValidGSTIN(shippingGSTIN) || !isValidGSTIN(gstNumber)) {
//             setMessage({
//                 text: `❌ One or more GSTIN/GST fields are invalid. Each must be exactly 15 alphanumeric chars.`,
//                 type: "error",
//             });
//             return;
//         }

//         if (!isValidPAN(pan)) {
//             setMessage({
//                 text: "❌ Invalid PAN! It must be exactly 10 alphanumeric characters (A–Z, 0–9).",
//                 type: "error",
//             });
//             return;
//         }

//         const validItems = lineItems.filter(
//             (item) =>
//                 item.materialCode?.toString().trim() ||
//                 item.hsnCode?.toString().trim() ||
//                 item.description?.toString().trim() ||
//                 item.uom?.toString().trim()
//         );

//         if (validItems.length === 0) {
//             setMessage({
//                 text: "❌ Please add at least one line item before downloading PDF.",
//                 type: "error",
//             });
//             return;
//         }

//         if (!validateLineItemsNumeric(validItems)) return;

//         // Recompute totals to pass to PDF
//         const netTotal = validItems.reduce((sum, item) => {
//             const quantity = parseFloat(item.quantity) || 0;
//             const rate = parseFloat(item.rate) || 0;
//             return sum + quantity * rate;
//         }, 0);

//         const tax1Amount = (netTotal * (parseFloat(tax1.percent) || 0)) / 100;
//         const tax2Amount = (netTotal * (parseFloat(tax2.percent) || 0)) / 100;
//         const tax3Amount = (netTotal * (parseFloat(tax3.percent) || 0)) / 100;
//         const totalTax = tax1Amount + tax2Amount + tax3Amount;
//         const roundOff = parseFloat(totals.roundOff || 0);
//         const grandTotal = netTotal + totalTax + roundOff;

//         // Prevent bogus totals (defensive)
//         if (isNaN(netTotal) || isNaN(totalTax) || isNaN(grandTotal)) {
//             setMessage({
//                 text: "❌ Totals calculation produced invalid numbers. Please check line items / tax percentages.",
//                 type: "error",
//             });
//             return;
//         }

//         // Build PDF payload with explicit tax amounts (so PDF doesn't recalc/duplicate incorrectly)
//         const pdfData = {
//             projectName: selectedProject?.projectName || "Untitled Project",
//             billingFromAddress: addresses.billingFromAddress,
//             billingFromState,
//             billingFromStateCode,
//             billingFromGSTIN,
//             billingFromBrand,
//             billingFromContact,
//             billingToAddress: addresses.billingToAddress,
//             billingToState,
//             billingToStateCode,
//             billingToGSTIN,
//             shippingAddress: addresses.shippingAddress,
//             shippingState,
//             shippingStateCode,
//             shippingGSTIN,
//             shippingBrand,
//             shippingContact,
//             deliveryAddress: addresses.deliveryAddress,
//             storeCode,
//             sapCode,
//             vendorCode,
//             billNumber,
//             billDate: billDate ? billDate.toISOString() : null,
//             estimateNo,
//             dateOfEstimate: dateOfEstimate ? dateOfEstimate.toISOString() : null,
//             projectId: projectId || "-",
//             gstNumber,
//             pan,
//             poNumber,
//             poDate: poDate ? poDate.toISOString() : null,
//             poType,
//             workDescription: subWorkDescription,
//             invoiceTitle,
//             // numeric totals
//             netTotal: parseFloat(netTotal.toFixed(2)),
//             totalTax: parseFloat(totalTax.toFixed(2)),
//             roundOff: parseFloat(roundOff.toFixed(2)),
//             grandTotal: parseFloat(grandTotal.toFixed(2)),
//             // individual tax labels + amounts (so PDF can render each properly once)
//             tax1Option: tax1.option || "",
//             tax1Percent: parseFloat(tax1.percent) || 0,
//             tax1Amount: parseFloat(tax1Amount.toFixed(2)),
//             tax2Option: tax2.option || "",
//             tax2Percent: parseFloat(tax2.percent) || 0,
//             tax2Amount: parseFloat(tax2Amount.toFixed(2)),
//             tax3Option: tax3.option || "",
//             tax3Percent: parseFloat(tax3.percent) || 0,
//             tax3Amount: parseFloat(tax3Amount.toFixed(2)),
//             lineItems: validItems,
//         };
//         console.log("Generating PDF with data:", pdfData);

//         try {
//             const blob = await pdf(<BillingPDFDocument billing={pdfData} />).toBlob();
//             const url = URL.createObjectURL(blob);
//             const link = document.createElement("a");
//             link.href = url;
//             link.download = `Billing_${pdfData.projectName}.pdf`;
//             link.click();
//             URL.revokeObjectURL(url);
//         } catch (error) {
//             console.error("❌ Error generating PDF:", error);
//             setMessage({ text: "❌ Error generating PDF.", type: "error" });
//         }
//     };

//     useEffect(() => {
//         const style = document.createElement("style");
//         style.innerHTML = responsiveButtonStyle;
//         document.head.appendChild(style);
//         return () => {
//             document.head.removeChild(style);
//         };
//     }, []);

//     return (
//         <div className="container-fluid py-3">
//             <Form
//                 onSubmit={handleSubmit}
//                 render={(formRenderProps) => (
//                     <FormElement>
//                         <div className="mb-4">
//                             <label className="form-label fw-bold">
//                                 Projects <span className="text-danger">*</span>
//                             </label>
//                             <div style={{ maxWidth: "320px" }}>
//                                 <Field
//                                     name="project"
//                                     component={DropDownField}
//                                     data={projects}
//                                     textField="projectName"
//                                     value={selectedProject}          // Pass current selectedProject object
//                                     onChange={setSelectedProject}    // Update selectedProject on change
//                                 />

//                             </div>
//                         </div>

//                         {/* Parties & Addresses */}
//                         <div>
//                             <h6 className="fw-bold mb-3">Parties and Addresses</h6>
//                             <div className="row g-3">
//                                 {/* Billing From */}
//                                 <div className="col-md-6">
//                                     <div className="border rounded p-3 h-100">
//                                         <h6 className="fw-bold mb-2">Billing From - Bilva Interiors</h6>
//                                         <textarea
//                                             name="billingFromAddress"
//                                             value={addresses.billingFromAddress}
//                                             onChange={(e) => setAddresses({ ...addresses, billingFromAddress: e.target.value })}
//                                             className="form-control mb-2"
//                                             placeholder="Address"
//                                             style={{ height: "100px" }}
//                                         />
//                                         <div className="row g-2 mt-2">
//                                             <div className="col-md-4">
//                                                 <Field
//                                                     name="billingFromState"
//                                                     label="State"
//                                                     value={billingFromState}
//                                                     onChange={(e) => setBillingFromState(e.value || e.target.value)}
//                                                     component={FormInput}
//                                                 />
//                                             </div>
//                                             <div className="col-md-4">
//                                                 <Field
//                                                     name="billingFromStateCode"
//                                                     label="State Code"
//                                                     value={billingFromStateCode}
//                                                     onChange={(e) => setBillingFromStateCode(e.value || e.target.value)}
//                                                     component={FormInput}
//                                                 />
//                                             </div>
//                                             <div className="col-md-4">
//                                                 <Field
//                                                     name="billingFromGSTIN"
//                                                     label="GSTIN"
//                                                     value={billingFromGSTIN}
//                                                     onChange={(e) => setBillingFromGSTIN(e.value || e.target.value)}
//                                                     component={FormInput}
//                                                 />
//                                             </div>
//                                         </div>
//                                         <div className="row g-2 mt-2">
//                                             <div className="col-md-6">
//                                                 <Field
//                                                     name="billingFromBrand"
//                                                     label="Brand"
//                                                     value={billingFromBrand}
//                                                     onChange={(e) => setBillingFromBrand(e.value || e.target.value)}
//                                                     component={FormInput}
//                                                 />
//                                             </div>
//                                             <div className="col-md-6">
//                                                 <Field
//                                                     name="billingFromContact"
//                                                     label="Contact Email / Phone (Optional)"
//                                                     value={billingFromContact}
//                                                     onChange={(e) => setBillingFromContact(e.value || e.target.value)}
//                                                     component={FormInput}
//                                                 />
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Shipping Address */}
//                                 <div className="col-md-6">
//                                     <div className="border rounded p-3 h-100">
//                                         <h6 className="fw-bold mb-2">Shipping Address</h6>
//                                         <textarea
//                                             name="shippingAddress"
//                                             value={addresses.shippingAddress}
//                                             onChange={(e) => setAddresses({ ...addresses, shippingAddress: e.target.value })}
//                                             className="form-control mb-2"
//                                             placeholder="Address"
//                                             style={{ height: "100px" }}
//                                         />
//                                         <div className="row g-2 mt-2">
//                                             <div className="col-md-4">
//                                                 <Field
//                                                     name="shippingState"
//                                                     label="State"
//                                                     value={shippingState}
//                                                     onChange={(e) => setShippingState(e.value || e.target.value)}
//                                                     component={FormInput}
//                                                 />
//                                             </div>
//                                             <div className="col-md-4">
//                                                 <Field
//                                                     name="shippingStateCode"
//                                                     label="State Code"
//                                                     value={shippingStateCode}
//                                                     onChange={(e) => setShippingStateCode(e.value || e.target.value)}
//                                                     component={FormInput}
//                                                 />
//                                             </div>
//                                             <div className="col-md-4">
//                                                 <Field
//                                                     name="shippingGSTIN"
//                                                     label="GSTIN"
//                                                     value={shippingGSTIN}
//                                                     onChange={(e) => setShippingGSTIN(e.value || e.target.value)}
//                                                     component={FormInput}
//                                                 />
//                                             </div>
//                                         </div>
//                                         <div className="row g-2 mt-2">
//                                             <div className="col-md-6">
//                                                 <Field
//                                                     name="shippingBrand"
//                                                     label="Brand"
//                                                     value={shippingBrand}
//                                                     onChange={(e) => setShippingBrand(e.value || e.target.value)}
//                                                     component={FormInput}
//                                                 />
//                                             </div>
//                                             <div className="col-md-6">
//                                                 <Field
//                                                     name="shippingContact"
//                                                     label="Contact Email / Phone (Optional)"
//                                                     value={shippingContact}
//                                                     onChange={(e) => setShippingContact(e.value || e.target.value)}
//                                                     component={FormInput}
//                                                 />
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Billing To */}
//                                 <div className="col-md-6">
//                                     <div className="border rounded p-3 h-100">
//                                         <h6 className="fw-bold mb-2">Billing To</h6>
//                                         <textarea
//                                             name="billingToAddress"
//                                             value={addresses.billingToAddress}
//                                             onChange={(e) => setAddresses({ ...addresses, billingToAddress: e.target.value })}
//                                             className="form-control mb-2"
//                                             placeholder="Address"
//                                             style={{ height: "100px" }}
//                                         />
//                                         <div className="row g-2 mt-2">
//                                             <div className="col-md-4">
//                                                 <Field
//                                                     name="billingToState"
//                                                     label="State"
//                                                     value={billingToState}
//                                                     onChange={(e) => setBillingToState(e.value || e.target.value)}
//                                                     component={FormInput}
//                                                 />
//                                             </div>
//                                             <div className="col-md-4">
//                                                 <Field
//                                                     name="billingToStateCode"
//                                                     label="State Code"
//                                                     value={billingToStateCode}
//                                                     onChange={(e) => setBillingToStateCode(e.value || e.target.value)}
//                                                     component={FormInput}
//                                                 />
//                                             </div>
//                                             <div className="col-md-4">
//                                                 <Field
//                                                     name="billingToGSTIN"
//                                                     label="GSTIN"
//                                                     value={billingToGSTIN}
//                                                     onChange={(e) => setBillingToGSTIN(e.value || e.target.value)}
//                                                     component={FormInput}
//                                                 />
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Delivery Address */}
//                                 <div className="col-md-6">
//                                     <div className="border rounded p-3 h-100">
//                                         <h6 className="fw-bold mb-2">Delivery Address</h6>
//                                         <textarea
//                                             name="deliveryAddress"
//                                             value={addresses.deliveryAddress}
//                                             onChange={(e) => setAddresses({ ...addresses, deliveryAddress: e.target.value })}
//                                             className="form-control mb-2"
//                                             placeholder="Address"
//                                             style={{ height: "100px" }}
//                                         />
//                                         <div className="row g-2 mt-2">
//                                             <div className="col-md-4">
//                                                 <Field
//                                                     name="storeCode"
//                                                     label="Store Code"
//                                                     value={storeCode}
//                                                     onChange={(e) => setStoreCode(e.value || e.target.value)}
//                                                     component={FormInput}
//                                                 />
//                                             </div>
//                                             <div className="col-md-4">
//                                                 <Field
//                                                     name="sapCode"
//                                                     label="SAP Code"
//                                                     value={sapCode}
//                                                     onChange={(e) => setSapCode(e.value || e.target.value)}
//                                                     component={FormInput}
//                                                 />
//                                             </div>
//                                             <div className="col-md-4">
//                                                 <Field
//                                                     name="vendorCode"
//                                                     label="Vendor Code"
//                                                     value={vendorCode}
//                                                     onChange={(e) => setVendorCode(e.value || e.target.value)}
//                                                     component={FormInput}
//                                                 />
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Document Details */}
//                         <div className="mt-4">
//                             <h6 className="fw-bold mb-3">Invoice Details</h6>
//                             <div className="row g-3 align-items-end">
//                                 {[
//                                     { label: "Bill Number", state: billNumber, setter: setBillNumber },
//                                     { label: "Bill Date", state: billDate, setter: setBillDate, type: "date" },
//                                     { label: "Invoice No", state: estimateNo, setter: setEstimateNo },
//                                     { label: "Date of Invoice", state: dateOfEstimate, setter: setDateOfEstimate, type: "date" },
//                                     { label: "Project ID", state: projectId, setter: setProjectId },
//                                     { label: "GST Number", state: gstNumber, setter: setGSTNumber },
//                                     { label: "PAN", state: pan, setter: setPAN },
//                                     { label: "PO Number", state: poNumber, setter: setPONumber },
//                                     { label: "PO Date", state: poDate, setter: setPODate, type: "date" },
//                                     { label: "PO Type", state: poType, setter: setPOType },
//                                     { label: "Sub(work Description)", state: subWorkDescription, setter: setSubWorkDescription },
//                                     { label: "Invoice Title / Subject", state: invoiceTitle, setter: setInvoiceTitle },
//                                 ].map((item, i) => (
//                                     <div key={i} className="col-md-3 col-sm-6">
//                                         {item.type === "date" ? (
//                                             <FloatingLabelWrapper label={item.label}>
//                                                 <DatePicker
//                                                     value={item.state}
//                                                     onChange={(e) => item.setter(e.value)}
//                                                     format="yyyy-MM-dd"
//                                                     size="large"
//                                                     className="form-control"
//                                                 />
//                                             </FloatingLabelWrapper>
//                                         ) : (
//                                             <Field
//                                                 name={item.label.replace(/\s+/g, "").toLowerCase()}
//                                                 label={item.label}
//                                                 value={item.state || ""}
//                                                 onChange={(e) => item.setter(e.value || e.target.value)}
//                                                 component={FormInput}
//                                                 type="text"
//                                             />
//                                         )}
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>

//                         {/* Line Items */}
//                         <div className="mt-4 border rounded p-3">
//                             <h6 className="fw-bold mb-2">Line Items</h6>
//                             <EditableLineItemsGrid
//                                 value={lineItems}
//                                 onChange={setLineItems}
//                                 columns={[
//                                     { field: "materialCode", title: "Material Code" },
//                                     { field: "hsnCode", title: "HSN Code" },
//                                     { field: "description", title: "Description" },
//                                     { field: "uom", title: "UOM" },
//                                     { field: "quantity", title: "Quantity", type: "numeric" },
//                                     { field: "rate", title: "Rate", type: "numeric" },
//                                     { field: "amount", title: "Amount", type: "numeric" },
//                                 ]}
//                             />
//                         </div>

//                         {/* Tax & Totals */}
//                         <div className="mt-4">
//                             <div className="row align-items-start">
//                                 {/* Tax Options - Left Side */}
//                                 <div className="col-md-6">
//                                     <h6 className="fw-bold mb-3">Tax</h6>
//                                     <div className="container-fluid px-0">
//                                         {[
//                                             { label: "IGST", data: tax1, setData: setTax1 },
//                                             { label: "CGST", data: tax2, setData: setTax2 },
//                                             { label: "SGST", data: tax3, setData: setTax3 },
//                                         ].map((item, idx) => (
//                                             <div key={idx} className="row g-3 mb-2">
//                                                 <div className="col-md-6 d-flex gap-2 align-items-center">
//                                                     <label className="fw-semibold" style={{ minWidth: "60px" }}>
//                                                         {item.label}
//                                                     </label>
//                                                     <input
//                                                         type="number"
//                                                         className="form-control responsive-numeric-input"
//                                                         placeholder="%"
//                                                         value={item.data.percent}
//                                                         onChange={(e) =>
//                                                             item.setData({ ...item.data, percent: e.target.value })
//                                                         }
//                                                     />
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>

//                                 {/* Totals - Right Side */}
//                                 <div className="col-md-6">
//                                     <h6 className="fw-bold mb-3">Total</h6>
//                                     {[
//                                         { label: "Net Total", value: totals.netTotal, setter: (val) => setTotals({ ...totals, netTotal: val }) },
//                                         { label: "Total Tax", value: totals.totalTax, setter: (val) => setTotals({ ...totals, totalTax: val }) },
//                                         { label: "Round Off", value: totals.roundOff, setter: (val) => setTotals({ ...totals, roundOff: val }) },
//                                         { label: "Grand Total", value: totals.grandTotal, setter: (val) => setTotals({ ...totals, grandTotal: val }) },
//                                     ].map((item, idx) => (
//                                         <div
//                                             key={idx}
//                                             className={`d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-2 ${item.label === "Grand Total" ? "fw-bold border-top pt-2 mb-3" : ""}`}
//                                         >
//                                             {/* Label */}
//                                             <span className="mb-1 mb-sm-0">{item.label}:</span>

//                                             {/* Input */}
//                                             <input
//                                                 type="number"
//                                                 className="form-control"
//                                                 style={{ width: "120px" }}
//                                                 value={item.value}
//                                                 onChange={(e) => item.setter(parseFloat(e.target.value))}
//                                             />
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                         </div>

//                         {/* </div> */}


//                         {message.text && (
//                             <div
//                                 className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"} mt-3`}
//                                 style={{
//                                     fontWeight: 600,
//                                     borderRadius: "8px",
//                                     padding: "10px 15px",
//                                     alignContent: "center",
//                                 }}
//                             >
//                                 {message.text}
//                             </div>
//                         )}

//                         {/* <div className="d-flex justify-content-start gap-2 mt-3 mb-4 button-row">
//                             <Button themeColor="primary" type="submit" className="responsive-button">
//                                 Save
//                             </Button>

//                             <Button type="button" onClick={() => window.location.reload()} className="responsive-button">
//                                 Cancel
//                             </Button>
//                         </div>

//                         <div className="d-flex justify-content-end button-row mb-3">
//                             <Button
//                                 themeColor="primary"
//                                 type="button"
//                                 onClick={handleDownloadPDF}
//                                 className="responsive-button"
//                             >
//                                 Download PDF
//                             </Button>
//                         </div> */}

//                         <div className="d-flex justify-content-between align-items-center mt-3 mb-4 button-row">
//                             {/* Left Side: Save and Cancel */}
//                             <div className="d-flex gap-2">
//                                 <Button themeColor="primary" type="submit" className="responsive-button">
//                                     Save
//                                 </Button>

//                                 <Button type="button" onClick={() => window.location.reload()} className="responsive-button">
//                                     Cancel
//                                 </Button>
//                             </div>

//                             {/* Right Side: Download PDF */}
//                             <div>
//                                 <Button
//                                     themeColor="primary"
//                                     type="button"
//                                     onClick={handleDownloadPDF}
//                                     className="responsive-button"
//                                 >
//                                     Download PDF
//                                 </Button>
//                             </div>
//                         </div>


//                     </FormElement>
//                 )
//                 }
//             />
//         </div >
//     );
// };

// export default Billing;

import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, Field, FormElement } from "@progress/kendo-react-form";
import { Button } from "@progress/kendo-react-buttons";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { DatePicker } from "@progress/kendo-react-dateinputs";
import FormInput from "../../components/Form/FormInput";
import FloatingLabelWrapper from "../../components/Form/FloatingLabelWrapper/FloatingLabelWrapper";
import EditableLineItemsGrid from "../../components/EditableLineItemsGrid";
import { pdf } from "@react-pdf/renderer";
import { BillingPDFDocument } from "./BillingPdf";
import BillingPDF from "./BillingPdf";


// -------------------- Responsive buttons CSS --------------------
const responsiveButtonStyle = `
  /* Mobile buttons */
  @media (max-width: 768px) {
    .responsive-button {
      width: 100% !important;
      margin-bottom: 10px;
      font-size: 1rem;
    }

    /* Stack flex containers vertically on mobile */
    .button-row {
      flex-direction: column !important;
      align-items: stretch !important;
    }

    /* Numeric inputs smaller on mobile */
    .responsive-numeric-input {
      width: 80px;
    }
  }

  /* Desktop: fixed width for numeric inputs */
  .responsive-numeric-input {
    width: 100px;
  }
`;


// <-- MODIFIED: Added { onBack } to receive the prop from the parent
const Billing = ({ onBack }) => {
    const [projects, setProjects] = useState([]);
    const [message, setMessage] = useState({ text: "", type: "" });
    const [lineItems, setLineItems] = useState([]);
    const [tax1, setTax1] = useState({ option: "IGST", percent: 0 });
    const [tax2, setTax2] = useState({ option: "CGST", percent: 0 });
    const [tax3, setTax3] = useState({ option: "SGST", percent: 0 });

    const [totals, setTotals] = useState({
        netTotal: 0,
        totalTax: 0,
        roundOff: 0,
        grandTotal: 0,
    });

    // ----------------- All form fields state -----------------
    const [addresses, setAddresses] = useState({
        billingFromAddress: "",
        billingToAddress: "",
        shippingAddress: "",
        deliveryAddress: "",
    });

    const [billingFromState, setBillingFromState] = useState("");
    const [billingFromStateCode, setBillingFromStateCode] = useState("");
    const [billingFromGSTIN, setBillingFromGSTIN] = useState("");
    const [billingFromBrand, setBillingFromBrand] = useState("");
    const [billingFromContact, setBillingFromContact] = useState("");

    const [shippingState, setShippingState] = useState("");
    const [shippingStateCode, setShippingStateCode] = useState("");
    const [shippingGSTIN, setShippingGSTIN] = useState("");
    const [shippingBrand, setShippingBrand] = useState("");
    const [shippingContact, setShippingContact] = useState("");

    const [billingToState, setBillingToState] = useState("");
    const [billingToStateCode, setBillingToStateCode] = useState("");
    const [billingToGSTIN, setBillingToGSTIN] = useState("");

    const [storeCode, setStoreCode] = useState("");
    const [sapCode, setSapCode] = useState("");
    const [vendorCode, setVendorCode] = useState("");

    const [billNumber, setBillNumber] = useState("");
    const [billDate, setBillDate] = useState(null);
    const [estimateNo, setEstimateNo] = useState("");
    const [dateOfEstimate, setDateOfEstimate] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [gstNumber, setGSTNumber] = useState("");
    const [pan, setPAN] = useState("");
    const [poNumber, setPONumber] = useState("");
    const [poDate, setPODate] = useState(null);
    const [poType, setPOType] = useState("");
    const [subWorkDescription, setSubWorkDescription] = useState("");
    const [invoiceTitle, setInvoiceTitle] = useState("");
    const [projectId, setProjectId] = useState("");

    const API_BASE = "https://localhost:7142/api";

    useEffect(() => {
        fetch(`${API_BASE}/projects`)
            .then((res) => res.json())
            .then((data) => setProjects(data))
            .catch((err) => console.error("Error fetching projects:", err));
    }, []);

    // <-- MODIFIED: This useEffect now handles navigation
    useEffect(() => {
        if (message.type === "success" && onBack) {
            // If the message is "success" and an onBack function is provided...
            const timer = setTimeout(() => {
                onBack(); // ...call the onBack function after 5 seconds
            }, 5000);
            return () => clearTimeout(timer); // Cleanup timer on unmount
        }
        else if (message.type === "error") {
             // Keep the original 5-second clear for error messages
            const timer = setTimeout(() => setMessage({ text: "", type: "" }), 5000);
            return () => clearTimeout(timer);
        }
    }, [message, onBack]); // Added onBack to dependency array

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
    }, []); // run once on mount

    const handleAddressChange = (e) => {
        setAddresses({ ...addresses, [e.target.name]: e.target.value });
    };

    const DropDownField = ({ value, onChange, data, textField }) => (
        <div style={{ width: "200px" }}>
            <DropDownList
                data={data}
                textField={textField}
                value={value}
                onChange={(e) => onChange(e.value)}
                defaultItem={{ [textField]: "Select Project" }}
                style={{ width: "100%" }}
            />
        </div>
    );

    // ---- Totals & tax calculation ----
    useEffect(() => {
        if (lineItems.length === 0) return;

        // compute net total = sum(quantity * rate) for all items
        const netTotal = lineItems.reduce((sum, item) => {
            const quantity = parseFloat(item.quantity) || 0;
            const rate = parseFloat(item.rate) || 0;
            const amount = quantity * rate;
            return sum + amount;
        }, 0);

        // compute individual tax amounts
        const tax1Amount = (netTotal * (parseFloat(tax1.percent) || 0)) / 100;
        const tax2Amount = (netTotal * (parseFloat(tax2.percent) || 0)) / 100;
        const tax3Amount = (netTotal * (parseFloat(tax3.percent) || 0)) / 100;

        const totalTax = tax1Amount + tax2Amount + tax3Amount;
        const roundOff = parseFloat(totals.roundOff || 0);

        const grandTotal = netTotal + totalTax + roundOff;

        setTotals({
            netTotal: parseFloat(netTotal.toFixed(2)),
            totalTax: parseFloat(totalTax.toFixed(2)),
            roundOff: parseFloat(roundOff.toFixed(2)),
            grandTotal: parseFloat(grandTotal.toFixed(2)),
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lineItems, tax1, tax2, tax3, totals.roundOff]);

    // ---- Validation helpers ----
    const isValidGSTIN = (value) => /^[A-Z0-9]{15}$/i.test((value || "").trim());
    const isValidPAN = (value) => /^[A-Z0-9]{10}$/i.test((value || "").trim());

    const validateCommonRequiredFields = () => {
        // Common required fields (used for both Save and PDF)
        const requiredFields = [
            { name: "Billing From Address", value: addresses.billingFromAddress },
            { name: "Billing To Address", value: addresses.billingToAddress },
            { name: "Shipping Address", value: addresses.shippingAddress },
            { name: "Delivery Address", value: addresses.deliveryAddress },
            { name: "Billing From GSTIN", value: billingFromGSTIN },
            { name: "Billing To GSTIN", value: billingToGSTIN },
            { name: "Shipping GSTIN", value: shippingGSTIN },
            { name: "GST Number", value: gstNumber },
            { name: "PAN", value: pan },
            { name: "Invoice Title", value: invoiceTitle },
        ];

        for (const field of requiredFields) {
            if (!field.value || String(field.value).trim() === "") {
                setMessage({
                    text: `❌ Please fill ${field.name}. All fields are mandatory.`,
                    type: "error",
                });
                return false;
            }
        }
        return true;
    };

    const validateLineItemsNumeric = (items) => {
        for (const [idx, item] of items.entries()) {
            const quantity = parseFloat(item.quantity);
            const rate = parseFloat(item.rate);
            if (Number.isNaN(quantity) || quantity <= 0) {
                setMessage({
                    text: `❌ Line item ${idx + 1}: Quantity must be a number greater than 0.`,
                    type: "error",
                });
                return false;
            }
            if (Number.isNaN(rate) || rate <= 0) {
                setMessage({
                    text: `❌ Line item ${idx + 1}: Rate must be a number greater than 0.`,
                    type: "error",
                });
                return false;
            }
        }
        return true;
    };

    // ---- Submit (Save) ----
    const handleSubmit = async (dataItem) => {
        setMessage({ text: "", type: "" });

        if (!validateCommonRequiredFields()) return;

        if (!isValidGSTIN(billingFromGSTIN)) {
            setMessage({
                text: `❌ Invalid Billing From GSTIN! It must be exactly 15 alphanumeric characters.`,
                type: "error",
            });
            return;
        }
        if (!isValidGSTIN(billingToGSTIN)) {
            setMessage({
                text: `❌ Invalid Billing To GSTIN! It must be exactly 15 alphanumeric characters.`,
                type: "error",
            });
            return;
        }
        if (!isValidGSTIN(shippingGSTIN)) {
            setMessage({
                text: `❌ Invalid Shipping GSTIN! It must be exactly 15 alphanumeric characters.`,
                type: "error",
            });
            return;
        }
        if (!isValidGSTIN(gstNumber)) {
            setMessage({
                text: `❌ Invalid GST Number! It must be exactly 15 alphanumeric characters.`,
                type: "error",
            });
            return;
        }

        if (!isValidPAN(pan)) {
            setMessage({
                text: "❌ Invalid PAN! It must be exactly 10 alphanumeric characters (A–Z, 0–9).",
                type: "error",
            });
            return;
        }

        const validItems = lineItems.filter(
            (item) =>
                item.materialCode?.toString().trim() ||
                item.hsnCode?.toString().trim() ||
                item.description?.toString().trim() ||
                item.uom?.toString().trim()
        );

        if (validItems.length === 0) {
            setMessage({
                text: "❌ Please add at least one line item before saving.",
                type: "error",
            });
            return;
        }

        if (!validateLineItemsNumeric(validItems)) return;

        // Recompute totals locally to ensure accuracy
        const netTotal = validItems.reduce((sum, item) => {
            const quantity = parseFloat(item.quantity) || 0;
            const rate = parseFloat(item.rate) || 0;
            return sum + quantity * rate;
        }, 0);
        const tax1Amount = (netTotal * (parseFloat(tax1.percent) || 0)) / 100;
        const tax2Amount = (netTotal * (parseFloat(tax2.percent) || 0)) / 100;
        const tax3Amount = (netTotal * (parseFloat(tax3.percent) || 0)) / 100;
        const totalTax = tax1Amount + tax2Amount + tax3Amount;
        const grandTotal = netTotal + totalTax + (totals.roundOff || 0);

        const billingData = {
            projectName: selectedProject?.projectName || "Untitled Project",
            billingFromAddress: addresses.billingFromAddress,
            billingFromState,
            billingFromStateCode,
            billingFromGSTIN,
            billingFromBrand,
            billingFromContact,
            shippingAddress: addresses.shippingAddress,
            shippingState,
            shippingStateCode,
            shippingGSTIN,
            shippingBrand,
            shippingContact,
            billingToAddress: addresses.billingToAddress,
            billingToState,
            billingToStateCode,
            billingToGSTIN,
            deliveryAddress: addresses.deliveryAddress,
            storeCode,
            sapCode,
            vendorCode,
            billNumber,
            billDate,
            estimateNo,
            dateOfEstimate,
            gstNumber,
            pan,
            poNumber,
            poDate,
            poType,
            subWorkDescription,
            invoiceTitle,
            tax1Option: tax1.option,
            tax1Percent: parseFloat(tax1.percent) || 0,
            tax2Option: tax2.option,
            tax2Percent: parseFloat(tax2.percent) || 0,
            tax3Option: tax3.option,
            tax3Percent: parseFloat(tax3.percent) || 0,
            netTotal: parseFloat(netTotal.toFixed(2)),
            totalTax: parseFloat(totalTax.toFixed(2)),
            roundOff: parseFloat(totals.roundOff || 0),
            grandTotal: parseFloat(grandTotal.toFixed(2)),
            lineItems: validItems,
        };

        try {
            const res = await fetch(`${API_BASE}/billing`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(billingData),
            });

            if (res.ok) {
                // <-- MODIFIED: Updated success message text
                setMessage({
                    text: "✅ Billing information saved! Returning to list...",
                    type: "success",
                });
            } else {
                const err = await res.text();
                setMessage({ text: "❌ Failed to save: " + err, type: "error" });
            }
        } catch (err) {
            console.error("Error:", err);
            setMessage({ text: "❌ Error saving billing info.", type: "error" });
        }
    };

    // ---- Download PDF (with validations + clean tax data) ----
    const handleDownloadPDF = async () => {
        setMessage({ text: "", type: "" });

        if (!validateCommonRequiredFields()) return;

        if (!isValidGSTIN(billingFromGSTIN) || !isValidGSTIN(billingToGSTIN) || !isValidGSTIN(shippingGSTIN) || !isValidGSTIN(gstNumber)) {
            setMessage({
                text: `❌ One or more GSTIN/GST fields are invalid. Each must be exactly 15 alphanumeric chars.`,
                type: "error",
            });
            return;
        }

        if (!isValidPAN(pan)) {
            setMessage({
                text: "❌ Invalid PAN! It must be exactly 10 alphanumeric characters (A–Z, 0–9).",
                type: "error",
            });
            return;
        }

        const validItems = lineItems.filter(
            (item) =>
                item.materialCode?.toString().trim() ||
                item.hsnCode?.toString().trim() ||
                item.description?.toString().trim() ||
                item.uom?.toString().trim()
        );

        if (validItems.length === 0) {
            setMessage({
                text: "❌ Please add at least one line item before downloading PDF.",
                type: "error",
            });
            return;
        }

        if (!validateLineItemsNumeric(validItems)) return;

        // Recompute totals to pass to PDF
        const netTotal = validItems.reduce((sum, item) => {
            const quantity = parseFloat(item.quantity) || 0;
            const rate = parseFloat(item.rate) || 0;
            return sum + quantity * rate;
        }, 0);

        const tax1Amount = (netTotal * (parseFloat(tax1.percent) || 0)) / 100;
        const tax2Amount = (netTotal * (parseFloat(tax2.percent) || 0)) / 100;
        const tax3Amount = (netTotal * (parseFloat(tax3.percent) || 0)) / 100;
        const totalTax = tax1Amount + tax2Amount + tax3Amount;
        const roundOff = parseFloat(totals.roundOff || 0);
        const grandTotal = netTotal + totalTax + roundOff;

        // Prevent bogus totals (defensive)
        if (isNaN(netTotal) || isNaN(totalTax) || isNaN(grandTotal)) {
            setMessage({
                text: "❌ Totals calculation produced invalid numbers. Please check line items / tax percentages.",
                type: "error",
            });
            return;
        }

        // Build PDF payload with explicit tax amounts (so PDF doesn't recalc/duplicate incorrectly)
        const pdfData = {
            projectName: selectedProject?.projectName || "Untitled Project",
            billingFromAddress: addresses.billingFromAddress,
            billingFromState,
            billingFromStateCode,
            billingFromGSTIN,
            billingFromBrand,
            billingFromContact,
            billingToAddress: addresses.billingToAddress,
            billingToState,
            billingToStateCode,
            billingToGSTIN,
            shippingAddress: addresses.shippingAddress,
            shippingState,
            shippingStateCode,
            shippingGSTIN,
            shippingBrand,
            shippingContact,
            deliveryAddress: addresses.deliveryAddress,
            storeCode,
            sapCode,
            vendorCode,
            billNumber,
            billDate: billDate ? billDate.toISOString() : null,
            estimateNo,
            dateOfEstimate: dateOfEstimate ? dateOfEstimate.toISOString() : null,
            projectId: projectId || "-",
            gstNumber,
            pan,
            poNumber,
            poDate: poDate ? poDate.toISOString() : null,
            poType,
            workDescription: subWorkDescription,
            invoiceTitle,
            // numeric totals
            netTotal: parseFloat(netTotal.toFixed(2)),
            totalTax: parseFloat(totalTax.toFixed(2)),
            roundOff: parseFloat(roundOff.toFixed(2)),
            grandTotal: parseFloat(grandTotal.toFixed(2)),
            // individual tax labels + amounts (so PDF can render each properly once)
            tax1Option: tax1.option || "",
            tax1Percent: parseFloat(tax1.percent) || 0,
            tax1Amount: parseFloat(tax1Amount.toFixed(2)),
            tax2Option: tax2.option || "",
            tax2Percent: parseFloat(tax2.percent) || 0,
            tax2Amount: parseFloat(tax2Amount.toFixed(2)),
            tax3Option: tax3.option || "",
            tax3Percent: parseFloat(tax3.percent) || 0,
            tax3Amount: parseFloat(tax3Amount.toFixed(2)),
            lineItems: validItems,
        };
        console.log("Generating PDF with data:", pdfData);

        try {
            const blob = await pdf(<BillingPDFDocument billing={pdfData} />).toBlob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `Billing_${pdfData.projectName}.pdf`;
            link.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("❌ Error generating PDF:", error);
            setMessage({ text: "❌ Error generating PDF.", type: "error" });
        }
    };

    useEffect(() => {
        const style = document.createElement("style");
        style.innerHTML = responsiveButtonStyle;
        document.head.appendChild(style);
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    return (
        <div className="container-fluid py-3">
            <Form
                onSubmit={handleSubmit}
                render={(formRenderProps) => (
                    <FormElement>
                        <div className="mb-4">
                            <label className="form-label fw-bold">
                                Projects <span className="text-danger">*</span>
                            </label>
                            <div style={{ maxWidth: "320px" }}>
                                <Field
                                    name="project"
                                    component={DropDownField}
                                    data={projects}
                                    textField="projectName"
                                    value={selectedProject}          // Pass current selectedProject object
                                    onChange={setSelectedProject}    // Update selectedProject on change
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
                                            onChange={(e) => setAddresses({ ...addresses, billingFromAddress: e.target.value })}
                                            className="form-control mb-2"
                                            placeholder="Address"
                                            style={{ height: "100px" }}
                                        />
                                        <div className="row g-2 mt-2">
                                            <div className="col-md-4">
                                                <Field
                                                    name="billingFromState"
                                                    label="State"
                                                    value={billingFromState}
                                                    onChange={(e) => setBillingFromState(e.value || e.target.value)}
                                                    component={FormInput}
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <Field
                                                    name="billingFromStateCode"
                                                    label="State Code"
                                                    value={billingFromStateCode}
                                                    onChange={(e) => setBillingFromStateCode(e.value || e.target.value)}
                                                    component={FormInput}
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <Field
                                                    name="billingFromGSTIN"
                                                    label="GSTIN"
                                                    value={billingFromGSTIN}
                                                    onChange={(e) => setBillingFromGSTIN(e.value || e.target.value)}
                                                    component={FormInput}
                                                />
                                            </div>
                                        </div>
                                        <div className="row g-2 mt-2">
                                            <div className="col-md-6">
                                                <Field
                                                    name="billingFromBrand"
                                                    label="Brand"
                                                    value={billingFromBrand}
                                                    onChange={(e) => setBillingFromBrand(e.value || e.target.value)}
                                                    component={FormInput}
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <Field
                                                    name="billingFromContact"
                                                    label="Contact Email / Phone (Optional)"
                                                    value={billingFromContact}
                                                    onChange={(e) => setBillingFromContact(e.value || e.target.value)}
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
                                            onChange={(e) => setAddresses({ ...addresses, shippingAddress: e.target.value })}
                                            className="form-control mb-2"
                                            placeholder="Address"
                                            style={{ height: "100px" }}
                                        />
                                        <div className="row g-2 mt-2">
                                            <div className="col-md-4">
                                                <Field
                                                    name="shippingState"
                                                    label="State"
                                                    value={shippingState}
                                                    onChange={(e) => setShippingState(e.value || e.target.value)}
                                                    component={FormInput}
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <Field
                                                    name="shippingStateCode"
                                                    label="State Code"
                                                    value={shippingStateCode}
                                                    onChange={(e) => setShippingStateCode(e.value || e.target.value)}
                                                    component={FormInput}
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <Field
                                                    name="shippingGSTIN"
                                                    label="GSTIN"
                                                    value={shippingGSTIN}
                                                    onChange={(e) => setShippingGSTIN(e.value || e.target.value)}
                                                    component={FormInput}
                                                />
                                            </div>
                                        </div>
                                        <div className="row g-2 mt-2">
                                            <div className="col-md-6">
                                                <Field
                                                    name="shippingBrand"
                                                    label="Brand"
                                                    value={shippingBrand}
                                                    onChange={(e) => setShippingBrand(e.value || e.target.value)}
                                                    component={FormInput}
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <Field
                                                    name="shippingContact"
                                                    label="Contact Email / Phone (Optional)"
                                                    value={shippingContact}
                                                    onChange={(e) => setShippingContact(e.value || e.target.value)}
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
                                            onChange={(e) => setAddresses({ ...addresses, billingToAddress: e.target.value })}
                                            className="form-control mb-2"
                                            placeholder="Address"
                                            style={{ height: "100px" }}
                                        />
                                        <div className="row g-2 mt-2">
                                            <div className="col-md-4">
                                                <Field
                                                    name="billingToState"
                                                    label="State"
                                                    value={billingToState}
                                                    onChange={(e) => setBillingToState(e.value || e.target.value)}
                                                    component={FormInput}
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <Field
                                                    name="billingToStateCode"
                                                    label="State Code"
                                                    value={billingToStateCode}
                                                    onChange={(e) => setBillingToStateCode(e.value || e.target.value)}
                                                    component={FormInput}
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <Field
                                                    name="billingToGSTIN"
                                                    label="GSTIN"
                                                    value={billingToGSTIN}
                                                    onChange={(e) => setBillingToGSTIN(e.value || e.target.value)}
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
                                            onChange={(e) => setAddresses({ ...addresses, deliveryAddress: e.target.value })}
                                            className="form-control mb-2"
                                            placeholder="Address"
                                            style={{ height: "100px" }}
                                        />
                                        <div className="row g-2 mt-2">
                                            <div className="col-md-4">
                                                <Field
                                                    name="storeCode"
                                                    label="Store Code"
                                                    value={storeCode}
                                                    onChange={(e) => setStoreCode(e.value || e.target.value)}
                                                    component={FormInput}
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <Field
                                                    name="sapCode"
                                                    label="SAP Code"
                                                    value={sapCode}
                                                    onChange={(e) => setSapCode(e.value || e.target.value)}
                                                    component={FormInput}
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <Field
                                                    name="vendorCode"
                                                    label="Vendor Code"
                                                    value={vendorCode}
                                                    onChange={(e) => setVendorCode(e.value || e.target.value)}
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
                            <h6 className="fw-bold mb-3">Invoice Details</h6>
                            <div className="row g-3 align-items-end">
                                {[
                                    { label: "Bill Number", state: billNumber, setter: setBillNumber },
                                    { label: "Bill Date", state: billDate, setter: setBillDate, type: "date" },
                                    { label: "Invoice No", state: estimateNo, setter: setEstimateNo },
                                    { label: "Date of Invoice", state: dateOfEstimate, setter: setDateOfEstimate, type: "date" },
                                    { label: "Project ID", state: projectId, setter: setProjectId },
                                    { label: "GST Number", state: gstNumber, setter: setGSTNumber },
                                    { label: "PAN", state: pan, setter: setPAN },
                                    { label: "PO Number", state: poNumber, setter: setPONumber },
                                    { label: "PO Date", state: poDate, setter: setPODate, type: "date" },
                                    { label: "PO Type", state: poType, setter: setPOType },
                                    { label: "Sub(work Description)", state: subWorkDescription, setter: setSubWorkDescription },
                                    { label: "Invoice Title / Subject", state: invoiceTitle, setter: setInvoiceTitle },
                                ].map((item, i) => (
                                    <div key={i} className="col-md-3 col-sm-6">
                                        {item.type === "date" ? (
                                            <FloatingLabelWrapper label={item.label}>
                                                <DatePicker
                                                    value={item.state}
                                                    onChange={(e) => item.setter(e.value)}
                                                    format="yyyy-MM-dd"
                                                    size="large"
                                                    className="form-control"
                                                />
                                            </FloatingLabelWrapper>
                                        ) : (
                                            <Field
                                                name={item.label.replace(/\s+/g, "").toLowerCase()}
                                                label={item.label}
                                                value={item.state || ""}
                                                onChange={(e) => item.setter(e.value || e.target.value)}
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
                            <h6 className="fw-bold mb-2">Line Items</h6>
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
                                {/* Tax Options - Left Side */}
                                <div className="col-md-6">
                                    <h6 className="fw-bold mb-3">Tax</h6>
                                    <div className="container-fluid px-0">
                                        {[
                                            { label: "IGST", data: tax1, setData: setTax1 },
                                            { label: "CGST", data: tax2, setData: setTax2 },
                                            { label: "SGST", data: tax3, setData: setTax3 },
                                        ].map((item, idx) => (
                                            <div key={idx} className="row g-3 mb-2">
                                                <div className="col-md-6 d-flex gap-2 align-items-center">
                                                    <label className="fw-semibold" style={{ minWidth: "60px" }}>
                                                        {item.label}
                                                    </label>
                                                    <input
                                                        type="number"
                                                        className="form-control responsive-numeric-input"
                                                        placeholder="%"
                                                        value={item.data.percent}
                                                        onChange={(e) =>
                                                            item.setData({ ...item.data, percent: e.target.value })
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Totals - Right Side */}
                                <div className="col-md-6">
                                    <h6 className="fw-bold mb-3">Total</h6>
                                    {[
                                        { label: "Net Total", value: totals.netTotal, setter: (val) => setTotals({ ...totals, netTotal: val }) },
                                        { label: "Total Tax", value: totals.totalTax, setter: (val) => setTotals({ ...totals, totalTax: val }) },
                                        { label: "Round Off", value: totals.roundOff, setter: (val) => setTotals({ ...totals, roundOff: val }) },
                                        { label: "Grand Total", value: totals.grandTotal, setter: (val) => setTotals({ ...totals, grandTotal: val }) },
                                    ].map((item, idx) => (
                                        <div
                                            key={idx}
                                            className={`d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-2 ${item.label === "Grand Total" ? "fw-bold border-top pt-2 mb-3" : ""}`}
                                        >
                                            {/* Label */}
                                            <span className="mb-1 mb-sm-0">{item.label}:</span>

                                            {/* Input */}
                                            <input
                                                type="number"
                                                className="form-control"
                                                style={{ width: "120px" }}
                                                value={item.value}
                                                onChange={(e) => item.setter(parseFloat(e.target.value))}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* </div> */}


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

                        {/* <div className="d-flex justify-content-start gap-2 mt-3 mb-4 button-row">
                            <Button themeColor="primary" type="submit" className="responsive-button">
                                Save
                            </Button>

                            <Button type="button" onClick={() => window.location.reload()} className="responsive-button">
                                Cancel
                            </Button>
                        </div>

                        <div className="d-flex justify-content-end button-row mb-3">
                            <Button
                                themeColor="primary"
                                type="button"
                                onClick={handleDownloadPDF}
                                className="responsive-button"
                            >
                                Download PDF
                            </Button>
                        </div> */}

                        <div className="d-flex justify-content-between align-items-center mt-3 mb-4 button-row">
                            {/* Left Side: Save and Cancel */}
                            <div className="d-flex gap-2">
                                <Button themeColor="primary" type="submit" className="responsive-button">
                                    Save
                                </Button>

                                <Button type="button" onClick={() => window.location.reload()} className="responsive-button">
                                    Cancel
                                </Button>
                            </div>

                            {/* Right Side: Download PDF */}
                            <div>
                                <Button
                                    themeColor="primary"
                                    type="button"
                                    onClick={handleDownloadPDF}
                                    className="responsive-button"
                                >
                                    Download PDF
                                </Button>
                            </div>
                        </div>


                    </FormElement>
                )
                }
            />
        </div >
    );
};

export default Billing;