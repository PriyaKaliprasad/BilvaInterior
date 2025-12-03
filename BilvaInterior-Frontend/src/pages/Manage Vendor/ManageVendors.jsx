import React, { useState, useEffect } from 'react';
import './ManageVendors.css';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import FloatingLabelWrapper from '../../components/Form/FloatingLabelWrapper/FloatingLabelWrapper';

const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  mobile: '',
  categoryId: null,
  address: '',
  aadhaar: '',
  pan: '',
  bankId: null,
  branch: '',
  accountNumber: '',
  ifsc: '',
  micr: '',
  upi: '',
};

// ✅ Validation regex patterns
const aadhaarRegex = /^\d{12}$/;
const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i;
const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/i;
const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
const mobileRegex = /^[6-9]\d{9}$/;
const micrRegex = /^\d{9}$/;
const accountNumberRegex = /^[0-9]{9,18}$/;

// Example data for dropdowns — replace with API data as needed
const categories = [
  { id: 1, name: 'TILES' },
  { id: 2, name: 'WOOD' },
  { id: 3, name: 'PAINT' },
  { id: 4, name: 'ELECTRICAL' },
];

const banks = [
  { id: 'au-small-finance', name: 'AU Small Finance Bank' },
  { id: 'allahabad-bank', name: 'Allahabad Bank' },
  { id: 'bank-of-baroda', name: 'Bank of Baroda' },
  { id: 'bank-of-india', name: 'Bank of India' },
  { id: 'baroda-rajasthan-kshetriya-gramin', name: 'Baroda Rajasthan Kshetriya Gramin Bank' },
  { id: 'canara-bank', name: 'Canara Bank' },
  { id: 'catholic-syrian-bank', name: 'Catholic Syrian Bank' },
  { id: 'central-bank-of-india', name: 'Central Bank of India' },
  { id: 'city-union-bank', name: 'City Union Bank' },
  { id: 'cosmos-cooperative-bank', name: 'Cosmos Cooperative Bank' },
  { id: 'equitas-small-finance', name: 'Equitas Small Finance Bank' },
  { id: 'federal-bank', name: 'Federal Bank' },
  { id: 'hdfc', name: 'HDFC Bank' },
  { id: 'icici', name: 'ICICI Bank' },
  { id: 'idfc-first-bank', name: 'IDFC FIRST Bank' },
  { id: 'indian-bank', name: 'Indian Bank' },
  { id: 'indian-overseas-bank', name: 'Indian Overseas Bank' },
  { id: 'indusind-bank', name: 'IndusInd Bank' },
  { id: 'jana-small-finance-bank', name: 'Jana Small Finance Bank' },
  { id: 'karnataka-gramin-bank', name: 'Karnataka Gramin Bank' },
  { id: 'kotak-mahindra-bank', name: 'Kotak Mahindra Bank' },
  { id: 'prathama-bank', name: 'Prathama Bank' },
  { id: 'punjab-and-sind-bank', name: 'Punjab & Sind Bank' },
  { id: 'punjab-national-bank', name: 'Punjab National Bank' },
  { id: 'rbl-bank', name: 'RBL Bank' },
  { id: 'saraswat-cooperative-bank', name: 'Saraswat Cooperative Bank' },
  { id: 'state-bank-of-india', name: 'State Bank of India' },
  { id: 'south-indian-bank', name: 'South Indian Bank' },
  { id: 'suryoday-small-finance-bank', name: 'Suryoday Small Finance Bank' },
  { id: 'uco-bank', name: 'UCO Bank' },
  { id: 'ujjivan-small-finance-bank', name: 'Ujjivan Small Finance Bank' },
  { id: 'union-bank-of-india', name: 'Union Bank of India' },
  { id: 'yes-bank', name: 'Yes Bank' },
];

export default function ManageVendors({ selectedVendor = null, onSaved = () => {} }) {
  const [form, setForm] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  // When selectedVendor changes, populate or clear the form
  useEffect(() => {
    if (selectedVendor) {
      setForm({
        firstName: selectedVendor.firstName || '',
        lastName: selectedVendor.lastName || '',
        email: selectedVendor.email || '',
        mobile: selectedVendor.mobile || '',
        categoryId: selectedVendor.categoryId ?? null,
        address: selectedVendor.address || '',
        aadhaar: selectedVendor.aadhaar || '',
        pan: selectedVendor.pan || '',
        bankId: selectedVendor.bankId ?? null,
        branch: selectedVendor.branch || '',
        accountNumber: selectedVendor.accountNumber || '',
        ifsc: selectedVendor.ifsc || '',
        micr: selectedVendor.micr || '',
        upi: selectedVendor.upi || '',
      });
    } else {
      setForm(initialState);
    }
  }, [selectedVendor]);

  function handleInputChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  // ✅ Backend uniqueness check
  async function checkUnique(field, value) {
    if (!value) return false;
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7142';
      const res = await fetch(`${apiBase}/api/ManageVendors/check-unique?field=${field}&value=${encodeURIComponent(value)}`);
      if (!res.ok) return false;
      const data = await res.json();
      return data.exists;
    } catch {
      return false;
    }
  }

  async function validateForm() {
    if (form.mobile && !mobileRegex.test(form.mobile)) {
      return 'Invalid Mobile Number — must be 10 digits starting with 6–9.';
    }
    if (form.aadhaar && !aadhaarRegex.test(form.aadhaar)) {
      return 'Invalid Aadhaar Number — must be 12 digits.';
    }
    if (form.pan && !panRegex.test(form.pan)) {
      return 'Invalid PAN Number — format: ABCDE1234F.';
    }
    if (form.ifsc && !ifscRegex.test(form.ifsc)) {
      return 'Invalid IFSC Code — format: ABCD0XXXXXX.';
    }
    if (form.upi && !upiRegex.test(form.upi)) {
      return 'Invalid UPI ID — format: name@bank.';
    }
    if (form.micr && !micrRegex.test(form.micr)) {
      return 'Invalid MICR Code — must be exactly 9 digits.';
    }
    if (form.accountNumber && !accountNumberRegex.test(form.accountNumber)) {
      return 'Invalid Account Number';
    }


    // ✅ Uniqueness validations (skip check when value unchanged during edit)
    if (!(selectedVendor && selectedVendor.email === form.email) && await checkUnique('email', form.email)) return 'Email already exists.';
    if (!(selectedVendor && selectedVendor.mobile === form.mobile) && await checkUnique('mobile', form.mobile)) return 'Mobile number already exists.';
    if (form.aadhaar && !(selectedVendor && selectedVendor.aadhaar === form.aadhaar) && await checkUnique('aadhaar', form.aadhaar)) return 'Aadhaar already exists.';
    if (form.pan && !(selectedVendor && selectedVendor.pan === form.pan) && await checkUnique('pan', form.pan)) return 'PAN already exists.';
    if (form.accountNumber &&!(selectedVendor && selectedVendor.accountNumber === form.accountNumber) && await checkUnique('accountNumber', form.accountNumber)) {return 'Account Number already exists.';
    }

    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const error = await validateForm();
    if (error) {
      setToast({ visible: true, message: error, type: 'error' });
      return;
    }

    (async () => {
      setIsSubmitting(true);
      try {
        const apiBase = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7142';
        const baseUrl = `${apiBase.replace(/\/$/, '')}/api/ManageVendors`;

        const payload = {
          FirstName: form.firstName,
          LastName: form.lastName,
          Email: form.email,
          Mobile: form.mobile,
          CategoryId: form.categoryId,
          Address: form.address,
          Aadhaar: form.aadhaar,
          PAN: form.pan,
          BankId: form.bankId,
          Branch: form.branch,
          AccountNumber: form.accountNumber,
          IFSC: form.ifsc,
          MICR: form.micr,
          UPI: form.upi
        };

        let res;
        if (selectedVendor && selectedVendor.id) {
          // Update existing vendor (PUT)
          res = await fetch(`${baseUrl}/${selectedVendor.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(payload)
          });
        } else {
          // Create new vendor (POST)
          res = await fetch(baseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(payload)
          });
        }

        // Treat 200, 201 and 204 as success
          if (res.ok) {
          // Only attempt to parse JSON if there is content
          let saved = null;
          if (res.status !== 204) {
            try { saved = await res.json(); } catch { saved = null; }
          }
          setToast({ visible: true, message: selectedVendor ? 'Updated successfully' : 'Saved successfully', type: 'success' });
          setForm(initialState);

setTimeout(() => {
  onSaved?.(saved);   // add page will close AFTER toast is seen
}, 1200);

        } else {
          const text = await res.text().catch(() => '');
          setToast({ visible: true, message: `Save failed: ${res.status} - ${text}`, type: 'error' });
        }
      } catch (err) {
        console.error('Request failed', err);
        setToast({ visible: true, message: 'Request failed — check console and backend logs.', type: 'error' });
      } finally {
  setIsSubmitting(false);

  setTimeout(() => {
    setToast(t => t.visible ? { visible: false, message: '', type: t.type } : t);
  }, 2500);
}

    })();
  }

  function handleReset() {
    setForm(selectedVendor ? {
      firstName: selectedVendor.firstName || '',
      lastName: selectedVendor.lastName || '',
      email: selectedVendor.email || '',
      mobile: selectedVendor.mobile || '',
      categoryId: selectedVendor.categoryId ?? null,
      address: selectedVendor.address || '',
      aadhaar: selectedVendor.aadhaar || '',
      pan: selectedVendor.pan || '',
      bankId: selectedVendor.bankId ?? null,
      branch: selectedVendor.branch || '',
      accountNumber: selectedVendor.accountNumber || '',
      ifsc: selectedVendor.ifsc || '',
      micr: selectedVendor.micr || '',
      upi: selectedVendor.upi || '',
    } : initialState);
  }

  return (
    <div className="registration-wrapper">
      <form className="registration-card" onSubmit={handleSubmit} onReset={handleReset}>
        <h2 className="reg-title">{selectedVendor ? 'Edit Vendor' : 'Registration'}</h2>

        {/* Personal Details */}
        <section className="section">
          <h3 className="section-title">Personal Details</h3>
          <div className="form-grid">
            <div className="form-group">
              <FloatingLabelWrapper label={<>First Name <span className="required-asterisk">*</span></>}>
                <input
                  className="form-input"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter first name"
                />
              </FloatingLabelWrapper>
            </div>

            <div className="form-group">
               <FloatingLabelWrapper label={<>Last Name <span className="required-asterisk">*</span></>}>
                <input
                  className="form-input"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter last name"
                />
              </FloatingLabelWrapper>
            </div>

            <div className="form-group">
               <FloatingLabelWrapper label={<>Email-ID <span className="required-asterisk">*</span></>}>
                <input
                  className="form-input"
                  name="email"
                  value={form.email}
                  onChange={handleInputChange}
                  placeholder="name@example.com"
                  type="email"
                />
              </FloatingLabelWrapper>
            </div>

            <div className="form-group">
               <FloatingLabelWrapper label={<>Mobile Number <span className="required-asterisk">*</span></>}>
                <input
                  className={`form-input ${form.mobile && !mobileRegex.test(form.mobile) ? 'input-error' : ''}`}
                  name="mobile"
                  value={form.mobile}
                  onChange={handleInputChange}
                  placeholder="10-digit number"
                  maxLength={10}
                />
              </FloatingLabelWrapper>
            </div>

            <div className="form-group">
               <FloatingLabelWrapper label={<>Address <span className="required-asterisk">*</span></>}>
                <textarea
                  className="form-textarea"
                  name="address"
                  value={form.address}
                  onChange={handleInputChange}
                  placeholder="Street, City, State, PIN"
                  rows={2}
                />
              </FloatingLabelWrapper>
            </div>

            <div className="form-group">
               <FloatingLabelWrapper label={<>Categories <span className="required-asterisk">*</span></>}>
                <DropDownList
                  data={categories}
                  textField="name"
                  value={categories.find(c => c.id === form.categoryId) || null}
                  onChange={e => setForm(s => ({ ...s, categoryId: e.value ? e.value.id : null }))}
                />
              </FloatingLabelWrapper>
            </div>
          </div>
        </section>

        {/* KYC */}
        <section className="section">
          <h3 className="section-title">KYC</h3>
          <div className="form-grid">
            <div className="form-group">
               <FloatingLabelWrapper label={<>Aadhaar Number <span className="required-asterisk">*</span></>}>
                <input
                  className={`form-input ${form.aadhaar && !aadhaarRegex.test(form.aadhaar) ? 'input-error' : ''}`}
                  name="aadhaar"
                  value={form.aadhaar}
                  onChange={handleInputChange}
                  placeholder="12-digit"
                  maxLength={12}
                />
              </FloatingLabelWrapper>
            </div>

            <div className="form-group">
               <FloatingLabelWrapper label={<>PAN Card Number <span className="required-asterisk">*</span></>}>
                <input
                  className={`form-input ${form.pan && !panRegex.test(form.pan) ? 'input-error' : ''}`}
                  name="pan"
                  value={form.pan}
                  onChange={handleInputChange}
                  placeholder="ABCDE1234F"
                  maxLength={10}
                />
              </FloatingLabelWrapper>
            </div>
          </div>
        </section>

        {/* Bank Details */}
        <section className="section">
          <h3 className="section-title">Bank Details</h3>
          <div className="form-grid">
            <div className="form-group">
               <FloatingLabelWrapper label={<>Bank <span className="required-asterisk">*</span></>}>
                <DropDownList
                  data={banks}
                  textField="name"
                  value={banks.find(b => b.id === form.bankId) || null}
                  onChange={e => setForm(s => ({ ...s, bankId: e.value ? e.value.id : null }))}
                />
              </FloatingLabelWrapper>
            </div>

            <div className="form-group">
               <FloatingLabelWrapper label={<>Branch <span className="required-asterisk">*</span></>}>
                <input
                  className="form-input"
                  name="branch"
                  value={form.branch}
                  onChange={handleInputChange}
                  placeholder="Branch name"
                />
              </FloatingLabelWrapper>
            </div>

            <div className="form-group">
               <FloatingLabelWrapper label={<>Bank Account Number <span className="required-asterisk">*</span></>}>
                <input
                  className={`form-input ${form.accountNumber && !accountNumberRegex.test(form.accountNumber) ? 'input-error' : ''}`}
                  name="accountNumber"
                  value={form.accountNumber}
                  onChange={handleInputChange}
                  placeholder="Account number"
                />
              </FloatingLabelWrapper>
            </div>

            <div className="form-group">
               <FloatingLabelWrapper label={<>IFSC Code <span className="required-asterisk">*</span></>}>
                <input
                  className={`form-input ${form.ifsc && !ifscRegex.test(form.ifsc) ? 'input-error' : ''}`}
                  name="ifsc"
                  value={form.ifsc}
                  onChange={handleInputChange}
                  placeholder="e.g., HDFC0001234"
                />
              </FloatingLabelWrapper>
            </div>

            <div className="form-group">
               <FloatingLabelWrapper label={<>MICR Code <span className="required-asterisk">*</span></>}>
                <input
                  className={`form-input ${form.micr && !micrRegex.test(form.micr) ? 'input-error' : ''}`}
                  name="micr"
                  value={form.micr}
                  onChange={handleInputChange}
                  placeholder="9-digit MICR"
                />
              </FloatingLabelWrapper>
            </div>

            <div className="form-group">
               <FloatingLabelWrapper label={<>UPI-ID <span className="required-asterisk">*</span></>}>
                <input
                  className={`form-input ${form.upi && !upiRegex.test(form.upi) ? 'input-error' : ''}`}
                  name="upi"
                  value={form.upi}
                  onChange={handleInputChange}
                  placeholder="name@bank"
                />
              </FloatingLabelWrapper>
            </div>
          </div>
        </section>

        {/* Buttons & Toast */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginTop: 18 }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : (selectedVendor ? 'Update' : 'Submit')}
            </button>
            <button type="reset" className="btn btn-secondary">Reset</button>
          </div>

          {toast.visible && (
            <div style={{
              marginTop: 12,
              padding: '8px',
              borderRadius: '6px',
              textAlign: 'center',
              fontWeight: 'bold',
              color: toast.type === 'success' ? '#065f46' : '#b91c1c',
              backgroundColor: toast.type === 'success' ? '#d1fae5' : '#fee2e2'
            }}>
              {toast.message}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}