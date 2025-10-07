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
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(value) ? '' : 'Invalid Indian phone number';
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
  const [avatarPreviewOpen, setAvatarPreviewOpen] = useState(false);
  const fileInputRef = useRef(null);

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
  const [formChanged, setFormChanged] = useState(false); // ✅ Added

  // Load company data
  useEffect(() => {
    if (!companyId) return;
    const loadCompany = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/TieUpCompany/${companyId}`);
        const data = await res.json();
        if (!data) return;
        if (data.profilePicPath) {
          setAvatarSrc(`${import.meta.env.VITE_API_BASE_URL}${data.profilePicPath}`);
        }
        setSelectedState(data.state || 'Karnataka');
        const stateObj = indiaStatesCities.find(s => s.state === (data.state || 'Karnataka'));
        setCities(stateObj ? stateObj.cities : []);
        setSelectedCity(data.city || stateObj?.cities?.[0] || '');
        let billingTemplateArr = null;
        if (data.billingTemplatePath) {
          let filePath = data.billingTemplatePath;
          if (!filePath.startsWith('/uploads/')) {
            filePath = `/uploads/${filePath.replace(/^\/+/, '')}`;
          }
          billingTemplateArr = [{
            name: filePath.split('/').pop(),
            url: `${import.meta.env.VITE_API_BASE_URL}${filePath}`
          }];
        }
        setExcelFile(billingTemplateArr);
        setInitialValues({
          companyName: data.companyName || '',
          contactPerson: data.contactPerson || '',
          phone: data.phone || '',
          email: data.email || '',
          addressLine1: data.addressLine1 || '',
          addressLine2: data.addressLine2 || '',
          pincode: data.pincode || '',
          gstin: data.gstin || '',
          billingTemplate: billingTemplateArr
        });
      } catch (err) {
        console.error('Error loading company data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadCompany();
  }, [companyId]);

  useEffect(() => {
    if ((showGlobalError || uniqueError) && errorRef.current) {
      const y = errorRef.current.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, [showGlobalError, uniqueError]);

  const handleImageUpload = (src) => setAvatarSrc(src);

  const handleExcelUpload = (files) => {
    if (files?.length > 0) {
      const file = files[0].getRawFile ? files[0].getRawFile() : files[0];
      setExcelFile(file);
    }
  };

  const handlePreview = async () => {
    if (!excelFile) return;
    let fileToRead = null;
    if (Array.isArray(excelFile) && excelFile[0]) {
      if (excelFile[0] instanceof Blob) {
        fileToRead = excelFile[0];
      } else if (excelFile[0].getRawFile) {
        fileToRead = excelFile[0].getRawFile();
      } else if (excelFile[0].url) {
        try {
          const response = await fetch(excelFile[0].url);
          if (!response.ok) throw new Error('Failed to fetch file from server');
          fileToRead = await response.blob();
        } catch (err) {
          setToast({ visible: true, message: 'Error fetching file: ' + err.message, type: 'error' });
          return;
        }
      }
    } else if (excelFile instanceof Blob) {
      fileToRead = excelFile;
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

  const handleStateChange = (e) => {
    const state = e.target.value;
    setSelectedState(state);
    const stateObj = indiaStatesCities.find((s) => s.state === state);
    const newCities = stateObj ? stateObj.cities : [];
    setCities(newCities);
    setSelectedCity(newCities[0] || '');
  };

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  const getFieldStyle = (validationMessage, touched) => {
    return validationMessage && touched ? { border: '1px solid red' } : {};
  };

  const handleSubmit = async (dataItem, formApi) => {
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
      // Uniqueness check
      let isUnique = true;
      try {
        const checkResponse = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/TieUpCompany/checkUnique/${companyId}`,
          {
            method: 'POST',
            body: JSON.stringify({
              companyName: dataItem.companyName,
              email: dataItem.email,
              phone: dataItem.phone,
            }),
            headers: { 'Content-Type': 'application/json' },
          }
        );
        if (checkResponse.ok) {
          const checkResult = await checkResponse.json();
          isUnique = checkResult.isUnique;
        } else {
          const errorText = await checkResponse.text();
          setToast({
            visible: true,
            message: `Uniqueness check failed: ${errorText || checkResponse.statusText}`,
            type: 'error',
          });
          setIsSubmitting(false);
          return;
        }
      } catch (err) {
        setToast({ visible: true, message: 'Error during uniqueness check: ' + err.message, type: 'error' });
        setIsSubmitting(false);
        return;
      }

      if (!isUnique) {
        setToast({ visible: true, message: 'Company Name, Email, or Phone already exists.', type: 'error' });
        setIsSubmitting(false);
        return;
      }

      // Prepare FormData
      const formData = new FormData();
      Object.keys(dataItem).forEach((key) => {
        if (key !== 'profilePic' && key !== 'billingTemplate') {
          formData.append(key, dataItem[key] || '');
        }
      });

      formData.append('id', companyId);

      // Append files if new ones are selected
      if (dataItem.billingTemplate?.length > 0) {
        const file = dataItem.billingTemplate[0].getRawFile?.() || dataItem.billingTemplate[0];
        formData.append('billingTemplate', file);
      }

      if (dataItem.profilePic?.length > 0) {
        const file = dataItem.profilePic[0].getRawFile?.() || dataItem.profilePic[0];
        formData.append('profilePic', file);
      }

      // Always include city/state
      formData.append('state', selectedState);
      formData.append('city', selectedCity);

      // PUT request
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/TieUpCompany/${companyId}`,
        {
          method: 'PUT',
          body: formData,
        }
      );

      if (response.ok) {
        const updatedCompany = await response.json();
        setToast({ visible: true, message: 'Company updated successfully!', type: 'success' });
        setTimeout(() => {
          setToast({ visible: false, message: '', type: 'success' });
          if (onEditSuccess && updatedCompany) {
            onEditSuccess(updatedCompany);
          } else if (closeEdit) {
            closeEdit();
          }
        }, 2500);
      } else {
        const errorText = await response.text();
        setToast({ visible: true, message: `Failed to update company: ${errorText}`, type: 'error' });
      }
    } catch (err) {
      setToast({ visible: true, message: 'Error updating company: ' + err.message, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    loading ? (
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading...</div>
    ) : initialValues ? (
      <Form
        ref={formRef}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        onChange={() => {
          if (!formChanged) setFormChanged(true);
          if (toast.visible && toast.type === 'error') {
            setToast({ visible: false, message: '', type: 'success' });
          }
        }}
        render={(formRenderProps) => (
          <FormElement style={{ maxWidth: 900, padding: '0 1rem' }}>
            <CustomFormFieldSet cols={responsiveBreakpoints}>
              <div className="img-container">
                <Avatar
                  src={avatarSrc}
                  height={100}
                  style={{ borderRadius: 0, cursor: 'pointer' }}
                />
              </div>
              <Field
                name="profilePic"
                component={FormUpload}
                label="Company Logo"
                accept=".jpg,.jpeg,.png"
                allowedFormatsArray={['.jpg', '.jpeg', '.png']}
                onImageUpload={setAvatarSrc}
              />
              {avatarPreviewOpen && avatarSrc && (
                <Dialog title="Company Logo Preview" onClose={() => setAvatarPreviewOpen(false)}>
                  <div style={{ textAlign: 'center' }}>
                    <img src={avatarSrc} alt="Company Logo" style={{ maxWidth: '100%', maxHeight: '60vh', borderRadius: 8 }} />
                  </div>
                </Dialog>
              )}
            </CustomFormFieldSet>

            {/* Contact Info */}
            <CustomFormFieldSet legend="Contact Info" className="custom-fieldset">
              <div className="form-row">
                <Field name="companyName" component={FormInput} label="Company Name" validator={nameValidator} />
                <Field name="contactPerson" component={FormInput} label="Contact Person" validator={nameValidator} />
                <Field name="phone" component={FormMaskedInput} label="Phone" mask="0000000000" validator={phoneValidator} />
                <Field name="email" component={FormInput} label="Email" validator={emailValidator} />
              </div>
            </CustomFormFieldSet>

            {/* Address */}
            <CustomFormFieldSet legend="Address" className="custom-fieldset">
              <div className="form-row">
                <Field name="addressLine1" component={FormInput} label="Address Line 1" validator={requiredValidator} />
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
                <Field name="pincode" component={FormMaskedInput} mask="000000" label="Pincode" validator={pincodeValidator} />
              </div>
            </CustomFormFieldSet>

            {/* Business Details */}
            <CustomFormFieldSet legend="Business Details" className="custom-fieldset">
              <Field name="gstin" component={FormInput} label="GSTIN" validator={gstinValidator} />
            </CustomFormFieldSet>

            {/* Billing Template */}
            <CustomFormFieldSet legend="Billing Template (Excel)" className="custom-fieldset">
              <Field
                name="billingTemplate"
                component={FormUpload}
                label="Upload Excel File"
                accept=".xlsx,.xls"
                allowedFormatsArray={['.xlsx', '.xls']}
                onChange={(e) => handleExcelUpload(e && e.value ? e.value : [])}
              />
              {excelFile && excelFile.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <span>Existing file: </span>
                  <a href={excelFile[0].url} target="_blank" rel="noopener noreferrer">
                    {excelFile[0].name}
                  </a>
                </div>
              )}
            </CustomFormFieldSet>

            {excelFile && (
              <CustomFormFieldSet className="custom-fieldset">
                <Button type="button" onClick={handlePreview}>
                  Preview Billing Template
                </Button>
              </CustomFormFieldSet>
            )}

            {previewOpen && excelData && (
              <Dialog title="Billing Template Preview" onClose={() => setPreviewOpen(false)}>
                <div style={{ maxHeight: '60vh', overflow: 'auto' }}>
                  {excelData.map((sheet, index) => (
                    <div key={index} style={{ marginBottom: '1rem' }}>
                      <h5>{sheet.name}</h5>
                      <table border="1" cellPadding="5" style={{ width: '100%', borderCollapse: 'collapse' }}>
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

            {showGlobalError && (
              <div ref={errorRef} style={{ color: 'red', textAlign: 'center', marginTop: '1rem' }}>
                Please fix the validation errors before submitting.
              </div>
            )}

            {uniqueError && (
              <div style={{ color: 'red', textAlign: 'center', marginTop: '1rem' }}>
                {uniqueError}
              </div>
            )}

            {toast.visible && (
              <div
                style={{
                  textAlign: 'center',
                  marginTop: '1rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  backgroundColor: toast.type === 'success' ? '#4caf50' : '#f44336',
                  color: '#fff',
                  fontWeight: 500
                }}
              >
                {toast.message}
              </div>
            )}

            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <Button themeColor="primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update'}
              </Button>
              <Button
                look="outline"
                style={{ marginLeft: 12 }}
                onClick={closeEdit}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </FormElement>
        )}
      />
    ) : (
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>Company not found.</div>
    )
  );
};

export default TieUpEdit;
