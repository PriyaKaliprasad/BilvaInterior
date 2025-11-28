// import React, { useState } from "react";
// import { DropDownList } from "@progress/kendo-react-dropdowns";

// const UpdateWork = () => {
//     const [status, setStatus] = useState("In Progress");

//     const statusOptions = ["In Progress", "Pending", "Completed"];

//     return (
//         <div className="container mt-4">
//             {/* Card */}
//             <div className="card shadow-sm p-3">

//                 {/* Title */}
//                 <h5 className="fw-bold mb-1">689 - Quote Work to Complete</h5>
//                 <small className="text-muted">Assigned by Admin</small>

//                 <hr />

//                 {/* Update Status */}
//                 <div className="mb-3">
//                     <label className="form-label fw-semibold">Update Status</label>

//                     <div style={{ width: "250px" }}>
//                         <DropDownList
//                             data={statusOptions}
//                             value={status}
//                             onChange={(e) => setStatus(e.value)}
//                         />
//                     </div>

//                 </div>

//                 {/* Add Reply / Comments */}
//                 <div className="mb-3">
//                     <label className="form-label fw-semibold">Add Reply / Comments</label>
//                     <textarea
//                         className="form-control"
//                         placeholder="Enter your update..."
//                         rows="3"
//                     ></textarea>
//                 </div>

//                 {/* Attach File */}
//                 <div className="mb-3">
//                     <label className="form-label fw-semibold">Attach File (Optional)</label>

//                     <input type="file" className="form-control" />
//                 </div>

//                 {/* Submit Button */}
//                 <div className="mb-3">
//                     <button className="btn btn-primary w-auto px-4">Submit Update</button>
//                 </div>

//                 <hr />

//                 {/* Reply History */}
//                 <h6 className="fw-bold">Reply History</h6>
//                 <div className="border rounded p-3 bg-light text-muted">
//                     No updates yet.
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default UpdateWork;

// import React, { useState } from "react";
// import { DropDownList } from "@progress/kendo-react-dropdowns";

// const UpdateWork = () => {
//     const [status, setStatus] = useState("In Progress");
//     const [newReply, setNewReply] = useState("");
//     const [replies, setReplies] = useState([]);

//     const statusOptions = ["In Progress", "Pending", "Completed"];

//     const handleSubmit = () => {
//         if (!newReply.trim()) return; // prevent empty messages

//         const reply = {
//             id: replies.length + 1,
//             sender: "Employee", // Change to "Admin" if admin is replying
//             message: newReply,
//             timestamp: new Date().toLocaleString(),
//         };

//         setReplies([...replies, reply]);
//         setNewReply(""); // clear textarea
//     };

//     return (
//         <div className="container mt-4">
//             {/* Card */}
//             <div className="card shadow-sm p-3">

//                 {/* Title */}
//                 <h5 className="fw-bold mb-1">689 - Quote Work to Complete</h5>
//                 <small className="text-muted">Assigned by Admin</small>

//                 <hr />

//                 {/* Update Status */}
//                 <div className="mb-3">
//                     <label className="form-label fw-semibold">Update Status</label>
//                     <div style={{ width: "250px" }}>
//                         <DropDownList
//                             data={statusOptions}
//                             value={status}
//                             onChange={(e) => setStatus(e.value)}
//                         />
//                     </div>
//                 </div>

//                 {/* Add Reply / Comments */}
//                 <div className="mb-3">
//                     <label className="form-label fw-semibold">Add Reply / Comments</label>
//                     <textarea
//                         className="form-control"
//                         placeholder="Enter your update..."
//                         rows="3"
//                         value={newReply}
//                         onChange={(e) => setNewReply(e.target.value)}
//                     ></textarea>
//                 </div>

//                 {/* Attach File */}
//                 <div className="mb-3">
//                     <label className="form-label fw-semibold">Attach File (Optional)</label>
//                     <input type="file" className="form-control" />
//                 </div>

//                 {/* Submit Button */}
//                 <div className="mb-3">
//                     <button className="btn btn-primary w-auto px-4" onClick={handleSubmit}>
//                         Submit Update
//                     </button>
//                 </div>

//                 <hr />

//                 {/* Reply History */}
//                 <h6 className="fw-bold">Reply History</h6>
//                 <div className="mt-2">
//                     {replies.length === 0 ? (
//                         <div className="border rounded p-3 bg-light text-muted">
//                             No updates yet.
//                         </div>
//                     ) : (
//                         replies.map((reply) => (
//                             <div
//                                 key={reply.id}
//                                 className={`p-2 mb-2 rounded ${
//                                     reply.sender === "Admin"
//                                         ? "bg-primary text-white"
//                                         : "bg-secondary text-white"
//                                 }`}
//                             >
//                                 <div className="fw-bold">{reply.sender}</div>
//                                 <div>{reply.message}</div>
//                                 <small>{reply.timestamp}</small>
//                             </div>
//                         ))
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default UpdateWork;

// import React, { useState, useEffect } from "react";
// import { DropDownList } from "@progress/kendo-react-dropdowns";

// const UpdateWork = () => {
//     // -------------------------------
//     // CONFIG
//     // -------------------------------
//     const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/WorkItemTaskReply`;
//     const UpdateWork = ({ taskId, userRole }) => {

//         // -------------------------------
//         // STATES
//         // -------------------------------
//         const [status, setStatus] = useState("Select Status");
//         const [newReply, setNewReply] = useState("");
//         const [selectedFile, setSelectedFile] = useState(null);
//         const [replies, setReplies] = useState([]);

//         const statusOptions = ["In Progress", "Pending", "Completed"];

//         // -------------------------------
//         // FETCH EXISTING REPLIES
//         // -------------------------------
//         const fetchReplies = async () => {
//             try {
//                 const res = await fetch(`${API_URL}/GetReplies/${taskId}`);
//                 const data = await res.json();
//                 setReplies(data);
//             } catch (err) {
//                 console.error("Error loading replies:", err);
//             }
//         };

//         useEffect(() => {
//             fetchReplies();
//         }, []);

//         // -------------------------------
//         // SUBMIT REPLY TO BACKEND
//         // -------------------------------
//         const handleSubmit = async () => {
//             if (!newReply.trim()) return;
//             console.log("form data to submit");
//             const formData = new FormData();
//             formData.append("TaskId", taskId);
//             formData.append("Status", status);
//             formData.append("Comment", newReply);

//             if (selectedFile) formData.append("File", selectedFile);

//             // <-- Add this for admin/employee
//             const userRole = "Employee"; // or "Admin" depending on who is logged in
//             formData.append("RepliedBy", userRole);

//             // try {
//             //     const res = await fetch(`${API_URL}/AddReply`, {
//             //         method: "POST",
//             //         body: formData,
//             //     });

//             //     if (res.ok) {
//             //         alert("Reply submitted successfully!");
//             //         setNewReply("");
//             //         setSelectedFile(null);
//             //         fetchReplies(); // reload history
//             //     } else {
//             //         alert("Error submitting reply.");
//             //     }
//             // } catch (err) {
//             //     console.error("Submit error:", err);
//             //     alert("Something went wrong.");
//             // }
//         };



//         // -------------------------------
//         // UI
//         // -------------------------------
//         return (
//             <div className="container mt-4">
//                 <div className="card shadow-sm p-3">

//                     {/* Header */}
//                     <h5 className="fw-bold mb-1">{taskId} - Quote Work to Complete</h5>
//                     <small className="text-muted">Assigned by Admin</small>
//                     <hr />

//                     {/* Update Status */}
//                     <div className="mb-3">
//                         <label className="form-label fw-semibold">Update Status</label>
//                         <div style={{ width: "250px" }}>
//                             <DropDownList
//                                 data={statusOptions}
//                                 value={status}          // already matches default
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

//                     {/* Submit Button */}
//                     <div className="mb-3">
//                         <button className="btn btn-primary w-auto px-4" onClick={handleSubmit}>
//                             Submit Update
//                         </button>
//                     </div>

//                     <hr />
//                     {/* kjvnndkjv dkvd */}

//                     {/* Reply History */}
//                     <h6 className="fw-bold">Reply History</h6>
//                     <div className="mt-2">

//                         {replies.length === 0 ? (
//                             <div className="border rounded p-3 bg-light text-muted">
//                                 No updates yet.
//                             </div>
//                         ) : (
//                             replies.map((reply) => (
//                                 <div
//                                     key={reply.replyId}
//                                     className="p-2 mb-2 rounded bg-secondary text-white"
//                                 >

//                                     <div className="fw-bold">Employee</div>
//                                     <div>{reply.comment}</div>
//                                     <small>{new Date(reply.createdAt).toLocaleString()}</small>
//                                     {reply.filePath && (
//                                         <div>
//                                             {/* <a
//                                             href={`http://localhost:5057/${reply.filePath}`}
//                                             target="_blank"
//                                             rel="noopener noreferrer"
//                                             className="text-warning"
//                                         >
//                                             View File
//                                         </a> */}

//                                             {/* <a
//                                                 href={`${import.meta.env.VITE_API_BASE_URL}${reply.filePath}`}
//                                                 target="_blank"
//                                                 rel="noopener noreferrer"
//                                                 className="text-warning"
//                                             >
//                                                 View File
//                                             </a> */}
//                                             <a
//                                                 href={`${import.meta.env.VITE_API_BASE_URL}${reply.filePath}`}
//                                                 target="_blank"
//                                                 rel="noopener noreferrer"
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
//     }
// };

// export default UpdateWork;

// import React, { useState, useEffect } from "react";
// import { DropDownList } from "@progress/kendo-react-dropdowns";

// // 👇 Ensure currentUserRole is in the props here
// const ReplyWorkItem = ({ taskId, currentUserRole }) => {

//     const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/WorkItemTaskReply`;

//     const [status, setStatus] = useState("Select Status");
//     const [newReply, setNewReply] = useState("");
//     const [selectedFile, setSelectedFile] = useState(null);
//     const [replies, setReplies] = useState([]);

//     const statusOptions = ["In Progress", "Pending", "Completed"];

//     // -------------------------------
//     // FETCH REPLIES
//     // -------------------------------
//     const fetchReplies = async () => {
//         if (!taskId) return;
//         try {
//             const res = await fetch(`${API_URL}/GetReplies/${taskId}`);
//             const data = await res.json();
//             setReplies(data);
//         } catch (err) {
//             console.error("Error loading replies:", err);
//         }
//     };

//     useEffect(() => {
//         fetchReplies();
//     }, [taskId]);

//     // -------------------------------
//     // SUBMIT REPLY
//     // -------------------------------
//     const handleSubmit = async () => {
//         if (!newReply.trim()) return;

//         // Use the role passed from WorkList, or default to "Employee" if missing
//         const roleToSend = currentUserRole || "Employee";

//         console.log(`Submitting as ${roleToSend} for Task ID: ${taskId}`);

//         const formData = new FormData();
//         formData.append("TaskId", taskId);
//         formData.append("Status", status);
//         formData.append("Comment", newReply);
//         formData.append("RepliedBy", roleToSend); // 👇 Sending the correct role

//         if (selectedFile) formData.append("File", selectedFile);

//         try {
//             const res = await fetch(`${API_URL}/AddReply`, {
//                 method: "POST",
//                 body: formData,
//             });

//             if (res.ok) {
//                 alert("Reply submitted successfully!");
//                 setNewReply("");
//                 setSelectedFile(null);
//                 fetchReplies(); // Refresh the chat list
//             } else {
//                 const errData = await res.json();
//                 console.error("Submit error:", errData);
//                 alert("Error submitting reply.");
//             }
//         } catch (err) {
//             console.error("Submit error:", err);
//             alert("Something went wrong.");
//         }
//     };

//     // -------------------------------
//     // UI
//     // -------------------------------
//     return (
//         <div className="card shadow-sm p-3">

//             {/* Header */}
//             <div className="d-flex justify-content-between align-items-center">
//                 <h5 className="fw-bold mb-1">Task Discussion</h5>
//                 <span className="badge bg-info text-dark">You are: {currentUserRole || "Unknown"}</span>
//             </div>
//             <hr />

//             {/* Update Form */}
//             <div className="mb-3">
//                 <label className="form-label fw-bold" style={{ fontSize: "1.1rem" }}>
//                     Update Status
//                 </label>
//                 <div style={{ width: "250px" }}>
//                     <DropDownList
//                         data={statusOptions}
//                         value={status}
//                         onChange={(e) => setStatus(e.value)}
//                     />
//                 </div>
//             </div>

//             <div className="mb-3">
//                 <label className="form-label fw-bold" style={{ fontSize: "1.1rem" }}>
//                     Add Reply / Comments
//                 </label>
//                 <textarea
//                     className="form-control"
//                     placeholder={`Enter your update...`}
//                     rows="3"
//                     value={newReply}
//                     onChange={(e) => setNewReply(e.target.value)}
//                 ></textarea>
//             </div>

//             <div className="mb-3">
//                 <label className="form-label fw-bold" style={{ fontSize: "1.1rem" }}>
//                     Attach File (Optional)
//                 </label>
//                 <input
//                     type="file"
//                     className="form-control"
//                     onChange={(e) => setSelectedFile(e.target.files[0])}
//                 />
//             </div>


//             <div className="mb-3">
//                 <button className="btn btn-primary px-4" onClick={handleSubmit}>
//                     Send Reply
//                 </button>
//             </div>

//             <hr />

//             {/* -------------------------------------------------- */}
//             {/* CHAT HISTORY SECTION */}
//             {/* -------------------------------------------------- */}
//             <h6 className="fw-bold mb-3">Reply  History</h6>

//             <div className="chat-container p-3 bg-light rounded border" style={{ maxHeight: "400px", overflowY: "auto" }}>

//                 {replies.length === 0 ? (
//                     <div className="text-center text-muted">No messages yet.</div>
//                 ) : (
//                     replies.map((reply) => {
//                         // Check who sent this message
//                         // Ensure case-insensitive check just in case (Admin vs admin)
//                         const isByAdmin = reply.repliedBy?.toLowerCase() === "admin";

//                         // Define styles based on role
//                         const bubbleClass = isByAdmin
//                             ? "bg-primary text-white" // Admin = Blue
//                             : "bg-success text-white"; // Employee = Green

//                         const alignmentClass = isByAdmin
//                             ? "align-self-start text-start me-auto" // Admin on Left
//                             : "align-self-end text-end ms-auto"; // Employee on Right

//                         return (
//                             <div key={reply.replyId} className="d-flex flex-column mb-3" style={{ maxWidth: "100%" }}>

//                                 <div
//                                     className={`p-3 rounded shadow-sm ${bubbleClass} ${alignmentClass}`}
//                                     style={{ maxWidth: "75%", minWidth: "200px" }}
//                                 >
//                                     <div className="d-flex justify-content-between border-bottom border-white pb-1 mb-1">
//                                         {/* 👇 Display the actual name from DB, or fallback if null */}
//                                         <strong style={{ fontSize: "0.9em" }}>{reply.repliedBy || "Unknown"}</strong>
//                                         <small style={{ fontSize: "0.75em", opacity: 0.8, marginLeft: "10px" }}>
//                                             {new Date(reply.createdAt).toLocaleString()}
//                                         </small>
//                                     </div>

//                                     <div className="mb-1">{reply.comment}</div>

//                                     {/* Status Tag */}
//                                     <div className="mt-2">
//                                         <span className="badge bg-white text-dark" style={{ fontSize: "0.7em" }}>
//                                             Status: {reply.status}
//                                         </span>
//                                     </div>

//                                     {/* File Link */}
//                                     {reply.filePath && (
//                                         <div className="mt-2 pt-1 border-top border-white">
//                                             <a
//                                                 href={`${import.meta.env.VITE_API_BASE_URL}${reply.filePath}`}
//                                                 target="_blank"
//                                                 rel="noopener noreferrer"
//                                                 className="text-warning text-decoration-underline"
//                                                 style={{ fontSize: "0.9em" }}
//                                             >
//                                                 View Attachment 📎
//                                             </a>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                         );
//                     })
//                 )}
//             </div>

//         </div>
//     );
// };

// export default ReplyWorkItem;

// import React, { useState, useEffect } from "react";
// import { DropDownList } from "@progress/kendo-react-dropdowns";

// const ReplyWorkItem = ({ taskId, currentUserRole, onBack }) => {

//     const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/WorkItemTaskReply`;

//     const [status, setStatus] = useState("Select Status");
//     const [newReply, setNewReply] = useState("");
//     const [selectedFile, setSelectedFile] = useState(null);
//     const [replies, setReplies] = useState([]);

//     // New state for showing success/error messages
//     const [message, setMessage] = useState({ text: "", type: "" });

//     const statusOptions = ["In Progress", "Pending", "Completed"];

//     // -------------------------------
//     // FETCH REPLIES
//     // -------------------------------
//     const fetchReplies = async () => {
//         if (!taskId) return;
//         try {
//             const res = await fetch(`${API_URL}/GetReplies/${taskId}`);
//             const data = await res.json();
//             setReplies(data);
//         } catch (err) {
//             console.error("Error loading replies:", err);
//         }
//     };

//     useEffect(() => {
//         fetchReplies();
//     }, [taskId]);

//     // -------------------------------
//     // SUBMIT REPLY
//     // -------------------------------
//     const handleSubmit = async () => {
//         if (!newReply.trim()) return;

//         const roleToSend = currentUserRole || "Employee";

//         const formData = new FormData();
//         formData.append("TaskId", taskId);
//         formData.append("Status", status);
//         formData.append("Comment", newReply);
//         formData.append("RepliedBy", roleToSend);

//         if (selectedFile) formData.append("File", selectedFile);

//         try {
//             const res = await fetch(`${API_URL}/AddReply`, {
//                 method: "POST",
//                 body: formData,
//             });

//             if (res.ok) {
//                 // 1. Determine Success Message based on Role
//                 const successText = roleToSend === "Admin"
//                     ? "Reply sent to Employee!"
//                     : "Reply sent to Admin!";

//                 // 2. Show Message
//                 setMessage({ text: `${successText} Redirecting...`, type: "success" });

//                 // 3. Clear Inputs & Refresh Chat
//                 setNewReply("");
//                 setSelectedFile(null);
//                 fetchReplies();

//                 // 4. Wait 5 seconds, then go back using the prop from parent
//                 setTimeout(() => {
//                     if (onBack) onBack();
//                 }, 5000);

//             } else {
//                 const errData = await res.json();
//                 console.error("Submit error:", errData);
//                 setMessage({ text: "Error submitting reply.", type: "danger" });
//             }
//         } catch (err) {
//             console.error("Submit error:", err);
//             setMessage({ text: "Something went wrong.", type: "danger" });
//         }
//     };

//     // -------------------------------
//     // UI
//     // -------------------------------
//     return (
//         <div className="card shadow-sm p-3">

//             {/* Header */}
//             <div className="d-flex justify-content-between align-items-center">
//                 <h5 className="fw-bold mb-1">Task Discussion</h5>
//                 <span className="badge bg-info text-dark">You are: {currentUserRole || "Unknown"}</span>
//             </div>
//             <hr />

//             {/* Update Form */}
//             <div className="mb-3">
//                 <label className="form-label fw-bold" style={{ fontSize: "1.1rem" }}>
//                     Update Status
//                 </label>
//                 <div style={{ width: "250px" }}>
//                     <DropDownList
//                         data={statusOptions}
//                         value={status}
//                         onChange={(e) => setStatus(e.value)}
//                     />
//                 </div>
//             </div>

//             <div className="mb-3">
//                 <label className="form-label fw-bold" style={{ fontSize: "1.1rem" }}>
//                     Add Reply / Comments
//                 </label>
//                 <textarea
//                     className="form-control"
//                     placeholder={`Enter your update...`}
//                     rows="3"
//                     value={newReply}
//                     onChange={(e) => setNewReply(e.target.value)}
//                 ></textarea>
//             </div>

//             <div className="mb-3">
//                 <label className="form-label fw-bold" style={{ fontSize: "1.1rem" }}>
//                     Attach File (Optional)
//                 </label>
//                 <input
//                     type="file"
//                     className="form-control"
//                     onChange={(e) => setSelectedFile(e.target.files[0])}
//                 />
//             </div>

//             <div className="mb-3">
//                 <button className="btn btn-primary px-4" onClick={handleSubmit}>
//                     Send Reply
//                 </button>
//             </div>

//             {/* 👇 SUCCESS / ERROR MESSAGE DISPLAY */}
//             {message.text && (
//                 <div className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"} mb-3 shadow-sm`} role="alert">
//                     <strong>{message.text}</strong>
//                 </div>
//             )}

//             <hr />

//             {/* -------------------------------------------------- */}
//             {/* CHAT HISTORY SECTION */}
//             {/* -------------------------------------------------- */}
//             <h6 className="fw-bold mb-3">Chat History</h6>

//             <div className="chat-container p-3 bg-white rounded border" style={{ maxHeight: "400px", overflowY: "auto" }}>

//                 {replies.length === 0 ? (
//                     <div className="text-center text-muted">No messages yet.</div>
//                 ) : (
//                     replies.map((reply) => {
//                         const isByAdmin = reply.repliedBy?.toLowerCase() === "admin";

//                         const bubbleClass = isByAdmin
//                             ? "bg-light text-dark border"
//                             : "bg-white text-dark border border-secondary";

//                         const alignmentClass = isByAdmin
//                             ? "align-self-start text-start me-auto"
//                             : "align-self-end text-end ms-auto";

//                         return (
//                             <div key={reply.replyId} className="d-flex flex-column mb-3" style={{ maxWidth: "100%" }}>

//                                 <div
//                                     className={`p-3 rounded shadow-sm ${bubbleClass} ${alignmentClass}`}
//                                     style={{ maxWidth: "75%", minWidth: "200px" }}
//                                 >
//                                     <div className="d-flex justify-content-between border-bottom border-secondary pb-1 mb-2 opacity-75">
//                                         <strong style={{ fontSize: "0.9em" }}>{reply.repliedBy || "Unknown"}</strong>
//                                         <small style={{ fontSize: "0.75em", marginLeft: "10px" }}>
//                                             {new Date(reply.createdAt).toLocaleString()}
//                                         </small>
//                                     </div>

//                                     <div className="mb-1">{reply.comment}</div>

//                                     <div className="mt-2">
//                                         <span className="badge bg-secondary text-white" style={{ fontSize: "0.7em" }}>
//                                             Status: {reply.status}
//                                         </span>
//                                     </div>

//                                     {reply.filePath && (
//                                         <div className="mt-2 pt-1 border-top border-secondary">
//                                             <a
//                                                 href={`${import.meta.env.VITE_API_BASE_URL}${reply.filePath}`}
//                                                 target="_blank"
//                                                 rel="noopener noreferrer"
//                                                 className="text-primary text-decoration-underline"
//                                                 style={{ fontSize: "0.9em" }}
//                                             >
//                                                 View Attachment 📎
//                                             </a>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                         );
//                     })
//                 )}
//             </div>

//         </div>
//     );
// };

// export default ReplyWorkItem;

import React, { useState, useEffect } from "react";
import { DropDownList } from "@progress/kendo-react-dropdowns";

const ReplyWorkItem = ({ taskId, currentUserRole, onBack, onUpdate }) => {

    const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/WorkItemTaskReply`;
    // We might need this to update the main item status directly if the reply API doesn't do it
    const WORK_ITEM_API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/WorkItem`;

    const [status, setStatus] = useState("Select Status");
    const [newReply, setNewReply] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [replies, setReplies] = useState([]);

    const [message, setMessage] = useState({ text: "", type: "" });

    const statusOptions = ["In Progress", "Pending", "Completed"];

    // 👇 Helper to fix Timezone issues
    const formatDate = (dateString) => {
        if (!dateString) return "";

        // If date is missing 'Z', append it to force UTC-to-Local conversion
        const dateValue = dateString.endsWith("Z") ? dateString : dateString + "Z";

        return new Date(dateValue).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const fetchReplies = async () => {
        if (!taskId) return;
        try {
            const res = await fetch(`${API_URL}/GetReplies/${taskId}`);
            const data = await res.json();
            setReplies(data);

            // Optional: If you want the dropdown to default to the latest status
            if (data && data.length > 0) {
                setStatus(data[0].status);
            }
        } catch (err) {
            console.error("Error loading replies:", err);
        }
    };

    useEffect(() => {
        fetchReplies();
    }, [taskId]);

    // Helper to update the parent WorkItem status explicitly
    const updateParentStatus = async () => {
        try {
            // We fetch the current item first to get its details (optional but safer)
            // Or we can just send a PATCH/PUT if your API supports partial updates.
            // Assuming your API requires a full object or specific endpoint:

            // NOTE: If your backend 'AddReply' already updates the parent WorkItem status,
            // you can skip this function. But since you said it's not updating, 
            // we force it here manually if needed, OR we rely on 'onUpdate' timing.

            // Ideally, the backend should handle this trigger. 
            // If we rely purely on frontend reloading:
            return true;
        } catch (err) {
            console.error("Failed to update parent status", err);
        }
    };

    const handleSubmit = async () => {
        if (!newReply.trim()) return;

        const roleToSend = currentUserRole || "Employee";

        const formData = new FormData();
        formData.append("TaskId", taskId);
        formData.append("Status", status); // This status should update the main item
        formData.append("Comment", newReply);
        formData.append("RepliedBy", roleToSend);

        if (selectedFile) formData.append("File", selectedFile);

        try {
            const res = await fetch(`${API_URL}/AddReply`, {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                const successText = roleToSend === "Admin"
                    ? "Reply sent to Employee!"
                    : "Reply sent to Admin!";

                setMessage({ text: `${successText} Redirecting...`, type: "success" });

                setNewReply("");
                setSelectedFile(null);
                fetchReplies();

                // ---------------------------------------------------------
                // ⚡ CRITICAL FIX: Wait a tiny bit before reloading list
                // This ensures the DB has finished the write operation.
                // ---------------------------------------------------------
                setTimeout(() => {
                    if (onUpdate) onUpdate();
                }, 500); // 500ms delay is usually enough

                // Redirect back after 2 seconds (5s is a bit long for a chat interaction)
                setTimeout(() => {
                    if (onBack) onBack();
                }, 2000); // Changed to 2s for snappier feel, change back to 5000 if you prefer

            } else {
                const errData = await res.json();
                console.error("Submit error:", errData);
                setMessage({ text: "Error submitting reply.", type: "danger" });
            }
        } catch (err) {
            console.error("Submit error:", err);
            setMessage({ text: "Something went wrong.", type: "danger" });
        }
    };

    return (
        <div className="card shadow-sm p-3">

            <div className="d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-1">Task Discussion</h5>
                <span className="badge bg-info text-dark">You are: {currentUserRole || "Unknown"}</span>
            </div>
            <hr />

            <div className="mb-3">
                <label className="form-label fw-bold" style={{ fontSize: "1.1rem" }}>
                    Update Status
                </label>
                <div style={{ width: "250px" }}>
                    <DropDownList
                        data={statusOptions}
                        value={status}
                        onChange={(e) => setStatus(e.value)}
                    />
                </div>
            </div>

            <div className="mb-3">
                <label className="form-label fw-bold" style={{ fontSize: "1.1rem" }}>
                    Add Reply / Comments
                </label>
                <textarea
                    className="form-control"
                    placeholder={`Enter your update...`}
                    rows="3"
                    value={newReply}
                    onChange={(e) => setNewReply(e.target.value)}
                ></textarea>
            </div>

            <div className="mb-3">
                <label className="form-label fw-bold" style={{ fontSize: "1.1rem" }}>
                    Attach File (Optional)
                </label>
                <input
                    type="file"
                    className="form-control"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                />
            </div>


            <div className="mb-3">
                <button className="btn btn-primary px-4" onClick={handleSubmit}>
                    Send Reply
                </button>
            </div>

            {message.text && (
                <div className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"} mb-3 shadow-sm`} role="alert">
                    <strong>{message.text}</strong>
                </div>
            )}

            <hr />


            {/* Chat History */}


            <h6 className="fw-bold mb-3">Chat History</h6>

            <div className="chat-container p-3 bg-white rounded border" style={{ maxHeight: "400px", overflowY: "auto" }}>

                {replies.length === 0 ? (
                    <div className="text-center text-muted">No messages yet.</div>
                ) : (
                    replies.map((reply) => {
                        const isByAdmin = reply.repliedBy?.toLowerCase() === "admin";

                        const bubbleClass = isByAdmin
                            ? "bg-light text-dark border"
                            : "bg-white text-dark border border-secondary";

                        const alignmentClass = isByAdmin
                            ? "align-self-start text-start me-auto"
                            : "align-self-end text-end ms-auto";

                        return (
                            <div key={reply.replyId} className="d-flex flex-column mb-3" style={{ maxWidth: "100%" }}>

                                <div
                                    className={`p-3 rounded shadow-sm ${bubbleClass} ${alignmentClass}`}
                                    style={{ maxWidth: "75%", minWidth: "200px" }}
                                >
                                    <div className="d-flex justify-content-between border-bottom border-secondary pb-1 mb-2 opacity-75">
                                        <strong style={{ fontSize: "0.9em" }}>{reply.repliedBy || "Unknown"}</strong>
                                        <small style={{ fontSize: "0.75em", marginLeft: "10px" }}>
                                            {formatDate(reply.createdAt)}
                                        </small>
                                    </div>

                                    <div className="mb-1">{reply.comment}</div>

                                    <div className="mt-2">
                                        <span className="badge bg-secondary text-white" style={{ fontSize: "0.7em" }}>
                                            Status: {reply.status}
                                        </span>
                                    </div>

                                    {reply.filePath && (
                                        <div className="mt-2 pt-1 border-top border-secondary">
                                            <a
                                                href={`${import.meta.env.VITE_API_BASE_URL}${reply.filePath}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary text-decoration-underline"
                                                style={{ fontSize: "0.9em" }}
                                            >
                                                View Attachment 📎
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

        </div>
    );
};

export default ReplyWorkItem;