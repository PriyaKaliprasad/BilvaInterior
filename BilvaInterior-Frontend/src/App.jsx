// App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { NavigationProvider } from "./context/NavigationContext";
import { AuthProvider } from "./context/AuthContext";
import PublicRoute from "./routes/PublicRoute";
import LoginPage from "./pages/Login/LoginPage";
import ResetPasswordPage from "./pages/PasswordReset/ResetPasswordPage";
import ForgotPasswordPage from "./pages/ForgotPassword/ForgotPasswordPage";
import KeepAliveTabs from "./components/KeepAliveTabs";
import Sidebar from "./components/Sidebar/Sidebar";
import MainNavbar from "./components/Navbar/MainNavbar";
import SubNavbar from "./components/Navbar/SubNavbar";
import "./App.css";

import { sidebarLinks } from "./components/Sidebar/sidebarLinks";

/**
 * Tabstrip logic
 */

// Flatten the structure to get all tabs for content rendering
const getAllTabs = (groups) => {
  const tabs = [];
  groups.forEach((group) => {
    if (group.isGroup) {
      group.children.forEach((child) => {
        tabs.push({ id: child.id, label: child.label, content: child.content, navMeta: child.navMeta });
      });
    } else {
      tabs.push({ id: group.id, label: group.label, content: group.content, navMeta: group.navMeta });
    }
  });
  return tabs;
};

const tabList = getAllTabs(sidebarLinks);

const AppLayout = ({ sidebarOpen, setSidebarOpen }) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [openAccordion, setOpenAccordion] = useState(null);

  // Helper function to find which group contains the active tab
  const getActiveGroup = (activeTabId) => {
    for (const group of sidebarLinks) {
      if (group.isGroup && group.children.some(child => child.id === activeTabId)) {
        return group.id;
      }
    }
    return null;
  };

  // Helper function to get tab index for KeepAliveTabs
  const getTabIndex = (tabId) => {
    return tabList.findIndex(tab => tab.id === tabId);
  };

  // Get nav meta for current tab
  const currentTab = tabList.find(tab => tab.id === activeTab);
  const currentNavMeta = currentTab ? currentTab.navMeta : { title: "", breadcrumb: [] };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar
        groups={sidebarLinks}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openAccordion={openAccordion}
        setOpenAccordion={setOpenAccordion}
        getActiveGroup={getActiveGroup}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="main-content-with-navbar">
        <MainNavbar onSidebarOpen={() => setSidebarOpen(true)} />
        <SubNavbar navMeta={currentNavMeta} />
        <div className="main-content">
          <KeepAliveTabs
            tabs={tabList}
            activeTab={getTabIndex(activeTab)}
            setActiveTab={(index) => setActiveTab(tabList[index].id)}
          />
        </div>
      </div>
    </div>
  );
};


import PrivateRoute from "./routes/PrivateRoute";

const App = () => {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthProvider>
      <NavigationProvider>
        <Router>
          <Routes>
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<LoginPage />} />
            </Route>
            {/* Protected area under single route "/" wrapped by PrivateRoute */}
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<AppLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />} />
            </Route>
          </Routes>
        </Router>
      </NavigationProvider>
    </AuthProvider>
  )
};

export default App;
