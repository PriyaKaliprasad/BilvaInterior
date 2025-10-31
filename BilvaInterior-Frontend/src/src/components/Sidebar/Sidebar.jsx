// Sidebar.jsx

import React, { useEffect, useRef } from "react";
import { SvgIcon } from "@progress/kendo-react-common";
import "./Sidebar.css";

// Sidebar receives groups, activeTab, setActiveTab, openAccordion, setOpenAccordion, getActiveGroup, open, onClose
const Sidebar = ({ 
  groups, 
  activeTab, 
  setActiveTab, 
  openAccordion, 
  setOpenAccordion, 
  getActiveGroup, 
  open, 
  onClose 
}) => {
  const sidebarRef = useRef(null);

  // Close sidebar when clicking outside (mobile only)
  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        if (onClose) onClose();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onClose]);

  // Handle accordion toggle
  const toggleAccordion = (groupId) => {
    setOpenAccordion(prev => prev === groupId ? null : groupId);
  };

  // Handle tab selection
  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (onClose) onClose(); // Close sidebar on mobile
  };

  // Handle group click (for groups that contain the active tab)
  const handleGroupClick = (group) => {
    if (group.isGroup) {
      // If this group contains the active tab and is closed, open it
      const activeGroup = getActiveGroup(activeTab);
      if (activeGroup === group.id && openAccordion !== group.id) {
        setOpenAccordion(group.id);
      } else {
        toggleAccordion(group.id);
      }
    } else {
      handleTabClick(group.id);
    }
  };

  // Check if a group should be highlighted (contains active tab)
  const isGroupActive = (group) => {
    if (!group.isGroup) return group.id === activeTab;
    return group.children.some(child => child.id === activeTab);
  };

  return (
    <div
      ref={sidebarRef}
      className={`sidebar${open ? " open" : ""}`}
      style={{ zIndex: 1200 }}
    >
      <div className="sidebar-title mb-4">
        <h4>Bilva Interiors</h4>
      </div>
      
      <div className="w-100">
        {groups.map((group) => (
          <div key={group.id} className="mb-2">
            {/* Main group button */}
            <button
              className={`sidebar-link-btn w-100 d-flex justify-content-between align-items-center${
                isGroupActive(group) && (!group.isGroup || openAccordion !== group.id) 
                  ? " selected" 
                  : ""
              }`}
              onClick={() => handleGroupClick(group)}
            >
              <span className="d-flex align-items-center">
                {group.icon && (
                  <SvgIcon icon={group.icon} style={{ marginRight: 10, fontSize: 18 }} />
                )}
                {group.label}
              </span>
              {group.isGroup && (
                <i className={`bi bi-chevron-down sidebar-accordion-icon ${openAccordion === group.id ? 'open' : ''}`}></i>
              )}
            </button>

            {/* Accordion content for groups */}
            {group.isGroup && (
              <div className={`sidebar-accordion-content ${openAccordion === group.id ? 'open' : ''}`}>
                {group.children.map((child) => (
                  <button
                    key={child.id}
                    className={`sidebar-link-btn sidebar-sub-link w-100${
                      activeTab === child.id ? " selected" : ""
                    }`}
                    onClick={() => handleTabClick(child.id)}
                  >
                    <span className="d-flex align-items-center">
                      {child.icon && (
                        <SvgIcon icon={child.icon} style={{ marginRight: 10, fontSize: 16 }} />
                      )}
                      {child.label}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
