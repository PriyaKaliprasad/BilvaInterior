// Sidebar.jsx
import { PanelBar, PanelBarItem, PanelBarUtils } from "@progress/kendo-react-layout";
import { useNavigate, useLocation } from "react-router-dom";
import { components, SvgIcon } from "@progress/kendo-react-common";
import { logoutIcon } from "@progress/kendo-svg-icons";
import { sidebarLinks } from "./sidebarLinks";
import { Button } from "@progress/kendo-react-buttons";
import "./Sidebar.css"; // custom styles

// --- NOTE ---
// Use the "sidebarLinks.js" file to add/edit/delete links for the sidebar

// Helper to find selected and expanded keys based on current path
const findSelectedAndExpanded = (links, pathname, parentKey = "") => {
  let selected = null;
  let expanded = [];

  for (const item of links) {
    const key = parentKey ? `${parentKey}/${item.title}` : item.title;
    if (item.route === pathname) {
      selected = key;
    }
    if (item.children) {
      const child = findSelectedAndExpanded(item.children, pathname, key);
      if (child.selected) {
        expanded.push(key);
        selected = child.selected;
        expanded = expanded.concat(child.expanded);
      }
    }
  }
  return { selected, expanded };
};

// Find which item should be selected/expanded
const { selected, expanded } = findSelectedAndExpanded(sidebarLinks, location.pathname);


// Helper to render sidebar links with icons and keys
const renderSidebarLinks = (links, parentKey = "") =>
  links.map((item) => {
    const key = parentKey ? `${parentKey}/${item.title}` : item.title;
    return (
      <PanelBarItem
        key={key}
        title={
          item.icon ? (
            <span style={{ display: "flex", alignItems: "center" }}>
              <SvgIcon icon={item.icon} style={{ marginRight: 10 }} />
              {item.title}
            </span>
          ) : (
            item.title
          )
        }
        route={item.route}
        expanded={expanded.includes(key)}
        selected={selected === key}
      >
        {item.children && renderSidebarLinks(item.children, key)}
      </PanelBarItem>
    );
  });


const Sidebar = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();


  const handleSelect = (event) => {
    if (event.target.props.route) {
      navigate(event.target.props.route);
      onClose();
    }
  };



  return (
    <div className={`sidebar${open ? " open" : ""}`} style={{ zIndex: 1200 }}>
      {/* sidebar title */}
      <div className="sidebar-title">
        <h2>Bilva Interiors</h2>
      </div>

      {/* panelbar 1 */}
      <div className="segment-container">
        {/* segment of the panelbar */}
        <div className="segment">
          <PanelBar expandMode="single" onSelect={handleSelect}>
            {renderSidebarLinks(sidebarLinks)}
          </PanelBar>
        </div>
        {/* sign out button */}
        {/* <div className="btn-segment">
          <Button>
            Sign Out
            <SvgIcon icon={logoutIcon} style={{ marginLeft: "1rem", marginBottom: "0.1rem" }} />
          </Button>
        </div> */}
      </div>
    </div>
  );
};

export default Sidebar;
