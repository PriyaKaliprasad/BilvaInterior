import React, { useState } from 'react';
import './ManageVendors.css';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import FloatingLabelWrapper from '../components/Form/FloatingLabelWrapper/FloatingLabelWrapper';

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

// example data for dropdowns — replace with API data as needed
const categories = [
  { id: 1, name: 'Vendor' },
  { id: 2, name: 'Contractor' },
  { id: 3, name: 'Supplier' },
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

export default function ManageVendors() {
  const [form, setForm] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  function handleInputChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    (async () => {
      setIsSubmitting(true);
      try {
        const apiBase = import.meta.env.VITE_API_BASE_URL || 'https://localhost:5001';
        const url = `${apiBase.replace(/\/$/, '')}/api/ManageVendors`;

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

        console.log('Posting vendor to API:', url, payload);

        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload)
        });

        if (res.status === 201) {
          const created = await res.json();
          console.log('Saved vendor:', created);
          setToast({ visible: true, message: 'Saved successfully', type: 'success' });
          setForm(initialState);
        } else {
          const text = await res.text();
          console.error('Save failed', res.status, text);
          setToast({ visible: true, message: `Save failed: ${res.status} - ${text}`, type: 'error' });
        }
      } catch (err) {
        console.error('Request failed', err);
        setToast({ visible: true, message: 'Request failed — check console and backend logs.', type: 'error' });
      } finally {
        setIsSubmitting(false);
        setTimeout(() => setToast({ visible: false, message: '', type: 'success' }), 2500);
      }
    })();
  }

  function handleReset() {
    setForm(initialState);
  }

  return (
    <div className="registration-wrapper">
      <form className="registration-card" onSubmit={handleSubmit} onReset={handleReset}>
        <h2 className="reg-title">Registration</h2>

        <section className="section">
          <h3 className="section-title">Personal Details</h3>
          <div className="form-grid">
            <div className="form-group">
              <FloatingLabelWrapper label="First Name">
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
              <FloatingLabelWrapper label="Last Name">
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
              <FloatingLabelWrapper label="Email-ID">
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
              <FloatingLabelWrapper label="Mobile Number">
                <input
                  className="form-input"
                  name="mobile"
                  value={form.mobile}
                  onChange={handleInputChange}
                  placeholder="10-digit number"
                  maxLength={10}
                />
              </FloatingLabelWrapper>
            </div>

            <div className="form-group">
              <FloatingLabelWrapper label="Categories">
                <DropDownList
                  data={categories}
                  textField="name"
                  value={categories.find(c => c.id === form.categoryId) || null}
                  onChange={e => setForm(s => ({ ...s, categoryId: e.value ? e.value.id : null }))}
                  filterable={false}
                />
              </FloatingLabelWrapper>
            </div>

            <div className="form-group">
              <FloatingLabelWrapper label="Address">
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
          </div>
        </section>

        <section className="section">
          <h3 className="section-title">KYC</h3>
          <div className="form-grid">
            <div className="form-group">
              <FloatingLabelWrapper label="Aadhaar Number">
                <input
                  className="form-input"
                  name="aadhaar"
                  value={form.aadhaar}
                  onChange={handleInputChange}
                  placeholder="12-digit"
                  maxLength={12}
                />
              </FloatingLabelWrapper>
            </div>

            <div className="form-group">
              <FloatingLabelWrapper label="PAN Card Number">
                <input
                  className="form-input"
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

        <section className="section">
          <h3 className="section-title">Bank Details</h3>
          <div className="form-grid">
            <div className="form-group">
              <FloatingLabelWrapper label="Bank">
                <DropDownList
                  data={banks}
                  textField="name"
                  value={banks.find(b => b.id === form.bankId) || null}
                  onChange={e => setForm(s => ({ ...s, bankId: e.value ? e.value.id : null }))}
                  filterable={false}
                />
              </FloatingLabelWrapper>
            </div>

            <div className="form-group">
              <FloatingLabelWrapper label="Branch">
                <input className="form-input" name="branch" value={form.branch} onChange={handleInputChange} placeholder="Branch name" />
              </FloatingLabelWrapper>
            </div>

            <div className="form-group">
              <FloatingLabelWrapper label="Bank Account Number">
                <input className="form-input" name="accountNumber" value={form.accountNumber} onChange={handleInputChange} placeholder="Account number" />
              </FloatingLabelWrapper>
            </div>

            <div className="form-group">
              <FloatingLabelWrapper label="IFSC Code">
                <input className="form-input" name="ifsc" value={form.ifsc} onChange={handleInputChange} placeholder="e.g., HDFC0001234" />
              </FloatingLabelWrapper>
            </div>

            <div className="form-group">
              <FloatingLabelWrapper label="MICR Code">
                <input className="form-input" name="micr" value={form.micr} onChange={handleInputChange} placeholder="9-digit MICR" />
              </FloatingLabelWrapper>
            </div>

            <div className="form-group">
              <FloatingLabelWrapper label="UPI-ID">
                <input className="form-input" name="upi" value={form.upi} onChange={handleInputChange} placeholder="name@bank" />
              </FloatingLabelWrapper>
            </div>
          </div>
        </section>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginTop: 18 }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Submit'}</button>
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
