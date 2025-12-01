import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import { Dialog } from '@progress/kendo-react-dialogs';
import { Form, Field, FormElement } from '@progress/kendo-react-form';
import { Button } from '@progress/kendo-react-buttons';
import FormInput from '../../components/Form/FormInput';
import FormMaskedInput from '../../components/Form/FormMaskedInput';
import FormUpload from '../../components/Form/FormUpload';
import CustomFormFieldSet from '../../components/Form/CustomFormFieldSet';
import { indiaStatesCities } from '../../utils/indiaStatesCities';
import Avatar from '../../components/Avatar/CustomAvatar';
import { Switch } from "@progress/kendo-react-inputs";

// responsive breakpoints (keep same as before)
const responsiveBreakpoints = [
  { minWidth: 0, maxWidth: 499, value: 1 },
  { minWidth: 500, value: 2 }
];

// ------------------- Validators -------------------
const requiredValidator = (value) => (value ? '' : 'This field is required');
const nameValidator = (value) => {
  if (!value) return 'This field is required';
  if (value.length < 3) return 'Minimum 3 characters required';
  if (value.length > 25) return 'Maximum 25 characters allowed';
  return '';
};
const phoneValidator = (value) => {
  if (!value) return 'Phone number is required';
  // Allow 10-digit starting from 1-9 (as requested previously)
  const phoneRegex = /^[1-9]\d{9}$/;
  return phoneRegex.test(value) ? '' : 'Invalid phone number (10 digits required)';
};
const emailValidator = (value) => {
  if (!value) return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value) ? '' : 'Invalid email address';
};
const pincodeValidator = (value) => {
  if (!value) return 'Pincode is required';
  const pinRegex = /^[1-9][0-9]{5}$/;
  return pinRegex.test(value) ? '' : 'Invalid Indian pincode';
};
const gstinValidator = (value) => {
  if (!value) return 'GSTIN is required';
  const gstRegex = /^([0-9]{2}[A-Z]{4}[A-Z0-9]{1}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}Z[A-Z0-9]{1})$/;
  return gstRegex.test(value) ? '' : 'Invalid GSTIN format';
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
const TieUpEdit = ({ companyId, closeEdit, onEditSuccess }) => {
  // local states
  const [avatarSrc, setAvatarSrc] = useState(null);
  const [excelFile, setExcelFile] = useState(null);
  const [excelData, setExcelData] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const [selectedState, setSelectedState] = useState('Karnataka');
  const [cities, setCities] = useState(
    indiaStatesCities.find((s) => s.state === 'Karnataka')?.cities || []
  );
  const [selectedCity, setSelectedCity] = useState('Bengaluru');

  const errorRef = useRef(null);
  const formRef = useRef(null);
  const [showGlobalError, setShowGlobalError] = useState(false);
  const [uniqueError, setUniqueError] = useState('');
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load company data
  useEffect(() => {
    console.log("TieUpEdit mounted — companyId:", companyId);
  }, [companyId]);

  // LOAD company data robustly
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!companyId) {
        console.warn("TieUpEdit: no companyId provided");
        setLoading(false);
        setInitialValues(null);
        return;
      }

      try {
        const url = `${import.meta.env.VITE_API_BASE_URL || 'https://localhost:7142'}/api/TieUpCompany/${companyId}`;
        console.log("TieUpEdit fetching:", url);
        const res = await fetch(url, { credentials: 'include' });
        if (!res.ok) {
          const text = await res.text().catch(() => '');
          console.error("TieUpEdit fetch failed:", res.status, text);
          if (mounted) {
            setInitialValues(null);
            setLoading(false);
          }
          return;
        }

        // parse response safely (handle various backend shapes)
        let data = null;
        try {
          data = await res.json();
        } catch (err) {
          console.error("TieUpEdit: failed to parse JSON:", err);
        }

        // If API returns { data: {...} } or { success: true, data: {...} }, pick nested
        if (data && data.data) data = data.data;
        // If the backend returns an object with a property 'company' or similar, adjust here if needed

        if (!data || !data.companyName) {
          console.warn("TieUpEdit: fetched data is empty or missing companyName:", data);
          if (mounted) {
            setInitialValues(null);
            setLoading(false);
          }
          return;
        }

        // set avatar if available
        if (data.profilePicPath) {
          // normalize path (ensure starts with '/')
          const path = data.profilePicPath.startsWith('/') ? data.profilePicPath : '/' + data.profilePicPath;
          setAvatarSrc(`${import.meta.env.VITE_API_BASE_URL || 'https://localhost:7142'}${path}`);
        } else {
          setAvatarSrc(null);
        }

        // set cities/state safely
        const stateName = data.state || 'Karnataka';
        setSelectedState(stateName);
        const stateObj = indiaStatesCities.find((s) => s.state === stateName) || indiaStatesCities[0];
        setCities(stateObj ? stateObj.cities : []);
        setSelectedCity(data.city || (stateObj ? stateObj.cities?.[0] : ''));

        // prepare billingTemplate array if present
        let billingTemplateArr = null;
        if (data.billingTemplatePath) {
          let filePath = data.billingTemplatePath;
          if (!filePath.startsWith('/')) filePath = '/' + filePath;
          billingTemplateArr = [{
            name: filePath.split('/').pop(),
            url: `${import.meta.env.VITE_API_BASE_URL || 'https://localhost:7142'}${filePath}`
          }];
        }

        // set initial values for form
       const iv = {
  companyName: data.companyName || '',
  contactPerson: data.contactPerson || '',
  phone: data.phone || '',
  email: data.email || '',
  addressLine1: data.addressLine1 || '',
  addressLine2: data.addressLine2 || '',
  pincode: data.pincode || '',
  gstin: data.gstin || '',
  billingTemplate: billingTemplateArr,
  isActive: data.isActive ?? true   
};

        if (mounted) {
          setExcelFile(billingTemplateArr);
          setInitialValues(iv);
          setLoading(false);
        }
      } catch (err) {
        console.error("TieUpEdit load error:", err);
        if (mounted) {
          setInitialValues(null);
          setLoading(false);
        }
      }
    };

    load();
    return () => { mounted = false; };
  }, [companyId]);

  // handle preview (same as before)
  const handlePreview = async () => {
    if (!excelFile) return;
    let fileToRead = null;
    if (Array.isArray(excelFile) && excelFile[0]) {
      if (excelFile[0] instanceof Blob) fileToRead = excelFile[0];
      else if (excelFile[0].getRawFile) fileToRead = excelFile[0].getRawFile();
      else if (excelFile[0].url) {
        try {
          const r = await fetch(excelFile[0].url);
          if (!r.ok) throw new Error("Failed to fetch remote file");
          fileToRead = await r.blob();
        } catch (err) {
          setToast({ visible: true, message: 'Error fetching file: ' + err.message, type: 'error' });
          return;
        }
      }
    } else if (excelFile instanceof Blob) {
      fileToRead = excelFile;
    } else if (excelFile?.url) {
      try {
        const r = await fetch(excelFile.url);
        if (!r.ok) throw new Error("Failed to fetch remote file");
        fileToRead = await r.blob();
      } catch (err) {
        setToast({ visible: true, message: 'Error fetching file: ' + err.message, type: 'error' });
        return;
      }
    }

    if (!fileToRead) {
      setToast({ visible: true, message: 'No valid file to preview.', type: 'error' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheets = workbook.SheetNames.map((sheetName) => ({
        name: sheetName,
        data: XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 })
      }));
      setExcelData(sheets);
      setPreviewOpen(true);
    };
    reader.readAsArrayBuffer(fileToRead);
  };

  // handler helpers
  const handleStateChange = (e) => {
    const state = e.target.value;
    setSelectedState(state);
    const stateObj = indiaStatesCities.find((s) => s.state === state);
    const newCities = stateObj ? stateObj.cities : [];
    setCities(newCities);
    setSelectedCity(newCities[0] || '');
  };
  const handleCityChange = (e) => setSelectedCity(e.target.value);

  // submit handler (keeps your uniqueness + PUT logic)
  const handleSubmit = async (dataItem, formApi) => {
    // basic validation check (existing)
    if (formApi && formApi.errors && Object.keys(formApi.errors).length > 0) {
      const hasCriticalErrors = Object.keys(formApi.errors).some(
        (key) => formApi.touched[key] || !formApi.values[key]
      );
      if (hasCriticalErrors) {
        setShowGlobalError(true);
        return;
      }
    }

    setShowGlobalError(false);
    setUniqueError('');
    setIsSubmitting(true);

    try {
      // uniqueness check
      const checkUrl = `${import.meta.env.VITE_API_BASE_URL || 'https://localhost:7142'}/api/TieUpCompany/checkUnique/${companyId}`;
      const checkRes = await fetch(checkUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    companyName: dataItem.companyName,
    email: dataItem.email,
    phone: dataItem.phone,
    gstin: dataItem.gstin
  })
});

const checkData = await checkRes.json().catch(() => null);

if (checkData && checkData.isUnique === false) {
  const field = checkData.field;
  const message =
    field === 'gstin' ? 'GSTIN already exists.'
    : field === 'email' ? 'Email already exists.'
    : field === 'phone' ? 'Phone number already exists.'
    : field === 'companyName' ? 'Company Name already exists.'
    : 'Duplicate entry found.';

  // ✅ Field ko touched mark kar do (red border + validation active)
  if (formApi && formApi.onBlur) {
    formApi.onBlur({ target: { name: field } });
  }

  // ✅ Field ke value ko re-set karo (isse UI highlight confirm ho jata hai)
  if (formApi && formApi.onChange) {
    formApi.onChange({
      target: {
        name: field,
        value: formApi.values[field]
      }
    });
  }

  // ✅ Toast show
  setToast({ visible: true, message, type: 'error' });

  setIsSubmitting(false);
  return;
}

      // prepare form data
      const formData = new FormData();
      Object.keys(dataItem).forEach((k) => {
        if (k !== 'profilePic' && k !== 'billingTemplate') formData.append(k, dataItem[k] || '');
      });

      formData.append("isActive", dataItem.isActive);
      formData.append('id', companyId);
      formData.append('state', selectedState);
      formData.append('city', selectedCity);

       // Append files if new ones are selected**
      if (dataItem.billingTemplate?.length > 0) {
        const file = dataItem.billingTemplate[0].getRawFile?.() || dataItem.billingTemplate[0];
        formData.append('billingTemplate', file);
      }
      if (dataItem.profilePic?.length > 0) {
        const file = dataItem.profilePic[0].getRawFile?.() || dataItem.profilePic[0];
        formData.append('profilePic', file);
      }

            // PUT to update
      const updateUrl = `${import.meta.env.VITE_API_BASE_URL || 'https://localhost:7142'}/api/TieUpCompany/${companyId}`;
      const updateRes = await fetch(updateUrl, { method: 'PUT', body: formData });

      if (!updateRes.ok) {
        let errMsg = 'Failed to update company';

        try {
          const errData = await updateRes.json();
          if (errData && errData.errors) {
            const firstKey = Object.keys(errData.errors)[0];
            if (firstKey && errData.errors[firstKey] && errData.errors[firstKey][0]) {
              errMsg = errData.errors[firstKey][0];
            }
          }
        } catch (e) {}

        setToast({ visible: true, message: errMsg, type: 'error' });
        setIsSubmitting(false);
        return;
      }


      const updated = await updateRes.json().catch(()=>null);
      setToast({ visible: true, message: 'Company updated successfully!', type: 'success' });
      setTimeout(() => {
        setToast({ visible: false, message: '', type: 'success' });
        if (onEditSuccess && updated) onEditSuccess(updated);
        else if (closeEdit) closeEdit();
      }, 1400);
    } catch (err) {
      console.error("TieUpEdit submit error:", err);
      setToast({ visible: true, message: 'Error updating company: ' + err.message, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // UI: loading / not found handling
  if (loading) return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading...</div>;
  if (!initialValues) return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Company not found.</div>;

  // Render form
  return (
    <Form
      ref={formRef}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      render={(formRenderProps) => (
        <FormElement style={{ maxWidth: 900, padding: '0 1rem' }}>
          <CustomFormFieldSet cols={responsiveBreakpoints}>
            <div className="img-container">
              <Avatar src={avatarSrc} height={100} style={{ borderRadius: 0 }} />
            </div>
            <Field
              name="profilePic"
              component={FormUpload}
              label="Company Logo *"
              accept=".jpg,.jpeg,.png"
              allowedFormatsArray={['.jpg', '.jpeg', '.png']}
              onImageUpload={setAvatarSrc}
            />
          </CustomFormFieldSet>

          <CustomFormFieldSet legend="Contact Info" className="custom-fieldset">

  {/* Row 1 — Company Name + Contact Person */}
  <div className="form-row">
    <div className="form-col">
      <Field
        name="companyName"
        component={FormInput}
        label="Company Name *"
        validator={nameValidator}
      />
      {uniqueError === "companyName" && (
        <div style={{ color: "red", fontSize: 12 }}>Company Name already exists</div>
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


  {/* Row 2 — Phone + Email */}
  <div className="form-row">
    <div className="form-col">
      <Field
        name="phone"
        component={FormMaskedInput}
        label="Phone *"
        mask="0000000000"
        validator={phoneValidator}
      />
      {uniqueError === "phone" && (
        <div style={{ color: "red", fontSize: 12 }}>Phone already exists</div>
      )}
    </div>

    <div className="form-col">
      <Field
        name="email"
        component={FormInput}
        label="Email *"
        validator={emailValidator}
      />
      {uniqueError === "email" && (
        <div style={{ color: "red", fontSize: 12 }}>Email already exists</div>
      )}
    </div>
  </div>

</CustomFormFieldSet>

          <CustomFormFieldSet legend="Address" className="custom-fieldset">
            <div className="form-row">
              <Field name="addressLine1" component={FormInput} label="Address Line 1 *" validator={requiredValidator} />
              <Field name="addressLine2" component={FormInput} label="Address Line 2 *" validator={requiredValidator} />
            </div>

            <div className="form-row">
              <div style={{ flex: 1 }}>
                <label className="k-label">State</label>
                <select className="k-input" value={selectedState} onChange={handleStateChange} style={{ width: '100%', padding: '10px' }}>
                  <option value="">-- Select state --</option>
                  {indiaStatesCities.map((s) => <option key={s.state} value={s.state}>{s.state}</option>)}
                </select>
              </div>

              <div style={{ flex: 1, marginLeft: 12 }}>
                <label className="k-label">City</label>
                <select className="k-input" value={selectedCity} onChange={handleCityChange} disabled={!selectedState || cities.length === 0} style={{ width: '100%', padding: '10px' }}>
                  <option value="">-- Select city --</option>
                  {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="form-row" style={{ marginTop: 12 }}>
              <Field name="pincode" component={FormMaskedInput} mask="000000" label="Pincode *" validator={pincodeValidator} />
            </div>
          </CustomFormFieldSet>

          <CustomFormFieldSet legend="Business Details" className="custom-fieldset">
            <Field name="gstin" component={FormInput} label="GSTIN *" validator={gstinValidator} />
          </CustomFormFieldSet>

          <CustomFormFieldSet legend="Billing Template (Excel)" className="custom-fieldset">
            <Field name="billingTemplate" component={FormUpload} label="Upload Excel File *" accept=".xlsx,.xls" allowedFormatsArray={['.xlsx', '.xls']} onChange={(e) => {
              if (e.value && e.value.length > 0) {
                const file = e.value[0].getRawFile?.() || e.value[0];
                setExcelFile([file]);
              }
            }} />
            {excelFile && excelFile.length > 0 && (
              <div style={{ marginTop: 8 }}>
                <span>Existing file: </span>
                <a href={excelFile[0].url} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff' }}>
                  {excelFile[0].name}
                </a>
              </div>
            )}
          </CustomFormFieldSet>

          {excelFile && (
            <CustomFormFieldSet>
              <Button type="button" onClick={handlePreview}>Preview Billing Template</Button>
            </CustomFormFieldSet>
          )}

          {previewOpen && excelData && (
  <Dialog
    title="Billing Template Preview"
    width={350}
    height={500}
    closeIcon={true}
    modal={true}
    onClose={() => setPreviewOpen(false)}
    className="excel-dialog"
  >
    <div className="excel-preview-content">

      {excelData.map((sheet, index) => (
        <div key={index} style={{ marginBottom: "1rem" }}>
          <h5 style={{ marginBottom: "6px" }}>{sheet.name}</h5>

          <table className="preview-table">
            <tbody>
              {sheet.data.map((row, rIndex) => (
                <tr key={rIndex}>
                  {row.map((cell, cIndex) => (
                    <td key={cIndex}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

    </div>
  </Dialog>
)}

          {uniqueError && <div style={{ color: 'red', textAlign: 'center', marginTop: 10 }}>{uniqueError}</div>}
          {toast.visible && (
            <div style={{ textAlign: 'center', marginTop: '1rem', padding: '0.5rem 1rem', borderRadius: '6px', backgroundColor: toast.type === 'success' ? '#4caf50' : '#f44336', color: '#fff' }}>
              {toast.message}
            </div>
          )}

{/* ⭐ NEW — Active/Inactive toggle */}
<CustomFormFieldSet>
  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    <label style={{ fontWeight: 600 }}>Status:</label>

    <Switch
      checked={!!formRenderProps.valueGetter("isActive")}
      onChange={(e) =>
        formRenderProps.onChange({
          value: e.value,
          name: "isActive",
        })
      }
    />

    <span style={{ fontWeight: 500 }}>
      {formRenderProps.valueGetter("isActive") ? "Active" : "Inactive"}
    </span>
  </div>

  {/* Hidden field because Switch is not Field component */}
  <Field name="isActive" component={() => null} />
</CustomFormFieldSet>


          <div style={{ textAlign: 'left', marginTop: '1rem' }}>
            <Button themeColor="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update'}
            </Button>
            <Button look="outline" style={{ marginLeft: 12 }} onClick={closeEdit} disabled={isSubmitting}>
              Cancel
            </Button>
          </div>
        </FormElement>
      )}
    />
  );
};

export default TieUpEdit;
