// import React, { useState, useEffect } from "react";
// import { Grid, GridColumn } from "@progress/kendo-react-grid";
// import { Button } from "@progress/kendo-react-buttons";
// import { orderBy } from "@progress/kendo-data-query";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./EmployeeAll.css";

// /* -------------------------
//    Cell Renderers
//    ------------------------- */
// const FirstNameCell = (props) => (
//   <td>
//     <div className="cell-text" title={props.dataItem.firstName}>
//       {props.dataItem.firstName}
//     </div>
//   </td>
// );

// const LastNameCell = (props) => (
//   <td>
//     <div className="cell-text" title={props.dataItem.lastName}>
//       {props.dataItem.lastName}
//     </div>
//   </td>
// );

// const EmailCell = (props) => (
//   <td>
//     <div className="cell-text" title={props.dataItem.email}>
//       {props.dataItem.email}
//     </div>
//   </td>
// );

// const MobileCell = (props) => (
//   <td className="text-center">
//     <div className="cell-text" title={props.dataItem.mobile}>
//       {props.dataItem.mobile}
//     </div>
//   </td>
// );

// const RoleCell = (props) => (
//   <td>
//     <div className="cell-text" title={props.dataItem.role}>
//       {props.dataItem.role}
//     </div>
//   </td>
// );

// const StatusCell = (props) => {
//   const status = props.dataItem.status;
//   return (
//     <td className="text-center">
//       <span className={`status-badge ${status ? "active" : "inactive"}`}>
//         {status ? "Active" : "Inactive"}
//       </span>
//     </td>
//   );
// };

// const ActionCell = (props) => (
//   <td className="text-center">
//     <Button
//       size="small"
//       themeColor="primary"
//       onClick={() => props.onEdit(props.dataItem)}
//     >
//       Edit
//     </Button>
//   </td>
// );

// /* -------------------------
//    Main Component
//    ------------------------- */
// const EmployeeAll = () => {
//   const [employees, setEmployees] = useState([]);
//   const [skip, setSkip] = useState(0);
//   const [take, setTake] = useState(5);
//   const [sort, setSort] = useState([{ field: "firstName", dir: "asc" }]);
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const [saveMessage, setSaveMessage] = useState("");
//   const [isSuccess, setIsSuccess] = useState(false);

//   const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api/Employee`;

//   useEffect(() => {
//     fetch(API_BASE)
//       .then((res) => {
//         if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
//         return res.json();
//       })
//       .then((data) => setEmployees(Array.isArray(data) ? data : []))
//       .catch((err) => console.error("Error fetching employees:", err));
//   }, []);

//   const handlePageChange = (event) => {
//     setSkip(event.page.skip);
//     setTake(event.page.take);
//   };

//   const handleSortChange = (event) => {
//     setSort(event.sort);
//   };

//   const handleEdit = (employee) => {
//     setSelectedEmployee({ ...employee });
//     setSaveMessage("");
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setSelectedEmployee((prev) => ({
//       ...prev,
//       [name]: name === "status" ? value === "true" : value,
//     }));
//   };

//   const handleSave = () => {
//     if (!selectedEmployee || !selectedEmployee.id) return;

//     fetch(`${API_BASE}/${selectedEmployee.id}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(selectedEmployee),
//     })
//       .then((res) => {
//         if (!res.ok) throw new Error(`Failed (Status: ${res.status})`);
//         return res.json();
//       })
//       .then((data) => {
//         setEmployees((prev) =>
//           prev.map((emp) =>
//             emp.id === selectedEmployee.id ? selectedEmployee : emp
//           )
//         );
//         setIsSuccess(true);
//         setSaveMessage(
//           data?.message || "✅ Employee details saved successfully!"
//         );

//         setTimeout(() => {
//           setSaveMessage("");
//           setIsSuccess(false);
//         }, 5000);
//       })
//       .catch((err) => {
//         console.error("Error updating employee:", err);
//         setSaveMessage("❌ Failed to save employee details");
//         setIsSuccess(false);
//       });
//   };

//   const rowRender = (trElement, props) => {
//     const isEven = props.dataIndex % 2 === 1;
//     const style = { backgroundColor: isEven ? "#f6f6f6" : "#ffffff" };
//     return React.cloneElement(trElement, { style }, trElement.props.children);
//   };

//   return (
//     <div className="container-fluid mt-4 employee-all-wrapper">
//       {!selectedEmployee && (
//         <div className="card shadow-sm p-3">
//           <div className="table-responsive k-grid-wrap">
//             <Grid
//               data={orderBy(employees, sort).slice(skip, skip + take)}
//               pageable={true}
//               sortable={true}
//               skip={skip}
//               take={take}
//               total={employees.length}
//               onPageChange={handlePageChange}
//               sort={sort}
//               onSortChange={handleSortChange}
//               style={{ minWidth: "900px", border: "none" }}
//               rowRender={rowRender}
//             >
//               <GridColumn field="firstName" title="First Name" cell={FirstNameCell} width="150px" />
//               <GridColumn field="lastName" title="Last Name" cell={LastNameCell} width="120px" />
//               <GridColumn field="email" title="Email" cell={EmailCell} width="240px" />
//               <GridColumn field="mobile" title="Mobile" cell={MobileCell} width="140px" />
//               <GridColumn field="role" title="Role" cell={RoleCell} width="260px" />
//               <GridColumn field="status" title="Status" cell={StatusCell} width="120px" />
//               <GridColumn
//                 title="Actions"
//                 cell={(props) => <ActionCell {...props} onEdit={handleEdit} />}
//                 sortable={false}
//                 width="110px"
//               />
//             </Grid>
//           </div>
//         </div>
//       )}

//       {selectedEmployee && (
//         <div className="card shadow-sm p-4">
//           <h5 className="mb-3">Edit Employee</h5>

//           {saveMessage && (
//             <div
//               style={{
//                 marginBottom: "1rem",
//                 padding: "10px",
//                 borderRadius: "6px",
//                 textAlign: "center",
//                 fontWeight: "bold",
//                 color: isSuccess ? "#065f46" : "#b91c1c",
//                 backgroundColor: isSuccess ? "#d1fae5" : "#fee2e2",
//                 border: `1px solid ${isSuccess ? "#34d399" : "#f87171"}`,
//               }}
//             >
//               {saveMessage}
//             </div>
//           )}

//           {/* ✅ Side-by-side inputs using Bootstrap grid */}
//           <div className="row">
//             <div className="col-md-6 mb-3">
//               <label>First Name:</label>
//               <input
//                 type="text"
//                 name="firstName"
//                 value={selectedEmployee.firstName || ""}
//                 onChange={handleInputChange}
//                 className="form-control"
//               />
//             </div>

//             <div className="col-md-6 mb-3">
//               <label>Last Name:</label>
//               <input
//                 type="text"
//                 name="lastName"
//                 value={selectedEmployee.lastName || ""}
//                 onChange={handleInputChange}
//                 className="form-control"
//               />
//             </div>

//             <div className="col-md-6 mb-3">
//               <label>Mobile:</label>
//               <input
//                 type="tel"
//                 name="mobile"
//                 value={selectedEmployee.mobile || ""}
//                 onChange={handleInputChange}
//                 className="form-control"
//               />
//             </div>

//             <div className="col-md-6 mb-3">
//               <label>Role:</label>
//               <input
//                 type="text"
//                 name="role"
//                 value={selectedEmployee.role || ""}
//                 onChange={handleInputChange}
//                 className="form-control"
//               />
//             </div>

//             <div className="col-md-6 mb-3">
//               <label>Status:</label>
//               <select
//                 name="status"
//                 value={selectedEmployee.status ? "true" : "false"}
//                 onChange={handleInputChange}
//                 className="form-select"
//               >
//                 <option value="true">Active</option>
//                 <option value="false">Inactive</option>
//               </select>
//             </div>
//           </div>

//           {/* ✅ Buttons aligned to left */}
//           <div className="d-flex justify-content-start gap-2 mt-3">
//             <Button themeColor="primary" onClick={handleSave}>
//               Save
//             </Button>
//             <Button
//               themeColor="secondary"
//               onClick={() => setSelectedEmployee(null)}
//             >
//               Cancel
//             </Button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default EmployeeAll;


// import React, { useState, useEffect } from "react";
// import EmployeesNew from "./ManageEmployees/EmployeesNew";
// import { Grid, GridColumn } from "@progress/kendo-react-grid";
// import { Button } from "@progress/kendo-react-buttons";
// import { orderBy } from "@progress/kendo-data-query";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./EmployeeAll.css";

// /* -------------------------
//    Cell Renderers
//    ------------------------- */
// const FirstNameCell = (props) => (
//   <td>
//     <div className="cell-text" title={props.dataItem.firstName}>
//       {props.dataItem.firstName}
//     </div>
//   </td>
// );

// const LastNameCell = (props) => (
//   <td>
//     <div className="cell-text" title={props.dataItem.lastName}>
//       {props.dataItem.lastName}
//     </div>
//   </td>
// );

// const EmailCell = (props) => (
//   <td>
//     <div className="cell-text" title={props.dataItem.email}>
//       {props.dataItem.email}
//     </div>
//   </td>
// );

// const MobileCell = (props) => (
//   <td className="text-center">
//     <div className="cell-text" title={props.dataItem.mobile}>
//       {props.dataItem.mobile}
//     </div>
//   </td>
// );

// const RoleCell = (props) => (
//   <td>
//     <div className="cell-text" title={props.dataItem.role}>
//       {props.dataItem.role.name}
//     </div>
//   </td>
// );

// const StatusCell = (props) => {
//   const status = props.dataItem.status;
//   return (
//     <td className="text-center">
//       <span className={`status-badge ${status ? "active" : "inactive"}`}>
//         {status ? "Active" : "Inactive"}
//       </span>
//     </td>
//   );
// };

// const ActionCell = (props) => (
//   <td className="text-center">
//     <Button
//       size="small"
//       themeColor="primary"
//       onClick={() => props.onEdit(props.dataItem)}
//     >
//       Edit
//     </Button>
//   </td>
// );

// /* -------------------------
//    Main Component
//    ------------------------- */


// const EmployeeAll = () => {
//   const [employees, setEmployees] = useState([]);
//   const [roles, setRoles] = useState([]);
//   const [skip, setSkip] = useState(0);
//   const [take, setTake] = useState(5);
//   const [sort, setSort] = useState([{ field: "firstName", dir: "asc" }]);
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const [saveMessage, setSaveMessage] = useState("");
//   const [isSuccess, setIsSuccess] = useState(false);
//   const [showAdd, setShowAdd] = useState(false);
//   const [isMobile, setIsMobile] = useState(
//     typeof window !== 'undefined' ? window.innerWidth <= 600 : false
//   );

//   const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api/Employee`;
//   const ROLE_API = `${import.meta.env.VITE_API_BASE_URL}/api/Role`;

//   // Fetch employees and roles
//   const fetchEmployees = () => {
//     fetch(API_BASE)
//       .then((res) => {
//         if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
//         return res.json();
//       })
//       .then((data) => setEmployees(Array.isArray(data) ? data : []))
//       .catch((err) => console.error("Error fetching employees:", err));
//     fetch(ROLE_API)
//       .then((res) => {
//         if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
//         return res.json();
//       })
//       .then((data) => setRoles(Array.isArray(data) ? data : []))
//       .catch((err) => console.error("Error fetching roles:", err));
//   };

//   useEffect(() => {
//     fetchEmployees();
//   }, []);

//   useEffect(() => {
//     const onResize = () => setIsMobile(window.innerWidth <= 600);
//     window.addEventListener('resize', onResize);
//     return () => window.removeEventListener('resize', onResize);
//   }, []);

//   const handlePageChange = (event) => {
//     setSkip(event.page.skip);
//     setTake(event.page.take);
//   };

//   const handleSortChange = (event) => {
//     setSort(event.sort);
//   };

//   const handleEdit = (employee) => {
//     setSelectedEmployee({ ...employee });
//     setSaveMessage("");
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     if (name === "RoleId") {
//       setSelectedEmployee((prev) => ({
//         ...prev,
//         RoleId: value,
//         role: roles.find((r) => String(r.id) === String(value)) || prev.role
//       }));
//     } else {
//       setSelectedEmployee((prev) => ({
//         ...prev,
//         [name]: name === "status" ? value === "true" : value,
//       }));
//     }
//   };

//   const handleSave = () => {
//     if (!selectedEmployee || !selectedEmployee.id) return;
//     // Prepare data for backend, send RoleId
//     const payload = {
//       ...selectedEmployee,
//       RoleId: selectedEmployee.RoleId || (selectedEmployee.role?.id ?? "")
//     };
//     fetch(`${API_BASE}/${selectedEmployee.id}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     })
//       .then((res) => {
//         if (!res.ok) throw new Error(`Failed (Status: ${res.status})`);
//         return res.json();
//       })
//       .then((data) => {
//         setEmployees((prev) =>
//           prev.map((emp) =>
//             emp.id === selectedEmployee.id ? { ...emp, ...payload } : emp
//           )
//         );
//         setIsSuccess(true);
//         setSaveMessage(
//           data?.message || "✅ Employee details saved successfully!"
//         );

//         // ✅ Auto-hide success after 5s, keep error until next success
//         setTimeout(() => {
//           setSaveMessage("");
//           setIsSuccess(false);
//         }, 5000);
//       })
//       .catch((err) => {
//         console.error("Error updating employee:", err);
//         setSaveMessage("❌ Failed to save employee details");
//         setIsSuccess(false);
//       });
//   };

//   const rowRender = (trElement, props) => {
//     const isEven = props.dataIndex % 2 === 1;
//     const style = { backgroundColor: isEven ? "#f6f6f6" : "#ffffff" };
//     return React.cloneElement(trElement, { style }, trElement.props.children);
//   };

//   // Responsive action bar style
//   const actionBarStyle = {
//     position: 'sticky',
//     top: 0,
//     zIndex: 10,
//     background: '#fff',
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: '0.5rem 0.5rem 0.5rem 0.5rem',
//     borderBottom: '1px solid #eee',
//     minHeight: 48,
//     marginBottom: 10,
//   };
//   const actionBarBtnGroup = {
//     display: 'flex',
//     gap: '0.5rem',
//   };

//   // --- Main Render ---
//   if (showAdd) {
//     return (
//       <>
//         <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
//           <Button
//             icon="arrow-left"
//             size="small"
//             onClick={() => setShowAdd(false)}
//             className="action-btn back-btn"
//             style={{ marginRight: 8 }}
//           >
//             <span className="tieup-action-btn-text">Back</span>
//           </Button>
//         </div>
//         <EmployeesNew />
//       </>
//     );
//   }
//   if (selectedEmployee) {
//     return (
//       <>
//         <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
//           <Button
//             icon="arrow-left"
//             size="small"
//             onClick={() => setSelectedEmployee(null)}
//             className="action-btn back-btn"
//             style={{ marginRight: 8 }}
//           >
//             <span className="tieup-action-btn-text">Back</span>
//           </Button>
//         </div>
//         <div className="card shadow-sm p-4">
//           <h5 className="mb-3">Edit Employee</h5>

//           <div className="mb-2">
//             <label>First Name:</label>
//             <input
//               type="text"
//               name="firstName"
//               value={selectedEmployee.firstName || ""}
//               onChange={handleInputChange}
//               className="form-control"
//             />
//           </div>

//           <div className="mb-2">
//             <label>Last Name:</label>
//             <input
//               type="text"
//               name="lastName"
//               value={selectedEmployee.lastName || ""}
//               onChange={handleInputChange}
//               className="form-control"
//             />
//           </div>

//           <div className="mb-2">
//             <label>Mobile:</label>
//             <input
//               type="tel"
//               name="mobile"
//               value={selectedEmployee.mobile || ""}
//               onChange={handleInputChange}
//               className="form-control"
//             />
//           </div>

//           <div className="mb-2">
//             <label>Role:</label>
//             <select
//               name="RoleId"
//               value={selectedEmployee.RoleId || (selectedEmployee.role?.id ?? "")}
//               onChange={handleInputChange}
//               className="form-select"
//             >
//               <option value="">-- Select Role --</option>
//               {roles.map((role) => (
//                 <option key={role.id} value={role.id}>{role.name}</option>
//               ))}
//             </select>
//           </div>

//           <div className="mb-2">
//             <label>Status:</label>
//             <select
//               name="status"
//               value={selectedEmployee.status ? "true" : "false"}
//               onChange={handleInputChange}
//               className="form-select"
//             >
//               <option value="true">Active</option>
//               <option value="false">Inactive</option>
//             </select>
//           </div>

//           {/* ✅ Message below inputs, above buttons */}
//           {saveMessage && (
//             <div
//               style={{
//                 marginTop: "0.5rem",
//                 marginBottom: "1rem",
//                 padding: "10px",
//                 borderRadius: "6px",
//                 textAlign: "center",
//                 fontWeight: "bold",
//                 color: isSuccess ? "#065f46" : "#b91c1c",
//                 backgroundColor: isSuccess ? "#d1fae5" : "#fee2e2",
//                 border: `1px solid ${isSuccess ? "#34d399" : "#f87171"}`,
//               }}
//             >
//               {saveMessage}
//             </div>
//           )}

//           <div className="d-flex justify-content-end gap-2 mt-3">
//             <Button themeColor="primary" onClick={handleSave}>
//               Save
//             </Button>
//             <Button
//               themeColor="secondary"
//               onClick={() => setSelectedEmployee(null)}
//             >
//               Cancel
//             </Button>
//           </div>

//           {saveMessage && (
//             <div className="alert alert-success mt-3 text-center">
//               {saveMessage}
//             </div>
//           )}
//         </div>
//       </>
//     );
//   }

//   return (
//     <div className="container-fluid employee-all-wrapper">
//       {/* Action Bar: Always visible, sticky */}
//       <div style={actionBarStyle} className="employee-action-bar">
//         <div style={actionBarBtnGroup}>
//           <Button
//             icon="refresh"
//             size="small"
//             onClick={fetchEmployees}
//             className="action-btn refresh-btn"
//           >
//             <span className="tieup-action-btn-text">Refresh</span>
//           </Button>
//         </div>
//         <div style={actionBarBtnGroup}>
//           <Button
//             icon="plus"
//             size="small"
//             onClick={() => setShowAdd(true)}
//             themeColor="primary"
//             className="action-btn add-btn"
//           >
//             <span className="tieup-action-btn-text">Add</span>
//           </Button>
//         </div>
//       </div>

//       {/* Show Grid if no employee selected */}
//       <div className="card shadow-sm p-3">
//         <div className="table-responsive k-grid-wrap empl-scrollbar">
//           <Grid
//             data={orderBy(employees, sort).slice(skip, skip + take)}
//             pageable={true}
//             sortable={true}
//             skip={skip}
//             take={take}
//             total={employees.length}
//             onPageChange={handlePageChange}
//             sort={sort}
//             onSortChange={handleSortChange}
//             style={{ minWidth: "900px", border: "none" }}
//             rowRender={rowRender}
//           >
//             <GridColumn
//               field="firstName"
//               title="First Name"
//               cell={FirstNameCell}
//               width="150px"
//             />
//             <GridColumn
//               field="lastName"
//               title="Last Name"
//               cell={LastNameCell}
//               width="120px"
//             />
//             <GridColumn
//               field="email"
//               title="Email"
//               cell={EmailCell}
//               width="240px"
//             />
//             <GridColumn
//               field="mobile"
//               title="Mobile"
//               cell={MobileCell}
//               width="140px"
//             />
//             <GridColumn
//               field="role"
//               title="Role"
//               cell={RoleCell}
//               width="260px"
//             />
//             <GridColumn
//               field="status"
//               title="Status"
//               cell={StatusCell}
//               width="120px"
//             />
//             <GridColumn
//               title="Actions"
//               cell={(props) => <ActionCell {...props} onEdit={handleEdit} />}
//               sortable={false}
//               width="110px"
//             />
//           </Grid>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EmployeeAll;

import React, { useState, useEffect, useCallback } from "react";
import EmployeesNew from "./ManageEmployees/EmployeesNew";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { Button } from "@progress/kendo-react-buttons";
import { orderBy } from "@progress/kendo-data-query";
import "bootstrap/dist/css/bootstrap.min.css";
import "./EmployeeAll.css";

const NAME_REGEX = /^[A-Za-z\s'-]+$/;
const MOBILE_REGEX = /^[0-9]{10}$/;

// ----------------------------------------------------------
// Cell Renderers
// ----------------------------------------------------------
const FirstNameCell = (props) => (
  <td>
    <div className="cell-text" title={props.dataItem.firstName}>
      {props.dataItem.firstName}
    </div>
  </td>
);

const LastNameCell = (props) => (
  <td>
    <div className="cell-text" title={props.dataItem.lastName}>
      {props.dataItem.lastName}
    </div>
  </td>
);

const EmailCell = (props) => (
  <td>
    <div className="cell-text" title={props.dataItem.email}>
      {props.dataItem.email}
    </div>
  </td>
);

const MobileCell = (props) => (
  <td className="text-center">
    <div className="cell-text" title={props.dataItem.mobile}>
      {props.dataItem.mobile}
    </div>
  </td>
);

const RoleCell = (props) => (
  <td>
    <div className="cell-text" title={props.dataItem.role?.name}>
      {props.dataItem.role?.name}
    </div>
  </td>
);

const StatusCell = (props) => {
  const status = props.dataItem.status;
  return (
    <td className="text-center">
      <span className={`status-badge ${status ? "active" : "inactive"}`}>
        {status ? "Active" : "Inactive"}
      </span>
    </td>
  );
};

const ActionCell = (props) => (
  <td className="text-center">
    <Button
      size="small"
      themeColor="primary"
      onClick={() => props.onEdit(props.dataItem)}
    >
      Edit
    </Button>
  </td>
);

// ----------------------------------------------------------
// Main Component
// ----------------------------------------------------------
const EmployeeAll = () => {
  const [employees, setEmployees] = useState([]);
  const [roles, setRoles] = useState([]);
  const [skip, setSkip] = useState(0);
  const [take, setTake] = useState(5);
  const [sort, setSort] = useState([{ field: "firstName", dir: "asc" }]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [saveMessage, setSaveMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 600 : false
  );

  const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api/Employee`;
  const ROLE_API = `${import.meta.env.VITE_API_BASE_URL}/api/Role`;

  // Fetch employees and roles
  const fetchEmployees = useCallback(() => {
    fetch(API_BASE)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((data) => setEmployees(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error fetching employees:", err));

    fetch(ROLE_API)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((data) => setRoles(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error fetching roles:", err));
  }, [API_BASE, ROLE_API]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Responsive
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // History handling so browser BACK returns to list
  useEffect(() => {
    const onPop = () => {
      if (selectedEmployee) setSelectedEmployee(null);
      if (showAdd) setShowAdd(false);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [selectedEmployee, showAdd]);

  const pushStateForView = (type) => {
    try {
      window.history.pushState({ view: type, ts: Date.now() }, "");
    } catch { }
  };

  const handlePageChange = (event) => {
    setSkip(event.page.skip);
    setTake(event.page.take);
  };

  const handleSortChange = (event) => {
    setSort(event.sort);
  };

  const handleEdit = (employee) => {
    setSelectedEmployee({ ...employee });
    setSaveMessage("");
    pushStateForView("editEmployee");
  };

  // ✅ Input Change Handler with Validation + Auto-Capitalization
  const handleInputChange = (e) => {
    const { name, value: rawValue } = e.target;
    let value = rawValue;

    // ✅ Only for names
    if (name === "firstName" || name === "lastName") {
      // Remove all non-alphabet and non-space characters
      value = value.replace(/[^A-Za-z\s]/g, "");

      // ✅ Auto-capitalize only the FIRST letter, keep the rest as typed (no lowercase forcing)
      if (value.length > 0) {
        value = value.charAt(0).toUpperCase() + value.slice(1);
      }
    }

    // ✅ For mobile - allow only digits
    if (name === "mobile") {
      value = value.replace(/\D/g, "");
    }

    // ✅ For Role & Status (dropdowns)
    if (name === "RoleId") {
      setSelectedEmployee((prev) => ({
        ...prev,
        RoleId: value,
        role: roles.find((r) => String(r.id) === String(value)) || prev?.role,
      }));
      return;
    }

    if (name === "status") {
      setSelectedEmployee((prev) => ({
        ...prev,
        [name]: value === "true",
      }));
      return;
    }

    // ✅ Update other fields
    if (selectedEmployee) {
      setSelectedEmployee((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };



  const handleMobileKeyDown = (e) => {
    const allowed =
      e.key === "Backspace" ||
      e.key === "Tab" ||
      e.key === "ArrowLeft" ||
      e.key === "ArrowRight" ||
      e.key === "Delete" ||
      (e.ctrlKey || e.metaKey);
    if (allowed) return;
    if (!/\d/.test(e.key)) e.preventDefault();
  };

  // Save (Edit)
  const handleSave = async () => {
  const firstName = selectedEmployee?.firstName?.trim() || "";
  const lastName = selectedEmployee?.lastName?.trim() || "";
  const email = selectedEmployee?.email?.trim() || "";
  const mobile = selectedEmployee?.mobile?.trim() || "";

  const cleanFirst = firstName.replace(/[^A-Za-z\s]/g, "");
  const cleanLast = lastName.replace(/[^A-Za-z\s]/g, "");

  // ✅ Step 1: basic validations
  if (!cleanFirst || !NAME_REGEX.test(cleanFirst)) {
    setSaveMessage("❌ First name is invalid. Only alphabets allowed.");
    setIsSuccess(false);
    return;
  }
  if (!cleanLast || !NAME_REGEX.test(cleanLast)) {
    setSaveMessage("❌ Last name is invalid. Only alphabets allowed.");
    setIsSuccess(false);
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setSaveMessage("❌ Invalid email format.");
    setIsSuccess(false);
    return;
  }

  if (!MOBILE_REGEX.test(mobile)) {
    setSaveMessage("❌ Mobile number must be 10 digits.");
    setIsSuccess(false);
    return;
  }

  // ✅ Step 2: check if mobile number already exists (unique validation)
  const duplicate = employees.find(
    (emp) => emp.mobile === mobile && emp.id !== selectedEmployee.id
  );

  if (duplicate) {
    setSaveMessage("❌ This mobile number is already used by another employee.");
    setIsSuccess(false);
    return;
  }

  // ✅ Step 3: clean payload
  const payload = {
    ...selectedEmployee,
    firstName: cleanFirst.charAt(0).toUpperCase() + cleanFirst.slice(1).toLowerCase(),
    lastName: cleanLast.charAt(0).toUpperCase() + cleanLast.slice(1).toLowerCase(),
    email,
    mobile,
  };

  // ✅ Step 4: send to API
  try {
    const response = await fetch(`${API_BASE}/${selectedEmployee.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      setSaveMessage("✅ Employee saved successfully!");
      setIsSuccess(true);

      // ✅ Step 5: Wait a bit, then go back to list with refresh
      setTimeout(() => {
        fetchEmployees();              // refresh data
        setSelectedEmployee(null);     // go back to list
        try {
          window.history.replaceState({}, ""); // reset history
        } catch {}
      }, 1000); // 1 second delay to show success message briefly
    } else {
      setSaveMessage("❌ Error saving employee.");
      setIsSuccess(false);
    }
  } catch (error) {
    console.error(error);
    setSaveMessage("❌ Network error.");
    setIsSuccess(false);
  }
};




  const rowRender = (trElement, props) => {
    const isEven = props.dataIndex % 2 === 1;
    const style = { backgroundColor: isEven ? "#f6f6f6" : "#ffffff" };
    return React.cloneElement(trElement, { style }, trElement.props.children);
  };

  const actionBarStyle = {
    position: "sticky",
    top: 0,
    zIndex: 10,
    background: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.5rem",
    borderBottom: "1px solid #eee",
    minHeight: 48,
    marginBottom: 10,
  };

  const handleAfterAdd = () => {
    setShowAdd(false);
    fetchEmployees();
    try {
      window.history.replaceState({}, "");
    } catch { }
  };

  // --- Main Render ---
  if (showAdd) {
    return (
      <>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
          <Button
            icon="arrow-left"
            size="small"
            onClick={() => {
              setShowAdd(false);
              try {
                window.history.replaceState({}, "");
              } catch { }
            }}
            className="action-btn back-btn"
            style={{ marginRight: 8 }}
          >
            <span className="tieup-action-btn-text">Back</span>
          </Button>
        </div>
        <EmployeesNew onAdded={handleAfterAdd} />
      </>
    );
  }

  if (selectedEmployee) {
    return (
      <>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
          <Button
            icon="arrow-left"
            size="small"
            onClick={() => {
              setSelectedEmployee(null);
              try {
                window.history.replaceState({}, "");
              } catch { }
            }}
            className="action-btn back-btn"
            style={{ marginRight: 8 }}
          >
            <span className="tieup-action-btn-text">Back</span>
          </Button>
        </div>
        <div className="card shadow-sm p-4">
          <h5 className="mb-3">Edit Employee</h5>

          <div className="mb-2">
            <label>First Name:</label>
            <input
              type="text"
              name="firstName"
              value={selectedEmployee.firstName || ""}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>

          <div className="mb-2">
            <label>Last Name:</label>
            <input
              type="text"
              name="lastName"
              value={selectedEmployee.lastName || ""}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>

          <div className="mb-2">
            <label>Mobile:</label>
            <input
              type="tel"
              name="mobile"
              value={selectedEmployee.mobile || ""}
              onChange={handleInputChange}
              onKeyDown={handleMobileKeyDown}
              maxLength={10}
              className="form-control"
            />
          </div>

          <div className="mb-2">
            <label>Role:</label>
            <select
              name="RoleId"
              value={selectedEmployee.RoleId || (selectedEmployee.role?.id ?? "")}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="">-- Select Role --</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-2">
            <label>Status:</label>
            <select
              name="status"
              value={selectedEmployee.status ? "true" : "false"}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          {saveMessage && (
            <div
              style={{
                marginTop: "0.5rem",
                marginBottom: "1rem",
                padding: "10px",
                borderRadius: "6px",
                textAlign: "center",
                fontWeight: "bold",
                color: isSuccess ? "#065f46" : "#b91c1c",
                backgroundColor: isSuccess ? "#d1fae5" : "#fee2e2",
                border: `1px solid ${isSuccess ? "#34d399" : "#f87171"}`,
              }}
            >
              {saveMessage}
            </div>
          )}

          <div className="d-flex justify-content-start gap-2 mt-3">
            <Button themeColor="primary" onClick={handleSave}>
              Save
            </Button>
            <Button
              themeColor="secondary"
              onClick={() => {
                setSelectedEmployee(null);
                try {
                  window.history.replaceState({}, "");
                } catch { }
              }}
            >
              Cancel
            </Button>
          </div>

        </div>
      </>
    );
  }

  return (
    <div className="container-fluid employee-all-wrapper">
      <div style={actionBarStyle} className="employee-action-bar">
        <div>
          <Button
            icon="refresh"
            size="small"
            onClick={fetchEmployees}
            className="action-btn refresh-btn"
          >
            <span className="tieup-action-btn-text">Refresh</span>
          </Button>
        </div>
        <div>
          <Button
            icon="plus"
            size="small"
            onClick={() => {
              setShowAdd(true);
              setSaveMessage("");
              pushStateForView("addEmployee");
            }}
            themeColor="primary"
            className="action-btn add-btn"
          >
            <span className="tieup-action-btn-text">Add</span>
          </Button>
        </div>
      </div>

      <div className="card shadow-sm p-3">
        <div className="table-responsive k-grid-wrap empl-scrollbar">
          <Grid
            data={orderBy(employees, sort).slice(skip, skip + take)}
            pageable
            sortable
            skip={skip}
            take={take}
            total={employees.length}
            onPageChange={handlePageChange}
            sort={sort}
            onSortChange={handleSortChange}
            style={{ minWidth: "900px", border: "none" }}
            rowRender={rowRender}
          >
            <GridColumn field="firstName" title="First Name" cell={FirstNameCell} width="150px" />
            <GridColumn field="lastName" title="Last Name" cell={LastNameCell} width="120px" />
            <GridColumn field="email" title="Email" cell={EmailCell} width="240px" />
            <GridColumn field="mobile" title="Mobile" cell={MobileCell} width="140px" />
            <GridColumn field="role" title="Role" cell={RoleCell} width="260px" />
            <GridColumn field="status" title="Status" cell={StatusCell} width="120px" />
            <GridColumn
              title="Actions"
              cell={(props) => <ActionCell {...props} onEdit={handleEdit} />}
              sortable={false}
              width="110px"
            />
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default EmployeeAll;

