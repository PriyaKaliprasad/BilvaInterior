// Sidebar.jsx

import React, { useEffect, useRef, useMemo } from "react";
import { SvgIcon } from "@progress/kendo-react-common";
import "./Sidebar.css";
import { useAuth } from "../../context/AuthContext";

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
  const { user: authUser } = useAuth();

  console.log("User features:", authUser?.role?.features);

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

  // Build a set of allowed feature labels from the authenticated user
  const visibleGroups = useMemo(() => {
    const featNames = new Set((authUser?.role?.features || []).map(f => f.featureName));
    return groups.filter(group => {
      if (group.isGroup) {
        const visibleChildren = (group.children || []).filter(child => featNames.has(child.label));
        return featNames.has(group.label) || visibleChildren.length > 0;
      }
      return featNames.has(group.label);
    });
  }, [groups, authUser?.role?.features]);

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
        {visibleGroups.map((group) => {
          const featNames = new Set((authUser?.role?.features || []).map(f => f.featureName));
          const hasFeature = (label) => featNames.has(label);
          const visibleChildren = group.isGroup ? (group.children || []).filter(child => hasFeature(child.label)) : [];
          const groupActive = !group.isGroup ? group.id === activeTab : (visibleChildren.some(child => child.id === activeTab) || group.id === activeTab);

          return (
            <div key={group.id} className="mb-2">
              {/* Main group button */}
              <button
                className={`sidebar-link-btn w-100 d-flex justify-content-between align-items-center${
                  groupActive && (!group.isGroup || openAccordion !== group.id) ? " selected" : ""
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
              {group.isGroup && visibleChildren.length > 0 && (
                <div className={`sidebar-accordion-content ${openAccordion === group.id ? 'open' : ''}`}>
                  {visibleChildren.map((child) => (
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
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
