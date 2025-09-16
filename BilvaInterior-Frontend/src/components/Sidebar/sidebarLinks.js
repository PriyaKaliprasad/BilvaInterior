// sidebarData.js
import { chartPieIcon, folderIcon, calendarIcon, globeIcon, stickyNoteIcon, 
         dollarIcon, moneyExchangeIcon, usersSolidIcon, clipboardTextIcon, 
         userIcon } from "@progress/kendo-svg-icons";

export const sidebarLinks = [
  {
    title: "Dashboard",
    route: "/dashboard",
    icon: chartPieIcon
  },
  {
    title: "Projects",
    icon: folderIcon,
    children: [
      { title: "All Projects", route: "/projects/all" },
      { title: "All Enquiries", route: "/projects/enquiries" },
      { title: "Project Types", route: "/projects/types" },
      { title: "Add New Project Type", route: "/projects/types/new" },
    ]
  },
  {
    title: "Site Visit",
    icon: calendarIcon,
    children: [
      { title: "All Site Visits", route: "/site-visit/all" },
      { title: "New Site Visit", route: "/site-visit/new" }
    ]
  },
  {
    title: "Tie-up company",
    icon: globeIcon,
    children: [
      { title: "All Companies", route: "/tie-up-company/all" },
      { title: "New Company", route: "/tie-up-company/new" }
    ]
  },
  { title: "Quotations", route: "/quotations", icon: stickyNoteIcon },
  { title: "Expense Tracker", route: "/expense-tracker", icon: dollarIcon },
  { title: "Billing", route: "/billing", icon: moneyExchangeIcon },
  {
    title: "Manage Employees",
    icon: usersSolidIcon,
    children: [
      { title: "All Employees", route: "/manage-employees/all" },
      { title: "New Employee", route: "/manage-employees/new" },
      { title: "Manage Roles", route: "/manage-employees/roles" },
      { title: "Add New Roles", route: "/manage-employees/new-role" }
    ]
  },
  { title: "Audit Trail", route: "/audit-trail", icon: clipboardTextIcon },
];
