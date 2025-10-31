import {
    chartPieIcon, folderIcon, calendarIcon, globeIcon, stickyNoteIcon,
    dollarIcon, moneyExchangeIcon, usersSolidIcon, clipboardTextIcon,
    userIcon
} from "@progress/kendo-svg-icons";

// ✅ Fixed import list
import ExcelUpload from "../../pages/ExcelUpload.jsx";
import Dashboard from "../../pages/Dashboard.jsx";
import ProjectsAll from "../../pages/project/ProjectsAll.jsx";
import ProjectsEnquiries from "../../pages/project/ProjectsEnquiries.jsx";
import ProjectsTypes from "../../pages/project/ProjectsTypes.jsx";
import NewProject from "../../pages/project/NewProject.jsx";
import AddProjectType from "../../pages/project/AddProjectType.jsx";
import SiteVisitAll from "../../pages/SiteVisitAll.jsx";
import SiteVisitNew from "../../pages/SiteVisit/SiteVisitNew.jsx";
import TieUpAll from "../../pages/TieUpCompany/TieUpAll.jsx";
import TieUpNew from "../../pages/TieUpCompany/TieUpNew.jsx";
import TieUpEdit from "../../pages/TieUpCompany/TieUpEdit.jsx";
import ManageVendors from "../../pages/Manage Vendor/ManageVendors.jsx";
import Quotations from "../../pages/Quotations.jsx";
import AllQuotations from "../../pages/AllQuotations.jsx";   // ✅ Added missing import
import ExpenseTracker from "../../pages/Expense Tracker/ExpenseTracker.jsx";
import Billing from "../../pages/Billing.jsx";
import EmployeesAll from "../../pages/EmployeesAll.jsx";
import EmployeesNew from "../../pages/ManageEmployees/EmployeesNew.jsx";
import EmployeesRoles from "../../pages/EmployeesRoles.jsx";
import AddNewRole from "../../pages/AddNewRole.jsx";
import AuditTrail from "../../pages/AuditTrail.jsx";
import MyAccount from "../../pages/MyAccount.jsx";
import ManageVendorsAll from "../../pages/Manage Vendor/ManageVendorsAll.jsx";

// Sidebar groups
export const sidebarLinks = [
    {
        id: "dashboard",
        label: "Dashboard",
        icon: chartPieIcon,
        navMeta: { title: "Dashboard", breadcrumb: ["Dashboard"] },
        content: Dashboard,
        isGroup: false
    },
    {
        id: "measurement-sheet",
        label: "Measurement Sheet",
        navMeta: { title: "Measurement Sheet", breadcrumb: ["Measurement Sheet"] },
        content: ExcelUpload,
        isGroup: false
    },
    {
        id: "projects",
        label: "Projects",
        icon: folderIcon,
        isGroup: true,
        children: [
            {
                id: "projects-all",
                label: "All Projects",
                navMeta: { title: "All Projects", breadcrumb: ["Projects", "All Projects"] },
                content: ProjectsAll,
            },
            {
                id: "projects-new",
                label: "New Project",
                navMeta: { title: "New Project", breadcrumb: ["Projects", "New Project"] },
                content: NewProject,
            },
            {
                id: "projects-enquiries",
                label: "Enquiries",
                navMeta: { title: "Enquiries", breadcrumb: ["Projects", "Enquiries"] },
                content: ProjectsEnquiries,
            },
            {
                id: "projects-types",
                label: "Project Types",
                navMeta: { title: "Project Types", breadcrumb: ["Projects", "Project Types"] },
                content: ProjectsTypes,
            }
        ]
    },
    {
        id: "site-visit",
        label: "Site Visit",
        icon: calendarIcon,
        isGroup: true,
        children: [
            {
                id: "site-visit-all",
                label: "All Site Visits",
                navMeta: { title: "All Site Visits", breadcrumb: ["Site Visit", "All Site Visits"] },
                content: SiteVisitAll,
            },
            {
                id: "site-visit-new",
                label: "New Site Visit",
                navMeta: { title: "New Site Visit", breadcrumb: ["Site Visit", "New Site Visit"] },
                content: SiteVisitNew,
            }
        ]
    },
    {
        id: "tie-up",
        label: "Tie Up Company",
        icon: globeIcon,
        navMeta: { title: "Tie Up Company", breadcrumb: ["Tie Up Company"] },
        content: TieUpAll,
        isGroup: false
    },
    {
        id: "quotations",
        label: "Quotations",
        icon: stickyNoteIcon,
        navMeta: { title: "Quotations", breadcrumb: ["Quotations"] },
        content: Quotations,
        isGroup: true,
        children: [
            {
                id: "all-quotations",
                label: "All Quotations",
                navMeta: { title: "All Quotations", breadcrumb: ["Quotations", "All Quotations"] },
                content: AllQuotations,   // ✅ fixed reference
            },
            {
                id: "new-quotation",
                label: "New Quotation",
                navMeta: { title: "New Quotation", breadcrumb: ["Quotations", "New Quotation"] },
                content: Quotations,
            }
        ]
    },
    {
        id: "expense-tracker",
        label: "Expense Tracker",
        icon: dollarIcon,
        navMeta: { title: "Expense Tracker", breadcrumb: ["Expense Tracker"] },
        content: ExpenseTracker,
        isGroup: false
    },
    {
        id: "billing",
        label: "Billing",
        icon: moneyExchangeIcon,
        navMeta: { title: "Billing", breadcrumb: ["Billing"] },
        content: Billing,
        isGroup: false
    },
    {
        id: "employees",
        label: "Manage Employees",
        icon: usersSolidIcon,
        isGroup: true,
        children: [
            {
                id: "employees-all",
                label: "All Employees",
                navMeta: { title: "All Employees", breadcrumb: ["Manage Employees", "All Employees"] },
                content: EmployeesAll,
            },
            {
                id: "employees-roles",
                label: "Employee Roles",
                navMeta: { title: "Employee Roles", breadcrumb: ["Manage Employees", "Employee Roles"] },
                content: EmployeesRoles,
            }
        ]
    },
    {
        id: "audit-trail",
        label: "Audit Trail",
        icon: clipboardTextIcon,
        navMeta: { title: "Audit Trail", breadcrumb: ["Audit Trail"] },
        content: AuditTrail,
        isGroup: false
    },
    {
        id: "manage-vendors",
        label: "Manage Vendors",
        icon: userIcon,
        navMeta: { title: "Manage Vendors", breadcrumb: ["Manage Vendors"] },
        content: ManageVendorsAll,
        isGroup: false
    }
];
