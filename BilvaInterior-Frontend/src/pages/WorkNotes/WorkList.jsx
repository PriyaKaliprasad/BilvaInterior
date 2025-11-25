

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

import React, { useState, useEffect } from 'react';
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { Pager } from "@progress/kendo-react-data-tools";
import { DatePicker } from "@progress/kendo-react-dateinputs";
import ReplyWorkItem from "./ReplyWorkItem";
import { Button } from "@progress/kendo-react-buttons";

const WorkList = () => {
    const [workItems, setWorkItems] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [currentPage, setCurrentPage] = useState('list');
    const [selectedItem, setSelectedItem] = useState(null);

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
    const handlePageChange = (event) => setPage(event.page);

    // Define user role
    const userRole = localStorage.getItem("userRole") || "Admin";
    //const userRole = "Employee";

    // Load data
    const loadData = () => {
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/WorkItem`)
            .then(res => res.json())
            .then(data => setWorkItems(data))
            .catch(err => console.error(err));
    };

    useEffect(() => { loadData(); }, []);
    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Employee`)
            .then(res => res.json())
            .then(data => setEmployees(data.map(emp => ({ id: emp.id, name: emp.firstName }))))
            .catch(() => setEmployees([]));
    }, []);

    const filteredItems = selectedEmployee
        ? workItems.filter(item => item.assignedTo === selectedEmployee.name)
        : workItems;
    const pagedData = filteredItems.slice(page.skip, page.skip + page.take);

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
            assignedTo: employees.find(e => e.id === formData.assignedTo)?.name || "",
            targetDay: formData.targetDay ? formData.targetDay.toISOString().split("T")[0] : null,
            status: formData.status,
            priority: formData.priority
        };
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/WorkItem`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        if (res.ok) {
            setMessage({ text: "Work item saved successfully!", type: "success" });

            setFormData({
                refNo: '',
                description: '',
                assignedTo: null,
                targetDay: null,
                status: '',
                priority: ''
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

    // ---------------- Conditional Render ----------------

    if (currentPage === 'reply' && selectedItem) {
        return (
            <div className="container mt-4">
                {/* <button className="btn btn-light border px-4 mb-3" onClick={handleBackToList}>
                    Back 
                </button> */}
                <div className="mb-3">
                    <Button
                        icon="arrow-left"
                        size="medium"
                        onClick={handleBackToList}
                        // className="action-btn back-btn" // Uncomment if you have these CSS classes
                        themeColor={"light"} // Makes it look like btn-light
                    >
                        Back to List
                    </Button>
                </div>


                <ReplyWorkItem
                    taskId={selectedItem.id}
                    currentUserRole={userRole}
                    onBack={handleBackToList}
                    onUpdate={loadData}
                />
            </div>
        );
    }

    if (currentPage === 'form') {
        return (
            <div className="container-fluid p-4 bg-light">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <Button
                        icon="arrow-left"
                        themeColor="light"
                        className="border px-4"
                        onClick={handleBackToList}
                    >
                        Back
                    </Button>
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
                                <div className="col-12 col-md-3">
                                    <label htmlFor="assignedTo" className="form-label fw-bold mb-1">Assigned To</label>
                                    <DropDownList
                                        id="assignedTo"
                                        data={employees}
                                        textField="name"
                                        dataItemKey="id"
                                        defaultItem={{ id: null, name: "-- Select Employee --" }}
                                        value={employees.find(e => e.id === formData.assignedTo) || null}
                                        onChange={(e) => handleDropDownChange("assignedTo")(e.value ? e.value.id : null)}
                                        style={{ width: "100%" }}
                                    />
                                </div>
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

            {/* 👇 CHANGE 1: Only show "Add New" button if user is Admin */}
            {userRole === "Admin" && (
                <div className="d-flex justify-content-end mb-2">
                    <button className="btn btn-primary btn-sm" onClick={handleAddNew}>+ Add New Work Item</button>
                </div>
            )}

            <div className="d-flex justify-content-between align-items-center mb-2 bg-white p-3 border-bottom flex-wrap">
                <button className="btn btn-light border border-secondary btn-sm shadow-sm" onClick={loadData} title="Reload List">Refresh</button>

                {/* 👇 CHANGE 2: Only show Filter if user is Admin */}
                {userRole === "Admin" && (
                    <div className="d-flex align-items-center gap-2">
                        <label className="fw-bold mb-0">Filter by Person:</label>
                        <DropDownList
                            data={employees}
                            textField="name"
                            dataItemKey="id"
                            value={selectedEmployee}
                            onChange={(e) => setSelectedEmployee(e.value)}
                            style={{ width: '350px', minWidth: '250px' }}
                            defaultValue={null}
                        />
                    </div>
                )}
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
                        </tr>
                    </thead>
                    <tbody>
                        {pagedData.length > 0 ? pagedData.map((item, index) => (
                            <tr key={item.taskId}>
                                <td className="ps-3 text-muted">{page.skip + index + 1}</td>
                                <td className="fw-medium">{item.refNo}</td>
                                <td className="text-secondary">{item.description}</td>
                                <td><span className="badge bg-primary text-white rounded-2 px-3 py-1">{item.assignedTo}</span></td>
                                <td className="text-secondary">{item.targetDay}</td>
                                <td><span className="badge text-dark rounded-2 px-3 py-1" style={{ backgroundColor: '#ffc107' }}>{item.status}</span></td>
                                <td><span className="badge bg-secondary text-white rounded-2 px-3 py-1">{item.priority}</span></td>
                                <td className="text-center">
                                    <button className="btn btn-sm btn-primary" onClick={() => handleReply(item)}>Reply</button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="9" className="text-center text-secondary py-3">No work items added yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-3 d-flex justify-content-start">
                <Pager skip={page.skip} take={page.take} total={filteredItems.length} buttonCount={5} info={true} type="numeric" previousNext={true} onPageChange={handlePageChange} />
            </div>
        </div>
    );
};

export default WorkList;