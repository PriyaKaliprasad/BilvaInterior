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
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(value) ? '' : 'Invalid Indian phone number (start with 6,7,8,9)';
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
const TieUpNew = ({ onCancel }) => {
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

  // Toast state
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (avatarSrc) {
      URL.revokeObjectURL(avatarSrc);
    }

    const newUrl = URL.createObjectURL(file);
    console.log("1. Uploaded image src:", newUrl);
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

    try {
      // HARD-CODED URL
      const checkResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/TieUpCompany/checkUnique/0`, {
        method: 'POST',
        body: JSON.stringify({
          companyName: dataItem.companyName,
          email: dataItem.email,
          phone: dataItem.phone
        }),
        headers: { 'Content-Type': 'application/json' }
      });

      let checkResult = { isUnique: true };
      try {
        const contentType = checkResponse.headers.get('Content-Type');
        if (contentType && contentType.includes('application/json')) {
          checkResult = await checkResponse.json();
        }
      } catch (err) {
        console.warn('Could not parse JSON from uniqueness check, assuming unique.', err);
      }

      if (!checkResult.isUnique) {
        setToast({ visible: true, message: 'Company Name, Email, or Phone already exists.', type: 'error' });
        setTimeout(() => setToast({ visible: false, message: '', type: 'success' }), 2500);
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
      formData.append('addressLine2', dataItem.addressLine2);
      formData.append('state', selectedState);
      formData.append('city', selectedCity);
      formData.append('pincode', dataItem.pincode);
      formData.append('gstin', dataItem.gstin);

      if (dataItem.billingTemplate?.length > 0) {
        const file = dataItem.billingTemplate[0].getRawFile?.() || dataItem.billingTemplate[0];
        formData.append('billingTemplate', file);
      }

      if (dataItem.profilePic?.length > 0) {
        const file = dataItem.profilePic[0].getRawFile?.() || dataItem.profilePic[0];
        console.log('2. Uploading profile pic:', file);
        formData.append('profilePic', file);
      }

      // HARD-CODED URL
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/TieUpCompany`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        await response.json();
        setToast({ visible: true, message: 'Form submitted successfully!', type: 'success' });
      } else {
        const error = await response.text();
        setToast({ visible: true, message: 'Failed to submit form: ' + error, type: 'error' });
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
        profilePic: null
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
                onChange={(e, fieldRenderProps) => {
                  if (e.value && e.value.length > 0) {
                    const rawFile = e.value[0].getRawFile?.() || e.value[0];
                    if (avatarSrc) {
                      URL.revokeObjectURL(avatarSrc);
                    }
                    const previewUrl = URL.createObjectURL(rawFile);
                    setAvatarSrc(previewUrl);
                    fieldRenderProps.formApi.setValue("profilePic", [rawFile]);
                    fieldRenderProps.formApi.setError("profilePic", undefined);
                  }
                }}
              />
            </div>
          </CustomFormFieldSet>

          {/* Contact Info */}
          <CustomFormFieldSet legend="Contact Info" className="custom-fieldset">
            <div className="form-row">
              <Field
                name="companyName"
                component={FormInput}
                label="Company Name"
                validator={nameValidator}
                inputProps={(fieldProps) =>
                  getFieldStyle(fieldProps.validationMessage, fieldProps.touched)
                }
              />
              <Field
                name="contactPerson"
                component={FormInput}
                label="Contact Person"
                validator={nameValidator}
                inputProps={(fieldProps) =>
                  getFieldStyle(fieldProps.validationMessage, fieldProps.touched)
                }
              />
            </div>
            <div className="form-row">
              <Field
                name="phone"
                component={FormMaskedInput}
                label="Phone"
                mask="0000000000"
                validator={phoneValidator}
                inputProps={(fieldProps) =>
                  getFieldStyle(fieldProps.validationMessage, fieldProps.touched)
                }
              />
              <Field
                name="email"
                component={FormInput}
                label="Email"
                validator={emailValidator}
                inputProps={(fieldProps) =>
                  getFieldStyle(fieldProps.validationMessage, fieldProps.touched)
                }
              />
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
                label="Address Line 1"
                validator={requiredValidator}
                inputProps={(fieldProps) =>
                  getFieldStyle(fieldProps.validationMessage, fieldProps.touched)
                }
              />
              <Field name="addressLine2" component={FormInput} label="Address Line 2" />
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
                label="Pincode"
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
              label="GSTIN"
              validator={gstinValidator}
              style={{ maxWidth: 350 }}
              inputProps={(fieldProps) =>
                getFieldStyle(fieldProps.validationMessage, fieldProps.touched)
              }
            />
          </CustomFormFieldSet>

          {/* Billing Template */}
          <CustomFormFieldSet legend="Billing Template (Excel)" className="custom-fieldset">
            <Field
              name="billingTemplate"
              component={FormUpload}
              label="Upload Excel File"
              accept=".xlsx,.xls"
              allowedFormatsArray={['.xlsx', '.xls']}
              onChange={(e, fieldRenderProps) => {
                if (e.value && e.value.length > 0) {
                  const file = e.value[0].getRawFile?.() || e.value[0];
                  fieldRenderProps.formApi.setValue('billingTemplate', [file]);
                  fieldRenderProps.formApi.setError('billingTemplate', undefined); // clear previous error
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
              title={
                excelFile?.name
                  ? excelFile.name.length > 25
                    ? excelFile.name.slice(0, 22) + '...'
                    : excelFile.name
                  : 'Excel Preview'
              }
              onClose={() => setPreviewOpen(false)}
            >
              <div className="excel-preview">
                {excelData ? (
                  <table
                    className="k-table k-table-md k-table-bordered"
                    style={{ width: '100%', minWidth: 400 }}
                  >
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