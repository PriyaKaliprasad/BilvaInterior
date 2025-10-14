import React, { useState, useEffect, useRef } from "react";
import { Form, Field, FormElement, FieldWrapper } from "@progress/kendo-react-form";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { DatePicker } from "@progress/kendo-react-dateinputs";
import { NumericTextBox, Input } from "@progress/kendo-react-inputs";
import { Upload } from "@progress/kendo-react-upload";
import { Button } from "@progress/kendo-react-buttons";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { ExcelExport } from "@progress/kendo-react-excel-export";
import { Dialog } from "@progress/kendo-react-dialogs";
import "@progress/kendo-theme-material/dist/all.css";
import FormInput from "../../components/Form/FormInput";
import FloatingLabelWrapper from "../../components/Form/FloatingLabelWrapper/FloatingLabelWrapper";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const initialExpenseItem = {
  materialCode: "",
  hsnCode: "",
  description: "",
  uom: "",
  quantity: 0,
  rate: 0,
  amount: 0,
};

const initialValues = {
  storeCode: "",
  sapCode: "",
  vendorCode: "",
  vendorName: "",
  billNo: "",
  billDate: null,
  gstin: "",
  pan: "",
  projectId: "",
  igst: 0,
  cgst: 0,
  sgst: 0,
  gstAmount: 0,
  files: [],
  taxRate: 0,
};

export default function ExpenseTracker() {
  const [projectOptions, setProjectOptions] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [expenseItems, setExpenseItems] = useState([]);
  const [totals, setTotals] = useState({
    netTotal: 0,
    igst: 0,
    cgst: 0,
    sgst: 0,
    roundOff: 0,
    grandTotal: 0,
  });

  // Vendor file preview
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState("");
  const [showFilePreview, setShowFilePreview] = useState(false);

  // Add Item Dialog
  const [showDialog, setShowDialog] = useState(false);
  const [dialogItem, setDialogItem] = useState(initialExpenseItem);

  // Vendor form values for export
  const [formValues, setFormValues] = useState(initialValues);

  const excelExportRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    async function fetchProjects() {
      setLoadingProjects(true);
      try {
        const res = await fetch(`${API_BASE}/api/Projects`, { signal });
        const data = await res.json();
        const opts = Array.isArray(data)
          ? data.map(p => ({
            text: p.projectName || p.name || "Unnamed Project",
            value: String(p.id ?? p._id ?? p.value ?? ""),
          }))
          : [];
        setProjectOptions(opts);
        if (opts.length > 0) setSelectedProject(opts[0].value);
      } catch (err) {
        setProjectOptions([]);
      } finally {
        setLoadingProjects(false);
      }
    }
    fetchProjects();
    return () => controller.abort();
  }, []);

  const requiredValidator = value => (value ? "" : "This field is required.");
  const numberValidator = value => (Number(value) >= 0 ? "" : "Value cannot be negative.");

  // Expense item handlers for dialog
  const openDialog = () => {
    setDialogItem(initialExpenseItem);
    setShowDialog(true);
  };

  const closeDialog = () => setShowDialog(false);

  const handleDialogChange = (e) => {
    const { name, value } = e.target;
    let updatedItem = { ...dialogItem, [name]: value };
    if (name === "quantity" || name === "rate") {
      const quantity = name === "quantity" ? value : updatedItem.quantity;
      const rate = name === "rate" ? value : updatedItem.rate;
      updatedItem.amount = (Number(quantity) || 0) * (Number(rate) || 0);
    }
    setDialogItem(updatedItem);
  };

  const handleDialogNumberChange = (field, value) => {
    let updatedItem = { ...dialogItem, [field]: value };
    if (field === "quantity" || field === "rate") {
      const quantity = field === "quantity" ? value : updatedItem.quantity;
      const rate = field === "rate" ? value : updatedItem.rate;
      updatedItem.amount = (Number(quantity) || 0) * (Number(rate) || 0);
    }
    setDialogItem(updatedItem);
  };

  const addDialogItem = (e) => {
    e.preventDefault();
    setExpenseItems([...expenseItems, dialogItem]);
    recalculateTotals([...expenseItems, dialogItem]);
    setShowDialog(false);
  };

  const recalculateTotals = items => {
    const netTotal = items.reduce((acc, item) => acc + Number(item.amount || 0), 0);
    const igst = Number(formValues.igst) || 0;
    const cgst = Number(formValues.cgst) || 0;
    const sgst = Number(formValues.sgst) || 0;
    const gstAmount = igst + cgst + sgst;
    const roundOff = Math.round(netTotal + gstAmount) - (netTotal + gstAmount);
    const grandTotal = netTotal + gstAmount + roundOff;
    setTotals({ netTotal, igst, cgst, sgst, roundOff, grandTotal });
  };

  const handleSubmit = dataItem => {
    setFormValues(dataItem);
    recalculateTotals(expenseItems);
  };

  const selectedProjectDataItem = projectOptions.find(o => o.value === selectedProject) || null;

  // Export: all page details in a single row, including file name if any, and all expense items (serialized)
  const getExportData = () => {
    // Only export if some data is filled
    const hasData =
      formValues.vendorName ||
      formValues.billNo ||
      formValues.billDate ||
      formValues.gstin ||
      formValues.pan ||
      formValues.projectId ||
      formValues.igst > 0 ||
      formValues.cgst > 0 ||
      formValues.sgst > 0 ||
      formValues.gstAmount > 0 ||
      (expenseItems && expenseItems.length > 0) ||
      selectedFile;

    if (!hasData) return [];

    return [
      {
        Project: selectedProjectDataItem?.text || "",
        VendorName: formValues.vendorName,
        BillNo: formValues.billNo,
        BillDate: formValues.billDate ? (typeof formValues.billDate === "string" ? formValues.billDate : formValues.billDate?.toLocaleDateString?.() || "") : "",
        GSTIN: formValues.gstin,
        PAN: formValues.pan,
        ProjectID: formValues.projectId,
        IGST: formValues.igst,
        CGST: formValues.cgst,
        SGST: formValues.sgst,
        GSTAmount: formValues.gstAmount,
        AttachedFile: selectedFile ? selectedFile.name : "",
        ExpenseItems: expenseItems.length
          ? expenseItems.map(item =>
            `MaterialCode: ${item.materialCode}, HSN: ${item.hsnCode}, Desc: ${item.description}, UOM: ${item.uom}, Qty: ${item.quantity}, Rate: ${item.rate}, Amt: ${item.amount}`
          ).join('\n')
          : "",
        NetTotal: totals.netTotal,
        IGSTTotal: totals.igst,
        CGSTTotal: totals.cgst,
        SGSTTotal: totals.sgst,
        RoundOff: totals.roundOff,
        GrandTotal: totals.grandTotal,
      }
    ];
  };

  const exportToExcel = () => {
    if (excelExportRef.current && getExportData().length > 0) {
      excelExportRef.current.save();
    }
  };

  return (
    <main style={{ background: "#f4f6fa", minHeight: "100vh", padding: "0 0 48px 0" }}>
      <div style={{ maxWidth: 1200, margin: "32px auto" }}>
        <style>{`
          .form-row { display:flex; gap:24px; margin-bottom:18px; align-items:flex-start; flex-wrap:wrap; }
          .field { box-sizing:border-box; width:100%; max-width:100%; }
          .header-left { display:flex; align-items:center; gap:16px; }
          .project-dropdown { width:220px; min-width:220px; }
          .field .k-datepicker, .field .k-dropdown, .field .k-numerictextbox, .field .k-textbox, .field .k-upload {
            width: 100% !important; box-sizing: border-box; margin: 0;
          }
          .field .floating-input, .field .floating-input.filled { display:block !important; width:100%; }
          .field .floating-input label,
          .field .floating-input .k-label,
          .field .floating-input .k-float-label { display:block; margin:0 0 6px 0; line-height:1; }
          @media (min-width: 992px) {
            .form-row {
              display: grid;
              grid-template-columns: repeat(3, 350px);
              justify-content: start;
              align-items: start;
            }
            .field { width:100%; max-width:100%; min-width:0; }
            .project-dropdown { width:220px; min-width:220px; }
          }
          @media (max-width: 991px) {
            .form-row { display:flex; flex-direction:column; gap:12px; align-items:stretch; }
            .field { width:100% !important; max-width:100% !important; min-width:0 !important; }
            .project-dropdown { width:100% !important; min-width:0 !important; }
            .floating-input { width:100% !important; display:block !important; }
          }
          .grid-wrapper { width:100%; overflow-x:auto; -webkit-overflow-scrolling: touch; }
        `}</style>

        {/* Header and Top Bar */}
        <div style={{
          background: "#fff", borderRadius: 8, boxShadow: "0 1px 4px #eee",
          marginBottom: 18, display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "24px 32px"
        }}>
          <div className="header-left" style={{ width: "100%", maxWidth: 600 }}>
            <div style={{ fontWeight: "bold", fontSize: 28 }}>Project</div>
            {loadingProjects ? (
              <div style={{ padding: "8px 12px", color: "#666" }}>Loading projects...</div>
            ) : (
              <DropDownList
                data={projectOptions}
                textField="text"
                dataItemKey="value"
                value={selectedProjectDataItem}
                onChange={e => {
                  const val = e.value?.value || e.value;
                  setSelectedProject(val);
                }}
                className="project-dropdown"
              />
            )}
          </div>
          <div>
            <Button themeColor="primary" style={{ width: 150 }} onClick={exportToExcel}>
              Export to Excel
            </Button>
          </div>
        </div>

        <Form
          initialValues={initialValues}
          onSubmit={handleSubmit}
          render={formRenderProps => (
            <FormElement>
              {/* Vendor & Document */}
              <section style={{
                background: "#fff",
                borderRadius: 8,
                boxShadow: "0 1px 4px #eee",
                marginBottom: 28,
                padding: "32px 32px 24px 32px"
              }}>
                <div style={{ fontWeight: "bold", fontSize: 22, marginBottom: 22 }}>Vendor & Document</div>
                <div className="form-row">
                  <Field name="vendorName" component={FormInput} label="Vendor / Supplier Name" validator={requiredValidator} className="field" />
                  <Field name="billNo" component={FormInput} label="Bill / Invoice Number" validator={requiredValidator} className="field" />
                  <Field name="billDate" component={props => (
                    <FloatingLabelWrapper label="Bill Date">
                      <DatePicker {...props} />
                    </FloatingLabelWrapper>
                  )} validator={requiredValidator} className="field" />
                </div>
                <div className="form-row">
                  <Field name="gstin" component={FormInput} label="Vendor GSTIN" className="field" />
                  <Field name="pan" component={FormInput} label="Vendor PAN" className="field" />
                  <Field name="projectId" component={FormInput} label="Project ID (if used)" className="field" />
                </div>
                <div className="form-row">
                  {/* IGST, CGST, SGST fields */}
                  <Field name="igst" component={props => (
                    <FloatingLabelWrapper label="IGST">
                      <NumericTextBox {...props} format="n2" />
                    </FloatingLabelWrapper>
                  )} className="field" />
                  <Field name="cgst" component={props => (
                    <FloatingLabelWrapper label="CGST">
                      <NumericTextBox {...props} format="n2" />
                    </FloatingLabelWrapper>
                  )} className="field" />
                  <Field name="sgst" component={props => (
                    <FloatingLabelWrapper label="SGST">
                      <NumericTextBox {...props} format="n2" />
                    </FloatingLabelWrapper>
                  )} className="field" />
                  <Field name="gstAmount" component={props => (
                    <FloatingLabelWrapper label="GST Amount">
                      <NumericTextBox {...props} format="n2" />
                    </FloatingLabelWrapper>
                  )} className="field" />
                </div>
                <div className="form-row" style={{ alignItems: "flex-end" }}>
                  <Field
                    name="files"
                    component={props => (
                      <FloatingLabelWrapper label="Attach invoice/receipt (PDF/JPG/PNG)">
                        <Upload
                          {...props}
                          showFileList={true}
                          multiple={false}
                          onAdd={e => {
                            const file = e.affectedFiles[0]?.getRawFile
                              ? e.affectedFiles[0].getRawFile()
                              : e.affectedFiles[0]?.rawFile || e.affectedFiles[0];
                            setTimeout(() => {
                              setSelectedFile(file);
                              if (file) setFilePreviewUrl(URL.createObjectURL(file));
                            }, 0);
                          }}
                        onRemove={e => {
                          setSelectedFile(null);
                          setFilePreviewUrl("");
                        }}
                        />
                      </FloatingLabelWrapper>
                    )}
                    className="field"
                  />
                  {selectedFile && (
                    <Button
                      style={{ marginTop: 8, marginLeft: 8 }}
                      themeColor="secondary"
                      type="button"
                      onClick={() => setShowFilePreview(true)}
                    >
                      Preview
                    </Button>
                  )}
                </div>
                {showFilePreview && (
                  <Dialog title="File Preview" onClose={() => setShowFilePreview(false)}>
                    {selectedFile && (
                      <>
                        {selectedFile.type === "application/pdf" ? (
                          <iframe src={filePreviewUrl} width="100%" height="500px" title="PDF Preview" />
                        ) : (
                          <img src={filePreviewUrl} alt="File Preview" style={{ maxWidth: "100%", maxHeight: "500px" }} />
                        )}
                      </>
                    )}
                    <div style={{ textAlign: "right", marginTop: 16 }}>
                      <Button themeColor="primary" onClick={() => setShowFilePreview(false)}>Close</Button>
                    </div>
                  </Dialog>
                )}
              </section>

              {/* Expense Items */}
              <section style={{
                background: "#fff",
                borderRadius: 8,
                boxShadow: "0 1px 4px #eee",
                marginBottom: 28,
                padding: "32px 32px 24px 32px"
              }}>
                <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
                  <div style={{ fontWeight: "bold", fontSize: 22 }}>Expense Items</div>
                  <Button themeColor="primary" style={{ marginLeft: "auto" }} onClick={openDialog}>Add Item</Button>
                </div>
                <div className="grid-wrapper">
                  <Grid data={expenseItems} style={{ minHeight: 100, minWidth: 760 }}>
                    <GridColumn field="materialCode" title="Material Code" width="120px" />
                    <GridColumn field="hsnCode" title="HSN Code" width="120px" />
                    <GridColumn field="description" title="Description" width="180px" />
                    <GridColumn field="uom" title="UOM" width="80px" />
                    <GridColumn field="quantity" title="Quantity" width="100px" />
                    <GridColumn field="rate" title="Rate" width="100px" />
                    <GridColumn field="amount" title="Amount" width="120px" />
                  </Grid>
                </div>
                {showDialog && (
                  <Dialog title="Add Expense Item" onClose={closeDialog}>
                    <form onSubmit={addDialogItem}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 400 }}>
                        <Input
                          name="materialCode"
                          label="Material Code"
                          placeholder="Material Code"
                          value={dialogItem.materialCode}
                          onChange={handleDialogChange}
                        />
                        <Input
                          name="hsnCode"
                          label="HSN Code"
                          placeholder="HSN Code"
                          value={dialogItem.hsnCode}
                          onChange={handleDialogChange}
                        />
                        <Input
                          name="description"
                          label="Description"
                          placeholder="Description"
                          value={dialogItem.description}
                          onChange={handleDialogChange}
                        />
                        <Input
                          name="uom"
                          label="UOM"
                          placeholder="UOM"
                          value={dialogItem.uom}
                          onChange={handleDialogChange}
                        />
                        <NumericTextBox
                          name="quantity"
                          label="Quantity"
                          placeholder="Quantity"
                          value={dialogItem.quantity}
                          onChange={e => handleDialogNumberChange("quantity", e.value)}
                        />
                        <NumericTextBox
                          name="rate"
                          label="Rate"
                          placeholder="Rate"
                          value={dialogItem.rate}
                          onChange={e => handleDialogNumberChange("rate", e.value)}
                        />
                        <Input
                          label="Amount"
                          value={((Number(dialogItem.quantity) || 0) * (Number(dialogItem.rate) || 0)).toFixed(2)}
                          disabled
                        />
                      </div>
                      <div style={{ marginTop: 24, textAlign: "right" }}>
                        <Button themeColor="primary" type="submit" style={{ marginRight: 8 }}>
                          Add
                        </Button>
                        <Button onClick={closeDialog} type="button">
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </Dialog>
                )}
              </section>

              {/* Tax Rates & Total */}
              <section style={{
                background: "#fff",
                borderRadius: 8,
                boxShadow: "0 1px 4px #eee",
                marginBottom: 28,
                padding: "32px 32px 24px 32px",
                display: "flex", gap: 32, alignItems: "flex-start", flexWrap: "wrap"
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "bold", fontSize: 22, marginBottom: 22 }}>Tax Rates</div>
                  <Field name="taxRate" component={props => (
                    <FloatingLabelWrapper label="Tax Rate">
                      <NumericTextBox {...props} style={{ width: 180 }} />
                    </FloatingLabelWrapper>
                  )} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "bold", fontSize: 22, marginBottom: 22 }}>Total</div>
                  <div style={{ fontSize: 16 }}>
                    <div>Net Total: <span style={{ float: "right" }}>₹ {totals.netTotal.toFixed(2)}</span></div>
                    <div>IGST: <span style={{ float: "right" }}>₹ {totals.igst.toFixed(2)}</span></div>
                    <div>CGST: <span style={{ float: "right" }}>₹ {totals.cgst.toFixed(2)}</span></div>
                    <div>SGST: <span style={{ float: "right" }}>₹ {totals.sgst.toFixed(2)}</span></div>
                    <div>Round Off: <span style={{ float: "right" }}>₹ {totals.roundOff.toFixed(2)}</span></div>
                    <div style={{ fontWeight: "bold", fontSize: 18, marginTop: 8 }}>Grand Total: <span style={{ float: "right" }}>₹ {totals.grandTotal.toFixed(2)}</span></div>
                  </div>
                  <div style={{ marginTop: 32, display: "flex", gap: 16, justifyContent: "flex-end" }}>
                    <Button themeColor="primary" type="submit" disabled={!formRenderProps.allowSubmit} style={{ minWidth: 120 }}>
                      Save
                    </Button>
                    <Button type="button" look="outline" style={{ minWidth: 120 }}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </section>
            </FormElement>
          )}
        />
      </div>
    </main>
  );
}