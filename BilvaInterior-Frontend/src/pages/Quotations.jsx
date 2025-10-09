import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, Field, FormElement } from "@progress/kendo-react-form";
import { Button } from "@progress/kendo-react-buttons";
import FormInput from "../components/Form/FormInput"; // adjust path if needed

const Quotation = () => {
  const handleSubmit = (dataItem) => {
    console.log("Quotation Form Submitted:", dataItem);
  };

  return (
    <div className="container-fluid py-3">
      {/* Header */}
      {/* Header */}
<div className="d-flex justify-content-end align-items-center mb-3">
  <Button themeColor="primary">Download PDF</Button>
</div>


      <Form
        onSubmit={handleSubmit}
        render={(formRenderProps) => (
          <FormElement>
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
                      className="form-control mb-2"
                      placeholder="Address"
                      style={{ height: "100px" }}
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
                        <label
                          className="form-label fw-semibold"
                          style={{ fontSize: "0.9rem", marginBottom: "4px" }}
                        >
                          {label}
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          style={{ height: "38px" }}
                          name={label.replace(/\s+/g, "").toLowerCase()}
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

            {/* Tax and Total Section */}
            <div className="mt-4">
              <div className="row align-items-start">
                {/* Tax Options Section */}
               <div className="col-md-6">
  <h6 className="fw-bold mb-3">Tax Options</h6>

  <div className="container-fluid px-0">
  {/* First Row */}
  <div className="row g-3 mb-2">
    <div className="col-md-8">
      <div className="d-flex gap-2">
        <select className="form-select flex-fill">
          <option>IGST</option>
          <option>CGST</option>
          <option>SGST</option>
        </select>
        <input
          type="number"
          className="form-control flex-fill"
          placeholder="%"
        />
      </div>
    </div>
  </div>

  {/* Second Row */}
  <div className="row g-3">
    <div className="col-md-8">
      <div className="d-flex gap-2">
        <select className="form-select flex-fill">
          <option></option>
          <option>IGST</option>
          <option>CGST</option>
          <option>SGST</option>
        </select>
        <input
          type="number"
          className="form-control flex-fill"
          placeholder="%"
        />
      </div>
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

                {/* Buttons aligned LEFT */}
                <div className="d-flex justify-content-start gap-2">
                  <Button themeColor="primary">Save</Button>
                  <Button>Cancel</Button>
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



