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
import api from "../../api/axios";

const Quotations = ({ quotationData = null, isEditing = false, onBack }) => {
  const [isSaving, setIsSaving] = useState(false); // 🔒 prevent multiple saves
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

  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  // Regex for validation
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  const billNumberRegex = /^[0-9]+$/;

  // Fetch projects
  // useEffect(() => {
  //   fetch(`${API_BASE}/projects`)
  //     .then((res) => res.json())
  //     .then((data) => setProjects(data))
  //     .catch((err) => console.error("Error fetching projects:", err));
  // }, []);

  useEffect(() => {
    api.get("/api/projects")
      .then((res) => setProjects(res.data))
      .catch((err) => console.error("Error fetching projects:", err));
  }, []);


  // <-- MODIFIED: This timer now navigates back instead of just clearing the message.
  // Auto-navigate on success
  useEffect(() => {
    if (message.type === "success" && onBack) {
      const timer = setTimeout(() => {
        onBack(); // Call the onBack prop to return to the list
      }, 5000);

      // Cleanup the timer if the component unmounts (e.g., user clicks "Back" manually)
      return () => clearTimeout(timer);
    }
  }, [message, onBack]); // Added onBack to dependency array

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

  // const DropDownField = (fieldRenderProps) => (
  //   <div style={{ width: "200px" }}>
  //     <DropDownList
  //       data={fieldRenderProps.data}
  //       value={fieldRenderProps.value}
  //       onChange={(e) => fieldRenderProps.onChange({ value: e.value })}
  //       defaultItem="Select Option"
  //       style={{ width: "100%" }}
  //     />
  //   </div>
  // );

  const DropDownField = (fieldRenderProps) => (
    <div style={{ width: "200px" }}>
      <DropDownList
        data={fieldRenderProps.data}
        value={fieldRenderProps.value}
        onChange={(e) => {
          // 1. Update Kendo Form State
          fieldRenderProps.onChange({ value: e.value });

          // 2. Call our custom state updater if provided
          if (fieldRenderProps.onValueChange) {
            fieldRenderProps.onValueChange(e.value);
          }
        }}
        defaultItem="Select Option"
        style={{ width: "100%" }}
      />
    </div>
  );

  // Handle Save (existing)
  const handleSubmit = async (dataItem) => {

    // 🔒 BLOCK MULTIPLE CLICKS
    if (isSaving) return;

    setIsSaving(true); // lock save
    setMessage({ text: "", type: "" });
    const isFormEmpty =
  !dataItem.projectId &&
  !addresses.billingFromAddress.trim() &&
  !addresses.billingToAddress.trim() &&
  !addresses.shippingAddress.trim() &&
  !addresses.deliveryAddress.trim() &&
  lineItems.every(
    (i) =>
      !i.materialCode &&
      !i.hsnCode &&
      !i.description &&
      !i.uom &&
      !i.quantity &&
      !i.rate
  );

if (isFormEmpty) {
  setMessage({
    text: "❌ Please fill the form before saving.",
    type: "error",
  });
  setIsSaving(false);
  return;
}


    // Basic validations (same as before)
    if (!dataItem.projectId || dataItem.projectId === "Select Option") {
      setMessage({ text: "❌ Please select a project.", type: "error" });
      setIsSaving(false); // 🔓 allow retry
      return;
    }

    for (const [key, value] of Object.entries(addresses)) {
      if (!value.trim()) {
        setMessage({
          text: `❌ Please fill ${key.replace(/([A-Z])/g, " $1")}`,
          type: "error",
        });
        setIsSaving(false); // 🔓 allow retry
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
        setIsSaving(false); // 🔓 allow retry
        return;
      }
      if (gstValue.length !== 15 || !gstRegex.test(gstValue.toUpperCase())) {
        setMessage({
          text: `❌ ${label} must be a valid 15-character GST number.`,
          type: "error",
        });
        setIsSaving(false); // 🔓 allow retry
        return;
      }
    }

    // ... existing GST format check loop ...

    // --- FIX FOR TC_831: Check if Billing From and Billing To GSTIN are the same ---
    const billingFrom = dataItem.billingFromGSTIN ? dataItem.billingFromGSTIN.trim().toUpperCase() : "";
    const billingTo = dataItem.billingToConsigneeGSTIN ? dataItem.billingToConsigneeGSTIN.trim().toUpperCase() : "";

    if (billingFrom && billingTo && billingFrom === billingTo) {
      setMessage({
        text: "❌ Billing From GSTIN and Billing To (Consignee) GSTIN cannot be the same.",
        type: "error",
      });
      setIsSaving(false); // 🔓 allow retry
      return;
    }

    if (!dataItem.pan || !panRegex.test(dataItem.pan.toUpperCase())) {
      setMessage({ text: "❌ Please enter a valid PAN Number.", type: "error" });
      setIsSaving(false); // 🔓 allow retry
      return;
    }

    if (!dataItem.billnumber || !billNumberRegex.test(dataItem.billnumber)) {
      setMessage({ text: "❌ Please enter a valid Bill Number.", type: "error" });
      setIsSaving(false); // 🔓 allow retry
      return;
    }

    if (lineItems.length === 0 || lineItems.every((item) => !item.materialCode && !item.description)) {
      setMessage({ text: "❌ Please add at least one line item.", type: "error" });
      setIsSaving(false); // 🔓 allow retry
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
          setIsSaving(false); // 🔓 allow retry
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
      subWorkDescription: dataItem.subWorkDescription || "",
      CGST: totals.cgst || 0,
      SGST: totals.sgst || 0,
      IGST: totals.igst || 0,
      netTotal: totals.netTotal || 0,
      roundOff: totals.roundOff || 0,
      grandTotal: totals.grandTotal || 0,
      createdDate: new Date().toISOString(),
      lineItems: cleanedLineItems,
    };

    try {
      const res = await api.post("/api/quotations", quotationData);

      if (res.status === 200 || res.status === 201) {
        setMessage({
          text: "✅ Quotation saved! Redirecting...",
          type: "success",
        });

        console.log("Saved Quotation:", quotationData);

        // ❗ DO NOT set isSaving(false) here
        // Save must remain locked until redirect happens

      } else {
        setMessage({
          text: "❌ Failed to save quotation.",
          type: "error",
        });

        setIsSaving(false); // 🔓 allow retry
      }

    } catch (err) {
      console.error("Error:", err);

      setMessage({
        text: `❌ Error saving quotation: ${err.response?.data || err.message}`,
        type: "error",
      });

      setIsSaving(false); // 🔓 allow retry
    }

  };

  // const handleLineItemChange = (newData) => {
  //   // 1. Perform the Calculation
  //   const calculatedData = newData.map((item) => {
  //     const quantity = parseFloat(item.quantity) || 0;
  //     const rate = parseFloat(item.rate) || 0;
  //     // Use toFixed(2) for currency formatting
  //     const amount = (quantity * rate).toFixed(2);

  //     return {
  //       ...item,
  //       amount: amount
  //     };
  //   });

  const handleLineItemChange = (newData) => {
    // 1. Perform the Calculation
    const calculatedData = newData.map((item) => {

      // --- FIX FOR TC_821: Remove any numbers from UOM ---
      let safeUom = item.uom ? item.uom.toString() : "";
      if (/\d/.test(safeUom)) {
        // This replaces any digit (0-9) with an empty string
        safeUom = safeUom.replace(/\d/g, "");
      }

      const quantity = parseFloat(item.quantity) || 0;
      const rate = parseFloat(item.rate) || 0;
      // Use toFixed(2) for currency formatting
      const amount = (quantity * rate).toFixed(2);

      return {
        ...item,
        uom: safeUom, // Use the sanitized UOM
        amount: amount
      };
    });

    // 2. Filter out extra empty rows (The Fix)
    // We only keep a row if it has data OR if it is the very last row.
    const cleanedData = calculatedData.filter((item, index) => {
      // Check if this row has any actual data entered
      const hasData =
        (item.materialCode && item.materialCode.toString().trim() !== "") ||
        (item.description && item.description.toString().trim() !== "") ||
        (item.quantity && parseFloat(item.quantity) !== 0) ||
        (item.rate && parseFloat(item.rate) !== 0);

      const isLastItem = index === calculatedData.length - 1;

      // Keep the row if it has data OR it's the last row (placeholder for new input)
      return hasData || isLastItem;
    });

    setLineItems(cleanedData);
  };

  // Auto-calculate totals

  useEffect(() => {
    if (lineItems.length === 0) return;

    const netTotal = lineItems.reduce((sum, item) => {
      const qty = parseFloat(item.quantity) || 0;
      const rate = parseFloat(item.rate) || 0;
      return sum + qty * rate;
    }, 0);

    // Calculate each tax
    const tax1Amount = (netTotal * (parseFloat(tax1.percent) || 0)) / 100;
    const tax2Amount = (netTotal * (parseFloat(tax2.percent) || 0)) / 100;
    const tax3Amount = (netTotal * (parseFloat(tax3?.percent) || 0)) / 100;

    const totalTax = tax1Amount + tax2Amount + tax3Amount;
    const roundOff = parseFloat(totals.roundOff) || 0;
    const grandTotal = netTotal + totalTax + roundOff;

    setTotals((prev) => ({
      ...prev,
      netTotal: parseFloat(netTotal.toFixed(2)),
      igst: parseFloat(tax1Amount.toFixed(2)), // ✅ Only IGST
      cgst: parseFloat(tax2Amount.toFixed(2)), // ✅ Only CGST
      sgst: parseFloat(tax3Amount.toFixed(2)), // ✅ Only SGST
      grandTotal: parseFloat(grandTotal.toFixed(2)),
    }));

  }, [lineItems, tax1, tax2, tax3, totals.roundOff]);


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

              </div>

              <Button
                icon="arrow-left"
                size="small"
                onClick={onBack}
                className="action-btn back-btn"
                style={{ marginRight: 8 }}
              >
                <span className="tieup-action-btn-text">Back</span>
              </Button>

              {/* Project Dropdown */}
              {/* Project Dropdown */}
              <div className="mb-4">
                <label className="form-label fw-bold">
                  Projects <span className="text-danger">*</span>
                </label>
                <div style={{ maxWidth: "320px" }}>

                  {/* --- 2. UNCOMMENT AND USE THIS BLOCK --- */}
                  <Field
                    name="projectId"
                    component={DropDownField}
                    data={projects.map((p) => p.projectName)}
                    onValueChange={setSelectedProject}
                  />

                  {/* The other commented-out fields can be deleted */}
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
              {/* Document Details */}
              <div className="mt-4">
                <h6 className="fw-bold mb-3">Document Details</h6>
                {/* Use align-items-center to fix vertical alignment issues */}
                <div className="row g-3 align-items-center">
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
                  ].map((label, i) => {
                    // Create safe field name
                    const fieldName = label.replace(/\s+/g, "").toLowerCase();
                    const isDate = ["Bill Date", "Date of Estimate", "PO Date"].includes(label);

                    return (
                      <div key={i} className="col-md-3 col-sm-6">
                        {isDate ? (
                          <FloatingLabelWrapper label={label}>
                            <Field
                              name={fieldName}
                              component={(fieldRenderProps) => (
                                <DatePicker
                                  {...fieldRenderProps}
                                  format="yyyy-MM-dd"
                                  size="large"
                                  // Ensure class matches standard inputs
                                  className="form-control"
                                  max={new Date()}
                                />
                              )}
                            />
                          </FloatingLabelWrapper>
                        ) : (
                          // Wrap standard inputs in FloatingLabelWrapper too if you want identical styling
                          // OR keep them as standard inputs but ensure they have the same height class
                          <Field
                            name={fieldName}
                            label={label}
                            component={FormInput}
                            type="text"
                          />
                        )}
                      </div>
                    );
                  })}

                  {/* Manually added fields - ensure they match the loop structure */}
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
                  onChange={handleLineItemChange}
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
                <div className="row align-items-start g-4">
                  {/* Tax Section */}
                  <div className="col-md-6">
                    <h6 className="fw-bold mb-3">Tax</h6>
                    <div className="container-fluid px-0">
                      {[
                        { label: "IGST", value: tax1.percent, setter: setTax1, name: "tax1_percent" },
                        { label: "CGST", value: tax2.percent, setter: setTax2, name: "tax2_percent" },
                        { label: "SGST", value: tax3?.percent || "", setter: setTax3, name: "tax3_percent" },
                      ].map((tax, index) => (
                        <div className="row g-2 mb-2" key={index}>
                          <div className="col-6 col-sm-5 col-md-6 d-flex align-items-center gap-2">
                            <label className="fw-semibold mb-0" style={{ minWidth: "60px" }}>
                              {tax.label}
                            </label>
                            {/* <input
                              type="number"
                              className="form-control flex-grow-1"
                              placeholder="0"
                              value={tax.value}
                              onChange={(e) => tax.setter({ percent: e.target.value })}
                              name={tax.name}
                            /> */}

                            <input
                              type="number"
                              className="form-control flex-grow-1"
                              placeholder="0"
                              value={tax.value}
                              onChange={(e) => {
                                // --- FIX FOR TC_826, TC_827, TC_828: Reject negative values ---
                                const val = e.target.value;
                                // Only update if value is empty (allowing user to delete) or positive
                                if (val === "" || parseFloat(val) >= 0) {
                                  tax.setter({ percent: val });
                                }
                              }}
                              name={tax.name}
                              min="0" // Helper for browser UI
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total Section */}
                  <div className="col-md-6">
                    <h6 className="fw-bold mb-3">Total</h6>
                    {[
                      { label: "Net Total", value: totals.netTotal, key: "netTotal" },
                      { label: "Tax Total", value: (totals.igst + totals.cgst + totals.sgst).toFixed(2), key: "taxTotal" },
                      { label: "Round Off", value: totals.roundOff, key: "roundOff" },
                      { label: "Grand Total", value: totals.grandTotal, key: "grandTotal", bold: true },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className={`d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-2 ${item.bold ? "fw-bold border-top pt-2 mt-2" : ""
                          }`}
                      >
                        {/* Label */}
                        <span className="mb-1 mb-sm-0">{item.label}:</span>

                        {/* Input */}
                        <input
                          type="number"
                          className="form-control"
                          style={{ width: "120px" }}
                          value={item.value}
                          onChange={(e) =>
                            setTotals({ ...totals, [item.key]: parseFloat(e.target.value) })
                          }
                          name={item.key}
                        />
                      </div>
                    ))}
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

              {/* <div className="d-flex flex-wrap justify-content-between align-items-center mt-3 mb-4"> */}
              {/* Left side: Save + Cancel */}
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mt-3 mb-4">
                {/* Left: Save + Cancel */}
                <div className="d-flex flex-row flex-wrap flex-md-nowrap justify-content-center justify-content-md-start gap-2 w-100 w-md-auto">
                  <Button
                    themeColor="primary"
                    type="submit"
                    disabled={isSaving}   // 🔒 disable button
                    className="flex-grow-1 flex-md-grow-0"
                    style={{ minWidth: "120px" }}
                  >
                    {isSaving ? "Saving..." : "Save"}
                  </Button>

                  <Button
                    type="button"
                    disabled={isSaving}
                    onClick={() => window.location.reload()}
                  >
                    Cancel
                  </Button>
                </div>

                {/* Right: Download PDF */}
                <div className="mt-2 mt-md-0 d-flex justify-content-center justify-content-md-end w-100 w-md-auto">
                  <Button
                    themeColor="primary"
                    type="button"
                    className="flex-grow-1 flex-md-grow-0"
                    style={{ minWidth: "120px" }}
                    onClick={async () => {
                      let values = formRenderProps.value || {};
                      const domValues = readFormValuesFromDom();
                      values = { ...domValues, ...values };

                      if (!values.projectId && selectedProject)
                        values.projectId = selectedProject;

                      if (!values.projectId) {
                        setMessage({
                          text: "❌ Please select a project before downloading PDF.",
                          type: "error",
                        });
                        return;
                      }

                      if (validateForPDF(values)) {
                        const cleanedLineItems = getNonEmptyLineItems();
                        const pdfData = {
                          projectName: selectedProject || values.projectId || "",
                          projectID: values.projectid || "",
                          storeCode: values.storeCode || "",
                          sapCode: values.sapCode || "",
                          vendorCode: values.vendorCode || "",
                          billingFromAddress: addresses.billingFromAddress || "",
                          billingFromGSTIN: values.billingFromGSTIN || "",
                          billingFromStateCode: values.billingFromStateCode || "",
                          billingToAddress: addresses.billingToAddress || "",
                          gstinBuyer: values.billingToBuyerGSTIN || "",
                          gstinConsignee: values.billingToConsigneeGSTIN || "",
                          shippingAddress: addresses.shippingAddress || "",
                          shippingGSTIN: values.shippingGSTIN || "",
                          deliveryAddress: addresses.deliveryAddress || "",
                          billNumber: values.billnumber || "",
                          billDate: values.billdate || "",
                          estimateNo: values.estimateno || "",
                          dateOfEstimate: values.dateofestimate || "",
                          poNumber: values.ponumber || "",
                          poDate: values.podate || "",
                          poType: values.potype || "",
                          taxPercent1: tax1.percent || 0,
                          taxPercent2: tax2.percent || 0,
                          taxPercent3: tax3.percent || 0,
                          netTotal: totals.netTotal || 0,
                          igst: totals.igst || 0,
                          roundOff: totals.roundOff || 0,
                          grandTotal: totals.grandTotal || 0,
                          gstNumber: values.gstnumber || "",
                          pan: values.pan || "",
                          brandNameSubBrand: values.brandNameSubBrand || "",
                          subWorkDescription: values.subWorkDescription || "",
                          lineItems: cleanedLineItems || [],
                        };
                        await generateQuotationPDF(pdfData);
                      }
                    }}
                  >
                    Download PDF
                  </Button>
                </div>
              </div>

            </FormElement>
          </div>
        )}
      />
    </div>
  );
};

export default Quotations;