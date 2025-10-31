import React from "react";
import { Breadcrumb } from "@progress/kendo-react-layout";
import "./SubNavbar.css";

// SubNavbar receives navMeta prop: { title, breadcrumb }
const SubNavbar = ({ navMeta }) => {
  if (!navMeta || !navMeta.title) return null;

  return (
    <div className="sub-navbar">
      <div className="sub-navbar-title">{navMeta.title}</div>
      {navMeta.breadcrumb && navMeta.breadcrumb.length > 1 && (
        <div className="sub-navbar-breadcrumb">
          <Breadcrumb
            data={navMeta.breadcrumb.map((title, idx) => ({
              text: title,
              ...(idx < navMeta.breadcrumb.length - 1 ? { url: "#" } : {}),
            }))}
            ariaLabel="Breadcrumb"
          />
        </div>
      )}
    </div>
  );
};

export default SubNavbar;
