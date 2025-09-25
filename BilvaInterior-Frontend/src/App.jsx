// App.jsx
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import MainNavbar from "./components/Navbar/MainNavbar";
import SubNavbar from "./components/Navbar/SubNavbar";
import "./App.css";
import { NavigationProvider } from "./context/NavigationContext";
import { AuthProvider } from "./context/AuthContext";

import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";

import Dashboard from "./pages/Dashboard";
import ProjectsAll from "./pages/ProjectsAll";
import ProjectsEnquiries from "./pages/ProjectsEnquiries";
import ProjectsTypes from "./pages/ProjectsTypes";
import AddProjectType from "./pages/AddProjectType";
import SiteVisitAll from "./pages/SiteVisitAll";
import SiteVisitNew from "./pages/SiteVisit/SiteVisitNew";
import TieUpAll from "./pages/TieUpCompany/TieUpAll";
import TieUpNew from "./pages/TieUpCompany/TieUpNew";
import Quotations from "./pages/Quotations";
import ExpenseTracker from "./pages/ExpenseTracker";
import Billing from "./pages/Billing";
import EmployeesAll from "./pages/EmployeesAll";
import EmployeesNew from "./pages/ManageEmployees/EmployeesNew";
import EmployeesRoles from "./pages/EmployeesRoles";
import AddNewRole from "./pages/AddNewRole";
import AuditTrail from "./pages/AuditTrail";
import MyAccount from "./pages/MyAccount";
import LoginPage from "./pages/Login/LoginPage";

// Layout component for protected routes
const AppLayout = ({ sidebarOpen, setSidebarOpen }) => (
  <div style={{ display: "flex", minHeight: "100vh" }}>
    <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    {sidebarOpen && (
      <div
        className="sidebar-backdrop"
        onClick={() => setSidebarOpen(false)}
        aria-label="Close sidebar"
      />
    )}
    <div className="main-content-with-navbar">
      <MainNavbar onSidebarOpen={setSidebarOpen} />
      <SubNavbar />
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  </div>
);

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthProvider>
      <NavigationProvider>
        <Router>
          <Routes>
            {/* Public routes - redirect to dashboard if authenticated */}
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<LoginPage />} />
            </Route>

            {/* Protected routes - redirect to login if not authenticated */}
            <Route element={<PrivateRoute />}>
              <Route element={<AppLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/projects/all" element={<ProjectsAll />} />
                <Route path="/projects/enquiries" element={<ProjectsEnquiries />} />
                <Route path="/projects/types" element={<ProjectsTypes />} />
                <Route path="/projects/types/new" element={<AddProjectType />} />
                <Route path="/site-visit/all" element={<SiteVisitAll />} />
                <Route path="/site-visit/new" element={<SiteVisitNew />} />
                <Route path="/tie-up-company/all" element={<TieUpAll />} />
                <Route path="/tie-up-company/new" element={<TieUpNew />} />
                <Route path="/quotations" element={<Quotations />} />
                <Route path="/expense-tracker" element={<ExpenseTracker />} />
                <Route path="/billing" element={<Billing />} />
                <Route path="/manage-employees/all" element={<EmployeesAll />} />
                <Route path="/manage-employees/new" element={<EmployeesNew />} />
                <Route path="/manage-employees/roles" element={<EmployeesRoles />} />
                <Route path="/manage-employees/new-role" element={<AddNewRole />} />
                <Route path="/audit-trail" element={<AuditTrail />} />
                <Route path="/my-account" element={<MyAccount />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </NavigationProvider>
    </AuthProvider>
  );
};

export default App;
