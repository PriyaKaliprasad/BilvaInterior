import React from "react";
import { useLocation } from "react-router-dom";
import { useNavigation } from "../../context/NavigationContext";
import { Breadcrumb } from "@progress/kendo-react-layout";
import "./SubNavbar.css";

const SubNavbar = () => {
  const location = useLocation();
  const { getNavInfo } = useNavigation();
  const { parent, breadcrumb } = getNavInfo(location.pathname);

  // Don't render if no parent or breadcrumb
  if (!parent && (!breadcrumb || breadcrumb.length === 0)) return null;

  return (
    <div className="sub-navbar">
      <div className="sub-navbar-title">{parent}</div>
      {breadcrumb.length > 1 && (
        <div className="sub-navbar-breadcrumb">
          <Breadcrumb
            data={breadcrumb.map((title, idx) => ({
              text: title,
              // Optionally, add url for all except last
              ...(idx < breadcrumb.length - 1 ? { url: "#" } : {}),
            }))}
            ariaLabel="Breadcrumb"
          />
        </div>
      )}
    </div>
  );
};

export default SubNavbar;
