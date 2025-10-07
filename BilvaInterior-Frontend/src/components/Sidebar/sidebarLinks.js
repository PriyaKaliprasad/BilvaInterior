

import { chartPieIcon, folderIcon, calendarIcon, globeIcon, stickyNoteIcon, 
         dollarIcon, moneyExchangeIcon, usersSolidIcon, clipboardTextIcon, 
         userIcon } from "@progress/kendo-svg-icons";

// Import all page components
import Dashboard from '../../pages/Dashboard.jsx';
import ProjectsAll from '../../pages/ProjectsAll.jsx';
import ProjectsEnquiries from '../../pages/ProjectsEnquiries.jsx';
import ProjectsTypes from '../../pages/ProjectsTypes.jsx';
import NewProject from '../../pages/NewProject.jsx';
import SiteVisitAll from '../../pages/SiteVisitAll.jsx';
import SiteVisitNew from '../../pages/SiteVisit/SiteVisitNew.jsx';
import TieUpAll from '../../pages/TieUpCompany/TieUpAll.jsx';
import TieUpNew from '../../pages/TieUpCompany/TieUpNew.jsx';
import TieUpEdit from '../../pages/TieUpCompany/TieUpEdit.jsx';
import Quotations from '../../pages/Quotations.jsx';
import ExpenseTracker from '../../pages/ExpenseTracker.jsx';
import Billing from '../../pages/Billing.jsx';
import EmployeesAll from '../../pages/EmployeesAll.jsx';
import EmployeesNew from '../../pages/ManageEmployees/EmployeesNew.jsx';
import EmployeesRoles from '../../pages/EmployeesRoles.jsx';
import AddNewRole from '../../pages/AddNewRole.jsx';
import AuditTrail from '../../pages/AuditTrail.jsx';
import MyAccount from '../../pages/MyAccount.jsx';


// Sidebar groups with navMeta, icons, tab IDs, and page components
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
    isGroup: false,
    // children: [
    //   {
    //     id: "tie-up-all",
    //     label: "All Companies",
    //     navMeta: { title: "All Companies", breadcrumb: ["Tie Up Company", "All Companies"] },
    //     content: TieUpAll,
    //   },
    //   {
    //     id: "tie-up-new",
    //     label: "New Company",
    //     navMeta: { title: "New Company", breadcrumb: ["Tie Up Company", "New Company"] },
    //     content: TieUpNew,
    //   }
    // ]
  },
  {
    id: "quotations",
    label: "Quotations",
    icon: stickyNoteIcon,
    navMeta: { title: "Quotations", breadcrumb: ["Quotations"] },
    content: Quotations,
    isGroup: false
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
        id: "employees-new",
        label: "New Employee",
        navMeta: { title: "New Employee", breadcrumb: ["Manage Employees", "New Employee"] },
        content: EmployeesNew,
      },
      {
        id: "employees-roles",
        label: "Employee Roles",
        navMeta: { title: "Employee Roles", breadcrumb: ["Manage Employees", "Employee Roles"] },
        content: EmployeesRoles,
      },
      {
        id: "add-new-role",
        label: "Add New Role",
        navMeta: { title: "Add New Role", breadcrumb: ["Manage Employees", "Add New Role"] },
        content: AddNewRole,
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
  // {
  //   id: "my-account",
  //   label: "My Account",
  //   icon: userIcon,
  //   navMeta: { title: "My Account", breadcrumb: ["My Account"] },
  //   content: MyAccount,
  //   isGroup: false
  // }
];
