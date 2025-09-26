import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import CompanyForm from "./CompanyForm";

const TieUpEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [company, setCompany] = useState(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    axios
      .get(`https://localhost:7142/api/TieUpCompany/${id}`)
      .then((res) => {
        const loaded = res.data || {};
        setCompany({
          ...loaded,
          state: loaded.state || "Karnataka",
          city: loaded.city || "Bengaluru",
          companyLogo: loaded.profilePicPath || null,
          billingTemplatePath: loaded.billingTemplatePath || null,
        });
      })
      .catch(() => alert("Failed to load company"));
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "billingTemplate") {
      setFile(files[0]);
    } else if (name === "companyLogo") {
      setCompany({
        ...company,
        companyLogo: files[0],
      });
    } else {
      setCompany({
        ...company,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.keys(company).forEach((key) => {
      if (key !== "companyLogo" && key !== "billingTemplatePath") {
        formData.append(key, company[key] || "");
      }
    });

    if (file) {
      formData.append("billingTemplate", file);
    }

    if (company.companyLogo instanceof File) {
      formData.append("profilePic", company.companyLogo);
    }

    try {
      await axios.put(`https://localhost:7142/api/TieUpCompany/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Company updated successfully!");
      navigate("/tie-up-company/all");
    } catch (err) {
      console.error(err);
      alert("Failed to update company");
    }
  };

  if (!company) return <div>Loading...</div>;

  const logoUrl =
    company.companyLogo instanceof File
      ? URL.createObjectURL(company.companyLogo)
      : company.companyLogo
      ? `https://localhost:7142/Uploads/profile/${company.companyLogo}`
      : "/default-avatar.png";

  return (
    <CompanyForm
      formData={company}
      logoUrl={logoUrl}
      onChange={handleChange}
      onSubmit={handleSubmit}
      isEdit={true}
      onCancel={() => navigate("/tie-up-company/all")}
    />
  );
};

export default TieUpEdit;
