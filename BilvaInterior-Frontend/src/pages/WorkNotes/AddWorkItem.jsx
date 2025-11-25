// import React, { useState, useEffect } from 'react';
// import { DropDownList } from "@progress/kendo-react-dropdowns";
// import { DatePicker } from "@progress/kendo-react-dateinputs";

// // ======================
// // Main Component
// // ======================
// const WorkItemForm = () => {
//     const [formData, setFormData] = useState({
//         refNo: '',
//         description: '',
//         assignedTo: null,
//         targetDay: null, // empty date
//         status: '',
//         priority: ''
//     });

//     const [employees, setEmployees] = useState([]);
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

//     useEffect(() => {
//         const mockData = [
//             { id: 1, name: 'John Doe' },
//             { id: 2, name: 'Jane Smith' },
//             { id: 3, name: 'Robert Brown' },
//             { id: 4, name: 'Emily White' }
//         ];
//         setEmployees(mockData);
//     }, []);

//     const handleInputChange = (e) => {
//         const { id, value } = e.target;
//         setFormData({ ...formData, [id]: value });
//     };
//     const handleDropDownChange = (key) => (value) => {
//         setFormData({ ...formData, [key]: value });
//     };
//     const handleDateChange = (e) => setFormData({ ...formData, targetDay: e.value });
//     const handleSubmit = (e) => { e.preventDefault(); console.log(formData); };

//     return (
//         <div className="container-fluid p-4 bg-light">
//             {/* Header */}
//             <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3">
//                 <h3 className="fw-bold text-dark">Work Note List / Tagging</h3>
//                 <span className="text-muted small">
//                     Assign work items to team members & keep track
//                 </span>
//             </div>

//             {/* Form Card */}
//             <div className="card shadow-sm">
//                 <div className="card-body">
//                     <form onSubmit={handleSubmit}>

//                         {/* First Row: Ref/No, Description, Assigned To, Target Day */}
//                         <div className="row g-3">
//                             <div className="col-12 col-md-2">
//                                 <label htmlFor="refNo" className="form-label fw-bold mb-1" style={{ fontSize: "16px" }}>
//                                     Ref / No.
//                                 </label>                               
//                                  <input
//                                     type="text"
//                                     className="form-control form-control-lg"
//                                     id="refNo"
//                                     value={formData.refNo}
//                                     onChange={handleInputChange}
//                                 />
//                             </div>
//                             <div className="col-12 col-md-5">
//                                 <label htmlFor="description" className="form-label fw-bold mb-1" style={{ fontSize: "16px" }}>Work Description</label>
//                                 <input
//                                     type="text"
//                                     className="form-control form-control-lg"
//                                     id="description"
//                                     value={formData.description}
//                                     onChange={handleInputChange}
//                                 />
//                             </div>
//                             <div className="col-12 col-md-3">
//                                 <label htmlFor="assignedTo" className="form-label fw-bold mb-1" style={{ fontSize: "16px" }}>Assigned To</label>
//                                 <DropDownList
//                                     id="assignedTo"
//                                     data={employees}
//                                     textField="name"
//                                     dataItemKey="id"
//                                     value={employees.find(e => e.id === formData.assignedTo) || null}
//                                     onChange={(e) => handleDropDownChange("assignedTo")(e.value ? e.value.id : null)}
//                                 />
//                             </div>
//                             <div className="col-12 col-md-2">
//                                 <label htmlFor="targetDay" className="form-label fw-bold mb-1" style={{ fontSize: "16px" }}>Target Day</label>
//                                 <DatePicker
//                                     id="targetDay"
//                                     value={formData.targetDay}
//                                     onChange={handleDateChange}
//                                 />
//                             </div>
//                         </div>

//                         {/* Second Row: Status & Priority */}
//                         <div className="row g-3 mt-2">
//                             <div className="col-12 col-md-3">
//                                 <label htmlFor="status" className="form-label fw-bold mb-1" style={{ fontSize: "16px" }}>Status</label>
//                                 <DropDownList
//                                     id="status"
//                                     data={statusOptions}
//                                     textField="name"
//                                     dataItemKey="id"
//                                     value={statusOptions.find(s => s.id === formData.status) || null}
//                                     onChange={(e) => handleDropDownChange("status")(e.value ? e.value.id : null)}
//                                 />
//                             </div>
//                             <div className="col-12 col-md-3">
//                                 <label htmlFor="priority" className="form-label fw-bold mb-1" style={{ fontSize: "16px" }}>Priority</label>
//                                 <DropDownList
//                                     id="priority"
//                                     data={priorityOptions}
//                                     textField="name"
//                                     dataItemKey="id"
//                                     value={priorityOptions.find(p => p.id === formData.priority) || null}
//                                     onChange={(e) => handleDropDownChange("priority")(e.value ? e.value.id : null)}
//                                 />
//                             </div>
//                         </div>

//                         {/* Buttons: Save, Cancel & Add to List */}
// <div className="row mt-4 pt-3 border-top">
//     <div className="col-12 d-flex justify-content-between">
//         <div className="d-flex gap-2">
//             <button type="submit" className="btn btn-primary px-4">
//                 Save
//             </button>
//             <button type="button" className="btn btn-secondary px-4" onClick={() => console.log("Cancelled")}>
//                 Cancel
//             </button>
//         </div>
//         <div>
//             <button type="button" className="btn btn-primary px-4">
//                 Add to List
//             </button>
//         </div>
//     </div>
// </div>

//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default WorkItemForm;

// import React, { useState, useEffect } from 'react';
// import { DropDownList } from "@progress/kendo-react-dropdowns";
// import { DatePicker } from "@progress/kendo-react-dateinputs";
// // import './WorkItemForm.css'; // For mobile input width

// const WorkItemForm = () => {
//     const [formData, setFormData] = useState({
//         refNo: '',
//         description: '',
//         assignedTo: null,
//         targetDay: null,
//         status: '',
//         priority: ''
//     });

//     const [employees, setEmployees] = useState([]);
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

//     useEffect(() => {
//         const mockData = [
//             { id: 1, name: 'John Doe' },
//             { id: 2, name: 'Jane Smith' },
//             { id: 3, name: 'Robert Brown' },
//             { id: 4, name: 'Emily White' }
//         ];
//         setEmployees(mockData);
//     }, []);

//     const handleInputChange = (e) => {
//         const { id, value } = e.target;
//         setFormData({ ...formData, [id]: value });
//     };
//     const handleDropDownChange = (key) => (value) => {
//         setFormData({ ...formData, [key]: value });
//     };
//     const handleDateChange = (e) => setFormData({ ...formData, targetDay: e.value });
//     const handleSubmit = (e) => { e.preventDefault(); console.log(formData); };

//     return (
//         <div className="container-fluid p-4 bg-light">
//             {/* Header */}
//             <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3">
//                 <h3 className="fw-bold text-dark">Work Note List / Tagging</h3>
//                 <span className="text-muted small">
//                     Assign work items to team members & keep track
//                 </span>
//             </div>

//             {/* Form Card */}
//             <div className="card shadow-sm">
//                 <div className="card-body">
//                     <form onSubmit={handleSubmit}>

//                         {/* First Row */}
//                         <div className="row g-3">
//                             <div className="col-12 col-md-2">
//                                 <label htmlFor="refNo" className="form-label fw-bold mb-1">Ref / No.</label>
//                                 <input
//                                     type="text"
//                                     className="form-control form-control-lg mobile-input"
//                                     id="refNo"
//                                     value={formData.refNo}
//                                     onChange={handleInputChange}
//                                 />
//                             </div>
//                             <div className="col-12 col-md-5">
//                                 <label htmlFor="description" className="form-label fw-bold mb-1">Work Description</label>
//                                 <input
//                                     type="text"
//                                     className="form-control form-control-lg mobile-input"
//                                     id="description"
//                                     value={formData.description}
//                                     onChange={handleInputChange}
//                                 />
//                             </div>
//                             <div className="col-12 col-md-3">
//                                 <label htmlFor="assignedTo" className="form-label fw-bold mb-1">Assigned To</label>
//                                 <DropDownList
//                                     id="assignedTo"
//                                     data={employees}
//                                     textField="name"
//                                     dataItemKey="id"
//                                     value={employees.find(e => e.id === formData.assignedTo) || null}
//                                     onChange={(e) => handleDropDownChange("assignedTo")(e.value ? e.value.id : null)}
//                                     className="mobile-input"
//                                 />
//                             </div>
//                             <div className="col-12 col-md-2">
//                                 <label htmlFor="targetDay" className="form-label fw-bold mb-1">Target Day</label>
//                                 <DatePicker
//                                     id="targetDay"
//                                     value={formData.targetDay}
//                                     onChange={handleDateChange}
//                                     className="mobile-input"
//                                 />
//                             </div>
//                         </div>

//                         {/* Second Row */}
//                         <div className="row g-3 mt-2">
//                             <div className="col-12 col-md-3">
//                                 <label htmlFor="status" className="form-label fw-bold mb-1">Status</label>
//                                 <DropDownList
//                                     id="status"
//                                     data={statusOptions}
//                                     textField="name"
//                                     dataItemKey="id"
//                                     value={statusOptions.find(s => s.id === formData.status) || null}
//                                     onChange={(e) => handleDropDownChange("status")(e.value ? e.value.id : null)}
//                                     className="mobile-input"
//                                 />
//                             </div>
//                             <div className="col-12 col-md-3">
//                                 <label htmlFor="priority" className="form-label fw-bold mb-1">Priority</label>
//                                 <DropDownList
//                                     id="priority"
//                                     data={priorityOptions}
//                                     textField="name"
//                                     dataItemKey="id"
//                                     value={priorityOptions.find(p => p.id === formData.priority) || null}
//                                     onChange={(e) => handleDropDownChange("priority")(e.value ? e.value.id : null)}
//                                     className="mobile-input"
//                                 />
//                             </div>
//                         </div>

//                         {/* Buttons: Responsive */}
//                         {/* Buttons: Save, Cancel & Add to List */}
// <div className="row mt-4 pt-3 border-top">
//     <div className="col-12 d-flex flex-column flex-md-row justify-content-between gap-2">

//         {/* Save & Cancel */}
//         <div className="d-flex gap-2 flex-row">
//             <button type="submit" className="btn btn-primary px-4 d-block d-md-inline-block w-100 w-md-auto">
//                 Save
//             </button>
//             <button type="button" className="btn btn-secondary px-4 d-block d-md-inline-block w-100 w-md-auto" onClick={() => console.log("Cancelled")}>
//                 Cancel
//             </button>
//         </div>

//         {/* Add to List */}
//         <div className="mt-2 mt-md-0 text-md-end">
//             <button type="button" className="btn btn-primary px-4 d-block d-md-inline-block w-100 w-md-auto">
//                 Add to List
//             </button>
//         </div>

//     </div>
// </div>




//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default WorkItemForm;

// import React, { useState, useEffect } from 'react';
// import { DropDownList } from "@progress/kendo-react-dropdowns";
// import { DatePicker } from "@progress/kendo-react-dateinputs";
// import WorkList from './WorkList'; // Import WorkList

// const AddWorkItem = () => {
//   const [formData, setFormData] = useState({
//     refNo: '',
//     description: '',
//     assignedTo: null,
//     targetDay: null,
//     status: '',
//     priority: ''
//   });

//   const [workItems, setWorkItems] = useState([]);

//   const [employees, setEmployees] = useState([]);
//   const statusOptions = [
//     { id: 'Pending', name: 'Pending' },
//     { id: 'In Progress', name: 'In Progress' },
//     { id: 'Completed', name: 'Completed' }
//   ];
//   const priorityOptions = [
//     { id: 'Low', name: 'Low' },
//     { id: 'Normal', name: 'Normal' },
//     { id: 'High', name: 'High' }
//   ];

//   useEffect(() => {
//     // Mock employee data
//     const mockData = [
//       { id: 1, name: 'John Doe' },
//       { id: 2, name: 'Jane Smith' },
//       { id: 3, name: 'Robert Brown' },
//       { id: 4, name: 'Emily White' }
//     ];
//     setEmployees(mockData);
//   }, []);

//   // Handle input changes
//   const handleInputChange = (e) => {
//     const { id, value } = e.target;
//     setFormData({ ...formData, [id]: value });
//   };

//   const handleDropDownChange = (key) => (value) => {
//     setFormData({ ...formData, [key]: value });
//   };

//   const handleDateChange = (e) => setFormData({ ...formData, targetDay: e.value });

//   // Add new work item to the list
//   const handleSave = (e) => {
//     e.preventDefault();
//     if (!formData.refNo || !formData.description) return; // basic validation
//     const newItem = {
//       id: workItems.length + 1,
//       refNo: formData.refNo,
//       description: formData.description,
//       person: employees.find(e => e.id === formData.assignedTo)?.name || '-',
//       targetDay: formData.targetDay ? formData.targetDay.toLocaleDateString() : '-',
//       status: formData.status || 'Pending',
//       priority: formData.priority || 'Normal'
//     };
//     setWorkItems([...workItems, newItem]);
//     // Reset form
//     setFormData({
//       refNo: '',
//       description: '',
//       assignedTo: null,
//       targetDay: null,
//       status: '',
//       priority: ''
//     });
//   };

//   return (
//     <div className="container-fluid p-4 bg-light">
//       {/* Header */}
//       <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3">
//         <h3 className="fw-bold text-dark">Work Note List / Tagging</h3>
//         <span className="text-muted small">Assign work items to team members & keep track</span>
//       </div>

//       {/* Form Card */}
//       <div className="card shadow-sm">
//         <div className="card-body">
//           <form onSubmit={handleSave}>

// {/* First Row */}
// <div className="row g-3">
//   <div className="col-12 col-md-2">
//     <label htmlFor="refNo" className="form-label fw-bold mb-1">Ref / No.</label>
//     <input
//       type="text"
//       className="form-control form-control-lg"
//       id="refNo"
//       value={formData.refNo}
//       onChange={handleInputChange}
//     />
//   </div>
//   <div className="col-12 col-md-5">
//     <label htmlFor="description" className="form-label fw-bold mb-1">Work Description</label>
//     <input
//       type="text"
//       className="form-control form-control-lg"
//       id="description"
//       value={formData.description}
//       onChange={handleInputChange}
//     />
//   </div>
//   <div className="col-12 col-md-3">
//     <label htmlFor="assignedTo" className="form-label fw-bold mb-1">Assigned To</label>
//     <DropDownList
//       id="assignedTo"
//       data={employees}
//       textField="name"
//       dataItemKey="id"
//       value={employees.find(e => e.id === formData.assignedTo) || null}
//       onChange={(e) => handleDropDownChange("assignedTo")(e.value ? e.value.id : null)}
//     />
//   </div>
//   <div className="col-12 col-md-2">
//     <label htmlFor="targetDay" className="form-label fw-bold mb-1">Target Day</label>
//     <DatePicker
//       id="targetDay"
//       value={formData.targetDay}
//       onChange={handleDateChange}
//     />
//   </div>
// </div>

// {/* Second Row */}
// <div className="row g-3 mt-2">
//   <div className="col-12 col-md-3">
//     <label htmlFor="status" className="form-label fw-bold mb-1">Status</label>
//     <DropDownList
//       id="status"
//       data={statusOptions}
//       textField="name"
//       dataItemKey="id"
//       value={statusOptions.find(s => s.id === formData.status) || null}
//       onChange={(e) => handleDropDownChange("status")(e.value ? e.value.id : null)}
//     />
//   </div>
//   <div className="col-12 col-md-3">
//     <label htmlFor="priority" className="form-label fw-bold mb-1">Priority</label>
//     <DropDownList
//       id="priority"
//       data={priorityOptions}
//       textField="name"
//       dataItemKey="id"
//       value={priorityOptions.find(p => p.id === formData.priority) || null}
//       onChange={(e) => handleDropDownChange("priority")(e.value ? e.value.id : null)}
//     />
//   </div>
// </div>

//             {/* Buttons */}
// <div className="row mt-4 pt-3 border-top">
//   <div className="col-12 d-flex flex-column flex-md-row justify-content-between gap-2">
//     <div className="d-flex gap-2 flex-row w-100 flex-md-auto">
//       <button type="submit" className="btn btn-primary px-4 w-100 w-md-auto">Save</button>
//       <button type="button" className="btn btn-secondary px-4 w-100 w-md-auto" onClick={() => setFormData({
//         refNo: '', description: '', assignedTo: null, targetDay: null, status: '', priority: ''
//       })}>Cancel</button>
//     </div>
//     <div className="mt-2 mt-md-0 text-md-end">
//       <button type="button" className="btn btn-primary px-4 w-100 w-md-auto" onClick={() => console.log("Add to List clicked")}>Add to List</button>
//     </div>
//   </div>
// </div>

//           </form>
//         </div>
//       </div>

//       {/* Work List */}
//       <WorkList workItems={workItems} />
//     </div>
//   );
// };

// export default AddWorkItem;

import React, { useState, useEffect } from 'react';
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { DatePicker } from "@progress/kendo-react-dateinputs";

const WorkItemForm = () => {
    const [formData, setFormData] = useState({
        refNo: '',
        description: '',
        assignedTo: null,
        targetDay: null,
        status: '',
        priority: ''
    });

    const [employees, setEmployees] = useState([]);
    const [message, setMessage] = useState({ text: '', type: '' }); // <-- Success/Error message

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

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/Employee`)
            .then(res => res.json())
            .then(data => {
                setEmployees(
                    data.map(emp => ({
                        id: emp.id,
                        name: emp.firstName   // 👈 Only show First Name
                    }))
                );
            })
            .catch(() => setEmployees([]));
    }, []);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleDropDownChange = (key) => (value) => {
        setFormData({ ...formData, [key]: value });
    };

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
        } else {
            setMessage({ text: "Failed to save!", type: "danger" });
        }
    };


    return (
        <div className="container-fluid p-4 bg-light">
            <div className="d-flex justify-content-between align-items-center mb-3">

                <button
                    icon="arrow-left"
                    type="button"
                    className="btn btn-light border px-4"
                    onClick={() => navigate("/work-items")}
                >
                    Back
                </button>

                <span className="text-muted small">
                    Assign work items to team members & keep track
                </span>

            </div>

            <div className="card shadow-sm">
                <div className="card-body">
                    <form onSubmit={handleSave}>
                        {/* Form fields: Ref No, Description, Assigned To, Target Day */}
                        {/* ... your existing input code ... */}
                        {/* First Row */}
                        <div className="row g-3">
                            <div className="col-12 col-md-2">
                                <label htmlFor="refNo" className="form-label fw-bold mb-1">Ref / No.</label>
                                <input
                                    type="text"
                                    className="form-control form-control-lg"
                                    id="refNo"
                                    value={formData.refNo}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="col-12 col-md-5">
                                <label htmlFor="description" className="form-label fw-bold mb-1">Work Description</label>
                                <input
                                    type="text"
                                    className="form-control form-control-lg"
                                    id="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                />
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
                                    onChange={(e) =>
                                        handleDropDownChange("assignedTo")(e.value ? e.value.id : null)
                                    }
                                    style={{ width: "100%" }}
                                />
                            </div>


                            <div className="col-12 col-md-2">
                                <label htmlFor="targetDay" className="form-label fw-bold mb-1">Target Day</label>
                                <DatePicker
                                    id="targetDay"
                                    value={formData.targetDay}
                                    onChange={handleDateChange}
                                />
                            </div>
                        </div>

                        {/* Second Row */}
                        <div className="row g-3 mt-2">
                            <div className="col-12 col-md-3">
                                <label htmlFor="status" className="form-label fw-bold mb-1">Status</label>
                                <DropDownList
                                    id="status"
                                    data={statusOptions}
                                    textField="name"
                                    dataItemKey="id"
                                    value={statusOptions.find(s => s.id === formData.status) || null}
                                    onChange={(e) => handleDropDownChange("status")(e.value ? e.value.id : null)}
                                />
                            </div>
                            <div className="col-12 col-md-3">
                                <label htmlFor="priority" className="form-label fw-bold mb-1">Priority</label>
                                <DropDownList
                                    id="priority"
                                    data={priorityOptions}
                                    textField="name"
                                    dataItemKey="id"
                                    value={priorityOptions.find(p => p.id === formData.priority) || null}
                                    onChange={(e) => handleDropDownChange("priority")(e.value ? e.value.id : null)}
                                />
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="row mt-4 pt-3 border-top">
                            <div className="col-12 d-flex flex-column flex-md-row justify-content-between gap-2">

                                {/* Save & Cancel */}
                                <div className="d-flex gap-2 flex-row">
                                    <button type="submit" className="btn btn-primary px-4 d-block d-md-inline-block w-100 w-md-auto">
                                        Save
                                    </button>
                                    <button
                                        type="button"
                                        /* changed btn-secondary to btn-light border */
                                        className="btn btn-light border px-4 d-block d-md-inline-block w-100 w-md-auto"
                                        onClick={() => console.log("Cancelled")}
                                    >
                                        Cancel
                                    </button>
                                </div>

                                {/* Add to List */}
                                {/* <div className="mt-2 mt-md-0 text-md-end">
                                    <button type="button" className="btn btn-primary px-4 d-block d-md-inline-block w-100 w-md-auto">
                                        Add to List
                                    </button>
                                </div> */}

                            </div>
                        </div>

                        {/* Success / Error Message */}
                        {message.text && (
                            <div
                                className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"} mt-3`}
                                style={{
                                    fontWeight: 600,
                                    borderRadius: "8px",
                                    padding: "10px 15px",
                                    textAlign: "center",
                                }}
                            >
                                {message.text}
                            </div>
                        )}

                    </form>
                </div>
            </div>
        </div>
    );
};

export default WorkItemForm;
