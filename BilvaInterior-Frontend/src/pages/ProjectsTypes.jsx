// import React, { useState, useEffect } from 'react';
// import './projectTypes.css';

// // KendoReact imports
// import { Grid, GridColumn } from '@progress/kendo-react-grid';
// import { Button } from '@progress/kendo-react-buttons';
// import { Form, Field, FormElement } from '@progress/kendo-react-form';
// import { Dialog } from '@progress/kendo-react-dialogs';
// import { Switch } from '@progress/kendo-react-inputs';

// // Custom components
// import FormInput from '../components/Form/FormInput';
// import CustomFormFieldSet from '../components/Form/CustomFormFieldSet';
// import { nameValidator } from '../utils/validators';

// export default function ProjectTypes() {
//   const [projectTypes, setProjectTypes] = useState([]);
//   const [skip, setSkip] = useState(0);
//   const [take, setTake] = useState(6);
//   const [editItem, setEditItem] = useState(null);
//   const [successMessage, setSuccessMessage] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');

//   // ✅ Backend API URL
//   const apiUrl = 'https://localhost:7142/api/ProjectTypes';

//   // ✅ Load backend data
//   const fetchData = async () => {
//     try {
//       const res = await fetch(apiUrl);
//       if (res.ok) {
//         const data = await res.json();
//         setProjectTypes(data);
//       } else {
//         console.error('Failed to fetch project types:', await res.text());
//       }
//     } catch (err) {
//       console.error('Network error while fetching:', err);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   // ✅ Save updated project type (PUT to backend)
//   const handleEditSubmit = async (dataItem) => {
//     const newName = dataItem.typeName.trim();

//     // 1. If user didn’t change the name → just save
//     if (newName.toLowerCase() === editItem.name.trim().toLowerCase()) {
//       setErrorMessage('');
//     } else {
//       // 2. Check if another record already has this name
//       const duplicate = projectTypes.some(
//         (p) => p.name.trim().toLowerCase() === newName.toLowerCase()
//       );

//       if (duplicate) {
//         setErrorMessage('⚠️ Project type with this name already exists!');
//         return;
//       } else {
//         setErrorMessage('');
//       }
//     }

//     const updatedItem = {
//       ...editItem,
//       name: newName,
//       status: dataItem.status,
//     };

//     try {
//       const res = await fetch(`${apiUrl}/${editItem.id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(updatedItem),
//       });

//       if (res.ok) {
//         setProjectTypes((prev) =>
//           prev.map((p) => (p.id === editItem.id ? updatedItem : p))
//         );

//         // ✅ Show success
//         setSuccessMessage('✅ Project type saved successfully!');
//         setErrorMessage('');

//         setTimeout(() => {
//           setSuccessMessage('');
//           setEditItem(null); // close dialog
//         }, 3000);
//       } else {
//         const errMsg = await res.text();
//         setErrorMessage(`❌ Failed to update: ${errMsg}`);
//         console.error('Failed to update project type:', errMsg);
//       }
//     } catch (err) {
//       console.error('Network error while updating:', err);
//       setErrorMessage('❌ Network error while updating project type');
//     }
//   };

//   // Pagination
//   const handlePageChange = (event) => {
//     setSkip(event.page.skip);
//     setTake(event.page.take);
//   };

//   // ✅ Status cell
//   const StatusCell = (props) => {
//     const { status } = props.dataItem;
//     return (
//       <td>
//         <span
//           className={`badge ${status ? 'status-active' : 'status-inactive'}`}
//         >
//           {status ? 'Active' : 'Inactive'}
//         </span>
//       </td>
//     );
//   };

//   // Action cell
//   const ActionCell = (props) => (
//     <td>
//       <Button
//         themeColor="primary"
//         size="small"
//         onClick={() => setEditItem(props.dataItem)}
//       >
//         Edit
//       </Button>
//     </td>
//   );

//   // Switch field
//   const SwitchField = (fieldRenderProps) => (
//     <div className="k-form-field" style={{ marginTop: '12px' }}>
//       <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//         <label>Status</label>
//         <Switch
//           checked={fieldRenderProps.value}
//           onChange={(e) =>
//             fieldRenderProps.onChange({
//               value: e.value,
//             })
//           }
//           onLabel="ACTIVE"
//           offLabel="INACTIVE"
//         />
//       </div>
//     </div>
//   );

//   return (
//     <main className="page-container">
//       {/* ✅ Refresh Button */}
//       <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
//         <Button themeColor="primary" size="small" onClick={fetchData}>
//           Refresh
//         </Button>
//       </div>

//       {/* Grid Section */}
//       <div className="card">
//         <Grid
//           data={projectTypes.slice(skip, skip + take)}
//           pageable={true}
//           skip={skip}
//           take={take}
//           total={projectTypes.length}
//           onPageChange={handlePageChange}
//           style={{ height: 'auto', border: 'none' }}
//           dataItemKey="id"
//         >
//           <GridColumn field="name" title="Project Type" />
//           <GridColumn field="status" title="Status" cell={StatusCell} />
//           <GridColumn title="Action" cell={ActionCell} />
//         </Grid>
//       </div>

//       {/* Edit Dialog */}
//       {editItem && (
//         <Dialog
//           title="Edit Project Type"
//           onClose={() => setEditItem(null)}
//           width={window.innerWidth < 600 ? '95%' : 500}
//         >
//           <Form
//             onSubmit={handleEditSubmit}
//             initialValues={{
//               typeName: editItem.name,
//               status: editItem.status,
//             }}
//             render={(formRenderProps) => (
//               <FormElement className="responsive-form">
//                 <CustomFormFieldSet>
//                   <Field
//                     name="typeName"
//                     component={FormInput}
//                     label="Name of Project Type"
//                     validator={nameValidator}
//                   />
//                   <Field name="status" component={SwitchField} />
//                 </CustomFormFieldSet>

//                 {/* Buttons */}
//                 <div
//                   className="form-buttons"
//                   style={{ display: 'flex', gap: '8px', marginTop: '12px' }}
//                 >
//                   <Button
//                     type="button"
//                     onClick={() => setEditItem(null)}
//                     className="btn-cancel"
//                   >
//                     Cancel
//                   </Button>
//                   <Button
//                     type="submit"
//                     themeColor="primary"
//                     disabled={!formRenderProps.allowSubmit}
//                   >
//                     Save
//                   </Button>
//                 </div>

//                 {/* ✅ Inline Error Message */}
//                 {errorMessage && (
//                   <div
//                     style={{
//                       marginTop: '15px',
//                       padding: '10px',
//                       borderRadius: '4px',
//                       textAlign: 'center',
//                       backgroundColor: '#f8d7da',
//                       color: '#721c24',
//                       border: '1px solid #f5c6cb',
//                     }}
//                   >
//                     {errorMessage}
//                   </div>
//                 )}

//                 {/* ✅ Inline Success Message */}
//                 {successMessage && (
//                   <div
//                     style={{
//                       marginTop: '15px',
//                       padding: '10px',
//                       borderRadius: '4px',
//                       textAlign: 'center',
//                       backgroundColor: '#d4edda',
//                       color: '#155724',
//                       border: '1px solid #c3e6cb',
//                     }}
//                   >
//                     {successMessage}
//                   </div>
//                 )}
//               </FormElement>
//             )}
//           />
//         </Dialog>
//       )}
//     </main>
//   );
// }


// import React, { useState, useEffect } from 'react';
// import './projectTypes.css';

// // KendoReact imports
// import { Grid, GridColumn } from '@progress/kendo-react-grid';
// import { Button } from '@progress/kendo-react-buttons';
// import { Form, Field, FormElement } from '@progress/kendo-react-form';
// import { Switch } from '@progress/kendo-react-inputs';

// // Custom components
// import FormInput from '../components/Form/FormInput';
// import CustomFormFieldSet from '../components/Form/CustomFormFieldSet';
// import { nameValidator } from '../utils/validators';

// export default function ProjectTypes() {
//   const [projectTypes, setProjectTypes] = useState([]);
//   const [skip, setSkip] = useState(0);
//   const [take, setTake] = useState(6);
//   const [editItem, setEditItem] = useState(null);
//   const [successMessage, setSuccessMessage] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');
//   const [isMobile, setIsMobile] = useState(
//     typeof window !== 'undefined' ? window.innerWidth <= 600 : false
//   );

//   // ✅ Backend API URL
//   const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/ProjectTypes`;

//   // Fetch data
//   const fetchData = async () => {
//     try {
//       const res = await fetch(apiUrl);
//       if (res.ok) {
//         const data = await res.json();
//         setProjectTypes(data || []);
//       } else {
//         console.error('Failed to fetch project types:', await res.text());
//       }
//     } catch (err) {
//       console.error('Network error while fetching:', err);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   // Listen for resize to toggle mobile view
//   useEffect(() => {
//     const onResize = () => {
//       setIsMobile(window.innerWidth <= 600);
//     };
//     window.addEventListener('resize', onResize);
//     return () => window.removeEventListener('resize', onResize);
//   }, []);

//   // Save updated project type
//   const handleEditSubmit = async (dataItem) => {
//     const newName = dataItem.typeName.trim();

//     if (newName.toLowerCase() === editItem.name.trim().toLowerCase()) {
//       setErrorMessage('');
//     } else {
//       const duplicate = projectTypes.some(
//         (p) => p.name.trim().toLowerCase() === newName.toLowerCase()
//       );
//       if (duplicate) {
//         setErrorMessage('⚠️ Project type with this name already exists!');
//         return;
//       } else {
//         setErrorMessage('');
//       }
//     }

//     const updatedItem = {
//       ...editItem,
//       name: newName,
//       status: dataItem.status,
//     };

//     try {
//       const res = await fetch(`${apiUrl}/${editItem.id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(updatedItem),
//       });

//       if (res.ok) {
//         setProjectTypes((prev) =>
//           prev.map((p) => (p.id === editItem.id ? updatedItem : p))
//         );
//         setSuccessMessage('✅ Project type saved successfully!');
//         setErrorMessage('');

//         setTimeout(() => {
//           setSuccessMessage('');
//         }, 5000);
//       } else {
//         const errMsg = await res.text();
//         setErrorMessage(`❌ Failed to update: ${errMsg}`);
//       }
//     } catch (err) {
//       setErrorMessage('❌ Network error while updating project type');
//     }
//   };

//   const handlePageChange = (event) => {
//     setSkip(event.page.skip);
//     setTake(event.page.take);
//   };

//   // Status cell
//   const StatusCell = (props) => {
//     const { status } = props.dataItem;
//     return (
//       <td>
//         <span
//           className={`badge ${status ? 'status-active' : 'status-inactive'}`}
//         >
//           {status ? 'Active' : 'Inactive'}
//         </span>
//       </td>
//     );
//   };

//   // Action cell
//   const ActionCell = (props) => (
//     <td>
//       <Button
//         themeColor="primary"
//         size="small"
//         onClick={() => setEditItem(props.dataItem)}
//       >
//         Edit
//       </Button>
//     </td>
//   );

//   // Switch field
//   const SwitchField = (fieldRenderProps) => (
//     <div className="k-form-field" style={{ marginTop: '12px' }}>
//       <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//         <label>Status</label>
//         <Switch
//           checked={fieldRenderProps.value}
//           onChange={(e) =>
//             fieldRenderProps.onChange({
//               value: e.value,
//             })
//           }
//           onLabel="ACTIVE"
//           offLabel="INACTIVE"
//         />
//       </div>
//     </div>
//   );

//   // ✅ Mobile list rendering (Edit button moved right after Status)
//   const MobileList = ({ items }) => {
//     if (!items || items.length === 0) {
//       return <div className="empty-mobile">No project types available.</div>;
//     }
//     return (
//       <div className="mobile-list">
//         {items.map((p) => (
//           <div key={p.id} className="mobile-item">
//             <div className="mobile-row">
//               <div className="mobile-label">Project Type</div>
//               <div className="mobile-value">{p.name}</div>
//             </div>

//             <div className="mobile-row">
//               <div className="mobile-label">Status</div>
//               <div className="mobile-value">
//                 <span className={`badge ${p.status ? 'status-active' : 'status-inactive'}`}>
//                   {p.status ? 'Active' : 'Inactive'}
//                 </span>

//                 {/* ✅ Edit button comes immediately after status */}
//                 <Button
//                   themeColor="primary"
//                   size="small"
//                   style={{ marginLeft: '10px' }}
//                   onClick={() => setEditItem(p)}
//                 >
//                   Edit
//                 </Button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     );
//   };

//   return (
//     <main className="page-container">
//       {!editItem ? (
//         <>
//           {/* Refresh Button */}
//           <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
//             <Button themeColor="primary" size="small" onClick={fetchData}>
//               Refresh
//             </Button>
//           </div>

//           {/* Desktop / Tablet: Kendo Grid. Mobile: card list */}
//           {!isMobile ? (
//             <div className="card grid-wrapper">
//               <Grid
//                 data={projectTypes.slice(skip, skip + take)}
//                 pageable={true}
//                 skip={skip}
//                 take={take}
//                 total={projectTypes.length}
//                 onPageChange={handlePageChange}
//                 style={{ minWidth: '700px', border: 'none' }}
//                 dataItemKey="id"
//               >
//                 <GridColumn field="name" title="Project Type" />
//                 <GridColumn field="status" title="Status" cell={StatusCell} />
//                 <GridColumn title="Action" cell={ActionCell} />
//               </Grid>
//             </div>
//           ) : (
//             <div className="card mobile-wrapper">
//               <MobileList items={projectTypes.slice(skip, skip + take)} />
//             </div>
//           )}
//         </>
//       ) : (
//         <>
//           {/* Full-page edit form */}
//           <div className="card">
//             <h2>Edit Project Type</h2>
//             <Form
//               onSubmit={handleEditSubmit}
//               initialValues={{
//                 typeName: editItem.name,
//                 status: editItem.status,
//               }}
//               render={(formRenderProps) => (
//                 <FormElement className="responsive-form">
//                   <CustomFormFieldSet>
//                     <Field
//                       name="typeName"
//                       component={FormInput}
//                       label="Name of Project Type"
//                       validator={nameValidator}
//                     />
//                     <Field name="status" component={SwitchField} />
//                   </CustomFormFieldSet>

//                   {/* ✅ Success Message ABOVE buttons */}
//                   {successMessage && (
//                     <div
//                       style={{
//                         marginBottom: '1rem',
//                         padding: '8px',
//                         borderRadius: '6px',
//                         textAlign: 'center',
//                         fontWeight: 'bold',
//                         color: '#065f46',
//                         backgroundColor: '#d1fae5',
//                         border: '1px solid #34d399',
//                       }}
//                     >
//                       {successMessage}
//                     </div>
//                   )}

//                   {/* ✅ Buttons (Save first, Cancel second) */}
//                   <div className="form-buttons" style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
//                     <Button
//                       type="submit"
//                       themeColor="primary"
//                       disabled={!formRenderProps.allowSubmit}
//                     >
//                       Save
//                     </Button>
//                     <Button
//                       type="button"
//                       onClick={() => setEditItem(null)}
//                       className="btn-cancel"
//                     >
//                       Cancel
//                     </Button>
//                   </div>

//                   {/* ❌ Error Message BELOW buttons */}
//                   {errorMessage && (
//                     <div
//                       style={{
//                         marginTop: '1rem',
//                         padding: '8px',
//                         borderRadius: '6px',
//                         textAlign: 'center',
//                         fontWeight: 'bold',
//                         color: '#b91c1c',
//                         backgroundColor: '#fee2e2',
//                         border: '1px solid #f87171',
//                       }}
//                     >
//                       {errorMessage}
//                     </div>
//                   )}
//                 </FormElement>
//               )}
//             />
//           </div>
//         </>
//       )}
//     </main>
//   );
// }


import React, { useState, useEffect } from 'react';
import './projectTypes.css';

import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { Button } from '@progress/kendo-react-buttons';
import { Form, Field, FormElement } from '@progress/kendo-react-form';
import { Switch } from '@progress/kendo-react-inputs';

import FormInput from '../components/Form/FormInput';
import CustomFormFieldSet from '../components/Form/CustomFormFieldSet';
import { nameValidator } from '../utils/validators';

export default function ProjectTypes() {
  const [projectTypes, setProjectTypes] = useState([]);
  const [skip, setSkip] = useState(0);
  const [take, setTake] = useState(6);
  const [editItem, setEditItem] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= 600 : false
  );

  const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/ProjectTypes`;

  const fetchData = async () => {
    try {
      const res = await fetch(apiUrl);
      if (res.ok) {
        const data = await res.json();
        setProjectTypes(data || []);
      } else {
        console.error('Failed to fetch project types:', await res.text());
      }
    } catch (err) {
      console.error('Network error while fetching:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const onResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // ✅ Save updated project type
  const handleEditSubmit = async (dataItem) => {
    const newName = dataItem.typeName.trim();

    // Check for duplicate name (case-insensitive)
    const duplicate = projectTypes.some(
      (p) =>
        p.name.trim().toLowerCase() === newName.toLowerCase() &&
        p.id !== editItem.id
    );

    if (duplicate) {
      setErrorMessage('⚠️ Project type with this name already exists!');
      setSuccessMessage('');
      return;
    }

    const updatedItem = {
      ...editItem,
      name: newName,
      status: dataItem.status,
    };

    try {
      const res = await fetch(`${apiUrl}/${editItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItem),
      });

      if (res.ok) {
        setProjectTypes((prev) =>
          prev.map((p) => (p.id === editItem.id ? updatedItem : p))
        );
        setSuccessMessage('✅ Project type saved successfully!');
        setErrorMessage('');

        setTimeout(() => {
          setSuccessMessage('');
        }, 5000);
      } else if (res.status === 409) {
        // Server duplicate conflict (if applicable)
        const errData = await res.text();
        setErrorMessage(
          `⚠️ ${errData || 'Project type with this name already exists!'}`
        );
        setSuccessMessage('');
      } else {
        const errMsg = await res.text();
        setErrorMessage(`❌ Failed to update: ${errMsg}`);
        setSuccessMessage('');
      }
    } catch (err) {
      setErrorMessage('❌ Network error while updating project type');
      setSuccessMessage('');
    }
  };

  const handlePageChange = (event) => {
    setSkip(event.page.skip);
    setTake(event.page.take);
  };

  const StatusCell = (props) => {
    const { status } = props.dataItem;
    return (
      <td>
        <span
          className={`badge ${status ? 'status-active' : 'status-inactive'}`}
        >
          {status ? 'Active' : 'Inactive'}
        </span>
      </td>
    );
  };

  const ActionCell = (props) => (
    <td>
      <Button
        themeColor="primary"
        size="small"
        onClick={() => setEditItem(props.dataItem)}
      >
        Edit
      </Button>
    </td>
  );

  const SwitchField = (fieldRenderProps) => (
    <div className="k-form-field" style={{ marginTop: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <label>Status</label>
        <Switch
          checked={fieldRenderProps.value}
          onChange={(e) =>
            fieldRenderProps.onChange({
              value: e.value,
            })
          }
          onLabel="ACTIVE"
          offLabel="INACTIVE"
        />
      </div>
    </div>
  );

  const MobileList = ({ items }) => {
    if (!items || items.length === 0) {
      return <div className="empty-mobile">No project types available.</div>;
    }
    return (
      <div className="mobile-list">
        {items.map((p) => (
          <div key={p.id} className="mobile-item">
            <div className="mobile-row">
              <div className="mobile-label">Project Type</div>
              <div className="mobile-value">{p.name}</div>
            </div>
            <div className="mobile-row">
              <div className="mobile-label">Status</div>
              <div className="mobile-value">
                <span
                  className={`badge ${
                    p.status ? 'status-active' : 'status-inactive'
                  }`}
                >
                  {p.status ? 'Active' : 'Inactive'}
                </span>
                <Button
                  themeColor="primary"
                  size="small"
                  style={{ marginLeft: '10px' }}
                  onClick={() => setEditItem(p)}
                >
                  Edit
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <main className="page-container">
      {!editItem ? (
        <>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginBottom: '10px',
            }}
          >
            <Button themeColor="primary" size="small" onClick={fetchData}>
              Refresh
            </Button>
          </div>

          {!isMobile ? (
            <div className="card grid-wrapper">
              <Grid
                data={projectTypes.slice(skip, skip + take)}
                pageable={true}
                skip={skip}
                take={take}
                total={projectTypes.length}
                onPageChange={handlePageChange}
                style={{ minWidth: '700px', border: 'none' }}
                dataItemKey="id"
              >
                <GridColumn field="name" title="Project Type" />
                <GridColumn field="status" title="Status" cell={StatusCell} />
                <GridColumn title="Action" cell={ActionCell} />
              </Grid>
            </div>
          ) : (
            <div className="card mobile-wrapper">
              <MobileList items={projectTypes.slice(skip, skip + take)} />
            </div>
          )}
        </>
      ) : (
        <div className="card">
          <h2>Edit Project Type</h2>
          <Form
            onSubmit={handleEditSubmit}
            initialValues={{
              typeName: editItem.name,
              status: editItem.status,
            }}
            render={(formRenderProps) => (
              <FormElement className="responsive-form">
                <CustomFormFieldSet>
                  <Field
                    name="typeName"
                    component={FormInput}
                    label="Name of Project Type"
                    validator={nameValidator}
                  />
                  <Field name="status" component={SwitchField} />
                </CustomFormFieldSet>

                {/* ✅ Combined Messages ABOVE buttons */}
                {(successMessage || errorMessage) && (
                  <div
                    style={{
                      marginBottom: '1rem',
                      padding: '8px',
                      borderRadius: '6px',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      color: successMessage ? '#065f46' : '#b91c1c',
                      backgroundColor: successMessage
                        ? '#d1fae5'
                        : '#fee2e2',
                      border: successMessage
                        ? '1px solid #34d399'
                        : '1px solid #f87171',
                    }}
                  >
                    {successMessage || errorMessage}
                  </div>
                )}

                {/* Buttons */}
                <div
                  className="form-buttons"
                  style={{ display: 'flex', gap: '8px', marginTop: '12px' }}
                >
                  <Button
                    type="submit"
                    themeColor="primary"
                    disabled={!formRenderProps.allowSubmit}
                  >
                    Save
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setEditItem(null)}
                    className="btn-cancel"
                  >
                    Cancel
                  </Button>
                </div>
              </FormElement>
            )}
          />
        </div>
      )}
    </main>
  );
}


