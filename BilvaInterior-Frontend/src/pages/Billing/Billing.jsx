import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, Field, FormElement } from "@progress/kendo-react-form";
import { Button } from "@progress/kendo-react-buttons";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { DatePicker } from "@progress/kendo-react-dateinputs";
import FormInput from "../../components/Form/FormInput";
import FloatingLabelWrapper from "../../components/Form/FloatingLabelWrapper/FloatingLabelWrapper";
import EditableLineItemsGrid from "../../components/EditableLineItemsGrid";
import BillingPDF from "./BillingPdf";
import { pdf } from "@react-pdf/renderer";
import { BillingPDFDocument } from "./BillingPdf";


const Billing = () => {
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
    const taxOptions = ["IGST", "CGST", "SGST"];

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

    // const DropDownField = (fieldRenderProps) => (
    //     <div style={{ width: "200px" }}>
    //         <DropDownList
    //             data={projects}
    //             dataItemKey="id"
    //             textField="projectName"
    //             value={selectedProject}
    //             onChange={(e) => setSelectedProject(e.value)}
    //             defaultItem={{ id: 0, projectName: "Select Project" }}
    //             style={{ width: "100%" }}
    //         />

    //     </div>
    // );
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


    const handleSubmit = async (dataItem) => {
        setMessage({ text: "", type: "" });

        // Validate mandatory addresses
        for (const [key, value] of Object.entries(addresses)) {
            if (!value.trim()) {
                setMessage({
                    text: `❌ Please fill ${key.replace(/([A-Z])/g, " $1")}`,
                    type: "error",
                });
                return;
            }
        }

        const cleanedLineItems = lineItems.filter(
            (item) =>
                item.materialCode?.trim() ||
                item.hsnCode?.trim() ||
                item.description?.trim() ||
                item.uom?.trim()
        );

        const billingData = {
      projectName: dataItem.projectId,
      projectID: dataItem.projectid || "",
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
            tax1Percent: tax1.percent,
            tax2Option: tax2.option,
            tax2Percent: tax2.percent,
            netTotal: totals.netTotal,
            igst: totals.igst,
            roundOff: totals.roundOff,
            grandTotal: totals.grandTotal,
            lineItems: cleanedLineItems,
        };

        try {
            const res = await fetch(`${API_BASE}/billing`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(billingData) // ✅ send directly
            });

            if (res.ok) {
                setMessage({
                    text: "✅ Billing information saved successfully!",
                    type: "success",
                });
                console.log("Saved Billing:", billingData);
            } else {
                const err = await res.text();
                setMessage({ text: "❌ Failed to save: " + err, type: "error" });
            }
        } catch (err) {
            console.error("Error:", err);
            setMessage({ text: "❌ Error saving billing info.", type: "error" });
        }
    };

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


    const handleDownloadPDF = async () => {
  try {
    const pdfData = {
      projectName: selectedProject?.projectName || "Untitled Project",
      billingFromAddress: addresses.billingFromAddress,
      billingFromStateCode,
      billingFromGSTIN,
      billingToAddress: addresses.billingToAddress,
      shippingAddress: addresses.shippingAddress,
      deliveryAddress: addresses.deliveryAddress,
      storeCode,
      sapCode,
      vendorCode,
      billNumber,
      billDate: billDate ? billDate.toLocaleDateString() : "-",
      lineItems,
      netTotal: totals.netTotal,
      igst: totals.igst,
      roundOff: totals.roundOff,
      grandTotal: totals.grandTotal,
    };

const blob = await pdf(<BillingPDFDocument billing={pdfData} />).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Billing_${pdfData.projectName}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("❌ Error generating PDF:", error);
  }
};



    return (
        <div className="container-fluid py-3">
            <div className="d-flex justify-content-end align-items-center mb-3">
                <Button themeColor="primary" onClick={() => handleDownloadPDF()}>
                    Download PDF
                </Button>

            </div>

            <Form
                onSubmit={handleSubmit}
                render={(formRenderProps) => (
                    <FormElement>

                        {/* PASTE THE DROPDOWN FROM QUOTATION.JSX HERE */}

                        {/* <div className="mb-4">
                            <label className="form-label fw-bold">
                                Projects <span className="text-danger">*</span>
                            </label>
                            <div style={{ maxWidth: "320px" }}>
                                <DropDownList
                                    data={projects}
                                    dataItemKey="projectId"
                                    textField="projectName"
                                    value={selectedProject}
                                    onChange={(e) => setSelectedProject(e.value)}
                                    defaultItem={{ projectId: 0, projectName: "Select Project" }}
                                    style={{ width: "100%" }}
                                />
                            </div>
                        </div> */}
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
                            <h6 className="fw-bold mb-3">Invoice / Estimate Details</h6>
                            <div className="row g-3 align-items-end">
                                {[
                                    { label: "Bill Number", state: billNumber, setter: setBillNumber },
                                    { label: "Bill Date", state: billDate, setter: setBillDate, type: "date" },
                                    { label: "Estimate No", state: estimateNo, setter: setEstimateNo },
                                    { label: "Date of Estimate", state: dateOfEstimate, setter: setDateOfEstimate, type: "date" },
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

                                {/* Tax Options */}
                                <div className="col-md-6">
                                    <h6 className="fw-bold mb-3">Tax Options</h6>
                                    <div className="container-fluid px-0">
                                        {[tax1, tax2].map((tax, idx) => (
                                            <div key={idx} className="row g-3 mb-2">
                                                <div className="col-md-6 d-flex gap-2 align-items-center">
                                                    <DropDownList
                                                        data={taxOptions}
                                                        value={idx === 0 ? tax1.option : tax2.option}
                                                        onChange={(e) => idx === 0 ? setTax1({ ...tax1, option: e.value }) : setTax2({ ...tax2, option: e.value })}
                                                        defaultItem="Select Option"
                                                    />
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        placeholder="%"
                                                        value={idx === 0 ? tax1.percent : tax2.percent}
                                                        onChange={(e) => idx === 0 ? setTax1({ ...tax1, percent: e.target.value }) : setTax2({ ...tax2, percent: e.target.value })}
                                                        style={{ width: "100px" }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Totals */}
                                <div className="col-md-6">
                                    <h6 className="fw-bold mb-3">Total</h6>
                                    {[
                                        { label: "Net Total", value: totals.netTotal, setter: val => setTotals({ ...totals, netTotal: val }) },
                                        { label: "IGST", value: totals.igst, setter: val => setTotals({ ...totals, igst: val }) },
                                        { label: "Round Off", value: totals.roundOff, setter: val => setTotals({ ...totals, roundOff: val }) },
                                        { label: "Grand Total", value: totals.grandTotal, setter: val => setTotals({ ...totals, grandTotal: val }) },
                                    ].map((item, idx) => (
                                        <div key={idx} className={`d-flex justify-content-between mb-2 ${item.label === "Grand Total" ? "fw-bold border-top pt-2 mb-3" : ""}`}>
                                            <span>{item.label}:</span>
                                            <input
                                                type="number"
                                                className="form-control w-25"
                                                value={item.value}
                                                onChange={(e) => item.setter(parseFloat(e.target.value))}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Message */}
                        {message.text && (
                            <div className={`mt-3 text-center fw-semibold ${message.type === "success" ? "text-success" : "text-danger"}`}>
                                {message.text}
                            </div>
                        )}

                        {/* Buttons */}
                        <div className="d-flex justify-content-start gap-2 mt-3 mb-4">
                            {/* Make this button type="submit" so Form handles submission */}
                            <Button themeColor="primary" type="submit">
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

export default Billing;
