

// import React, { useState, useEffect } from 'react';
// import { DropDownList } from "@progress/kendo-react-dropdowns";
// import { Pager } from "@progress/kendo-react-data-tools";

// const WorkList = () => {
//     const [workItems, setWorkItems] = useState([]);
//     const [employees, setEmployees] = useState([]);
//     const [selectedEmployee, setSelectedEmployee] = useState(null);

//     // Pagination state (same as AllQuotations page)
//     const [page, setPage] = useState({
//         skip: 0,
//         take: 10
//     });

//     const handlePageChange = (event) => {
//         setPage(event.page);     // EXACT LIKE YOUR OTHER PAGE
//     };

//     const loadData = () => {
//         fetch(`${import.meta.env.VITE_API_BASE_URL}/api/WorkItem`)
//             .then(res => res.json())
//             .then(data => setWorkItems(data))
//             .catch(err => console.error(err));
//     };

//     useEffect(() => {
//         loadData();
//     }, []);

//     // Load employees
//     useEffect(() => {
//         fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Employee`)
//             .then(res => res.json())
//             .then(data => {
//                 setEmployees(
//                     data.map(emp => ({
//                         id: emp.id,
//                         name: emp.firstName
//                     }))
//                 );
//             })
//             .catch(() => setEmployees([]));
//     }, []);

//     // Filtering
//     const filteredItems = selectedEmployee
//         ? workItems.filter(item => item.assignedTo === selectedEmployee.name)
//         : workItems;

//     // Pagination applied HERE
//     const pagedData = filteredItems.slice(page.skip, page.skip + page.take);

//     const handleReply = (item) => {
//         alert(`Reply clicked for Ref / No: ${item.refNo}`);
//     };

//     const handleAddNew = () => {
//         alert("Navigate to Add Work Item page");
//     };

//     return (
//         <div className="container-fluid p-0 mt-4">

//             {/* ADD NEW BUTTON */}
//             <div className="d-flex justify-content-end mb-2">
//                 <button className="btn btn-primary btn-sm" onClick={handleAddNew}>
//                     + Add New Work Item
//                 </button>
//             </div>

//             {/* HEADER */}
//             <div className="d-flex justify-content-between align-items-center mb-2 bg-white p-3 border-bottom flex-wrap">

//                 <button
//                     className="btn btn-light border border-secondary btn-sm shadow-sm"
//                     onClick={loadData}
//                     title="Reload List"
//                 >
//                     Refresh
//                 </button>

//                 <div className="d-flex align-items-center gap-2">
//                     <label className="fw-bold mb-0">Filter by Person:</label>

//                     <DropDownList
//                         data={employees}
//                         textField="name"
//                         dataItemKey="id"
//                         value={selectedEmployee}
//                         onChange={(e) => setSelectedEmployee(e.value)}
//                         style={{ width: '350px', minWidth: '250px' }}
//                         defaultValue={null}
//                     />
//                 </div>
//             </div>

//             {/* TABLE */}
//             <div className="table-responsive bg-white">
//                 <table className="table table-hover align-middle mb-0">
//                     <thead className="table-light">
//                         <tr>
//                             <th className="py-3 ps-3">Serial No</th>
//                             <th className="py-3">Ref / No.</th>
//                             <th className="py-3" style={{ width: '40%' }}>Work Details</th>
//                             <th className="py-3">Person</th>
//                             <th className="py-3">Target Day</th>
//                             <th className="py-3">Status</th>
//                             <th className="py-3">Priority</th>
//                             <th className="py-3 text-center">Reply</th>
//                         </tr>
//                     </thead>

//                     <tbody>
//                         {pagedData.length > 0 ? pagedData.map((item, index) => (
//                             <tr key={item.id}>
//                                 <td className="ps-3 text-muted">{page.skip + index + 1}</td>
//                                 <td className="fw-medium">{item.refNo}</td>
//                                 <td className="text-secondary">{item.description}</td>
//                                 <td>
//                                     <span className="badge bg-primary text-white rounded-2 px-3 py-1">
//                                         {item.assignedTo}
//                                     </span>
//                                 </td>
//                                 <td className="text-secondary">{item.targetDay}</td>
//                                 <td>
//                                     <span className="badge text-dark rounded-2 px-3 py-1" style={{ backgroundColor: '#ffc107' }}>
//                                         {item.status}
//                                     </span>
//                                 </td>
//                                 <td>
//                                     <span className="badge bg-secondary text-white rounded-2 px-3 py-1">
//                                         {item.priority}
//                                     </span>
//                                 </td>
//                                 <td className="text-center">
//                                     <button className="btn btn-sm btn-primary" onClick={() => handleReply(item)}>
//                                         Reply
//                                     </button>
//                                 </td>
//                             </tr>
//                         )) : (
//                             <tr>
//                                 <td colSpan="9" className="text-center text-secondary py-3">
//                                     No work items added yet.
//                                 </td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>

//             {/* PAGINATION (SAME AS ALL QUOTATIONS PAGE) */}
//             <div className="mt-3 d-flex justify-content-start">
//                 <Pager
//                     skip={page.skip}
//                     take={page.take}
//                     total={filteredItems.length}
//                     buttonCount={5}
//                     info={true}
//                     type="numeric"
//                     previousNext={true}
//                     onPageChange={handlePageChange}
//                 />
//             </div>
//         </div>
//     );
// };

// export default WorkList;


// CombinedWork.jsx
// import React, { useState, useEffect } from 'react';
// import { DropDownList } from "@progress/kendo-react-dropdowns";
// import { Pager } from "@progress/kendo-react-data-tools";
// import { DatePicker } from "@progress/kendo-react-dateinputs";


// // ---------- Main Component ----------
// const CombinedWork = () => {
//   const [currentPage, setCurrentPage] = useState("worklist"); // worklist, add, reply
//   const [selectedWorkItem, setSelectedWorkItem] = useState(null);

//   return (
//     <div>
//       {currentPage === "worklist" && (
//         <WorkList
//           onAddNew={() => setCurrentPage("add")}
//           onReply={(item) => {
//             setSelectedWorkItem(item);
//             setCurrentPage("reply");
//           }}
//         />
//       )}

//       {currentPage === "add" && (
//         <WorkItemForm onBack={() => setCurrentPage("worklist")} />
//       )}

//       {currentPage === "reply" && (
//         <UpdateWork workItem={selectedWorkItem} onBack={() => setCurrentPage("worklist")} />
//       )}
//     </div>
//   );
// };

// // ---------- Work List Page ----------
// const WorkList = ({ onAddNew, onReply }) => {
//   const [workItems, setWorkItems] = useState([]);
//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const [page, setPage] = useState({ skip: 0, take: 10 });

//   const handlePageChange = (event) => setPage(event.page);

//   const loadData = () => {
//     fetch(`${import.meta.env.VITE_API_BASE_URL}/api/WorkItem`)
//       .then(res => res.json())
//       .then(data => setWorkItems(data))
//       .catch(err => console.error(err));
//   };

//   useEffect(() => loadData(), []);

//   useEffect(() => {
//     fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Employee`)
//       .then(res => res.json())
//       .then(data => setEmployees(data.map(emp => ({ id: emp.id, name: emp.firstName }))))
//       .catch(() => setEmployees([]));
//   }, []);

//   const filteredItems = selectedEmployee
//     ? workItems.filter(item => item.assignedTo === selectedEmployee.name)
//     : workItems;

//   const pagedData = filteredItems.slice(page.skip, page.skip + page.take);

//   return (
//     <div className="container-fluid p-0 mt-4">
//       <div className="d-flex justify-content-end mb-2">
//         <button className="btn btn-primary btn-sm" onClick={onAddNew}>
//           + Add New Work Item
//         </button>
//       </div>

//       <div className="d-flex justify-content-between align-items-center mb-2 bg-white p-3 border-bottom flex-wrap">
//         <button className="btn btn-light border border-secondary btn-sm shadow-sm" onClick={loadData} title="Reload List">
//           Refresh
//         </button>

//         <div className="d-flex align-items-center gap-2">
//           <label className="fw-bold mb-0">Filter by Person:</label>
//           <DropDownList
//             data={employees}
//             textField="name"
//             dataItemKey="id"
//             value={selectedEmployee}
//             onChange={(e) => setSelectedEmployee(e.value)}
//             style={{ width: '350px', minWidth: '250px' }}
//             defaultValue={null}
//           />
//         </div>
//       </div>

//       <div className="table-responsive bg-white">
//         <table className="table table-hover align-middle mb-0">
//           <thead className="table-light">
//             <tr>
//               <th className="py-3 ps-3">Serial No</th>
//               <th className="py-3">Ref / No.</th>
//               <th className="py-3" style={{ width: '40%' }}>Work Details</th>
//               <th className="py-3">Person</th>
//               <th className="py-3">Target Day</th>
//               <th className="py-3">Status</th>
//               <th className="py-3">Priority</th>
//               <th className="py-3 text-center">Reply</th>
//             </tr>
//           </thead>
//           <tbody>
//             {pagedData.length > 0 ? pagedData.map((item, index) => (
//               <tr key={item.id}>
//                 <td className="ps-3 text-muted">{page.skip + index + 1}</td>
//                 <td className="fw-medium">{item.refNo}</td>
//                 <td className="text-secondary">{item.description}</td>
//                 <td>
//                   <span className="badge bg-primary text-white rounded-2 px-3 py-1">{item.assignedTo}</span>
//                 </td>
//                 <td className="text-secondary">{item.targetDay}</td>
//                 <td>
//                   <span className="badge text-dark rounded-2 px-3 py-1" style={{ backgroundColor: '#ffc107' }}>{item.status}</span>
//                 </td>
//                 <td>
//                   <span className="badge bg-secondary text-white rounded-2 px-3 py-1">{item.priority}</span>
//                 </td>
//                 <td className="text-center">
//                   <button className="btn btn-sm btn-primary" onClick={() => onReply(item)}>Reply</button>
//                 </td>
//               </tr>
//             )) : (
//               <tr>
//                 <td colSpan="9" className="text-center text-secondary py-3">No work items added yet.</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       <div className="mt-3 d-flex justify-content-start">
//         <Pager
//           skip={page.skip}
//           take={page.take}
//           total={filteredItems.length}
//           buttonCount={5}
//           info={true}
//           type="numeric"
//           previousNext={true}
//           onPageChange={handlePageChange}
//         />
//       </div>
//     </div>
//   );
// };

// // ---------- Add New Work Item Page ----------
// const WorkItemForm = ({ onBack }) => {
//   const [formData, setFormData] = useState({
//     refNo: '',
//     description: '',
//     assignedTo: null,
//     targetDay: null,
//     status: '',
//     priority: ''
//   });
//   const [employees, setEmployees] = useState([]);
//   const [message, setMessage] = useState({ text: '', type: '' });

//   const statusOptions = [{ id: 'Pending', name: 'Pending' }, { id: 'In Progress', name: 'In Progress' }, { id: 'Completed', name: 'Completed' }];
//   const priorityOptions = [{ id: 'Low', name: 'Low' }, { id: 'Normal', name: 'Normal' }, { id: 'High', name: 'High' }];

//   useEffect(() => {
//     fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Employee`)
//       .then(res => res.json())
//       .then(data => setEmployees(data.map(emp => ({ id: emp.id, name: emp.firstName }))))
//       .catch(() => setEmployees([]));
//   }, []);

//   const handleInputChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });
//   const handleDropDownChange = (key) => (value) => setFormData({ ...formData, [key]: value });
//   const handleDateChange = (e) => setFormData({ ...formData, targetDay: e.value });

//   const handleSave = async (e) => {
//     e.preventDefault();
//     const payload = {
//       refNo: formData.refNo,
//       description: formData.description,
//       assignedTo: employees.find(e => e.id === formData.assignedTo)?.name || "",
//       targetDay: formData.targetDay ? formData.targetDay.toISOString().split("T")[0] : null,
//       status: formData.status,
//       priority: formData.priority
//     };
//     const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/WorkItem`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload)
//     });
//     setMessage({ text: res.ok ? "Work item saved successfully!" : "Failed to save!", type: res.ok ? "success" : "danger" });
//   };

//   return (
//     <div className="container-fluid p-4 bg-light">
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <button className="btn btn-light border px-4" onClick={onBack}>Back</button>
//         <span className="text-muted small">Assign work items to team members & keep track</span>
//       </div>

//       <div className="card shadow-sm">
//         <div className="card-body">
//           <form onSubmit={handleSave}>
//             <div className="row g-3">
//               <div className="col-12 col-md-2">
//                 <label htmlFor="refNo" className="form-label fw-bold mb-1">Ref / No.</label>
//                 <input type="text" className="form-control form-control-lg" id="refNo" value={formData.refNo} onChange={handleInputChange} />
//               </div>
//               <div className="col-12 col-md-5">
//                 <label htmlFor="description" className="form-label fw-bold mb-1">Work Description</label>
//                 <input type="text" className="form-control form-control-lg" id="description" value={formData.description} onChange={handleInputChange} />
//               </div>
//               <div className="col-12 col-md-3">
//                 <label htmlFor="assignedTo" className="form-label fw-bold mb-1">Assigned To</label>
//                 <DropDownList
//                   id="assignedTo"
//                   data={employees}
//                   textField="name"
//                   dataItemKey="id"
//                   defaultItem={{ id: null, name: "-- Select Employee --" }}
//                   value={employees.find(e => e.id === formData.assignedTo) || null}
//                   onChange={(e) => handleDropDownChange("assignedTo")(e.value ? e.value.id : null)}
//                   style={{ width: "100%" }}
//                 />
//               </div>
//               <div className="col-12 col-md-2">
//                 <label htmlFor="targetDay" className="form-label fw-bold mb-1">Target Day</label>
//                 <DatePicker id="targetDay" value={formData.targetDay} onChange={handleDateChange} />
//               </div>
//             </div>

//             <div className="row g-3 mt-2">
//               <div className="col-12 col-md-3">
//                 <label htmlFor="status" className="form-label fw-bold mb-1">Status</label>
//                 <DropDownList
//                   id="status"
//                   data={statusOptions}
//                   textField="name"
//                   dataItemKey="id"
//                   value={statusOptions.find(s => s.id === formData.status) || null}
//                   onChange={(e) => handleDropDownChange("status")(e.value ? e.value.id : null)}
//                 />
//               </div>
//               <div className="col-12 col-md-3">
//                 <label htmlFor="priority" className="form-label fw-bold mb-1">Priority</label>
//                 <DropDownList
//                   id="priority"
//                   data={priorityOptions}
//                   textField="name"
//                   dataItemKey="id"
//                   value={priorityOptions.find(p => p.id === formData.priority) || null}
//                   onChange={(e) => handleDropDownChange("priority")(e.value ? e.value.id : null)}
//                 />
//               </div>
//             </div>

//             <div className="row mt-4 pt-3 border-top">
//               <div className="col-12 d-flex flex-column flex-md-row justify-content-between gap-2">
//                 <div className="d-flex gap-2 flex-row">
//                   <button type="submit" className="btn btn-primary px-4 d-block d-md-inline-block w-100 w-md-auto">Save</button>
//                   <button type="button" className="btn btn-light border px-4 d-block d-md-inline-block w-100 w-md-auto">Cancel</button>
//                 </div>
//               </div>
//             </div>

//             {message.text && (
//               <div className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"} mt-3`} style={{ fontWeight: 600, borderRadius: "8px", padding: "10px 15px", textAlign: "center" }}>
//                 {message.text}
//               </div>
//             )}
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ---------- Reply Page ----------
// const UpdateWork = ({ workItem, onBack }) => {
//   const [status, setStatus] = useState("In Progress");
//   const statusOptions = ["In Progress", "Pending", "Completed"];

//   return (
//     <div className="container mt-4">
//       <button className="btn btn-light mb-3" onClick={onBack}>Back</button>

//       <div className="card shadow-sm p-3">
//         <h5 className="fw-bold mb-1">{workItem?.refNo || 'Work Item'} - Quote Work to Complete</h5>
//         <small className="text-muted">Assigned by Admin</small>
//         <hr />

//         <div className="mb-3">
//           <label className="form-label fw-semibold">Update Status</label>
//           <div style={{ width: "250px" }}>
//             <DropDownList
//               data={statusOptions}
//               value={status}
//               onChange={(e) => setStatus(e.value)}
//             />
//           </div>
//         </div>

//         <div className="mb-3">
//           <label className="form-label fw-semibold">Add Reply / Comments</label>
//           <textarea className="form-control" placeholder="Enter your update..." rows="3"></textarea>
//         </div>

//         <div className="mb-3">
//           <label className="form-label fw-semibold">Attach File (Optional)</label>
//           <input type="file" className="form-control" />
//         </div>

//         <div className="mb-3">
//           <button className="btn btn-primary w-auto px-4">Submit Update</button>
//         </div>

//         <hr />
//         <h6 className="fw-bold">Reply History</h6>
//         <div className="border rounded p-3 bg-light text-muted">
//           No updates yet.
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CombinedWork;

// import React, { useState, useEffect } from 'react';
// import { DropDownList } from "@progress/kendo-react-dropdowns";
// import { Pager } from "@progress/kendo-react-data-tools";
// import { DatePicker } from "@progress/kendo-react-dateinputs";

// const WorkList = () => {
//     const [workItems, setWorkItems] = useState([]);
//     const [employees, setEmployees] = useState([]);
//     const [selectedEmployee, setSelectedEmployee] = useState(null);
//     const [currentPage, setCurrentPage] = useState('list'); // 'list', 'form', 'reply'
//     const [selectedItem, setSelectedItem] = useState(null); // For reply page

//     const [formData, setFormData] = useState({
//         refNo: '',
//         description: '',
//         assignedTo: null,
//         targetDay: null,
//         status: '',
//         priority: ''
//     });

//     const [message, setMessage] = useState({ text: '', type: '' });

//     const statusOptions = [
//         { id: 'Pending', name: 'Pending' },
//         { id: 'In Progress', name: 'In Progress' },
//         { id: 'Completed', name: 'Completed' }
//     ];
//     const priorityOptions = [
//         { id: 'Low', name: 'Low' },
//         { id: 'Normal', name: 'Normal' },
//         { id: 'High', name: 'High' }
//     ];

//     // Pagination
//     const [page, setPage] = useState({ skip: 0, take: 10 });
//     const handlePageChange = (event) => setPage(event.page);

//     // Load data
//     const loadData = () => {
//         fetch(`${import.meta.env.VITE_API_BASE_URL}/api/WorkItem`)
//             .then(res => res.json())
//             .then(data => setWorkItems(data))
//             .catch(err => console.error(err));
//     };

//     useEffect(() => { loadData(); }, []);
//     useEffect(() => {
//         fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Employee`)
//             .then(res => res.json())
//             .then(data => setEmployees(data.map(emp => ({ id: emp.id, name: emp.firstName }))))
//             .catch(() => setEmployees([]));
//     }, []);

//     const filteredItems = selectedEmployee
//         ? workItems.filter(item => item.assignedTo === selectedEmployee.name)
//         : workItems;
//     const pagedData = filteredItems.slice(page.skip, page.skip + page.take);

//     // ---------------- Navigation Handlers ----------------
//     const handleAddNew = () => {
//         setFormData({ refNo: '', description: '', assignedTo: null, targetDay: null, status: '', priority: '' });
//         setMessage({ text: '', type: '' });
//         setCurrentPage('form');
//     };
//     const handleReply = (item) => {
//         setSelectedItem(item); // Save clicked item
//         setCurrentPage('reply');
//     };
//     const handleBackToList = () => {
//         setCurrentPage('list');
//         setSelectedItem(null);
//     };

//     // ---------------- Form Handlers ----------------
//     const handleInputChange = (e) => { const { id, value } = e.target; setFormData({ ...formData, [id]: value }); };
//     const handleDropDownChange = (key) => (value) => setFormData({ ...formData, [key]: value });
//     const handleDateChange = (e) => setFormData({ ...formData, targetDay: e.value });

//     const handleSave = async (e) => {
//         e.preventDefault();
//         const payload = {
//             refNo: formData.refNo,
//             description: formData.description,
//             assignedTo: employees.find(e => e.id === formData.assignedTo)?.name || "",
//             targetDay: formData.targetDay ? formData.targetDay.toISOString().split("T")[0] : null,
//             status: formData.status,
//             priority: formData.priority
//         };
//         const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/WorkItem`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(payload)
//         });
//         if (res.ok) {
//             setMessage({ text: "Work item saved successfully!", type: "success" });
//             loadData();
//         } else {
//             setMessage({ text: "Failed to save!", type: "danger" });
//         }
//     };

//     // ---------------- Reply Page Component ----------------
//     const ReplyPage = () => {
//         const [status, setStatus] = useState(selectedItem.status || "In Progress");
//         const [newReply, setNewReply] = useState("");
//         const [selectedFile, setSelectedFile] = useState(null);
//         const [replies, setReplies] = useState([]);

//         const statusOptions = ["In Progress", "Pending", "Completed"];
//         const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/WorkItemTaskReply`;

//         // Fetch replies for selected item
//         const fetchReplies = async () => {
//             try {
//                 const res = await fetch(`${API_URL}/GetReplies/${selectedItem.id}`);
//                 const data = await res.json();
//                 setReplies(data);
//             } catch (err) {
//                 console.error("Error loading replies:", err);
//             }
//         };

//         useEffect(() => {
//             fetchReplies();
//         }, []);

//         // Submit reply
//         const handleSubmit = async () => {
//             if (!newReply.trim()) return;

//             const formData = new FormData();
//             formData.append("TaskId", selectedItem.id);
//             formData.append("Status", status);
//             formData.append("Comment", newReply);

//             if (selectedFile) {
//                 formData.append("File", selectedFile);
//             }

//             try {
//                 const res = await fetch(`${API_URL}/AddReply`, {
//                     method: "POST",
//                     body: formData,
//                 });

//                 if (res.ok) {
//                     alert("Reply submitted successfully!");
//                     setNewReply("");
//                     setSelectedFile(null);
//                     fetchReplies(); // reload replies
//                 } else {
//                     alert("Error submitting reply.");
//                 }
//             } catch (err) {
//                 console.error("Submit error:", err);
//                 alert("Something went wrong.");
//             }
//         };

//         return (
//             <div className="container mt-4">
//                 <button className="btn btn-light border px-4 mb-3" onClick={handleBackToList}>Back</button>
//                 <div className="card shadow-sm p-3">
//                     <h5 className="fw-bold mb-1">{selectedItem.refNo} - {selectedItem.description}</h5>
//                     <small className="text-muted">Assigned by Admin</small>
//                     <hr />

//                     {/* Status Update */}
//                     <div className="mb-3">
//                         <label className="form-label fw-semibold">Update Status</label>
//                         <div style={{ width: "250px" }}>
//                             <DropDownList
//                                 data={statusOptions}
//                                 value={status}
//                                 onChange={(e) => setStatus(e.value)}
//                             />
//                         </div>
//                     </div>

//                     {/* Add Reply */}
//                     <div className="mb-3">
//                         <label className="form-label fw-semibold">Add Reply / Comments</label>
//                         <textarea
//                             className="form-control"
//                             placeholder="Enter your update..."
//                             rows="3"
//                             value={newReply}
//                             onChange={(e) => setNewReply(e.target.value)}
//                         ></textarea>
//                     </div>

//                     {/* File Upload */}
//                     <div className="mb-3">
//                         <label className="form-label fw-semibold">Attach File (Optional)</label>
//                         <input
//                             type="file"
//                             className="form-control"
//                             onChange={(e) => setSelectedFile(e.target.files[0])}
//                         />
//                     </div>

//                     <div className="mb-3">
//                         <button className="btn btn-primary w-auto px-4" onClick={handleSubmit}>
//                             Submit Update
//                         </button>
//                     </div>

//                     <hr />

//                     {/* Reply History */}
//                     <h6 className="fw-bold">Reply History</h6>
//                     <div className="mt-2">
//                         {replies.length === 0 ? (
//                             <div className="border rounded p-3 bg-white text-muted">
//                                 No updates yet.
//                             </div>
//                         ) : (
//                             replies.map((reply) => (
//                                 <div
//                                     key={reply.replyId}
//                                     className="p-2 mb-2 rounded bg-white text-dark border"
//                                 >
//                                     <div className="fw-bold">{reply.repliedBy || "Employee"}</div>
//                                     <div>{reply.comment}</div>
//                                     <small>{new Date(reply.createdAt).toLocaleString()}</small>
//                                     {reply.filePath && (
//                                         <div>
//                                             <a
//                                                 href={`${import.meta.env.VITE_API_BASE_URL}${reply.filePath}`}
//                                                 target="_blank"
//                                                 rel="noopener noreferrer"
//                                                 className="text-warning"
//                                             >
//                                                 View File
//                                             </a>
//                                         </div>
//                                     )}
//                                 </div>
//                             ))
//                         )}
//                     </div>
//                 </div>
//             </div>
//         );
//     };


//     // ---------------- Conditional Render ----------------
//     if (currentPage === 'form') {
//         // Form Page
//         return (
//             <div className="container-fluid p-4 bg-light">
//                 <div className="d-flex justify-content-between align-items-center mb-3">
//                     <button className="btn btn-light border px-4" onClick={handleBackToList}>Back</button>
//                     <span className="text-muted small">Assign work items to team members & keep track</span>
//                 </div>
//                 <div className="card shadow-sm">
//                     <div className="card-body">
//                         <form onSubmit={handleSave}>
//                             {/* Form fields */}
//                             <div className="row g-3">
//                                 <div className="col-12 col-md-2">
//                                     <label htmlFor="refNo" className="form-label fw-bold mb-1">Ref / No.</label>
//                                     <input type="text" className="form-control form-control-lg" id="refNo" value={formData.refNo} onChange={handleInputChange} />
//                                 </div>
//                                 <div className="col-12 col-md-5">
//                                     <label htmlFor="description" className="form-label fw-bold mb-1">Work Description</label>
//                                     <input type="text" className="form-control form-control-lg" id="description" value={formData.description} onChange={handleInputChange} />
//                                 </div>
//                                 <div className="col-12 col-md-3">
//                                     <label htmlFor="assignedTo" className="form-label fw-bold mb-1">Assigned To</label>
//                                     <DropDownList
//                                         id="assignedTo"
//                                         data={employees}
//                                         textField="name"
//                                         dataItemKey="id"
//                                         defaultItem={{ id: null, name: "-- Select Employee --" }}
//                                         value={employees.find(e => e.id === formData.assignedTo) || null}
//                                         onChange={(e) => handleDropDownChange("assignedTo")(e.value ? e.value.id : null)}
//                                         style={{ width: "100%" }}
//                                     />
//                                 </div>
//                                 <div className="col-12 col-md-2">
//                                     <label htmlFor="targetDay" className="form-label fw-bold mb-1">Target Day</label>
//                                     <DatePicker id="targetDay" value={formData.targetDay} onChange={handleDateChange} />
//                                 </div>
//                             </div>
//                             <div className="row g-3 mt-2">
//                                 <div className="col-12 col-md-3">
//                                     <label htmlFor="status" className="form-label fw-bold mb-1">Status</label>
//                                     <DropDownList id="status" data={statusOptions} textField="name" dataItemKey="id" value={statusOptions.find(s => s.id === formData.status) || null} onChange={(e) => handleDropDownChange("status")(e.value ? e.value.id : null)} />
//                                 </div>
//                                 <div className="col-12 col-md-3">
//                                     <label htmlFor="priority" className="form-label fw-bold mb-1">Priority</label>
//                                     <DropDownList id="priority" data={priorityOptions} textField="name" dataItemKey="id" value={priorityOptions.find(p => p.id === formData.priority) || null} onChange={(e) => handleDropDownChange("priority")(e.value ? e.value.id : null)} />
//                                 </div>
//                             </div>

//                             <div className="row mt-4 pt-3 border-top">
//                                 <div className="col-12 d-flex flex-column flex-md-row justify-content-between gap-2">
//                                     <div className="d-flex gap-2 flex-row">
//                                         <button type="submit" className="btn btn-primary px-4 w-100 w-md-auto">Save</button>
//                                         <button type="button" className="btn btn-light border px-4 w-100 w-md-auto" onClick={handleBackToList}>Cancel</button>
//                                     </div>
//                                 </div>
//                             </div>

//                             {message.text && (
//                                 <div className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"} mt-3`} style={{ fontWeight: 600, borderRadius: "8px", padding: "10px 15px", textAlign: "center" }}>
//                                     {message.text}
//                                 </div>
//                             )}
//                         </form>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     if (currentPage === 'reply') {
//         return <ReplyPage />;
//     }

//     // ---------------- List Page ----------------
//     return (
//         <div className="container-fluid p-0 mt-4">
//             <div className="d-flex justify-content-end mb-2">
//                 <button className="btn btn-primary btn-sm" onClick={handleAddNew}>+ Add New Work Item</button>
//             </div>

//             <div className="d-flex justify-content-between align-items-center mb-2 bg-white p-3 border-bottom flex-wrap">
//                 <button className="btn btn-light border border-secondary btn-sm shadow-sm" onClick={loadData} title="Reload List">Refresh</button>
//                 <div className="d-flex align-items-center gap-2">
//                     <label className="fw-bold mb-0">Filter by Person:</label>
//                     <DropDownList data={employees} textField="name" dataItemKey="id" value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.value)} style={{ width: '350px', minWidth: '250px' }} defaultValue={null} />
//                 </div>
//             </div>

//             <div className="table-responsive bg-white">
//                 <table className="table table-hover align-middle mb-0">
//                     <thead className="table-light">
//                         <tr>
//                             <th className="py-3 ps-3">Serial No</th>
//                             <th className="py-3">Ref / No.</th>
//                             <th className="py-3" style={{ width: '40%' }}>Work Details</th>
//                             <th className="py-3">Person</th>
//                             <th className="py-3">Target Day</th>
//                             <th className="py-3">Status</th>
//                             <th className="py-3">Priority</th>
//                             <th className="py-3 text-center">Reply</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {pagedData.length > 0 ? pagedData.map((item, index) => (
//                             <tr key={item.id}>
//                                 <td className="ps-3 text-muted">{page.skip + index + 1}</td>
//                                 <td className="fw-medium">{item.refNo}</td>
//                                 <td className="text-secondary">{item.description}</td>
//                                 <td><span className="badge bg-primary text-white rounded-2 px-3 py-1">{item.assignedTo}</span></td>
//                                 <td className="text-secondary">{item.targetDay}</td>
//                                 <td><span className="badge text-dark rounded-2 px-3 py-1" style={{ backgroundColor: '#ffc107' }}>{item.status}</span></td>
//                                 <td><span className="badge bg-secondary text-white rounded-2 px-3 py-1">{item.priority}</span></td>
//                                 <td className="text-center">
//                                     <button className="btn btn-sm btn-primary" onClick={() => handleReply(item)}>Reply</button>
//                                 </td>
//                             </tr>
//                         )) : (
//                             <tr>
//                                 <td colSpan="9" className="text-center text-secondary py-3">No work items added yet.</td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>

//             <div className="mt-3 d-flex justify-content-start">
//                 <Pager skip={page.skip} take={page.take} total={filteredItems.length} buttonCount={5} info={true} type="numeric" previousNext={true} onPageChange={handlePageChange} />
//             </div>
//         </div>
//     );
// };

// export default WorkList;

// import React, { useState, useEffect } from 'react';
// import { DropDownList } from "@progress/kendo-react-dropdowns";
// import { Pager } from "@progress/kendo-react-data-tools";
// import { DatePicker } from "@progress/kendo-react-dateinputs";
// // 👇 Import is named ReplyWorkItem
// import ReplyWorkItem from "./ReplyWorkItem"; 

// const WorkList = () => {
//     const [workItems, setWorkItems] = useState([]);
//     const [employees, setEmployees] = useState([]);
//     const [selectedEmployee, setSelectedEmployee] = useState(null);
//     const [currentPage, setCurrentPage] = useState('list'); 
//     const [selectedItem, setSelectedItem] = useState(null); 

//     const [formData, setFormData] = useState({
//         refNo: '',
//         description: '',
//         assignedTo: null,
//         targetDay: null,
//         status: '',
//         priority: ''
//     });

//     const [message, setMessage] = useState({ text: '', type: '' });

//     const statusOptions = [
//         { id: 'Pending', name: 'Pending' },
//         { id: 'In Progress', name: 'In Progress' },
//         { id: 'Completed', name: 'Completed' }
//     ];
//     const priorityOptions = [
//         { id: 'Low', name: 'Low' },
//         { id: 'Normal', name: 'Normal' },
//         { id: 'High', name: 'High' }
//     ];

//     // Pagination
//     const [page, setPage] = useState({ skip: 0, take: 10 });
//     const handlePageChange = (event) => setPage(event.page);

//     // Define user role
//     const userRole = localStorage.getItem("userRole") || "Admin"; 

//     // Load data
//     const loadData = () => {
//         fetch(`${import.meta.env.VITE_API_BASE_URL}/api/WorkItem`)
//             .then(res => res.json())
//             .then(data => setWorkItems(data))
//             .catch(err => console.error(err));
//     };

//     useEffect(() => { loadData(); }, []);
//     useEffect(() => {
//         fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Employee`)
//             .then(res => res.json())
//             .then(data => setEmployees(data.map(emp => ({ id: emp.id, name: emp.firstName }))))
//             .catch(() => setEmployees([]));
//     }, []);

//     const filteredItems = selectedEmployee
//         ? workItems.filter(item => item.assignedTo === selectedEmployee.name)
//         : workItems;
//     const pagedData = filteredItems.slice(page.skip, page.skip + page.take);

//     // ---------------- Navigation Handlers ----------------
//     const handleAddNew = () => {
//         setFormData({ refNo: '', description: '', assignedTo: null, targetDay: null, status: '', priority: '' });
//         setMessage({ text: '', type: '' });
//         setCurrentPage('form');
//     };
//     const handleReply = (item) => {
//         console.log("Selected Item Data:", item); // 👈 Add this!
//         setSelectedItem(item); 
//         setCurrentPage('reply');
//     };
//     const handleBackToList = () => {
//         setCurrentPage('list');
//         setSelectedItem(null);
//     };

//     // ---------------- Form Handlers ----------------
//     const handleInputChange = (e) => { const { id, value } = e.target; setFormData({ ...formData, [id]: value }); };
//     const handleDropDownChange = (key) => (value) => setFormData({ ...formData, [key]: value });
//     const handleDateChange = (e) => setFormData({ ...formData, targetDay: e.value });

//     const handleSave = async (e) => {
//         e.preventDefault();
//         const payload = {
//             refNo: formData.refNo,
//             description: formData.description,
//             assignedTo: employees.find(e => e.id === formData.assignedTo)?.name || "",
//             targetDay: formData.targetDay ? formData.targetDay.toISOString().split("T")[0] : null,
//             status: formData.status,
//             priority: formData.priority
//         };

//         const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/WorkItem`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(payload)
//         });

//         if (res.ok) {
//             // 1. Show Success Message
//             setMessage({ text: "Work item saved successfully! Redirecting in 5 seconds...", type: "success" });

//             // 2. Clear the form inputs immediately
//             setFormData({ 
//                 refNo: '', 
//                 description: '', 
//                 assignedTo: null, 
//                 targetDay: null, 
//                 status: '', 
//                 priority: '' 
//             });

//             // 3. Reload data in the background
//             loadData();

//             // 4. Wait 5 seconds, then go back to the list
//             setTimeout(() => {
//                 handleBackToList(); 
//                 setMessage({ text: '', type: '' }); // Clear the message
//             }, 5000);

//         } else {
//             setMessage({ text: "Failed to save!", type: "danger" });
//         }
//     };

//     // ---------------- Conditional Render ----------------

//     if (currentPage === 'reply' && selectedItem) {
//         return (
//             <div className="container mt-4">
//                 <button className="btn btn-light border px-4 mb-3" onClick={handleBackToList}>
//                     Back to List
//                 </button>

//                 {/* 👇 FIXED: Changed UpdateWork to ReplyWorkItem to match the import */}
//                 <ReplyWorkItem 
//                     taskId={selectedItem.id} 
//                     currentUserRole={userRole} 
//                     onBack={handleBackToList} // 👈 ADD THIS LINE (Pass the back function)
//                 />
//             </div>
//         );
//     }

//     if (currentPage === 'form') {
//         return (
//             <div className="container-fluid p-4 bg-light">
//                 <div className="d-flex justify-content-between align-items-center mb-3">
//                     <button className="btn btn-light border px-4" onClick={handleBackToList}>Back</button>
//                     <span className="text-muted small">Assign work items to team members & keep track</span>
//                 </div>
//                 <div className="card shadow-sm">
//                     <div className="card-body">
//                         <form onSubmit={handleSave}>
//                             <div className="row g-3">
//                                 <div className="col-12 col-md-2">
//                                     <label htmlFor="refNo" className="form-label fw-bold mb-1">Ref / No.</label>
//                                     <input type="text" className="form-control form-control-lg" id="refNo" value={formData.refNo} onChange={handleInputChange} />
//                                 </div>
//                                 <div className="col-12 col-md-5">
//                                     <label htmlFor="description" className="form-label fw-bold mb-1">Work Description</label>
//                                     <input type="text" className="form-control form-control-lg" id="description" value={formData.description} onChange={handleInputChange} />
//                                 </div>
//                                 <div className="col-12 col-md-3">
//                                     <label htmlFor="assignedTo" className="form-label fw-bold mb-1">Assigned To</label>
//                                     <DropDownList
//                                         id="assignedTo"
//                                         data={employees}
//                                         textField="name"
//                                         dataItemKey="id"
//                                         defaultItem={{ id: null, name: "-- Select Employee --" }}
//                                         value={employees.find(e => e.id === formData.assignedTo) || null}
//                                         onChange={(e) => handleDropDownChange("assignedTo")(e.value ? e.value.id : null)}
//                                         style={{ width: "100%" }}
//                                     />
//                                 </div>
//                                 <div className="col-12 col-md-2">
//                                     <label htmlFor="targetDay" className="form-label fw-bold mb-1">Target Day</label>
//                                     <DatePicker id="targetDay" value={formData.targetDay} onChange={handleDateChange} />
//                                 </div>
//                             </div>
//                             <div className="row g-3 mt-2">
//                                 <div className="col-12 col-md-3">
//                                     <label htmlFor="status" className="form-label fw-bold mb-1">Status</label>
//                                     <DropDownList id="status" data={statusOptions} textField="name" dataItemKey="id" value={statusOptions.find(s => s.id === formData.status) || null} onChange={(e) => handleDropDownChange("status")(e.value ? e.value.id : null)} />
//                                 </div>
//                                 <div className="col-12 col-md-3">
//                                     <label htmlFor="priority" className="form-label fw-bold mb-1">Priority</label>
//                                     <DropDownList id="priority" data={priorityOptions} textField="name" dataItemKey="id" value={priorityOptions.find(p => p.id === formData.priority) || null} onChange={(e) => handleDropDownChange("priority")(e.value ? e.value.id : null)} />
//                                 </div>
//                             </div>

//                             <div className="row mt-4 pt-3 border-top">
//                                 <div className="col-12 d-flex flex-column flex-md-row justify-content-between gap-2">
//                                     <div className="d-flex gap-2 flex-row">
//                                         <button type="submit" className="btn btn-primary px-4 w-100 w-md-auto">Save</button>
//                                         <button type="button" className="btn btn-light border px-4 w-100 w-md-auto" onClick={handleBackToList}>Cancel</button>
//                                     </div>
//                                 </div>
//                             </div>

//                             {message.text && (
//                                 <div className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"} mt-3`} style={{ fontWeight: 600, borderRadius: "8px", padding: "10px 15px", textAlign: "center" }}>
//                                     {message.text}
//                                 </div>
//                             )}
//                         </form>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     // ---------------- List Page ----------------
//     return (
//         <div className="container-fluid p-0 mt-4">
//             <div className="d-flex justify-content-end mb-2">
//                 <button className="btn btn-primary btn-sm" onClick={handleAddNew}>+ Add New Work Item</button>
//             </div>

//             <div className="d-flex justify-content-between align-items-center mb-2 bg-white p-3 border-bottom flex-wrap">
//                 <button className="btn btn-light border border-secondary btn-sm shadow-sm" onClick={loadData} title="Reload List">Refresh</button>
//                 <div className="d-flex align-items-center gap-2">
//                     <label className="fw-bold mb-0">Filter by Person:</label>
//                     <DropDownList data={employees} textField="name" dataItemKey="id" value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.value)} style={{ width: '350px', minWidth: '250px' }} defaultValue={null} />
//                 </div>
//             </div>

//             <div className="table-responsive bg-white">
//                 <table className="table table-hover align-middle mb-0">
//                     <thead className="table-light">
//                         <tr>
//                             <th className="py-3 ps-3">Serial No</th>
//                             <th className="py-3">Ref / No.</th>
//                             <th className="py-3" style={{ width: '40%' }}>Work Details</th>
//                             <th className="py-3">Person</th>
//                             <th className="py-3">Target Day</th>
//                             <th className="py-3">Status</th>
//                             <th className="py-3">Priority</th>
//                             <th className="py-3 text-center">Reply</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {pagedData.length > 0 ? pagedData.map((item, index) => (
//                             <tr key={item.taskId}> 
//                                 <td className="ps-3 text-muted">{page.skip + index + 1}</td>
//                                 <td className="fw-medium">{item.refNo}</td>
//                                 <td className="text-secondary">{item.description}</td>
//                                 <td><span className="badge bg-primary text-white rounded-2 px-3 py-1">{item.assignedTo}</span></td>
//                                 <td className="text-secondary">{item.targetDay}</td>
//                                 <td><span className="badge text-dark rounded-2 px-3 py-1" style={{ backgroundColor: '#ffc107' }}>{item.status}</span></td>
//                                 <td><span className="badge bg-secondary text-white rounded-2 px-3 py-1">{item.priority}</span></td>
//                                 <td className="text-center">
//                                     <button className="btn btn-sm btn-primary" onClick={() => handleReply(item)}>Reply</button>
//                                 </td>
//                             </tr>
//                         )) : (
//                             <tr>
//                                 <td colSpan="9" className="text-center text-secondary py-3">No work items added yet.</td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>

//             <div className="mt-3 d-flex justify-content-start">
//                 <Pager skip={page.skip} take={page.take} total={filteredItems.length} buttonCount={5} info={true} type="numeric" previousNext={true} onPageChange={handlePageChange} />
//             </div>
//         </div>
//     );
// };

// export default WorkList;

// import React, { useState, useEffect } from 'react';
// import { DropDownList } from "@progress/kendo-react-dropdowns";
// import { Pager } from "@progress/kendo-react-data-tools";
// import { DatePicker } from "@progress/kendo-react-dateinputs";
// // 👇 Import is named ReplyWorkItem
// import ReplyWorkItem from "./ReplyWorkItem"; 

// const WorkList = () => {
//     const [workItems, setWorkItems] = useState([]);
//     const [employees, setEmployees] = useState([]);
//     const [selectedEmployee, setSelectedEmployee] = useState(null);
//     const [currentPage, setCurrentPage] = useState('list'); 
//     const [selectedItem, setSelectedItem] = useState(null); 

//     const [formData, setFormData] = useState({
//         refNo: '',
//         description: '',
//         assignedTo: null,
//         targetDay: null,
//         status: '',
//         priority: ''
//     });

//     const [message, setMessage] = useState({ text: '', type: '' });

//     const statusOptions = [
//         { id: 'Pending', name: 'Pending' },
//         { id: 'In Progress', name: 'In Progress' },
//         { id: 'Completed', name: 'Completed' }
//     ];
//     const priorityOptions = [
//         { id: 'Low', name: 'Low' },
//         { id: 'Normal', name: 'Normal' },
//         { id: 'High', name: 'High' }
//     ];

//     // Pagination
//     const [page, setPage] = useState({ skip: 0, take: 10 });
//     const handlePageChange = (event) => setPage(event.page);

//     // Define user role
//     const userRole = localStorage.getItem("userRole") || "Admin"; 

//     // Load data
//     const loadData = () => {
//         fetch(`${import.meta.env.VITE_API_BASE_URL}/api/WorkItem`)
//             .then(res => res.json())
//             .then(data => setWorkItems(data))
//             .catch(err => console.error(err));
//     };

//     useEffect(() => { loadData(); }, []);
//     useEffect(() => {
//         fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Employee`)
//             .then(res => res.json())
//             .then(data => setEmployees(data.map(emp => ({ id: emp.id, name: emp.firstName }))))
//             .catch(() => setEmployees([]));
//     }, []);

//     const filteredItems = selectedEmployee
//         ? workItems.filter(item => item.assignedTo === selectedEmployee.name)
//         : workItems;
//     const pagedData = filteredItems.slice(page.skip, page.skip + page.take);

//     // ---------------- Navigation Handlers ----------------
//     const handleAddNew = () => {
//         setFormData({ refNo: '', description: '', assignedTo: null, targetDay: null, status: '', priority: '' });
//         setMessage({ text: '', type: '' });
//         setCurrentPage('form');
//     };
//     const handleReply = (item) => {
//         setSelectedItem(item); 
//         setCurrentPage('reply');
//     };
//     const handleBackToList = () => {
//         setCurrentPage('list');
//         setSelectedItem(null);
//     };

//     // ---------------- Form Handlers ----------------
//     const handleInputChange = (e) => { const { id, value } = e.target; setFormData({ ...formData, [id]: value }); };
//     const handleDropDownChange = (key) => (value) => setFormData({ ...formData, [key]: value });
//     const handleDateChange = (e) => setFormData({ ...formData, targetDay: e.value });

//     const handleSave = async (e) => {
//         e.preventDefault();
//         const payload = {
//             refNo: formData.refNo,
//             description: formData.description,
//             assignedTo: employees.find(e => e.id === formData.assignedTo)?.name || "",
//             targetDay: formData.targetDay ? formData.targetDay.toISOString().split("T")[0] : null,
//             status: formData.status,
//             priority: formData.priority
//         };
//         const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/WorkItem`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(payload)
//         });
//         if (res.ok) {
//             setMessage({ text: "Work item saved successfully!", type: "success" });

//             setFormData({ 
//                 refNo: '', 
//                 description: '', 
//                 assignedTo: null, 
//                 targetDay: null, 
//                 status: '', 
//                 priority: '' 
//             });

//             loadData();

//             setTimeout(() => {
//                 handleBackToList(); 
//                 setMessage({ text: '', type: '' });
//             }, 5000);

//         } else {
//             setMessage({ text: "Failed to save!", type: "danger" });
//         }
//     };

//     // ---------------- Conditional Render ----------------

//     if (currentPage === 'reply' && selectedItem) {
//         return (
//             <div className="container mt-4">
//                 <button className="btn btn-light border px-4 mb-3" onClick={handleBackToList}>
//                     Back to List
//                 </button>

//                 {/* 👇 CHANGE HERE: Added onUpdate={loadData} */}
//                 <ReplyWorkItem 
//                     taskId={selectedItem.id} 
//                     currentUserRole={userRole} 
//                     onBack={handleBackToList}
//                     onUpdate={loadData}
//                 />
//             </div>
//         );
//     }

//     if (currentPage === 'form') {
//         return (
//             <div className="container-fluid p-4 bg-light">
//                 <div className="d-flex justify-content-between align-items-center mb-3">
//                     <button className="btn btn-light border px-4" onClick={handleBackToList}>Back</button>
//                     <span className="text-muted small">Assign work items to team members & keep track</span>
//                 </div>
//                 <div className="card shadow-sm">
//                     <div className="card-body">
//                         <form onSubmit={handleSave}>
//                             <div className="row g-3">
//                                 <div className="col-12 col-md-2">
//                                     <label htmlFor="refNo" className="form-label fw-bold mb-1">Ref / No.</label>
//                                     <input type="text" className="form-control form-control-lg" id="refNo" value={formData.refNo} onChange={handleInputChange} />
//                                 </div>
//                                 <div className="col-12 col-md-5">
//                                     <label htmlFor="description" className="form-label fw-bold mb-1">Work Description</label>
//                                     <input type="text" className="form-control form-control-lg" id="description" value={formData.description} onChange={handleInputChange} />
//                                 </div>
//                                 <div className="col-12 col-md-3">
//                                     <label htmlFor="assignedTo" className="form-label fw-bold mb-1">Assigned To</label>
//                                     <DropDownList
//                                         id="assignedTo"
//                                         data={employees}
//                                         textField="name"
//                                         dataItemKey="id"
//                                         defaultItem={{ id: null, name: "-- Select Employee --" }}
//                                         value={employees.find(e => e.id === formData.assignedTo) || null}
//                                         onChange={(e) => handleDropDownChange("assignedTo")(e.value ? e.value.id : null)}
//                                         style={{ width: "100%" }}
//                                     />
//                                 </div>
//                                 <div className="col-12 col-md-2">
//                                     <label htmlFor="targetDay" className="form-label fw-bold mb-1">Target Day</label>
//                                     <DatePicker id="targetDay" value={formData.targetDay} onChange={handleDateChange} />
//                                 </div>
//                             </div>
//                             <div className="row g-3 mt-2">
//                                 <div className="col-12 col-md-3">
//                                     <label htmlFor="status" className="form-label fw-bold mb-1">Status</label>
//                                     <DropDownList id="status" data={statusOptions} textField="name" dataItemKey="id" value={statusOptions.find(s => s.id === formData.status) || null} onChange={(e) => handleDropDownChange("status")(e.value ? e.value.id : null)} />
//                                 </div>
//                                 <div className="col-12 col-md-3">
//                                     <label htmlFor="priority" className="form-label fw-bold mb-1">Priority</label>
//                                     <DropDownList id="priority" data={priorityOptions} textField="name" dataItemKey="id" value={priorityOptions.find(p => p.id === formData.priority) || null} onChange={(e) => handleDropDownChange("priority")(e.value ? e.value.id : null)} />
//                                 </div>
//                             </div>

//                             <div className="row mt-4 pt-3 border-top">
//                                 <div className="col-12 d-flex flex-column flex-md-row justify-content-between gap-2">
//                                     <div className="d-flex gap-2 flex-row">
//                                         <button type="submit" className="btn btn-primary px-4 w-100 w-md-auto">Save</button>
//                                         <button type="button" className="btn btn-light border px-4 w-100 w-md-auto" onClick={handleBackToList}>Cancel</button>
//                                     </div>
//                                 </div>
//                             </div>

//                             {message.text && (
//                                 <div className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"} mt-3`} style={{ fontWeight: 600, borderRadius: "8px", padding: "10px 15px", textAlign: "center" }}>
//                                     {message.text}
//                                 </div>
//                             )}
//                         </form>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     // ---------------- List Page ----------------
//     return (
//         <div className="container-fluid p-0 mt-4">
//             <div className="d-flex justify-content-end mb-2">
//                 <button className="btn btn-primary btn-sm" onClick={handleAddNew}>+ Add New Work Item</button>
//             </div>

//             <div className="d-flex justify-content-between align-items-center mb-2 bg-white p-3 border-bottom flex-wrap">
//                 <button className="btn btn-light border border-secondary btn-sm shadow-sm" onClick={loadData} title="Reload List">Refresh</button>
//                 <div className="d-flex align-items-center gap-2">
//                     <label className="fw-bold mb-0">Filter by Person:</label>
//                     <DropDownList data={employees} textField="name" dataItemKey="id" value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.value)} style={{ width: '350px', minWidth: '250px' }} defaultValue={null} />
//                 </div>
//             </div>

//             <div className="table-responsive bg-white">
//                 <table className="table table-hover align-middle mb-0">
//                     <thead className="table-light">
//                         <tr>
//                             <th className="py-3 ps-3">Serial No</th>
//                             <th className="py-3">Ref / No.</th>
//                             <th className="py-3" style={{ width: '40%' }}>Work Details</th>
//                             <th className="py-3">Person</th>
//                             <th className="py-3">Target Day</th>
//                             <th className="py-3">Status</th>
//                             <th className="py-3">Priority</th>
//                             <th className="py-3 text-center">Reply</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {pagedData.length > 0 ? pagedData.map((item, index) => (
//                             <tr key={item.taskId}> 
//                                 <td className="ps-3 text-muted">{page.skip + index + 1}</td>
//                                 <td className="fw-medium">{item.refNo}</td>
//                                 <td className="text-secondary">{item.description}</td>
//                                 <td><span className="badge bg-primary text-white rounded-2 px-3 py-1">{item.assignedTo}</span></td>
//                                 <td className="text-secondary">{item.targetDay}</td>
//                                 <td><span className="badge text-dark rounded-2 px-3 py-1" style={{ backgroundColor: '#ffc107' }}>{item.status}</span></td>
//                                 <td><span className="badge bg-secondary text-white rounded-2 px-3 py-1">{item.priority}</span></td>
//                                 <td className="text-center">
//                                     <button className="btn btn-sm btn-primary" onClick={() => handleReply(item)}>Reply</button>
//                                 </td>
//                             </tr>
//                         )) : (
//                             <tr>
//                                 <td colSpan="9" className="text-center text-secondary py-3">No work items added yet.</td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>

//             <div className="mt-3 d-flex justify-content-start">
//                 <Pager skip={page.skip} take={page.take} total={filteredItems.length} buttonCount={5} info={true} type="numeric" previousNext={true} onPageChange={handlePageChange} />
//             </div>
//         </div>
//     );
// };

// export default WorkList;

// import React, { useState, useEffect } from 'react';
// import { DropDownList } from "@progress/kendo-react-dropdowns";
// import { Pager } from "@progress/kendo-react-data-tools";
// import { DatePicker } from "@progress/kendo-react-dateinputs";
// import ReplyWorkItem from "./ReplyWorkItem";
// import { Button } from "@progress/kendo-react-buttons";

// const WorkList = () => {
//     const [workItems, setWorkItems] = useState([]);
//     const [employees, setEmployees] = useState([]);
//     const [selectedEmployee, setSelectedEmployee] = useState(null);
//     const [currentPage, setCurrentPage] = useState('list');
//     const [selectedItem, setSelectedItem] = useState(null);

//     const [formData, setFormData] = useState({
//         refNo: '',
//         description: '',
//         assignedTo: null,
//         targetDay: null,
//         status: '',
//         priority: ''
//     });

//     const [message, setMessage] = useState({ text: '', type: '' });

//     const statusOptions = [
//         { id: 'Pending', name: 'Pending' },
//         { id: 'In Progress', name: 'In Progress' },
//         { id: 'Completed', name: 'Completed' }
//     ];
//     const priorityOptions = [
//         { id: 'Low', name: 'Low' },
//         { id: 'Normal', name: 'Normal' },
//         { id: 'High', name: 'High' }
//     ];

//     // Pagination
//     const [page, setPage] = useState({ skip: 0, take: 10 });
//     const handlePageChange = (event) => setPage(event.page);

//     // Define user role
//     const userRole = localStorage.getItem("userRole") || "Admin";
//     //const userRole = "Employee";

//     // Load data
//     const loadData = () => {
//         fetch(`${import.meta.env.VITE_API_BASE_URL}/api/WorkItem`)
//             .then(res => res.json())
//             .then(data => setWorkItems(data))
//             .catch(err => console.error(err));
//     };

//     useEffect(() => { loadData(); }, []);
//     useEffect(() => {
//         fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Employee`)
//             .then(res => res.json())
//             .then(data => {
//                 const sorted = data
//                     .map(emp => ({ id: emp.id, name: emp.firstName }))
//                     .sort((a, b) => a.name.localeCompare(b.name));  // Sort alphabetically

//                 setEmployees(sorted);
//             })

//             .catch(() => setEmployees([]));
//     }, []);

//     const filteredItems = selectedEmployee
//         ? workItems.filter(item => item.assignedTo === selectedEmployee.name)
//         : workItems;
//     const pagedData = filteredItems.slice(page.skip, page.skip + page.take);

//     // ---------------- Navigation Handlers ----------------
//     const handleAddNew = () => {
//         setFormData({ refNo: '', description: '', assignedTo: null, targetDay: null, status: '', priority: '' });
//         setMessage({ text: '', type: '' });
//         setCurrentPage('form');
//     };
//     const handleReply = (item) => {
//         setSelectedItem(item);
//         setCurrentPage('reply');
//     };
//     const handleBackToList = () => {
//         setCurrentPage('list');
//         setSelectedItem(null);
//     };

//     // ---------------- Form Handlers ----------------
//     const handleInputChange = (e) => { const { id, value } = e.target; setFormData({ ...formData, [id]: value }); };
//     const handleDropDownChange = (key) => (value) => setFormData({ ...formData, [key]: value });
//     const handleDateChange = (e) => setFormData({ ...formData, targetDay: e.value });

//     const handleSave = async (e) => {
//         e.preventDefault();
//         const payload = {
//             refNo: formData.refNo,
//             description: formData.description,
//             assignedTo: employees.find(e => e.id === formData.assignedTo)?.name || "",
//             targetDay: formData.targetDay ? formData.targetDay.toISOString().split("T")[0] : null,
//             status: formData.status,
//             priority: formData.priority
//         };
//         const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/WorkItem`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(payload)
//         });
//         if (res.ok) {
//             setMessage({ text: "Work item saved successfully!", type: "success" });

//             setFormData({
//                 refNo: '',
//                 description: '',
//                 assignedTo: null,
//                 targetDay: null,
//                 status: '',
//                 priority: ''
//             });

//             loadData();

//             setTimeout(() => {
//                 handleBackToList();
//                 setMessage({ text: '', type: '' });
//             }, 5000);

//         } else {
//             setMessage({ text: "Failed to save!", type: "danger" });
//         }
//     };

//     // ---------------- Conditional Render ----------------

//     if (currentPage === 'reply' && selectedItem) {
//         return (
//             <div className="container mt-4">
//                 {/* <button className="btn btn-light border px-4 mb-3" onClick={handleBackToList}>
//                     Back 
//                 </button> */}
//                 <div className="mb-3">
//                     <Button
//                         icon="arrow-left"
//                         size="medium"
//                         onClick={handleBackToList}
//                         // className="action-btn back-btn" // Uncomment if you have these CSS classes
//                         themeColor={"light"} // Makes it look like btn-light
//                     >
//                         Back to List
//                     </Button>
//                 </div>


//                 <ReplyWorkItem
//                     taskId={selectedItem.id}
//                     currentUserRole={userRole}
//                     onBack={handleBackToList}
//                     onUpdate={loadData}
//                 />
//             </div>
//         );
//     }

//     if (currentPage === 'form') {
//         return (
//             <div className="container-fluid p-4 bg-light">
//                 <div className="d-flex justify-content-between align-items-center mb-3">
//                     <Button
//                         icon="arrow-left"
//                         themeColor="light"
//                         className="border px-4"
//                         onClick={handleBackToList}
//                     >
//                         Back
//                     </Button>
//                     <span className="text-muted small">Assign work items to team members & keep track</span>
//                 </div>
//                 <div className="card shadow-sm">
//                     <div className="card-body">
//                         <form onSubmit={handleSave}>
//                             <div className="row g-3">
//                                 <div className="col-12 col-md-2">
//                                     <label htmlFor="refNo" className="form-label fw-bold mb-1">Ref / No.</label>
//                                     <input type="text" className="form-control form-control-lg" id="refNo" value={formData.refNo} onChange={handleInputChange} />
//                                 </div>
//                                 <div className="col-12 col-md-5">
//                                     <label htmlFor="description" className="form-label fw-bold mb-1">Work Description</label>
//                                     <input type="text" className="form-control form-control-lg" id="description" value={formData.description} onChange={handleInputChange} />
//                                 </div>
//                                 <div className="col-12 col-md-3">
//                                     <label htmlFor="assignedTo" className="form-label fw-bold mb-1">Assigned To</label>
//                                     <DropDownList
//                                         id="assignedTo"
//                                         data={employees}
//                                         textField="name"
//                                         dataItemKey="id"
//                                         defaultItem={{ id: null, name: "-- Select Employee --" }}
//                                         value={employees.find(e => e.id === formData.assignedTo) || null}
//                                         onChange={(e) => handleDropDownChange("assignedTo")(e.value ? e.value.id : null)}
//                                         style={{ width: "100%" }}
//                                     />
//                                 </div>
//                                 <div className="col-12 col-md-2">
//                                     <label htmlFor="targetDay" className="form-label fw-bold mb-1">Target Day</label>
//                                     <DatePicker id="targetDay" value={formData.targetDay} onChange={handleDateChange} min={new Date()} />
//                                 </div>
//                             </div>
//                             <div className="row g-3 mt-2">
//                                 <div className="col-12 col-md-3">
//                                     <label htmlFor="status" className="form-label fw-bold mb-1">Status</label>
//                                     <DropDownList id="status" data={statusOptions} textField="name" dataItemKey="id" value={statusOptions.find(s => s.id === formData.status) || null} onChange={(e) => handleDropDownChange("status")(e.value ? e.value.id : null)} />
//                                 </div>
//                                 <div className="col-12 col-md-3">
//                                     <label htmlFor="priority" className="form-label fw-bold mb-1">Priority</label>
//                                     <DropDownList id="priority" data={priorityOptions} textField="name" dataItemKey="id" value={priorityOptions.find(p => p.id === formData.priority) || null} onChange={(e) => handleDropDownChange("priority")(e.value ? e.value.id : null)} />
//                                 </div>
//                             </div>

//                             <div className="row mt-4 pt-3 border-top">
//                                 <div className="col-12 d-flex flex-column flex-md-row justify-content-between gap-2">
//                                     <div className="d-flex gap-2 flex-row">
//                                         <button type="submit" className="btn btn-primary px-4 w-100 w-md-auto">Save</button>
//                                         <button type="button" className="btn btn-light border px-4 w-100 w-md-auto" onClick={handleBackToList}>Cancel</button>
//                                     </div>
//                                 </div>
//                             </div>

//                             {message.text && (
//                                 <div className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"} mt-3`} style={{ fontWeight: 600, borderRadius: "8px", padding: "10px 15px", textAlign: "center" }}>
//                                     {message.text}
//                                 </div>
//                             )}
//                         </form>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     const handleDelete = async (id) => {
//         if (!window.confirm("Are you sure you want to delete this item?")) return;

//         const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/WorkItem/${id}/softdelete`, {
//             method: "PUT"
//         });

//         if (res.ok) {
//             loadData();
//         } else {
//             alert("Failed to delete!");
//         }
//     };


//     // ---------------- List Page ----------------
//     return (
//         <div className="container-fluid p-0 mt-4">

//             {/* 👇 CHANGE 1: Only show "Add New" button if user is Admin */}
//             {userRole === "Admin" && (
//                 <div className="d-flex justify-content-end mb-2">
//                     <button className="btn btn-primary btn-sm" onClick={handleAddNew}>+ Add New Work Item</button>
//                 </div>
//             )}

//             <div className="d-flex justify-content-between align-items-center mb-2 bg-white p-3 border-bottom flex-wrap">
//                 <button className="btn btn-light border border-secondary btn-sm shadow-sm" onClick={loadData} title="Reload List">Refresh</button>

//                 {/* 👇 CHANGE 2: Only show Filter if user is Admin */}
//                 {userRole === "Admin" && (
//                     <div className="d-flex align-items-center gap-2">
//                         <label className="fw-bold mb-0">Filter by Person:</label>
//                         <DropDownList
//                             data={employees}
//                             textField="name"
//                             dataItemKey="id"
//                             value={selectedEmployee}
//                             onChange={(e) => setSelectedEmployee(e.value)}
//                             style={{ width: '350px', minWidth: '250px' }}
//                             defaultValue={null}
//                         />
//                     </div>
//                 )}
//             </div>

//             <div className="table-responsive bg-white">
//                 <table className="table table-hover align-middle mb-0">
//                     <thead className="table-light">
//                         <tr>
//                             <th className="py-3 ps-3">Serial No</th>
//                             <th className="py-3">Ref / No.</th>
//                             <th className="py-3" style={{ width: '40%' }}>Work Details</th>
//                             <th className="py-3">Person</th>
//                             <th className="py-3">Target Day</th>
//                             <th className="py-3">Status</th>
//                             <th className="py-3">Priority</th>
//                             <th className="py-3 text-center">Reply</th>
//                             {userRole === "Admin" && <th className="py-3 text-center">Actions</th>}

//                         </tr>
//                     </thead>
//                     <tbody>
//                         {pagedData.length > 0 ? pagedData.map((item, index) => (
//                             <tr key={item.taskId}>
//                                 <td className="ps-3 text-muted">{page.skip + index + 1}</td>
//                                 <td className="fw-medium">{item.refNo}</td>
//                                 <td className="text-secondary">{item.description}</td>
//                                 <td><span className="badge bg-primary text-white rounded-2 px-3 py-1">{item.assignedTo}</span></td>
//                                 <td className="text-secondary">{item.targetDay}</td>
//                                 <td><span className="badge text-dark rounded-2 px-3 py-1" style={{ backgroundColor: '#ffc107' }}>{item.status}</span></td>
//                                 <td><span className="badge bg-secondary text-white rounded-2 px-3 py-1">{item.priority}</span></td>
//                                 <td className="text-center">
//                                     <button className="btn btn-sm btn-primary" onClick={() => handleReply(item)}>Reply</button>
//                                 </td>

//                                 {userRole === "Admin" && (
//                                     <td className="text-center">
//                                         <button
//                                             className="btn btn-light border-danger text-danger btn-sm d-flex align-items-center justify-content-center"
//                                             style={{
//                                                 width: "34px",
//                                                 height: "34px",
//                                                 borderRadius: "6px",
//                                                 backgroundColor: "#ffffff",
//                                                 opacity: 1
//                                             }}
//                                             onClick={() => handleDelete(item.id)}
//                                         >
//                                             <span className="k-icon k-i-delete"></span>
//                                         </button>
//                                     </td>
//                                 )}


//                             </tr>
//                         )) : (
//                             <tr>
//                                 <td colSpan="9" className="text-center text-secondary py-3">No work items added yet.</td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>

//             <div className="mt-3 d-flex justify-content-start">
//                 <Pager skip={page.skip} take={page.take} total={filteredItems.length} buttonCount={5} info={true} type="numeric" previousNext={true} onPageChange={handlePageChange} />
//             </div>
//         </div>
//     );
// };

// export default WorkList;

// import React, { useState, useEffect } from 'react';
// import { DropDownList } from "@progress/kendo-react-dropdowns";
// import { Pager } from "@progress/kendo-react-data-tools";
// import { DatePicker } from "@progress/kendo-react-dateinputs";
// import ReplyWorkItem from "./ReplyWorkItem";
// import { Button } from "@progress/kendo-react-buttons";
// import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";

// const WorkList = () => {
//     const [workItems, setWorkItems] = useState([]);
//     const [employees, setEmployees] = useState([]);
//     const [selectedEmployee, setSelectedEmployee] = useState(null);
//     const [currentPage, setCurrentPage] = useState('list');
//     const [selectedItem, setSelectedItem] = useState(null);

//     const [confirmDeleteId, setConfirmDeleteId] = useState(null);

//     const [formData, setFormData] = useState({
//         refNo: '',
//         description: '',
//         assignedTo: null,
//         targetDay: null,
//         status: '',
//         priority: ''
//     });

//     const [message, setMessage] = useState({ text: '', type: '' });

//     const statusOptions = [
//         { id: 'Pending', name: 'Pending' },
//         { id: 'In Progress', name: 'In Progress' },
//         { id: 'Completed', name: 'Completed' }
//     ];

//     const priorityOptions = [
//         { id: 'Low', name: 'Low' },
//         { id: 'Normal', name: 'Normal' },
//         { id: 'High', name: 'High' }
//     ];

//     const [page, setPage] = useState({ skip: 0, take: 10 });
//     const handlePageChange = (event) => setPage(event.page);

//     const userRole = localStorage.getItem("userRole") || "Admin";

//     // LOAD WORK ITEMS
//     const loadData = () => {
//         fetch(`${import.meta.env.VITE_API_BASE_URL}/api/WorkItem`)
//             .then(res => res.json())
//             .then(data => {
//                 const sorted = data.sort((a, b) =>
//                     a.assignedTo.localeCompare(b.assignedTo)
//                 );
//                 setWorkItems(sorted);
//             })
//             .catch(err => console.error(err));
//     };

//     useEffect(() => { loadData(); }, []);

//     // LOAD EMPLOYEES
//     useEffect(() => {
//         fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Employee`)
//             .then(res => res.json())
//             .then(data => {
//                 const sorted = data
//                     .map(emp => ({ id: emp.id, name: emp.firstName }))
//                     .sort((a, b) => a.name.localeCompare(b.name));
//                 setEmployees(sorted);
//             })
//             .catch(() => setEmployees([]));
//     }, []);

//     const filteredItems = selectedEmployee
//         ? workItems.filter(item => item.assignedTo === selectedEmployee.name)
//         : workItems;

//     const pagedData = filteredItems.slice(page.skip, page.skip + page.take);

//     const handleAddNew = () => {
//         setFormData({ refNo: '', description: '', assignedTo: null, targetDay: null, status: '', priority: '' });
//         setMessage({ text: '', type: '' });
//         setCurrentPage('form');
//     };

//     const handleReply = (item) => {
//         setSelectedItem(item);
//         setCurrentPage('reply');
//     };

//     const handleBackToList = () => {
//         setCurrentPage('list');
//         setSelectedItem(null);
//     };

//     const handleInputChange = (e) => {
//         const { id, value } = e.target;
//         setFormData({ ...formData, [id]: value });
//     };

//     const handleDropDownChange = (key) => (value) =>
//         setFormData({ ...formData, [key]: value });

//     const handleDateChange = (e) =>
//         setFormData({ ...formData, targetDay: e.value });

//     const handleSave = async (e) => {
//         e.preventDefault();

//         const payload = {
//             refNo: formData.refNo,
//             description: formData.description,
//             assignedTo: employees.find(e => e.id === formData.assignedTo)?.name || "",
//             targetDay: formData.targetDay ? formData.targetDay.toISOString().split("T")[0] : null,
//             status: formData.status,
//             priority: formData.priority
//         };

//         const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/WorkItem`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(payload)
//         });

//         if (res.ok) {
//             setMessage({ text: "Work item saved successfully!", type: "success" });

//             setFormData({
//                 refNo: '',
//                 description: '',
//                 assignedTo: null,
//                 targetDay: null,
//                 status: '',
//                 priority: ''
//             });

//             loadData();

//             setTimeout(() => {
//                 handleBackToList();
//                 setMessage({ text: '', type: '' });
//             }, 5000);

//         } else {
//             setMessage({ text: "Failed to save!", type: "danger" });
//         }
//     };

//     // OPEN DELETE CONFIRMATION
//     const confirmDelete = (id) => {
//         setConfirmDeleteId(id);
//     };

//     // ACTUAL DELETE
//     const handleDeleteConfirmed = async () => {
//         const id = confirmDeleteId;
//         setConfirmDeleteId(null);

//         const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/WorkItem/${id}/softdelete`, {
//             method: "PUT"
//         });

//         if (res.ok) {
//             loadData();
//         } else {
//             alert("Failed to delete!");
//         }
//     };


//     // CANCEL DELETE
//     const handleCancelDelete = () => setConfirmDeleteId(null);


//     // -------------------- RENDERING -----------------------

//     if (currentPage === 'reply' && selectedItem) {
//         return (
//             <div className="container mt-4">
//                 <div className="mb-3">
//                     <Button
//                         icon="arrow-left"
//                         size="medium"
//                         onClick={handleBackToList}
//                         themeColor={"light"}
//                     >
//                         Back to List
//                     </Button>
//                 </div>

//                 <ReplyWorkItem
//                     taskId={selectedItem.id}
//                     currentUserRole={userRole}
//                     onBack={handleBackToList}
//                     onUpdate={loadData}
//                 />
//             </div>
//         );
//     }


//     if (currentPage === 'form') {
//         return (
//             <div className="container-fluid p-4 bg-light">
//                 <div className="d-flex justify-content-between align-items-center mb-3">
//                     <Button
//                         icon="arrow-left"
//                         themeColor="light"
//                         className="border px-4"
//                         onClick={handleBackToList}
//                     >
//                         Back
//                     </Button>
//                     <span className="text-muted small">Assign work items to team members & keep track</span>
//                 </div>

//                 <div className="card shadow-sm">
//                     <div className="card-body">
//                         <form onSubmit={handleSave}>
//                             <div className="row g-3">
//                                 <div className="col-12 col-md-2">
//                                     <label className="form-label fw-bold mb-1">Ref / No.</label>
//                                     <input type="text" className="form-control form-control-lg" id="refNo" value={formData.refNo} onChange={handleInputChange} />
//                                 </div>

//                                 <div className="col-12 col-md-5">
//                                     <label className="form-label fw-bold mb-1">Work Description</label>
//                                     <input type="text" className="form-control form-control-lg" id="description" value={formData.description} onChange={handleInputChange} />
//                                 </div>

//                                 <div className="col-12 col-md-3">
//                                     <label className="form-label fw-bold mb-1">Assigned To</label>
//                                     <DropDownList
//                                         id="assignedTo"
//                                         data={employees}
//                                         textField="name"
//                                         dataItemKey="id"
//                                         defaultItem={{ id: null, name: "-- Select Employee --" }}
//                                         value={employees.find(e => e.id === formData.assignedTo) || null}
//                                         onChange={(e) => handleDropDownChange("assignedTo")(e.value ? e.value.id : null)}
//                                     />
//                                 </div>

//                                 <div className="col-12 col-md-2">
//                                     <label className="form-label fw-bold mb-1">Target Day</label>
//                                     <DatePicker id="targetDay" value={formData.targetDay} onChange={handleDateChange} min={new Date()} />
//                                 </div>
//                             </div>

//                             <div className="row g-3 mt-2">
//                                 <div className="col-12 col-md-3">
//                                     <label className="form-label fw-bold mb-1">Status</label>
//                                     <DropDownList
//                                         id="status"
//                                         data={statusOptions}
//                                         textField="name"
//                                         dataItemKey="id"
//                                         value={statusOptions.find(s => s.id === formData.status) || null}
//                                         onChange={(e) => handleDropDownChange("status")(e.value ? e.value.id : null)}
//                                     />
//                                 </div>

//                                 <div className="col-12 col-md-3">
//                                     <label className="form-label fw-bold mb-1">Priority</label>
//                                     <DropDownList
//                                         id="priority"
//                                         data={priorityOptions}
//                                         textField="name"
//                                         dataItemKey="id"
//                                         value={priorityOptions.find(p => p.id === formData.priority) || null}
//                                         onChange={(e) => handleDropDownChange("priority")(e.value ? e.value.id : null)}
//                                     />
//                                 </div>
//                             </div>

//                             <div className="row mt-4 pt-3 border-top">
//                                 <div className="col-12 d-flex flex-column flex-md-row justify-content-between gap-2">
//                                     <div className="d-flex gap-2 flex-row">
//                                         <button type="submit" className="btn btn-primary px-4">Save</button>
//                                         <button type="button" className="btn btn-light border px-4" onClick={handleBackToList}>Cancel</button>
//                                     </div>
//                                 </div>
//                             </div>

//                             {message.text && (
//                                 <div className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"} mt-3`}>
//                                     {message.text}
//                                 </div>
//                             )}
//                         </form>
//                     </div>
//                 </div>
//             </div>
//         );
//     }


//     return (
//         <div className="container-fluid p-0 mt-4">

//             {confirmDeleteId && (
//                 <Dialog title="Confirm Delete" onClose={handleCancelDelete}>
//                     <p>Are you sure you want to delete this item?</p>

//                     <DialogActionsBar>
//                         <button className="k-button k-button-md k-rounded-md" onClick={handleCancelDelete}>
//                             Cancel
//                         </button>
//                         <button className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-danger"
//                             onClick={handleDeleteConfirmed}>
//                             Delete
//                         </button>
//                     </DialogActionsBar>
//                 </Dialog>
//             )}

//             {userRole === "Admin" && (
//                 <div className="d-flex justify-content-end mb-2">
//                     <button className="btn btn-primary btn-sm" onClick={handleAddNew}>+ Add New Work Item</button>
//                 </div>
//             )}

//             <div className="d-flex justify-content-between align-items-center mb-2 bg-white p-3 border-bottom flex-wrap">
//                 <button className="btn btn-light border border-secondary btn-sm shadow-sm" onClick={loadData} title="Reload List">Refresh</button>

//                 {userRole === "Admin" && (
//                     <div className="d-flex align-items-center gap-2">
//                         <label className="fw-bold mb-0">Filter by Person:</label>
//                         <DropDownList
//                             data={employees}
//                             textField="name"
//                             dataItemKey="id"
//                             value={selectedEmployee}
//                             onChange={(e) => setSelectedEmployee(e.value)}
//                             style={{ width: '350px', minWidth: '250px' }}
//                             defaultValue={null}
//                         />
//                     </div>
//                 )}
//             </div>

//             <div className="table-responsive bg-white">
//                 <table className="table table-hover align-middle mb-0">
//                     <thead className="table-light">
//                         <tr>
//                             <th className="py-3 ps-3">Serial No</th>
//                             <th className="py-3">Ref / No.</th>
//                             <th className="py-3" style={{ width: '40%' }}>Work Details</th>
//                             <th className="py-3">Person</th>
//                             <th className="py-3">Target Day</th>
//                             <th className="py-3">Status</th>
//                             <th className="py-3">Priority</th>
//                             <th className="py-3 text-center">Reply</th>
//                             {userRole === "Admin" && <th className="py-3 text-center">Actions</th>}
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {pagedData.length > 0 ? pagedData.map((item, index) => (
//                             <tr key={item.taskId}>
//                                 <td className="ps-3 text-muted">{page.skip + index + 1}</td>
//                                 <td className="fw-medium">{item.refNo}</td>
//                                 <td className="text-secondary">{item.description}</td>
//                                 <td><span className="badge bg-primary text-white rounded-2 px-3 py-1">{item.assignedTo}</span></td>
//                                 <td className="text-secondary">{item.targetDay}</td>
//                                 <td><span className="badge text-dark rounded-2 px-3 py-1" style={{ backgroundColor: '#ffc107' }}>{item.status}</span></td>
//                                 <td><span className="badge bg-secondary text-white rounded-2 px-3 py-1">{item.priority}</span></td>
//                                 <td className="text-center">
//                                     <button className="btn btn-sm btn-primary" onClick={() => handleReply(item)}>Reply</button>
//                                 </td>

//                                 {userRole === "Admin" && (
//                                     <td className="text-center">
//                                         <button
//                                             className="btn btn-light border-danger text-danger btn-sm d-flex align-items-center justify-content-center"
//                                             style={{
//                                                 width: "34px",
//                                                 height: "34px",
//                                                 borderRadius: "6px",
//                                                 backgroundColor: "#ffffff",
//                                                 opacity: 1
//                                             }}
//                                             onClick={() => confirmDelete(item.id)}
//                                         >
//                                             <span className="k-icon k-i-delete"></span>
//                                         </button>
//                                     </td>
//                                 )}

//                             </tr>
//                         )) : (
//                             <tr>
//                                 <td colSpan="9" className="text-center text-secondary py-3">No work items added yet.</td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>

//             <div className="mt-3 d-flex justify-content-start">
//                 <Pager
//                     skip={page.skip}
//                     take={page.take}
//                     total={filteredItems.length}
//                     buttonCount={5}
//                     info={true}
//                     type="numeric"
//                     previousNext={true}
//                     onPageChange={handlePageChange}
//                 />
//             </div>
//         </div>
//     );
// };

// export default WorkList;


// import React, { useState, useEffect } from 'react';
// import { DropDownList } from "@progress/kendo-react-dropdowns";
// import { Pager } from "@progress/kendo-react-data-tools";
// import { DatePicker } from "@progress/kendo-react-dateinputs";
// import ReplyWorkItem from "./ReplyWorkItem";
// import { Button } from "@progress/kendo-react-buttons";

// const WorkList = () => {
//     const [workItems, setWorkItems] = useState([]);
//     const [employees, setEmployees] = useState([]);
//     const [selectedEmployee, setSelectedEmployee] = useState(null);
//     const [currentPage, setCurrentPage] = useState('list');
//     const [selectedItem, setSelectedItem] = useState(null);

//     const [formData, setFormData] = useState({
//         refNo: '',
//         description: '',
//         assignedTo: null,
//         targetDay: null,
//         status: '',
//         priority: ''
//     });

//     const [message, setMessage] = useState({ text: '', type: '' });

//     const statusOptions = [
//         { id: 'Pending', name: 'Pending' },
//         { id: 'In Progress', name: 'In Progress' },
//         { id: 'Completed', name: 'Completed' }
//     ];
//     const priorityOptions = [
//         { id: 'Low', name: 'Low' },
//         { id: 'Normal', name: 'Normal' },
//         { id: 'High', name: 'High' }
//     ];

//     // Pagination
//     const [page, setPage] = useState({ skip: 0, take: 10 });
//     const handlePageChange = (event) => setPage(event.page);

//     // Define user role
//     const userRole = localStorage.getItem("userRole") || "Admin";

//     // Load data
//     const loadData = () => {
//         fetch(`${import.meta.env.VITE_API_BASE_URL}/api/WorkItem`)
//             .then(res => res.json())
//             .then(data => setWorkItems(data))
//             .catch(err => console.error(err));
//     };

//     useEffect(() => { loadData(); }, []);
//     useEffect(() => {
//         fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Employee`)
//             .then(res => res.json())
//             .then(data => {
//                 const sorted = data
//                     .map(emp => ({ id: emp.id, name: emp.firstName }))
//                     .sort((a, b) => a.name.localeCompare(b.name));
//                 setEmployees(sorted);
//             })
//             .catch(() => setEmployees([]));
//     }, []);

//     const filteredItems = selectedEmployee
//         ? workItems.filter(item => item.assignedTo === selectedEmployee.name)
//         : workItems;
//     const pagedData = filteredItems.slice(page.skip, page.skip + page.take);

//     // ---------------- Navigation Handlers ----------------
//     const handleAddNew = () => {
//         setFormData({ refNo: '', description: '', assignedTo: null, targetDay: null, status: '', priority: '' });
//         setMessage({ text: '', type: '' });
//         setCurrentPage('form');
//     };
//     const handleReply = (item) => {
//         setSelectedItem(item);
//         setCurrentPage('reply');
//     };
//     const handleBackToList = () => {
//         setCurrentPage('list');
//         setSelectedItem(null);
//     };

//     // ---------------- Form Handlers ----------------
//     const handleInputChange = (e) => { const { id, value } = e.target; setFormData({ ...formData, [id]: value }); };
//     const handleDropDownChange = (key) => (value) => setFormData({ ...formData, [key]: value });
//     const handleDateChange = (e) => setFormData({ ...formData, targetDay: e.value });

//     const handleSave = async (e) => {
//         e.preventDefault();
//         const payload = {
//             refNo: formData.refNo,
//             description: formData.description,
//             assignedTo: employees.find(e => e.id === formData.assignedTo)?.name || "",
//             targetDay: formData.targetDay ? formData.targetDay.toISOString().split("T")[0] : null,
//             status: formData.status,
//             priority: formData.priority
//         };
//         const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/WorkItem`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(payload)
//         });
//         if (res.ok) {
//             setMessage({ text: "Work item saved successfully!", type: "success" });
//             setFormData({
//                 refNo: '', description: '', assignedTo: null, targetDay: null, status: '', priority: ''
//             });
//             loadData();
//             setTimeout(() => {
//                 handleBackToList();
//                 setMessage({ text: '', type: '' });
//             }, 5000);
//         } else {
//             setMessage({ text: "Failed to save!", type: "danger" });
//         }
//     };

//     // ---------------- Conditional Render ----------------

//    if (currentPage === 'reply' && selectedItem) {
//         // 👇 Helper to find the ID, no matter what it is named
//         const realTaskId = selectedItem.taskId || selectedItem.TaskId || selectedItem.id || selectedItem.Id;

//         if (!realTaskId) {
//             console.error("❌ CRITICAL ERROR: Could not find a valid ID in selectedItem:", selectedItem);
//             alert("Error: Cannot reply because the Task ID is missing. Check console.");
//             return <button onClick={handleBackToList}>Back</button>;
//         }

//         return (
//             <div className="container mt-4">
//                 <div className="mb-3">
//                     <Button
//                         icon="arrow-left"
//                         size="medium"
//                         onClick={handleBackToList}
//                         themeColor={"light"}
//                     >
//                         Back to List
//                     </Button>
//                 </div>

//                 <ReplyWorkItem
//                     // 👇 Use the detected ID
//                     taskId={realTaskId} 
//                     currentUserRole={userRole}
//                     onBack={handleBackToList}
//                     onUpdate={loadData}
//                 />
//             </div>
//         );
//     }

//     if (currentPage === 'form') {
//         return (
//             <div className="container-fluid p-4 bg-light">
//                 <div className="d-flex justify-content-between align-items-center mb-3">
//                     <Button icon="arrow-left" themeColor="light" className="border px-4" onClick={handleBackToList}>Back</Button>
//                     <span className="text-muted small">Assign work items to team members & keep track</span>
//                 </div>
//                 <div className="card shadow-sm">
//                     <div className="card-body">
//                         <form onSubmit={handleSave}>
//                             {/* ... (Your form inputs remain exactly the same) ... */}
//                             {/* Shortened for brevity since no changes needed here */}
//                              <div className="row g-3">
//                                 <div className="col-12 col-md-2">
//                                     <label htmlFor="refNo" className="form-label fw-bold mb-1">Ref / No.</label>
//                                     <input type="text" className="form-control form-control-lg" id="refNo" value={formData.refNo} onChange={handleInputChange} />
//                                 </div>
//                                 <div className="col-12 col-md-5">
//                                     <label htmlFor="description" className="form-label fw-bold mb-1">Work Description</label>
//                                     <input type="text" className="form-control form-control-lg" id="description" value={formData.description} onChange={handleInputChange} />
//                                 </div>
//                                 <div className="col-12 col-md-3">
//                                     <label htmlFor="assignedTo" className="form-label fw-bold mb-1">Assigned To</label>
//                                     <DropDownList
//                                         id="assignedTo"
//                                         data={employees}
//                                         textField="name"
//                                         dataItemKey="id"
//                                         defaultItem={{ id: null, name: "-- Select Employee --" }}
//                                         value={employees.find(e => e.id === formData.assignedTo) || null}
//                                         onChange={(e) => handleDropDownChange("assignedTo")(e.value ? e.value.id : null)}
//                                         style={{ width: "100%" }}
//                                     />
//                                 </div>
//                                 <div className="col-12 col-md-2">
//                                     <label htmlFor="targetDay" className="form-label fw-bold mb-1">Target Day</label>
//                                     <DatePicker id="targetDay" value={formData.targetDay} onChange={handleDateChange} min={new Date()} />
//                                 </div>
//                             </div>
//                              <div className="row g-3 mt-2">
//                                 <div className="col-12 col-md-3">
//                                     <label htmlFor="status" className="form-label fw-bold mb-1">Status</label>
//                                     <DropDownList id="status" data={statusOptions} textField="name" dataItemKey="id" value={statusOptions.find(s => s.id === formData.status) || null} onChange={(e) => handleDropDownChange("status")(e.value ? e.value.id : null)} />
//                                 </div>
//                                 <div className="col-12 col-md-3">
//                                     <label htmlFor="priority" className="form-label fw-bold mb-1">Priority</label>
//                                     <DropDownList id="priority" data={priorityOptions} textField="name" dataItemKey="id" value={priorityOptions.find(p => p.id === formData.priority) || null} onChange={(e) => handleDropDownChange("priority")(e.value ? e.value.id : null)} />
//                                 </div>
//                             </div>

//                             <div className="row mt-4 pt-3 border-top">
//                                 <div className="col-12 d-flex flex-column flex-md-row justify-content-between gap-2">
//                                     <div className="d-flex gap-2 flex-row">
//                                         <button type="submit" className="btn btn-primary px-4 w-100 w-md-auto">Save</button>
//                                         <button type="button" className="btn btn-light border px-4 w-100 w-md-auto" onClick={handleBackToList}>Cancel</button>
//                                     </div>
//                                 </div>
//                             </div>
//                             {message.text && (
//                                 <div className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"} mt-3`} style={{ fontWeight: 600, borderRadius: "8px", padding: "10px 15px", textAlign: "center" }}>
//                                     {message.text}
//                                 </div>
//                             )}
//                         </form>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     const handleDelete = async (id) => {
//         if (!window.confirm("Are you sure you want to delete this item?")) return;
//         const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/WorkItem/${id}/softdelete`, {
//             method: "PUT"
//         });
//         if (res.ok) {
//             loadData();
//         } else {
//             alert("Failed to delete!");
//         }
//     };

//     // ---------------- List Page ----------------
//     return (
//         <div className="container-fluid p-0 mt-4">
//             {userRole === "Admin" && (
//                 <div className="d-flex justify-content-end mb-2">
//                     <button className="btn btn-primary btn-sm" onClick={handleAddNew}>+ Add New Work Item</button>
//                 </div>
//             )}

//             <div className="d-flex justify-content-between align-items-center mb-2 bg-white p-3 border-bottom flex-wrap">
//                 <button className="btn btn-light border border-secondary btn-sm shadow-sm" onClick={loadData} title="Reload List">Refresh</button>
//                 {userRole === "Admin" && (
//                     <div className="d-flex align-items-center gap-2">
//                         <label className="fw-bold mb-0">Filter by Person:</label>
//                         <DropDownList
//                             data={employees}
//                             textField="name"
//                             dataItemKey="id"
//                             value={selectedEmployee}
//                             onChange={(e) => setSelectedEmployee(e.value)}
//                             style={{ width: '350px', minWidth: '250px' }}
//                             defaultValue={null}
//                         />
//                     </div>
//                 )}
//             </div>

//             <div className="table-responsive bg-white">
//                 <table className="table table-hover align-middle mb-0">
//                     <thead className="table-light">
//                         <tr>
//                             <th className="py-3 ps-3">Serial No</th>
//                             <th className="py-3">Ref / No.</th>
//                             <th className="py-3" style={{ width: '40%' }}>Work Details</th>
//                             <th className="py-3">Person</th>
//                             <th className="py-3">Target Day</th>
//                             <th className="py-3">Status</th>
//                             <th className="py-3">Priority</th>
//                             <th className="py-3 text-center">Reply</th>
//                             {userRole === "Admin" && <th className="py-3 text-center">Actions</th>}
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {pagedData.length > 0 ? pagedData.map((item, index) => (
//                             <tr key={item.taskId}>
//                                 <td className="ps-3 text-muted">{page.skip + index + 1}</td>
//                                 <td className="fw-medium">{item.refNo}</td>
//                                 <td className="text-secondary">{item.description}</td>
//                                 <td><span className="badge bg-primary text-white rounded-2 px-3 py-1">{item.assignedTo}</span></td>
//                                 <td className="text-secondary">{item.targetDay}</td>
//                                 <td><span className="badge text-dark rounded-2 px-3 py-1" style={{ backgroundColor: '#ffc107' }}>{item.status}</span></td>
//                                 <td><span className="badge bg-secondary text-white rounded-2 px-3 py-1">{item.priority}</span></td>
//                                 <td className="text-center">
//                                     <button className="btn btn-sm btn-primary" onClick={() => handleReply(item)}>Reply</button>
//                                 </td>
//                                 {userRole === "Admin" && (
//                                     <td className="text-center">
//                                         <button
//                                             className="btn btn-light border-danger text-danger btn-sm d-flex align-items-center justify-content-center"
//                                             style={{ width: "34px", height: "34px", borderRadius: "6px", backgroundColor: "#ffffff" }}
//                                             onClick={() => handleDelete(item.taskId || item.id)} // Safer delete check
//                                         >
//                                             <span className="k-icon k-i-delete"></span>
//                                         </button>
//                                     </td>
//                                 )}
//                             </tr>
//                         )) : (
//                             <tr>
//                                 <td colSpan="9" className="text-center text-secondary py-3">No work items added yet.</td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>

//             <div className="mt-3 d-flex justify-content-start">
//                 <Pager skip={page.skip} take={page.take} total={filteredItems.length} buttonCount={5} info={true} type="numeric" previousNext={true} onPageChange={handlePageChange} />
//             </div>
//         </div>
//     );
// };

// export default WorkList;

// import React, { useState, useEffect } from 'react';
// import { DropDownList } from "@progress/kendo-react-dropdowns";
// import { Pager } from "@progress/kendo-react-data-tools";
// import { DatePicker } from "@progress/kendo-react-dateinputs";
// import ReplyWorkItem from "./ReplyWorkItem";
// import { Button } from "@progress/kendo-react-buttons";
// import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";

// const WorkList = () => {
//     const [workItems, setWorkItems] = useState([]);
//     const [employees, setEmployees] = useState([]);
//     const [selectedEmployee, setSelectedEmployee] = useState(null);
//     const [currentPage, setCurrentPage] = useState('list');
//     const [selectedItem, setSelectedItem] = useState(null);
//     const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

//     // Dialog State
//     const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
//     const [itemToDelete, setItemToDelete] = useState(null);

//     const [formData, setFormData] = useState({
//         refNo: '',
//         description: '',
//         assignedTo: null,
//         targetDay: null,
//         status: '',
//         priority: ''
//     });

//     const [message, setMessage] = useState({ text: '', type: '' });

//     const statusOptions = [
//         { id: 'Pending', name: 'Pending' },
//         { id: 'In Progress', name: 'In Progress' },
//         { id: 'Completed', name: 'Completed' }
//     ];
//     const priorityOptions = [
//         { id: 'Low', name: 'Low' },
//         { id: 'Normal', name: 'Normal' },
//         { id: 'High', name: 'High' }
//     ];

//     // Pagination
//     const [page, setPage] = useState({ skip: 0, take: 10 });
//     const handlePageChange = (event) => setPage(event.page);

//     // ---------------- User Role & Name Configuration ----------------
//     // Get the Role AND the logged-in User's Name from Local Storage
//     const userRole = localStorage.getItem("userRole") || "Admin";
//     //const userRole = "Employee";
//     const currentUserName = localStorage.getItem("userName") || ""; // MUST match the name in the database exactly

//     // const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

//     useEffect(() => {
//         const handleResize = () => setIsDesktop(window.innerWidth >= 768);
//         window.addEventListener("resize", handleResize);
//         return () => window.removeEventListener("resize", handleResize);
//     }, []);


//     // Load data
//     const loadData = () => {
//         fetch(`${import.meta.env.VITE_API_BASE_URL}/api/WorkItem`)
//             .then(res => res.json())
//             .then(data => setWorkItems(data))
//             .catch(err => console.error(err));
//     };

//     useEffect(() => { loadData(); }, []);

//     // Load Employees
//     useEffect(() => {
//         fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Employee`)
//             .then(res => res.json())
//             .then(data => {
//                 const sorted = data
//                     .map(emp => ({ id: emp.id, name: emp.firstName }))
//                     .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
//                 setEmployees(sorted);
//             })
//             .catch(() => setEmployees([]));
//     }, []);

//     // ---------------- Sorting & Filtering Logic ----------------

//     let processedItems = [...workItems];

//     // 1. FILTERING
//     if (userRole === "Employee") {
//         // If Employee: ONLY show items assigned to them
//         if (currentUserName) {
//             processedItems = processedItems.filter(item =>
//                 // Using toLowerCase() to avoid mismatch issues (e.g. "John" vs "john")
//                 (item.assignedTo || "").toLowerCase() === currentUserName.toLowerCase()
//             );
//         }
//     } else {
//         // If Admin: Apply the dropdown filter if selected
//         if (selectedEmployee) {
//             processedItems = processedItems.filter(item => item.assignedTo === selectedEmployee.name);
//         }
//     }

//     // 2. SORTING (Sort list by Person Name A-Z)
//     processedItems.sort((a, b) => {
//         const personA = a.assignedTo || "";
//         const personB = b.assignedTo || "";
//         return personA.toLowerCase().localeCompare(personB.toLowerCase());
//     });

//     // 3. PAGINATION
//     const pagedData = processedItems.slice(page.skip, page.skip + page.take);


//     // ---------------- Navigation Handlers ----------------
//     const handleAddNew = () => {
//         setFormData({ refNo: '', description: '', assignedTo: null, targetDay: null, status: '', priority: '' });
//         setMessage({ text: '', type: '' });
//         setCurrentPage('form');
//     };
//     const handleReply = (item) => {
//         setSelectedItem(item);
//         setCurrentPage('reply');
//     };
//     const handleBackToList = () => {
//         setCurrentPage('list');
//         setSelectedItem(null);
//     };

//     // ---------------- Form Handlers ----------------
//     const handleInputChange = (e) => { const { id, value } = e.target; setFormData({ ...formData, [id]: value }); };
//     const handleDropDownChange = (key) => (value) => setFormData({ ...formData, [key]: value });
//     const handleDateChange = (e) => setFormData({ ...formData, targetDay: e.value });

//     const handleSave = async (e) => {
//         e.preventDefault();
//         const payload = {
//             refNo: formData.refNo,
//             description: formData.description,
//             assignedTo: employees.find(e => e.id === formData.assignedTo)?.name || "",
//             targetDay: formData.targetDay ? formData.targetDay.toISOString().split("T")[0] : null,
//             status: formData.status,
//             priority: formData.priority
//         };
//         const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/WorkItem`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(payload)
//         });
//         if (res.ok) {
//             setMessage({ text: "Work item saved successfully!", type: "success" });
//             setFormData({
//                 refNo: '', description: '', assignedTo: null, targetDay: null, status: '', priority: ''
//             });
//             loadData();
//             setTimeout(() => {
//                 handleBackToList();
//                 setMessage({ text: '', type: '' });
//             }, 5000);
//         } else {
//             setMessage({ text: "Failed to save!", type: "danger" });
//         }
//     };

//     // ---------------- Delete Logic ----------------
//     const confirmDelete = (id) => {
//         setItemToDelete(id);
//         setDeleteDialogVisible(true);
//     };

//     const cancelDelete = () => {
//         setDeleteDialogVisible(false);
//         setItemToDelete(null);
//     };

//     const executeDelete = async () => {
//         if (!itemToDelete) return;
//         const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/WorkItem/${itemToDelete}/softdelete`, {
//             method: "PUT"
//         });
//         if (res.ok) {
//             loadData();
//             setDeleteDialogVisible(false);
//             setItemToDelete(null);
//         } else {
//             alert("Failed to delete!");
//             setDeleteDialogVisible(false);
//         }
//     };

//     // ---------------- Conditional Render ----------------

//     if (currentPage === 'reply' && selectedItem) {
//         const realTaskId = selectedItem.taskId || selectedItem.TaskId || selectedItem.id || selectedItem.Id;

//         if (!realTaskId) {
//             console.error("❌ CRITICAL ERROR: Could not find a valid ID in selectedItem:", selectedItem);
//             alert("Error: Cannot reply because the Task ID is missing. Check console.");
//             return <button onClick={handleBackToList}>Back</button>;
//         }

//         return (
//             <div className="container mt-4">
//                 <div className="mb-3">
//                     <Button icon="arrow-left" size="medium" onClick={handleBackToList} themeColor={"light"}>
//                         Back to List
//                     </Button>
//                 </div>
//                 <ReplyWorkItem
//                     taskId={realTaskId}
//                     currentUserRole={userRole}
//                     onBack={handleBackToList}
//                     onUpdate={loadData}
//                 />
//             </div>
//         );
//     }

//     if (currentPage === 'form') {
//         return (
//             <div className="container-fluid p-4 bg-light">
//                 <div className="d-flex justify-content-between align-items-center mb-3">
//                     <Button icon="arrow-left" themeColor="light" className="border px-4" onClick={handleBackToList}>Back</Button>
//                     <span className="text-muted small">Assign work items to team members & keep track</span>
//                 </div>
//                 <div className="card shadow-sm">
//                     <div className="card-body">
//                         <form onSubmit={handleSave}>
//                             <div className="row g-3">
//                                 <div className="col-12 col-md-2">
//                                     <label htmlFor="refNo" className="form-label fw-bold mb-1">Ref / No.</label>
//                                     <input type="text" className="form-control form-control-lg" id="refNo" value={formData.refNo} onChange={handleInputChange} />
//                                 </div>
//                                 <div className="col-12 col-md-5">
//                                     <label htmlFor="description" className="form-label fw-bold mb-1">Work Description</label>
//                                     <input type="text" className="form-control form-control-lg" id="description" value={formData.description} onChange={handleInputChange} />
//                                 </div>
//                                 <div className="col-12 col-md-3">
//                                     <label htmlFor="assignedTo" className="form-label fw-bold mb-1">Assigned To</label>
//                                     <DropDownList
//                                         id="assignedTo"
//                                         data={employees}
//                                         textField="name"
//                                         dataItemKey="id"
//                                         defaultItem={{ id: null, name: "-- Select Employee --" }}
//                                         value={employees.find(e => e.id === formData.assignedTo) || null}
//                                         onChange={(e) => handleDropDownChange("assignedTo")(e.value ? e.value.id : null)}
//                                         style={{ width: "100%" }}
//                                     />
//                                 </div>
//                                 <div className="col-12 col-md-2">
//                                     <label htmlFor="targetDay" className="form-label fw-bold mb-1">Target Day</label>
//                                     <DatePicker id="targetDay" value={formData.targetDay} onChange={handleDateChange} min={new Date()} />
//                                 </div>
//                             </div>
//                             <div className="row g-3 mt-2">
//                                 <div className="col-12 col-md-3">
//                                     <label htmlFor="status" className="form-label fw-bold mb-1">Status</label>
//                                     <DropDownList id="status" data={statusOptions} textField="name" dataItemKey="id" value={statusOptions.find(s => s.id === formData.status) || null} onChange={(e) => handleDropDownChange("status")(e.value ? e.value.id : null)} />
//                                 </div>
//                                 <div className="col-12 col-md-3">
//                                     <label htmlFor="priority" className="form-label fw-bold mb-1">Priority</label>
//                                     <DropDownList id="priority" data={priorityOptions} textField="name" dataItemKey="id" value={priorityOptions.find(p => p.id === formData.priority) || null} onChange={(e) => handleDropDownChange("priority")(e.value ? e.value.id : null)} />
//                                 </div>
//                             </div>
//                             <div className="row mt-4 pt-3 border-top">
//                                 <div className="col-12 d-flex flex-column flex-md-row justify-content-between gap-2">
//                                     <div className="d-flex gap-2 flex-row">
//                                         <button type="submit" className="btn btn-primary px-4 w-100 w-md-auto">Save</button>
//                                         <button type="button" className="btn btn-light border px-4 w-100 w-md-auto" onClick={handleBackToList}>Cancel</button>
//                                     </div>
//                                 </div>
//                             </div>
//                             {message.text && (
//                                 <div className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"} mt-3`} style={{ fontWeight: 600, borderRadius: "8px", padding: "10px 15px", textAlign: "center" }}>
//                                     {message.text}
//                                 </div>
//                             )}
//                         </form>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     // ---------------- List Page ----------------
//     return (
//         <div className="container-fluid p-0 mt-4">
//             {/* TOP SECTION FOR DESKTOP + MOBILE */}

//             <div className="container-fluid px-2">

//                 {/* DESKTOP VIEW */}
//                 <div className="d-none d-md-flex justify-content-between align-items-start mb-3">

//                     {/* LEFT - Refresh */}
//                     <button
//                         className="btn btn-light border border-secondary btn-sm shadow-sm"
//                         onClick={loadData}
//                         title="Reload List"
//                     >
//                         Refresh
//                     </button>

//                     {/* RIGHT - Add New + Filter */}
//                     <div className="d-flex flex-column align-items-end">
//                         {userRole === "Admin" && (
//                             <button
//                                 className="btn btn-primary btn-sm mb-2"
//                                 onClick={handleAddNew}
//                             >
//                                 + Add New Work Item
//                             </button>
//                         )}

//                         {userRole === "Admin" && (
//                             <div className="d-flex align-items-center gap-2">
//                                 <label className="fw-bold mb-0">Filter by Person:</label>
//                                 <DropDownList
//                                     data={employees}
//                                     textField="name"
//                                     dataItemKey="id"
//                                     value={selectedEmployee}
//                                     onChange={(e) => setSelectedEmployee(e.value)}
//                                     defaultValue={null}
//                                     style={{
//                                         width: isDesktop ? "320px" : "100%",   // Desktop wider, Mobile full width
//                                     }}
//                                 />

//                             </div>
//                         )}
//                     </div>
//                 </div>

//                 {/* MOBILE VIEW */}
//                 <div className="d-flex d-md-none flex-column gap-2 mb-3">

//                     <div className="d-flex justify-content-between gap-2">
//                         {userRole === "Admin" && (
//                             <button
//                                 className="btn btn-primary btn-sm w-50"
//                                 onClick={handleAddNew}
//                             >
//                                 + Add New Work Item
//                             </button>
//                         )}

//                         <button
//                             className="btn btn-light border border-secondary btn-sm shadow-sm w-50"
//                             onClick={loadData}
//                             title="Reload List"
//                         >
//                             Refresh
//                         </button>
//                     </div>

//                     {userRole === "Admin" && (
//                         <div className="d-flex flex-column gap-1">
//                             <label className="fw-bold mb-0">Filter by Person:</label>
//                             <DropDownList
//                                 data={employees}
//                                 textField="name"
//                                 dataItemKey="id"
//                                 value={selectedEmployee}
//                                 onChange={(e) => setSelectedEmployee(e.value)}
//                                 style={{ width: '100%' }}
//                                 defaultValue={null}
//                             />
//                         </div>
//                     )}
//                 </div>

//             </div>


//             <div className="table-responsive bg-white">
//                 <table className="table table-hover align-middle mb-0">
//                     <thead className="table-light">
//                         <tr>
//                             <th className="py-3 ps-3">Serial No</th>
//                             <th className="py-3">Ref / No.</th>
//                             <th className="py-3" style={{ width: '40%' }}>Work Details</th>
//                             <th className="py-3">Person</th>
//                             <th className="py-3">Target Day</th>
//                             <th className="py-3">Status</th>
//                             <th className="py-3">Priority</th>
//                             <th className="py-3 text-center">Reply</th>
//                             {userRole === "Admin" && <th className="py-3 text-center">Actions</th>}
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {pagedData.length > 0 ? pagedData.map((item, index) => {
//                             // 1. Get current date (reset time to midnight)
//                             const today = new Date();
//                             today.setHours(0, 0, 0, 0);

//                             // 2. Parse the item's target date
//                             const targetDate = item.targetDay ? new Date(item.targetDay) : null;

//                             // 3. Check if overdue
//                             const isOverdue = targetDate && targetDate < today && (item.status === 'Pending' || item.status === 'In Progress');

//                             return (
//                                 <tr
//                                     key={item.taskId}
//                                     // CHANGE: Use Bootstrap class 'table-danger' instead of inline style
//                                     className={isOverdue ? "table-danger" : ""}
//                                 >
//                                     <td className="ps-3 text-muted">{page.skip + index + 1}</td>
//                                     <td className="fw-medium">{item.refNo}</td>
//                                     <td className="text-secondary">{item.description}</td>
//                                     {/* Note: Badges will still have their own background colors, which is normal */}
//                                     <td><span className="badge bg-primary text-white rounded-2 px-3 py-1">{item.assignedTo}</span></td>

//                                     <td className="text-secondary">
//                                         {item.targetDay}
//                                     </td>

//                                     <td><span className="badge text-dark rounded-2 px-3 py-1" style={{ backgroundColor: '#ffc107' }}>{item.status}</span></td>
//                                     <td><span className={`badge text-white rounded-2 px-3 py-1 ${item.priority === "High" ? "bg-danger" : "bg-secondary"}`}>{item.priority}</span></td>
//                                     <td className="text-center">
//                                         <button className="btn btn-sm btn-primary" onClick={() => handleReply(item)}>Reply</button>
//                                     </td>
//                                     {userRole === "Admin" && (
//                                         <td className="text-center">
//                                             <Button
//                                                 icon="delete"
//                                                 themeColor="error"
//                                                 fillMode="outline"
//                                                 size="small"
//                                                 style={{ width: "34px", height: "34px" }}
//                                                 onClick={() => confirmDelete(item.taskId || item.id)}
//                                                 title="Delete"
//                                             />
//                                         </td>
//                                     )}
//                                 </tr>
//                             );
//                         }) : (
//                             <tr>
//                                 <td colSpan="9" className="text-center text-secondary py-3">No work items added yet.</td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>

//             <div className="mt-3 d-flex justify-content-start">
//                 <Pager skip={page.skip} take={page.take} total={processedItems.length} buttonCount={5} info={true} type="numeric" previousNext={true} onPageChange={handlePageChange} />
//             </div>

//             {/* Kendo Delete Confirmation Dialog */}
//             {deleteDialogVisible && (
//                 <Dialog
//                     title={"Delete Confirmation"}
//                     onClose={cancelDelete}
//                     minWidth={300}     // Good for mobile
//                     maxWidth={450}     // Good for desktop
//                 >
//                     <p style={{ margin: "25px", textAlign: "center", fontSize: "16px" }}>
//                         Are you sure you want to delete this item?
//                     </p>
//                     <DialogActionsBar>
//                         <button className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base" onClick={cancelDelete}>
//                             No
//                         </button>
//                         <button className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-error" onClick={executeDelete}>
//                             Yes
//                         </button>
//                     </DialogActionsBar>
//                 </Dialog>
//             )}
//         </div>
//     );


// };

// export default WorkList;

import React, { useState, useEffect } from 'react';
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { Pager } from "@progress/kendo-react-data-tools";
import { DatePicker } from "@progress/kendo-react-dateinputs";
import ReplyWorkItem from "./ReplyWorkItem";
import { Button } from "@progress/kendo-react-buttons";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";

const WorkList = () => {
    const [workItems, setWorkItems] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [currentPage, setCurrentPage] = useState('list');
    const [selectedItem, setSelectedItem] = useState(null);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
    const getRealId = (item) =>
        item.taskId || item.TaskId || item.id || item.Id;


    // Dialog State
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const [formData, setFormData] = useState({
        refNo: '',
        description: '',
        assignedTo: null,
        targetDay: null,
        status: '',
        priority: ''
    });

    const [message, setMessage] = useState({ text: '', type: '' });

    const statusOptions = [
        { id: 'Pending', name: 'Pending' },
        { id: 'In Progress', name: 'In Progress' },
        { id: 'Completed', name: 'Completed' }
    ];
    const priorityOptions = [
        { id: 'Low', name: 'Low' },
        { id: 'Normal', name: 'Normal' },
        { id: 'High', name: 'High' }
    ];

    // Pagination
    const [page, setPage] = useState({ skip: 0, take: 10 });
    const handlePageChange = (event) => {
        setPage({ skip: event.skip, take: event.take });
    };

    // ---------------- User Role & Name Configuration ----------------
    const userRole = localStorage.getItem("userRole") || "Admin";
    //const userRole = "Employee";

    const currentUserName = localStorage.getItem("userName") || "";

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);


    // Load data
    const loadData = () => {
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/WorkItem`)
            .then(res => res.json())
            .then(data => setWorkItems(data))
            .catch(err => console.error(err));
    };

    useEffect(() => { loadData(); }, []);

    // Load Employees
    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Employee`)
            .then(res => res.json())
            .then(data => {
                // const sorted = data
                //     .map(emp => ({ id: emp.id, name: emp.firstName }))
                //     .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
                // setEmployees(sorted);
                const sorted = [
                    { id: 0, name: "Show All" },   // ADD THIS
                    ...data
                        .map(emp => ({ id: emp.id, name: emp.firstName }))
                        .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
                ];
                setEmployees(sorted);
            })
            .catch(() => setEmployees([]));
    }, []);

    // ---------------- Sorting & Filtering Logic ----------------

    let processedItems = [...workItems];

    // 1. FILTERING
    if (userRole === "Employee") {
        if (currentUserName) {
            processedItems = processedItems.filter(item =>
                (item.assignedTo || "").toLowerCase() === currentUserName.toLowerCase()
            );
        }
    } else {
        // Admin filtering with "Show All"
        if (userRole === "Admin" && selectedEmployee && selectedEmployee.id !== 0) {
            processedItems = processedItems.filter(
                item => (item.assignedTo || "").toLowerCase() === selectedEmployee.name.toLowerCase()
            );
        }


    }

    // 2. SORTING
    processedItems.sort((a, b) => {
        const personA = a.assignedTo || "";
        const personB = b.assignedTo || "";
        return personA.toLowerCase().localeCompare(personB.toLowerCase());
    });

    // 3. PAGINATION
const pagedData = page
    ? processedItems.slice(page.skip, page.skip + page.take)
    : [];

    useEffect(() => {
const take = page?.take || 10;
const totalPages = Math.ceil(processedItems.length / take);

    const currentPageNumber = Math.floor(page.skip / page.take) + 1;

    if (currentPageNumber > totalPages && totalPages > 0) {
        setPage({ skip: 0, take: page.take });
    }
}, [processedItems.length]);




    // ---------------- Navigation Handlers ----------------
    const handleAddNew = () => {
        setFormData({ refNo: '', description: '', assignedTo: null, targetDay: null, status: '', priority: '' });
        setMessage({ text: '', type: '' });
        setCurrentPage('form');
    };
    const handleReply = (item) => {
        setSelectedItem(item);
        setCurrentPage('reply');
    };
    const handleBackToList = () => {
        setCurrentPage('list');
        setSelectedItem(null);
    };

    // ---------------- Form Handlers ----------------
    const handleInputChange = (e) => { const { id, value } = e.target; setFormData({ ...formData, [id]: value }); };
    const handleDropDownChange = (key) => (value) => setFormData({ ...formData, [key]: value });
    const handleDateChange = (e) => setFormData({ ...formData, targetDay: e.value });

    const handleSave = async (e) => {
        e.preventDefault();
        const payload = {
            refNo: formData.refNo,
            description: formData.description,
            assignedTo: formData.assignedTo?.name || "",
            targetDay: formData.targetDay ? formData.targetDay.toISOString().split("T")[0] : null,
            status: formData.status,
            priority: formData.priority
        };

        if (userRole === "Employee") {
            payload.assignedTo = currentUserName;
        }

        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/WorkItem`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        if (res.ok) {
            setMessage({ text: "Work item saved successfully!", type: "success" });
            setFormData({
                refNo: '', description: '', assignedTo: null, targetDay: null, status: '', priority: ''
            });
            loadData();
            setTimeout(() => {
                handleBackToList();
                setMessage({ text: '', type: '' });
            }, 5000);
        } else {
            setMessage({ text: "Failed to save!", type: "danger" });
        }
    };

    // ---------------- Delete Logic ----------------
    const confirmDelete = (id) => {
        setItemToDelete(id);
        setDeleteDialogVisible(true);
    };

    const cancelDelete = () => {
        setDeleteDialogVisible(false);
        setItemToDelete(null);
    };

    const executeDelete = async () => {
        if (!itemToDelete) return;
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/WorkItem/${itemToDelete}/softdelete`, {
            method: "PUT"
        });
        if (res.ok) {
            loadData();
            setDeleteDialogVisible(false);
            setItemToDelete(null);
        } else {
            alert("Failed to delete!");
            setDeleteDialogVisible(false);
        }
    };

    // ---------------- Conditional Render ----------------

    if (currentPage === 'reply' && selectedItem) {
        const realTaskId = selectedItem.taskId || selectedItem.TaskId || selectedItem.id || selectedItem.Id;

        if (!realTaskId) {
            console.error("❌ CRITICAL ERROR: Could not find a valid ID in selectedItem:", selectedItem);
            alert("Error: Cannot reply because the Task ID is missing. Check console.");
            return <button onClick={handleBackToList}>Back</button>;
        }

        return (
            <div className="container mt-4">
                <div className="mb-3">
                    <Button icon="arrow-left" size="medium" onClick={handleBackToList} themeColor={"light"}>
                        Back to List
                    </Button>
                </div>
                <ReplyWorkItem
                    taskId={realTaskId}
                    currentUserRole={userRole}
                    onBack={handleBackToList}
                    onUpdate={loadData}
                />
            </div>
        );
    }

    if (currentPage === 'form') {
        return (
            // Added p-3 for mobile, p-md-4 for desktop to manage padding better
            <div className="container-fluid p-3 p-md-4 bg-light">
                {/* Changed to flex-column on mobile so Back button and Text don't overlap */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 gap-2">
                    <Button icon="arrow-left" themeColor="light" className="border px-4" onClick={handleBackToList}>Back</Button>
                    <span className="text-muted small">Assign work items to team members & keep track</span>
                </div>
                <div className="card shadow-sm">
                    <div className="card-body">
                        <form onSubmit={handleSave}>
                            <div className="row g-3">
                                <div className="col-12 col-md-2">
                                    <label htmlFor="refNo" className="form-label fw-bold mb-1">Ref / No.</label>
                                    <input type="text" className="form-control form-control-lg" id="refNo" value={formData.refNo} onChange={handleInputChange} />
                                </div>
                                <div className="col-12 col-md-5">
                                    <label htmlFor="description" className="form-label fw-bold mb-1">Work Description</label>
                                    <input type="text" className="form-control form-control-lg" id="description" value={formData.description} onChange={handleInputChange} />
                                </div>
                                {userRole === "Admin" && (
                                    <div className="col-12 col-md-3">
                                        <label htmlFor="assignedTo" className="form-label fw-bold mb-1">Assigned To</label>
                                        <DropDownList
                                            id="assignedTo"
                                            data={employees}
                                            textField="name"
                                            dataItemKey="id"
                                            defaultItem={{ id: null, name: "-- Select Employee --" }}
                                            value={formData.assignedTo}
                                            onChange={(e) => handleDropDownChange("assignedTo")(e.value)}
                                            style={{ width: "100%" }}
                                        />
                                    </div>
                                )}

                                <div className="col-12 col-md-2">
                                    <label htmlFor="targetDay" className="form-label fw-bold mb-1">Target Day</label>
                                    <DatePicker id="targetDay" value={formData.targetDay} onChange={handleDateChange} min={new Date()} />
                                </div>
                            </div>
                            <div className="row g-3 mt-2">
                                <div className="col-12 col-md-3">
                                    <label htmlFor="status" className="form-label fw-bold mb-1">Status</label>
                                    <DropDownList id="status" data={statusOptions} textField="name" dataItemKey="id" value={statusOptions.find(s => s.id === formData.status) || null} onChange={(e) => handleDropDownChange("status")(e.value ? e.value.id : null)} />
                                </div>
                                <div className="col-12 col-md-3">
                                    <label htmlFor="priority" className="form-label fw-bold mb-1">Priority</label>
                                    <DropDownList id="priority" data={priorityOptions} textField="name" dataItemKey="id" value={priorityOptions.find(p => p.id === formData.priority) || null} onChange={(e) => handleDropDownChange("priority")(e.value ? e.value.id : null)} />
                                </div>
                            </div>
                            <div className="row mt-4 pt-3 border-top">
                                <div className="col-12 d-flex flex-column flex-md-row justify-content-between gap-2">
                                    <div className="d-flex gap-2 flex-row">
                                        <button type="submit" className="btn btn-primary px-4 w-100 w-md-auto">Save</button>
                                        <button type="button" className="btn btn-light border px-4 w-100 w-md-auto" onClick={handleBackToList}>Cancel</button>
                                    </div>
                                </div>
                            </div>
                            {message.text && (
                                <div className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"} mt-3`} style={{ fontWeight: 600, borderRadius: "8px", padding: "10px 15px", textAlign: "center" }}>
                                    {message.text}
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>

        );
    }

    // ---------------- List Page ----------------
    return (
        <div className="container-fluid p-0 mt-4">
            {/* TOP SECTION FOR DESKTOP + MOBILE */}

            <div className="container-fluid px-2">

                {/* DESKTOP VIEW */}
                <div className="d-none d-md-flex justify-content-between align-items-start mb-3">

                    {/* LEFT - Refresh */}
                    {/* <button
                        className="btn btn-light border border-secondary btn-sm shadow-sm"
                        onClick={loadData}
                        title="Reload List"
                    >
                        Refresh
                    </button> */}

                    <Button
                        icon="refresh"
                        className="btn btn-light border border-secondary btn-sm shadow-sm"
                        onClick={loadData}
                        title="Reload List"
                    >
                        Refresh
                    </Button>

                    {/* RIGHT - Add New + Filter */}
                    <div className="d-flex flex-column align-items-end">
                        {userRole === "Admin" && (
                            <button
                                className="btn btn-primary btn-sm mb-2"
                                onClick={handleAddNew}
                            >
                                + Add New Work Item
                            </button>
                        )}

                        {userRole === "Admin" && (
                            <div className="d-flex align-items-center gap-2">
                                <label className="fw-bold mb-0">Filter by Person:</label>

                                {/* Force specific width here since this is ONLY visible on Desktop */}
                                <div style={{ width: "200px" }}>
                                    <DropDownList
                                        data={employees}
                                        textField="name"
                                        dataItemKey="id"
                                        value={selectedEmployee}
                                        onChange={(e) => setSelectedEmployee(e.value)}
                                        defaultValue={null}
                                        style={{ width: "100%" }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* MOBILE VIEW */}
                {/* Changed to gap-3 to keep distance between buttons and filter text */}
                <div className="d-flex d-md-none flex-column gap-3 mb-3">

                    {/* Stack Buttons Vertically (flex-column) so "Add New Work Item" text fits */}
                    {/* MOBILE VIEW */}
                    {/* 1. Removed 'flex-column' so they sit side-by-side */}
                    <div className="d-flex d-md-none gap-2 mb-3">

                        {userRole === "Admin" && (
                            <button
                                /* 2. Changed 'w-100' to 'flex-grow-1' so they share the width */
                                className="btn btn-primary btn-sm flex-grow-1"
                                onClick={handleAddNew}
                            >
                                {/* 3. Optional: Use text-nowrap to prevent ugly wrapping, or shorten text to "+ Add New" if it's too tight */}
                                + Add New Work Item
                            </button>
                        )}

                        <button
                            /* 2. Changed 'w-100' to 'flex-grow-1' */
                            className="btn btn-light border border-secondary btn-sm shadow-sm flex-grow-1"
                            onClick={loadData}
                            title="Reload List"
                        >
                            Refresh
                        </button>
                    </div>
                    {userRole === "Admin" && (
                        <div className="d-flex flex-column gap-1">
                            <label className="fw-bold mb-0">Filter by Person:</label>
                            <DropDownList
                                data={employees}
                                textField="name"
                                dataItemKey="id"
                                value={selectedEmployee}
                                onChange={(e) => setSelectedEmployee(e.value)}
                                style={{ width: '100%' }}
                                defaultValue={null}
                            />
                        </div>
                    )}
                </div>

            </div>


            <div className="table-responsive bg-white">
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                        <tr>
                            <th className="py-3 ps-3">Serial No</th>
                            <th className="py-3">Ref / No.</th>
                            <th className="py-3" style={{ width: '40%' }}>Work Details</th>
                            <th className="py-3">Person</th>
                            <th className="py-3">Target Day</th>
                            <th className="py-3">Status</th>
                            <th className="py-3">Priority</th>
                            <th className="py-3 text-center">Reply</th>
                            {userRole === "Admin" && <th className="py-3 text-center">Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {pagedData.length > 0 ? pagedData.map((item, index) => {
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            const targetDate = item.targetDay ? new Date(item.targetDay) : null;
                            const isOverdue = targetDate && targetDate < today && (item.status === 'Pending' || item.status === 'In Progress');

                            return (
                                <tr
                                    key={getRealId(item)}
                                    className={isOverdue ? "table-danger" : ""}
                                >
                                    <td className="ps-3 text-muted">{page.skip + index + 1}</td>
                                    <td className="fw-medium">{item.refNo}</td>
                                    <td className="text-secondary">{item.description}</td>
                                    <td><span className="badge bg-primary text-white rounded-2 px-3 py-1">{item.assignedTo}</span></td>

                                    <td className="text-secondary">
                                        {item.targetDay}
                                    </td>

                                    <td>
                                        <span
                                            className="badge text-dark rounded-2 px-3 py-1"
                                            style={{
                                                backgroundColor: '#ffc107',
                                                minWidth: '120px',
                                                display: 'inline-block',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {item.status}
                                        </span>
                                    </td>
                                    <td>
                                        <span
                                            className={`badge text-white rounded-2 px-3 py-1 ${item.priority === "High" ? "bg-danger" : "bg-secondary"
                                                }`}
                                            style={{
                                                minWidth: '100px',
                                                display: 'inline-block',
                                                textAlign: 'center'
                                            }}
                                        >
                                            {item.priority}
                                        </span>
                                    </td>


                                    <td className="text-center">
                                        <button className="btn btn-sm btn-primary" onClick={() => handleReply(item)}>Reply</button>
                                    </td>
                                    {userRole === "Admin" && (
                                        <td className="text-center">
                                            <Button
                                                icon="delete"
                                                themeColor="error"
                                                fillMode="outline"
                                                size="small"
                                                style={{ width: "34px", height: "34px" }}
                                                onClick={() => confirmDelete(getRealId(item))}
                                                title="Delete"
                                            />
                                        </td>
                                    )}
                                </tr>
                            );
                        }) : (
                            <tr>
                                <td colSpan="9" className="text-center text-secondary py-3">No work items added yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-3 d-flex justify-content-start">
                <Pager skip={page.skip} take={page.take} total={processedItems.length} buttonCount={5} info={true} type="numeric" previousNext={true} onPageChange={handlePageChange} />
            </div>

            {deleteDialogVisible && (
                <Dialog
                    title={"Delete Confirmation"}
                    onClose={cancelDelete}
                    minWidth={300}
                    maxWidth={450}
                >
                    <p style={{ margin: "25px", textAlign: "center", fontSize: "16px" }}>
                        Are you sure you want to delete this item?
                    </p>
                    <DialogActionsBar>
                        <button className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base" onClick={cancelDelete}>
                            No
                        </button>
                        <button className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-error" onClick={executeDelete}>
                            Yes
                        </button>
                    </DialogActionsBar>
                </Dialog>
            )}
        </div>
    );
};

export default WorkList;