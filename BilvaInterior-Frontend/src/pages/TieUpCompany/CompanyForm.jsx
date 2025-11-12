import React, { useState } from "react";
import { Input } from "@progress/kendo-react-inputs";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { Button } from "@progress/kendo-react-buttons";

const states = [
  { text: "Andhra Pradesh", value: "AP" },
  { text: "Arunachal Pradesh", value: "AR" },
  { text: "Assam", value: "AS" },
  { text: "Bihar", value: "BR" },
  { text: "Chhattisgarh", value: "CG" },
  { text: "Goa", value: "GA" },
  { text: "Gujarat", value: "GJ" },
  { text: "Haryana", value: "HR" },
  { text: "Himachal Pradesh", value: "HP" },
  { text: "Jharkhand", value: "JH" },
  { text: "Karnataka", value: "KA" },
  { text: "Kerala", value: "KL" },
  { text: "Madhya Pradesh", value: "MP" },
  { text: "Maharashtra", value: "MH" },
  { text: "Manipur", value: "MN" },
  { text: "Meghalaya", value: "ML" },
  { text: "Mizoram", value: "MZ" },
  { text: "Nagaland", value: "NL" },
  { text: "Odisha", value: "OR" },
  { text: "Punjab", value: "PB" },
  { text: "Rajasthan", value: "RJ" },
  { text: "Sikkim", value: "SK" },
  { text: "Tamil Nadu", value: "TN" },
  { text: "Telangana", value: "TG" },
  { text: "Tripura", value: "TR" },
  { text: "Uttar Pradesh", value: "UP" },
  { text: "Uttarakhand", value: "UK" },
  { text: "West Bengal", value: "WB" },
  { text: "Delhi", value: "DL" },
  { text: "Jammu and Kashmir", value: "JK" },
  { text: "Ladakh", value: "LA" },
];

const cities = [
  { text: "Mumbai", value: "Mumbai" },
  { text: "Delhi", value: "Delhi" },
  { text: "Bengaluru", value: "Bengaluru" },
  { text: "Hyderabad", value: "Hyderabad" },
  { text: "Ahmedabad", value: "Ahmedabad" },
  { text: "Chennai", value: "Chennai" },
  { text: "Kolkata", value: "Kolkata" },
  { text: "Surat", value: "Surat" },
  { text: "Pune", value: "Pune" },
  { text: "Jaipur", value: "Jaipur" },
];

const inputRowStyle = { display: "flex", gap: "20px", marginBottom: "20px" };
const inputColStyle = { flex: 1 };

const CompanyForm = ({ formData, onChange, onSubmit, onCancel, isEdit, logoUrl }) => {
  const [errors, setErrors] = useState({});

  // ✅ Validation before submit
  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      "companyName",
      "contactPerson",
      "phone",
      "email",
      "addressLine1",
      "addressLine2",
      "state",
      "city",
      "pincode",
      "gstin",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field] || formData[field].trim() === "") {
        newErrors[field] = "This field is required";
      }
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      alert("Please fill all required fields marked with *");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(e);
    }
  };

  const renderLabel = (label, required) => (
    <label style={{ fontWeight: 500 }}>
      {label} {required && <span style={{ color: "red" }}>*</span>}
    </label>
  );

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 800 }}>
      <h2>{isEdit ? `Edit Company (${formData.id || ""})` : "New Company"}</h2>

      <div style={{ display: "flex", alignItems: "center", marginBottom: "24px" }}>
        <img
          src={logoUrl}
          alt="Company Logo"
          style={{ width: 150, height: 100, objectFit: "cover", marginRight: 24, background: "#eee" }}
        />
        <input
          type="file"
          name="companyLogo"
          onChange={onChange}
          accept="image/*"
          style={{
            border: "1px solid #d4d4d4",
            padding: "10px",
            borderRadius: 4,
            fontSize: 14,
          }}
        />
      </div>

      {/* Row 1 */}
      <div style={inputRowStyle}>
        <div style={inputColStyle}>
          {renderLabel("Company Name", true)}
          <Input
            name="companyName"
            value={formData.companyName || ""}
            onChange={onChange}
            required
          />
          {errors.companyName && <div style={{ color: "red", fontSize: 12 }}>{errors.companyName}</div>}
        </div>
        <div style={inputColStyle}>
          {renderLabel("Contact Person", true)}
          <Input
            name="contactPerson"
            value={formData.contactPerson || ""}
            onChange={onChange}
            required
          />
          {errors.contactPerson && <div style={{ color: "red", fontSize: 12 }}>{errors.contactPerson}</div>}
        </div>
      </div>

      {/* Row 2 */}
      <div style={inputRowStyle}>
        <div style={inputColStyle}>
          {renderLabel("Phone", true)}
          <Input
            name="phone"
            value={formData.phone || ""}
            onChange={onChange}
            required
          />
          {errors.phone && <div style={{ color: "red", fontSize: 12 }}>{errors.phone}</div>}
        </div>
        <div style={inputColStyle}>
          {renderLabel("Email", true)}
          <Input
            type="email"
            name="email"
            value={formData.email || ""}
            onChange={onChange}
            required
          />
          {errors.email && <div style={{ color: "red", fontSize: 12 }}>{errors.email}</div>}
        </div>
      </div>

      {/* Row 3 */}
      <div style={inputRowStyle}>
        <div style={inputColStyle}>
          {renderLabel("Address Line 1", true)}
          <Input
            name="addressLine1"
            value={formData.addressLine1 || ""}
            onChange={onChange}
            required
          />
          {errors.addressLine1 && <div style={{ color: "red", fontSize: 12 }}>{errors.addressLine1}</div>}
        </div>
        <div style={inputColStyle}>
          {renderLabel("Address Line 2", true)}
          <Input
            name="addressLine2"
            value={formData.addressLine2 || ""}
            onChange={onChange}
            required
          />
          {errors.addressLine2 && <div style={{ color: "red", fontSize: 12 }}>{errors.addressLine2}</div>}
        </div>
      </div>

      {/* Row 4 */}
      <div style={inputRowStyle}>
        <div style={inputColStyle}>
          {renderLabel("State", true)}
          <DropDownList
            name="state"
            data={states}
            textField="text"
            dataItemKey="value"
            value={states.find((s) => s.text === formData.state) || null}
            onChange={(e) => onChange({ target: { name: "state", value: e.value?.text || "" } })}
            required
            placeholder="-- Select State --"
          />
          {errors.state && <div style={{ color: "red", fontSize: 12 }}>{errors.state}</div>}
        </div>
        <div style={inputColStyle}>
          {renderLabel("City", true)}
          <DropDownList
            name="city"
            data={cities}
            textField="text"
            dataItemKey="value"
            value={cities.find((c) => c.text === formData.city) || null}
            onChange={(e) => onChange({ target: { name: "city", value: e.value?.text || "" } })}
            required
            placeholder="-- Select City --"
          />
          {errors.city && <div style={{ color: "red", fontSize: 12 }}>{errors.city}</div>}
        </div>
      </div>

      {/* Row 5 */}
      <div style={inputRowStyle}>
        <div style={inputColStyle}>
          {renderLabel("Pincode", true)}
          <Input
            name="pincode"
            value={formData.pincode || ""}
            onChange={onChange}
            required
          />
          {errors.pincode && <div style={{ color: "red", fontSize: 12 }}>{errors.pincode}</div>}
        </div>
        <div style={inputColStyle}>
          {renderLabel("GSTIN", true)}
          <Input
            name="gstin"
            value={formData.gstin || ""}
            onChange={onChange}
            required
          />
          {errors.gstin && <div style={{ color: "red", fontSize: 12 }}>{errors.gstin}</div>}
        </div>
      </div>

      {/* Billing Template */}
      <div style={inputRowStyle}>
        <div style={inputColStyle}>
          {renderLabel("Billing Template", false)}
          <input
            type="file"
            name="billingTemplate"
            onChange={onChange}
            accept=".xls,.xlsx"
            style={{
              border: "1px solid #d4d4d4",
              padding: "8px",
              width: "100%",
              borderRadius: 4,
              fontSize: 14,
            }}
          />
          {formData.billingTemplatePath && (
            <div style={{ marginTop: 8 }}>
              <a
                href={`${import.meta.env.VITE_API_BASE_URL}/Uploads/${formData.billingTemplatePath}`}
                target="_blank"
                rel="noreferrer"
              >
                View existing template
              </a>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: 40 }}>
        <Button type="submit" primary>
          {isEdit ? "Save" : "Create"}
        </Button>
        <Button type="button" onClick={onCancel} style={{ marginLeft: 10 }}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default CompanyForm;
