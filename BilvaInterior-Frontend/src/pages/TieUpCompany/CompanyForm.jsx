import React from "react";
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

const CompanyForm = ({ formData, onChange, onSubmit, onCancel, isEdit, logoUrl }) => (
  <form onSubmit={onSubmit} style={{ maxWidth: 800 }}>
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

    <div style={inputRowStyle}>
      <div style={inputColStyle}>
        <Input
          name="companyName"
          value={formData.companyName || ""}
          onChange={onChange}
          placeholder="Company Name"
          required
        />
      </div>
      <div style={inputColStyle}>
        <Input
          name="contactPerson"
          value={formData.contactPerson || ""}
          onChange={onChange}
          placeholder="Contact Person"
          required
        />
      </div>
    </div>

    <div style={inputRowStyle}>
      <div style={inputColStyle}>
        <Input
          name="phone"
          value={formData.phone || ""}
          onChange={onChange}
          placeholder="Phone"
          required
        />
      </div>
      <div style={inputColStyle}>
        <Input
          type="email"
          name="email"
          value={formData.email || ""}
          onChange={onChange}
          placeholder="Email"
          required
        />
      </div>
    </div>

    <div style={inputRowStyle}>
      <div style={inputColStyle}>
        <Input
          name="addressLine1"
          value={formData.addressLine1 || ""}
          onChange={onChange}
          placeholder="Address Line 1"
          required
        />
      </div>
      <div style={inputColStyle}>
        <Input
          name="addressLine2"
          value={formData.addressLine2 || ""}
          onChange={onChange}
          placeholder="Address Line 2"
          required
        />
      </div>
    </div>

    <div style={inputRowStyle}>
      <div style={inputColStyle}>
        <DropDownList
          name="state"
          data={states}
          textField="text"
          dataItemKey="value"
          value={states.find((s) => s.text === formData.state) || states.find((s) => s.value === "KA")}
          onChange={(e) => onChange({ target: { name: "state", value: e.value?.text || "" } })}
          required
          placeholder="-- Select State --"
        />
      </div>
      <div style={inputColStyle}>
        <DropDownList
          name="city"
          data={cities}
          textField="text"
          dataItemKey="value"
          value={cities.find((c) => c.text === formData.city) || cities.find((c) => c.value === "Bengaluru")}
          onChange={(e) => onChange({ target: { name: "city", value: e.value?.text || "" } })}
          required
          placeholder="-- Select City --"
        />
      </div>
    </div>

    <div style={inputRowStyle}>
      <div style={inputColStyle}>
        <Input
          name="pincode"
          value={formData.pincode || ""}
          onChange={onChange}
          placeholder="Pincode"
          required
        />
      </div>
      <div style={inputColStyle}>
        <Input
          name="gstin"
          value={formData.gstin || ""}
          onChange={onChange}
          placeholder="GSTIN"
          required
        />
      </div>
    </div>

    <div style={inputRowStyle}>
      <div style={inputColStyle}>
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
              href={`https://localhost:7142/Uploads/${formData.billingTemplatePath}`}
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

export default CompanyForm;
