import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import { Dialog } from '@progress/kendo-react-dialogs';
import './TieUpNew.css';
import { Form, Field, FormElement } from '@progress/kendo-react-form';
import { Button } from '@progress/kendo-react-buttons';
import FormInput from '../../components/Form/FormInput';
import FormMaskedInput from '../../components/Form/FormMaskedInput';
import FormUpload from '../../components/Form/FormUpload';
import CustomFormFieldSet from '../../components/Form/CustomFormFieldSet';
import { indiaStatesCities } from '../../utils/indiaStatesCities';
import Avatar from '../../components/Avatar/CustomAvatar';
import { Switch } from "@progress/kendo-react-inputs";

// ✅ SAFE BASE URL (fixes undefined/api/... when .env isn't loaded)
const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL && import.meta.env.VITE_API_BASE_URL.replace(/\/+$/,'')) ||
  'https://localhost:7142';

const responsiveBreakpoints = [
  { minWidth: 0, maxWidth: 499, value: 1 },
  { minWidth: 500, value: 2 }
];

// ------------------- Validators -------------------
const requiredValidator = (value) => (value ? '' : 'This field is required');

const nameValidator = (value) => {
  if (!value) return 'This field is required';
  if (value.length > 25) return 'Maximum 25 characters allowed';
  return '';
};

const phoneValidator = (value) => {
  if (!value) return 'Phone number is required';
  const phoneRegex = /^[1-9]\d{9}$/; // ✅ accepts 1–9 start, still 10 digits
  return phoneRegex.test(value) ? '' : 'Enter valid 10-digit phone number';
};

const emailValidator = (value) => {
  if (!value) return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value) ? '' : 'Invalid email address';
};

// Address Line 2 specific validator
const addressLine2Validator = (value) => {
  if (!value || !String(value).trim()) return 'Address Line 2 is required';
  return '';
};

const pincodeValidator = (value) => {
  if (!value) return 'Pincode is required';
  const pinRegex = /^[1-9][0-9]{5}$/;
  return pinRegex.test(value) ? '' : 'Invalid Indian pincode';
};

const gstinValidator = (value) => {
  if (!value) return 'GSTIN is required';
  const gstRegex =
    /^([0-9]{2}[A-Z]{4}([A-Z]{1}|[0-9]{1})[0-9]{4}[A-Z]{1}[A-Z0-9]{1}Z[A-Z0-9]{1})$/;
  return gstRegex.test(value) ? '' : 'Invalid GSTIN format.';
};

const imageValidator = (files) => {
  if (!files || files.length === 0) return 'Company logo is required';
  const allowedFormats = ['.jpg', '.jpeg', '.png'];
  const invalidFile = files.find(
    (file) => !allowedFormats.some((ext) => file.name.toLowerCase().endsWith(ext))
  );
  if (invalidFile) return 'Invalid file format. Only JPG/JPEG/PNG allowed';
  return '';
};

// ------------------- Component -------------------

const TieUpNew = ({ onCancel, onSuccess }) => {
  const [avatarSrc, setAvatarSrc] = useState(null);
  const [excelFile, setExcelFile] = useState(null);
  const [excelData, setExcelData] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Manual State & City
  const [selectedState, setSelectedState] = useState('Karnataka');
  const [cities, setCities] = useState(
    indiaStatesCities.find((s) => s.state === 'Karnataka')?.cities || []
  );
  const [selectedCity, setSelectedCity] = useState("Bengaluru"); // default city

  const errorRef = useRef(null);
  const formRef = useRef(null);
  const [showGlobalError, setShowGlobalError] = useState(false);
  const [uniqueError, setUniqueError] = useState('');

  // Inline field-level error messages (duplicate checks)
const [inlineErrors, setInlineErrors] = useState({
  companyName: "",
  email: "",
  phone: "",
  gstin: ""
});

  // Toast state
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form reset key (like AddProjectType)
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    if ((showGlobalError || uniqueError) && errorRef.current) {
      const y = errorRef.current.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, [showGlobalError, uniqueError]);

  // ✅ cleanup for avatarSrc (object URL)
  useEffect(() => {
    return () => {
      if (avatarSrc) {
        URL.revokeObjectURL(avatarSrc);
      }
    };
  }, [avatarSrc]);

  const handleImageUpload = (file) => {
    if (!file) return; // ✅ safeguard
    // ✅ revoke old preview if it exists
    if (avatarSrc) URL.revokeObjectURL(avatarSrc);
    const newUrl = URL.createObjectURL(file);
    setAvatarSrc(newUrl);
  };

  const handleExcelUpload = (files) => {
    if (files?.length > 0) {
      const file = files[0].getRawFile ? files[0].getRawFile() : files[0];
      if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
        setExcelFile(file);
      } else {
        setExcelFile(null);
      }
    } else {
      setExcelFile(null);
    }
  };

  const handlePreview = () => {
    if (!excelFile) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      setExcelData(json);
      setPreviewOpen(true);
    };
    reader.readAsArrayBuffer(excelFile);
  };

  // ------------------- Submit with uniqueness check -------------------
  const handleSubmit = async (dataItem, formApi) => {
    if (formApi && formApi.errors && Object.keys(formApi.errors).length > 0) {
      setShowGlobalError(true);
      return;
    }
    setShowGlobalError(false);
    setUniqueError('');
    setIsSubmitting(true);
      // Hard guard for Address Line 2 (frontend)
  if (!dataItem.addressLine2 || !String(dataItem.addressLine2).trim()) {
    setToast({ visible: true, message: 'Address Line 2 is required', type: 'error' });
    setIsSubmitting(false);
    return;
  }

    try {
      // HARD-CODED URL
      const checkResponse = await fetch(`${API_BASE_URL}/api/TieUpCompany/checkUnique/0`, {
        method: 'POST',
        body: JSON.stringify({
          companyName: dataItem.companyName,
          email: dataItem.email,
          phone: dataItem.phone,
          gstin: dataItem.gstin
        }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      let checkResult = { isUnique: true };
      try {
        const contentType = checkResponse.headers.get('Content-Type');
        if (contentType && contentType.includes('application/json')) {
          checkResult = await checkResponse.json();
        }
      } catch (_) {
        // ignore parse errors; assume unique
      }

      if (!checkResult.isUnique) {

  // Reset previous inline errors
  setInlineErrors({
    companyName: "",
    email: "",
    phone: "",
    gstin: ""
  });

  // Set specific field error
  const validFields = ["companyName", "email", "phone", "gstin"];
  const field = validFields.includes(checkResult.field)
    ? checkResult.field
    : null;

  if (field) {
    setInlineErrors(prev => ({
      ...prev,
      [field]: checkResult.message || `${field} already exists`
    }));
  }

  // Global toast also show
  setToast({
    visible: true,
    message: "Duplicate entry found.",
    type: "error"
  });

  setUniqueError("");
  setIsSubmitting(false);
  return;
}

      const formData = new FormData();
      formData.append('companyName', dataItem.companyName);
      formData.append('contactPerson', dataItem.contactPerson);
      formData.append('phone', dataItem.phone);
      formData.append('email', dataItem.email);
      formData.append('storeCode', dataItem.storeCode || '');
      formData.append('sapCode', dataItem.sapCode || '');
      formData.append('addressLine1', dataItem.addressLine1);
      formData.append('addressLine2', dataItem.addressLine2 || '');
      formData.append('state', selectedState);
      formData.append('city', selectedCity);
      formData.append('pincode', dataItem.pincode);
      formData.append('gstin', dataItem.gstin);
      formData.append('isActive', dataItem.isActive);

      if (dataItem.billingTemplate?.length > 0) {
        const file = dataItem.billingTemplate[0].getRawFile?.() || dataItem.billingTemplate[0];
        formData.append('billingTemplate', file);
      }

      if (dataItem.profilePic?.length > 0) {
        const file = dataItem.profilePic[0].getRawFile?.() || dataItem.profilePic[0];
        formData.append('profilePic', file);
      }

      // HARD-CODED URL
      const response = await fetch(`${API_BASE_URL}/api/TieUpCompany`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (response.ok) {
        await response.json();
        setToast({ visible: true, message: 'Form submitted successfully!', type: 'success' });

        // Reset form after success
        if (typeof onSuccess === 'function') {
          onSuccess();
        } else if (typeof onCancel === 'function') {
          onCancel();
        }

        // reset form state (kept same as your code)
        setFormKey(prev => prev + 1);
        setAvatarSrc(null);
        setExcelFile(null);
        setExcelData(null);
        setSelectedState('Karnataka');
        setCities(indiaStatesCities.find((s) => s.state === 'Karnataka')?.cities || []);
        setSelectedCity('Bengaluru');
      } else {
  const raw = await response.text();
  let msg = 'Failed to submit form';
  try {
    const j = JSON.parse(raw);
    // ASP.NET ModelState style
    if (j?.errors) {
      const firstKey = Object.keys(j.errors)[0];
      const firstMsg = Array.isArray(j.errors[firstKey]) ? j.errors[firstKey][0] : j.errors[firstKey];
      msg = firstMsg || j.title || msg;
    } else if (j?.message || j?.error) {
      msg = j.message || j.error;
    }
  } catch {
    // not JSON, keep default
  }
  setToast({ visible: true, message: msg, type: 'error' });
}

      setTimeout(() => setToast({ visible: false, message: '', type: 'success' }), 2500);
    } catch (err) {
      setToast({ visible: true, message: 'Error submitting form: ' + err.message, type: 'error' });
      setTimeout(() => setToast({ visible: false, message: '', type: 'success' }), 2500);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStateChange = (e) => {
    const state = e.target.value;
    setSelectedState(state);
    const stateObj = indiaStatesCities.find((s) => s.state === state);
    const newCities = stateObj ? stateObj.cities : [];
    setCities(newCities);
    setSelectedCity(state === "Karnataka" && newCities?.includes("Bengaluru") ? "Bengaluru" : '');
  };

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  const getFieldStyle = (validationMessage, touched) => {
    return validationMessage && touched ? { border: '1px solid red' } : {};
  };

  return (
    <Form
      key={formKey}
      ref={formRef}
      onSubmit={handleSubmit}
      initialValues={{
      companyName: '',
      contactPerson: '',
      phone: '',
      email: '',
      storeCode: '',
      sapCode: '',
      addressLine1: '',
      addressLine2: '',
      pincode: '',
      gstin: '',
      billingTemplate: null,
      profilePic: null,
      isActive: true         
  }}
      render={(formRenderProps) => (
        <FormElement style={{ maxWidth: 900, padding: '0 1rem' }}>
          <CustomFormFieldSet cols={responsiveBreakpoints}>

            {/* Inline style for fixed avatar preview */}
            <style>{`
              .custom-avatar-square {
                width: 120px;
                height: 120px;
                border-radius: 8px;
                border: 1px solid #e5e7eb;
                background: #f3f4f6;
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
                font-size: 13px;
                color: #888;
                margin-bottom: 4px;
              }
              .custom-avatar-square img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 8px;
              }
            `}</style>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginBottom: 20,
                width: "100%",
              }}
            >
              {/* Avatar Preview */}
              {avatarSrc ? (
                <div className="custom-avatar-square">
                  <img src={avatarSrc} alt="Company Logo Preview" />
                </div>
              ) : (
                <div className="custom-avatar-square">
                  no image
                </div>
              )}

              {/* Show label only when no image */}
              {!avatarSrc && (
                <p style={{ fontSize: 12, marginTop: 8, textAlign: "center" }}>
                  Upload Company Logo
                </p>
              )}

              {/* Kendo Upload Field */}
              <Field
                name="profilePic"
                component={FormUpload}
                label=""
                accept=".jpg,.jpeg,.png"
                allowedFormatsArray={[".jpg", ".jpeg", ".png"]}
                validator={imageValidator}
                onChange={(e) => {
                  if (e?.value && e.value.length > 0) {
                    const rawFile = e.value[0].getRawFile?.() || e.value[0];
                    handleImageUpload(rawFile); // ✅ only preview; FormUpload already holds value
                  }
                }}
              />
            </div>
          </CustomFormFieldSet>

          {/* Contact Info */}
          <CustomFormFieldSet legend="Contact Info" className="custom-fieldset">
           <div className="form-row">

  <div className="form-col">
    <Field
      name="companyName"
      component={FormInput}
      label="Company Name *"
      validator={nameValidator}
    />
    {inlineErrors.companyName && (
      <div style={{ color: "red", fontSize: 12 }}>
        {inlineErrors.companyName}
      </div>
    )}
  </div>

  <div className="form-col">
    <Field
      name="contactPerson"
      component={FormInput}
      label="Contact Person *"
      validator={nameValidator}
    />
  </div>

</div>
            <div className="form-row">

  <div className="form-col">
    <Field
      name="phone"
      component={FormMaskedInput}
      label="Phone *"
      mask="0000000000"
      validator={phoneValidator}
    />
    {inlineErrors.phone && (
      <div style={{ color: "red", fontSize: 12 }}>
        {inlineErrors.phone}
      </div>
    )}
  </div>

  <div className="form-col">
    <Field
      name="email"
      component={FormInput}
      label="Email *"
      validator={emailValidator}
    />
    {inlineErrors.email && (
      <div style={{ color: "red", fontSize: 12 }}>
        {inlineErrors.email}
      </div>
    )}
  </div>

</div>
            <div className="form-row">
              <Field name="storeCode" component={FormInput} label="Store Code" />
              <Field name="sapCode" component={FormInput} label="SAP Code" />
            </div>
          </CustomFormFieldSet>

          {/* Address */}
          <CustomFormFieldSet legend="Address" className="custom-fieldset">
            <div className="form-row">
              <Field
                name="addressLine1"
                component={FormInput}
                label="Address Line 1 *"
                validator={requiredValidator}
                inputProps={(fieldProps) =>
                  getFieldStyle(fieldProps.validationMessage, fieldProps.touched)
                }
              />
              <Field
  name="addressLine2"
  component={FormInput}
  label="Address Line 2 *"
  validator={addressLine2Validator}
  inputProps={(fieldProps) =>
    getFieldStyle(fieldProps.validationMessage, fieldProps.touched)
  }
/>
            </div>
            <div className="form-row">
              <div style={{ flex: 1 }}>
                <label className="k-label">State</label>
                <select
                  className="k-input"
                  value={selectedState}
                  onChange={handleStateChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: selectedState ? '1px solid #ccc' : '1px solid red'
                  }}
                >
                  <option value="">-- Select state --</option>
                  {indiaStatesCities.map((s) => (
                    <option key={s.state} value={s.state}>
                      {s.state}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ flex: 1, marginLeft: 12 }}>
                <label className="k-label">City</label>
                <select
                  className="k-input"
                  value={selectedCity}
                  onChange={handleCityChange}
                  disabled={!selectedState || cities.length === 0}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: selectedCity ? '1px solid #ccc' : '1px solid red'
                  }}
                >
                  <option value="">-- Select city --</option>
                  {cities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row" style={{ marginTop: 12 }}>
              <Field
                name="pincode"
                component={FormMaskedInput}
                mask="000000"
                label="Pincode *"
                validator={pincodeValidator}
                inputProps={(fieldProps) =>
                  getFieldStyle(fieldProps.validationMessage, fieldProps.touched)
                }
              />
            </div>
          </CustomFormFieldSet>

          {/* Business Details */}
          <CustomFormFieldSet legend="Business Details" className="custom-fieldset">
            <Field
              name="gstin"
              component={FormInput}
              label="GSTIN *"
              validator={gstinValidator}
              style={{ maxWidth: 350 }}
              inputProps={(fieldProps) =>
                getFieldStyle(fieldProps.validationMessage, fieldProps.touched)
              }
            />
            {inlineErrors.gstin && (
  <div style={{ color: "red", fontSize: 12, marginTop: 4 }}>
    {inlineErrors.gstin}
  </div>
)}
          </CustomFormFieldSet>

          {/* Billing Template */}
          <CustomFormFieldSet legend="Billing Template (Excel)" className="custom-fieldset">
            <Field
              name="billingTemplate"
              component={FormUpload}
              label="Upload Excel File"
              accept=".xlsx,.xls"
              allowedFormatsArray={['.xlsx', '.xls']}
              onChange={(e) => {
                if (e?.value && e.value.length > 0) {
                  const file = e.value[0].getRawFile?.() || e.value[0];
                  handleExcelUpload([file]); // your existing preview logic
                }
              }}
            />
          </CustomFormFieldSet>

          {excelFile && (
            <CustomFormFieldSet className="custom-fieldset">
              <Button type="button" style={{ marginTop: 12 }} onClick={handlePreview}>
                Preview
              </Button>
            </CustomFormFieldSet>
          )}

<CustomFormFieldSet>
  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
    <label style={{ fontWeight: 600 }}>Status:</label>

    <Switch
      checked={!!formRenderProps.valueGetter("isActive")}
      onChange={(e) =>
        formRenderProps.onChange({
          name: "isActive",
          value: e.value,
        })
      }
    />

    <span>{formRenderProps.valueGetter("isActive") ? "Active" : "Inactive"}</span>
  </div>

  <Field name="isActive" component={() => null} />
</CustomFormFieldSet>

          {/* Toast below submit button */}
          {toast.visible && (
            <div style={{
              marginTop: 12,
              padding: "8px",
              borderRadius: "6px",
              textAlign: "center",
              fontWeight: "bold",
              color: toast.type === "success" ? "#065f46" : "#b91c1c",
              backgroundColor: toast.type === "success" ? "#d1fae5" : "#fee2e2"
            }}>
              {toast.message}
            </div>
          )}
          {/* Submit & Reset */}
          <div className="k-form-buttons" style={{ marginTop: 24, display: 'flex', gap: 12 }}>
            <Button
              themeColor="primary"
              type="submit"
              disabled={!formRenderProps.valid || isSubmitting}
            >
              {/* Saving indicator */}
              {isSubmitting ? (
                <div style={{ color: '#fff' }}>
                  Saving...
                </div>
              ) : (
                'Submit'
              )}
            </Button>
            <Button
              onClick={() => {
                formRenderProps.onFormReset();
                if (onCancel) onCancel();
              }}
            >
              Cancel
            </Button>
          </div>

          {/* Global error near submit button */}
          {(showGlobalError || uniqueError) && (
            <div ref={errorRef} style={{ color: 'red', marginTop: 8 }}>
              {uniqueError || 'Please fill all required fields correctly before submitting.'}
            </div>
          )}

          {/* Excel Preview Dialog */}
          {previewOpen && (
  <Dialog
    title={excelFile?.name || "Excel Preview"}
    width={350}
    height={500}
    closeIcon={true}
    modal={true}
    onClose={() => setPreviewOpen(false)}
    className="excel-dialog"
  >
    <div className="excel-preview-content">
      {excelData ? (
        <table className="preview-table">
          <tbody>
            {excelData.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>No data to preview.</div>
      )}
    </div>
  </Dialog>
)}

        </FormElement>
      )}
    />
  );
};

export default TieUpNew;
