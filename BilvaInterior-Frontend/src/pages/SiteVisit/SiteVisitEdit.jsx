import React, { useState, useEffect } from 'react';
// import { Grid, GridColumn } from '@progress/kendo-react-grid';
import EditableLineItemsGrid from '../../components/EditableLineItemsGrid';
import { Form, Field, FormElement, FieldWrapper } from '@progress/kendo-react-form';
import { Button } from '@progress/kendo-react-buttons';
import FormInput from '../../components/Form/FormInput';
import FormMaskedInput from '../../components/Form/FormMaskedInput';
import FormDatePicker from '../../components/Form/FormDatePicker';
import FormDropDown from '../../components/Form/FormDropDown';
import FormUpload from '../../components/Form/FormUpload';
import UploadWithPreview from '../../components/UploadWithPreview';
import CustomFormFieldSet from '../../components/Form/CustomFormFieldSet';
import { nameValidator, emailValidator, phoneValidator, requiredValidator, minMaxLengthValidator } from '../../utils/validators';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SiteVisitDialog.css';
import api from '../../api/axios';
import FloatingLabelWrapper from '../../components/Form/FloatingLabelWrapper/FloatingLabelWrapper';
import { DropDownList } from '@progress/kendo-react-dropdowns';

const reportTypes = [
    { text: 'Site Visit', value: 0 },
    { text: 'Work Completion', value: 1 },
    { text: 'Handover', value: 2 },
    { text: 'Delivery Challan', value: 3 },
];

const SiteVisitEdit = ({ siteVisitId }) => {
    // Employee state for dropdown
    const [employees, setEmployees] = useState([]);
    const [employeesLoading, setEmployeesLoading] = useState(false);
    const [employeesError, setEmployeesError] = useState(null);
    // Define columns for manual grid
    const lineItemColumns = [
        { field: 'description', title: 'Description' },
        { field: 'uom', title: 'UOM' },
        { field: 'boqQty', title: 'BOQ quantity', type: 'numeric' },
        { field: 'onsiteQty', title: 'On-site work quantity', type: 'numeric' },
        { field: 'finalReview', title: 'Final Review' },
        { field: 'remarks', title: 'Remarks' },
    ];

    // Projects state
    const [projects, setProjects] = useState([]);
    const [projectsLoading, setProjectsLoading] = useState(false);
    const [projectsError, setProjectsError] = useState(null);

    // Fetch projects on mount
    useEffect(() => {
        const fetchProjects = async () => {
            setProjectsLoading(true);
            setProjectsError(null);
            try {
                const res = await api.get('/api/projects');
                console.log(res.data)
                // Sort projects alphabetically by projectName
                const sortedProjects = (res.data || []).slice().sort((a, b) => {
                    if (!a.projectName) return -1;
                    if (!b.projectName) return 1;
                    return a.projectName.localeCompare(b.projectName);
                });
                setProjects(sortedProjects);
            } catch (err) {
                setProjectsError('Failed to load projects');
            } finally {
                setProjectsLoading(false);
            }
        };
        const fetchEmployees = async () => {
            setEmployeesLoading(true);
            setEmployeesError(null);
            try {
                const res = await api.get('/api/employee');
                // Map employees to have a 'name' property as 'firstName lastName'
                const mappedEmployees = (res.data || []).map(emp => ({
                    ...emp,
                    name: [emp.firstName, emp.lastName].filter(Boolean).join(' ').trim() || emp.name || '',
                }));
                setEmployees(mappedEmployees);
            } catch (err) {
                setEmployeesError('Failed to load employees');
            } finally {
                setEmployeesLoading(false);
            }
        };
        fetchProjects();
        fetchEmployees();
    }, []);


    // Helper to create an empty line item
    const createEmptyLineItem = (id) => ({
        id,
        description: '',
        uom: '',
        boqQty: '',
        onsiteQty: '',
        finalReview: '',
        remarks: '',
    });

    // Form initial state
    const [initialFormValues, setInitialFormValues] = useState({});


    // Initial data with one empty row at the end
    const [lineItems, setLineItems] = useState([
        createEmptyLineItem(1),
    ]);

    // Images and documents
    const [photos, setPhotos] = useState([]);
    const [siteVisitDocument, setSiteVisitDocument] = useState([]);
    // Fetch site visit data for editing
    useEffect(() => {
        if (!siteVisitId) return;
        const fetchSiteVisit = async () => {
            try {
                const res = await api.get(`/api/sitevisit/${siteVisitId}`);
                const data = res.data;
                // Map API data to form fields

                // Find project object for dropdown
                let projectValue = '';
                if (data.projectId && Array.isArray(projects)) {
                    const foundProject = projects.find(p => p.id === data.projectId);
                    projectValue = foundProject ? foundProject.id : data.projectId;
                }

                // Find employee object for dropdown
                let personVisitValue = '';
                if (data.personVisit && Array.isArray(employees)) {
                    const foundEmployee = employees.find(e => e.id === data.personVisit.id);
                    personVisitValue = foundEmployee ? foundEmployee.id : data.personVisit.id;
                }


                // Convert UTC date to IST for display
                function utcToIST(dateStr) {
                    if (!dateStr) return null;
                    const utcDate = new Date(dateStr);
                    return new Date(utcDate.getTime() + (5.5 * 60 * 60 * 1000));
                }

                let reportDateValue = null;
                if (data.lastModifiedUtc) {
                    reportDateValue = utcToIST(data.lastModifiedUtc);
                } else if (data.reportDate) {
                    reportDateValue = utcToIST(data.reportDate);
                }

                setInitialFormValues({
                    projectId: projectValue,
                    reportType: typeof data.reportType === 'number' ? data.reportType : '',
                    reportDate: reportDateValue,
                    storeName: data.storeName || '',
                    storeLocation: data.storeLocation || '',
                    storeManagerName: data.storeManagerName || '',
                    vendorCode: data.vendorCode || '',
                    storeCode: data.storeCode || '',
                    sapCode: data.sapCode || '',
                    storeManagerNumber: data.storeManagerNumber || '',
                    personVisitId: personVisitValue,
                    storeMailId: data.storeMailId || '',
                    storeAddress: data.storeAddress || '',
                    notes: data.notes || '',
                    photos: [], // handled separately
                    siteVisitDocument: [], // handled separately
                });
                
                console.log("data:", data);

                // Line items
                if (Array.isArray(data.lineItems) && data.lineItems.length) {
                    const mappedLineItems = data.lineItems.map((item, idx) => ({
                        id: idx + 1,
                        description: item.description || '',
                        uom: item.uom || '',
                        boqQty: item.boq || '',
                        onsiteQty: item.onsiteWorkQuantity || '',
                        finalReview: item.finalReview || '',
                        remarks: item.remarks || '',
                    }));
                    // Always one empty row at end
                    setLineItems([...mappedLineItems, createEmptyLineItem(mappedLineItems.length + 1)]);
                }
                // Photos/images
                if (Array.isArray(data.photos)) {
                    setPhotos(data.photos.map((img, idx) => ({
                        name: img.name || `photo${idx+1}`,
                        size: img.size || 0,
                        base64: img.base64 || img.url || '',
                        thumb: img.thumb || img.url || '',
                        file: null, // Existing images have no file object
                        type: img.type || 'image/jpeg',
                    })));
                }
                // Documents
                if (Array.isArray(data.documents)) {
                    setSiteVisitDocument(data.documents.map((doc, idx) => ({
                        name: doc.name || `doc${idx+1}`,
                        size: doc.size || 0,
                        base64: doc.base64 || doc.url || '',
                        file: null,
                        type: doc.type || '',
                    })));
                }
            } catch (err) {
                setErrorMessage('Failed to load site visit data');
            }
        };
        fetchSiteVisit();
    }, [siteVisitId]);

    // For in-cell editing
    const [editLineItems, setEditLineItems] = useState({});

    // Success/Error message state (toast)
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');


    const isRowEmpty = (item) => {
        // Check if all fields except id are empty
        return [
            'description',
            'uom',
            'boqQty',
            'onsiteQty',
            'finalReview',
            'remarks',
        ].every(key => !item[key] && item[key] !== 0);
    };

    const handleLineItemChange = (event) => {
        const inEditID = event.dataItem.id;
        const field = event.field || '';
        let updated = lineItems.map(item =>
            item.id === inEditID ? { ...item, [field]: event.value } : item
        );

        // Remove any non-last row that is now empty
        updated = updated.filter((item, idx) => {
            // Always keep the last row
            if (idx === updated.length - 1) return true;
            return !isRowEmpty(item);
        });

        // If the last row is not empty, add a new empty row
        const last = updated[updated.length - 1];
        if (!isRowEmpty(last)) {
            const maxId = updated.length ? Math.max(...updated.map(i => i.id)) : 0;
            updated.push(createEmptyLineItem(maxId + 1));
        }

        setLineItems(updated);
    };

    // Dialog state
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState('add'); // 'add' or 'edit'
    const [dialogData, setDialogData] = useState({
        description: '',
        uom: '',
        boqQty: '',
        onsiteQty: '',
        finalReview: '',
        remarks: '',
    });
    const [editId, setEditId] = useState(null);

    // Add item handler
    const handleAddLineItem = () => {
        setDialogMode('add');
        setDialogData({
            description: '',
            uom: '',
            boqQty: '',
            onsiteQty: '',
            finalReview: '',
            remarks: '',
        });
        setDialogOpen(true);
        setEditId(null);
    };

    // Edit item handler
    const handleEditLineItem = (item) => {
        setDialogMode('edit');
        setDialogData({ ...item });
        setDialogOpen(true);
        setEditId(item.id);
    };


    // Delete item handler
    const handleDeleteLineItem = (id) => {
        let updated = lineItems.filter(item => item.id !== id);
        // Always ensure one empty row at the end
        if (!updated.length || !isRowEmpty(updated[updated.length - 1])) {
            const maxId = updated.length ? Math.max(...updated.map(i => i.id)) : 0;
            updated.push(createEmptyLineItem(maxId + 1));
        }
        setLineItems(updated);
    };

    // Save dialog handler
    const handleDialogSave = () => {
        if (dialogMode === 'add') {
            const newId = lineItems.length ? Math.max(...lineItems.map(i => i.id)) + 1 : 1;
            setLineItems([...lineItems, { ...dialogData, id: newId }]);
        } else if (dialogMode === 'edit') {
            setLineItems(lineItems.map(item => item.id === editId ? { ...dialogData, id: editId } : item));
        }
        setDialogOpen(false);
    };

    // Dialog input change handler
    const handleDialogInputChange = (e) => {
        const { name, value } = e.target;
        setDialogData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (dataItem) => {
        // Create FormData
        const formData = new FormData();

        // Helper: append simple fields
        const appendField = (key, value) => {
            if (value !== undefined && value !== null) {
                formData.append(key, value);
            }
        };

        // Append all non-file fields
        Object.entries(dataItem).forEach(([key, value]) => {
            if (key === 'photos' || key === 'siteVisitDocument') return; // handle below
            if (key === 'reportDate' && value instanceof Date) {
                // Convert IST date to UTC ISO string for backend
                const utcDate = new Date(value.getTime() - (5.5 * 60 * 60 * 1000));
                formData.append(key, utcDate.toISOString());
            } else if (typeof value !== 'object' || value === null) {
                appendField(key, value);
            }
        });

        // Append all files (photos and siteVisitDocument) under 'Documents' key, only the file
        if (Array.isArray(dataItem.photos)) {
            dataItem.photos.forEach(photo => {
                if (photo.file) {
                    formData.append('Documents', photo.file);
                }
            });
        }

        if (Array.isArray(dataItem.siteVisitDocument)) {
            dataItem.siteVisitDocument.forEach(doc => {
                if (doc.getRawFile && typeof doc.getRawFile === 'function') {
                    const file = doc.getRawFile();
                    if (file) {
                        formData.append('Documents', file);
                    }
                } else if (doc.file) {
                    formData.append('Documents', doc.file);
                }
            });
        }

        // Append line items as JSON string, excluding the last empty row
        const nonEmptyLineItems = lineItems.filter(item => !isRowEmpty(item));
        nonEmptyLineItems.forEach((item, index) => {
            formData.append(`LineItems[${index}].Description`, item.description || '');
            formData.append(`LineItems[${index}].UOM`, item.uom || '');
            formData.append(`LineItems[${index}].BOQ`, item.boqQty || '');
            formData.append(`LineItems[${index}].OnsiteWorkQuantity`, item.onsiteQty || '');
            formData.append(`LineItems[${index}].FinalReview`, item.finalReview || '');
            formData.append(`LineItems[${index}].Remarks`, item.remarks || '');
        });

        // For debugging: log FormData keys and values
        for (let pair of formData.entries()) {
            console.log(pair[0] + ':', pair[1]);
        }

        // submit formData to API endpoint using axios instance
        try {
            let response;
            if (siteVisitId) {
                response = await api.put(`/api/sitevisit/${siteVisitId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            } else {
                response = await api.post('/api/sitevisit', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            }
            console.log('Site visit submitted successfully:', response.data);
            setSuccessMessage('✅ Site visit submitted successfully!');
            setErrorMessage('');
            setTimeout(() => setSuccessMessage(''), 5000);
        } catch (error) {
            if (error.response) {
                console.error('Submission failed:', error.response.status, error.response.data);
                setErrorMessage(`❌ Submission failed: ${error.response.data?.message || error.response.statusText || 'Unknown error'}`);
            } else if (error.request) {
                console.error('No response received:', error.request);
                setErrorMessage('❌ No response received from server.');
            } else {
                console.error('Error during submission:', error.message);
                setErrorMessage(`❌ Error during submission: ${error.message}`);
            }
            setSuccessMessage('');
            setTimeout(() => setErrorMessage(''), 5000);
        }
    };


    // Only render form when initialFormValues is ready (has keys)
    if (!initialFormValues || Object.keys(initialFormValues).length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <Form
            key={siteVisitId || 'new'}
            initialValues={initialFormValues}
            onSubmit={handleSubmit}
            render={(formRenderProps) => (
                <FormElement className="container py-4">

                    <div style={{border: '1px solid black'}}>
                        <img src={`${import.meta.env.VITE_API_BASE_URL}/uploads/sitevisit/sitevisit_2c215607-351f-4a6d-b4ea-a001d1ea2638.jpg`} alt="" />
                    </div>
                    {/* Project Dropdown */}
                    <FieldWrapper>
                        <div className="k-form-field-wrap mb-4 col-12 col-md-6">
                            <FloatingLabelWrapper label={'Project'} >
                                <Field
                                    name="projectId"
                                    validator={requiredValidator}
                                    required={true}
                                    component={props => (
                                        <DropDownList
                                            {...props}
                                            data={projects}
                                            textField="projectName"
                                            dataItemKey="id"
                                            value={projects.find(p => p.id === props.value) || null}
                                            onChange={e => props.onChange({ value: e.value ? e.value.id : null })}
                                            // filterable={true}
                                            loading={projectsLoading}
                                            disabled={projectsLoading || !!projectsError}
                                            style={{ width: "100%" }}
                                            size={'large'}
                                            placeholder={projectsLoading ? 'Loading...' : (projectsError ? 'Failed to load' : 'Select Project')}
                                        />
                                    )}
                                />
                            </FloatingLabelWrapper>
                            {projectsError && <div className="text-danger small mt-1">{projectsError}</div>}
                        </div>
                    </FieldWrapper>
                    {/* Report Info */}
                    <CustomFormFieldSet legend="Report Info">
                        <div className="row g-3">
                            <div className="col-md-6">
                                <Field
                                    name="reportType"
                                    label="Report Type"
                                    component={FormDropDown}
                                    data={reportTypes}
                                    textField="text"
                                    dataItemKey="value"
                                />
                            </div>
                            <div className="col-md-6">
                                <Field
                                    name="reportDate"
                                    label="Report Date"
                                    component={FormDatePicker}
                                />
                            </div>
                        </div>
                    </CustomFormFieldSet>
                    {/* Store/Project Details */}
                    <CustomFormFieldSet legend="Store/Project Details">
                        <div className="row g-3">
                            <div className="col-md-6">
                                <Field name="storeName" label="Store Name" component={FormInput} validator={minMaxLengthValidator} />
                            </div>
                            <div className="col-md-6">
                                <Field name="storeLocation" label="Store Location" component={FormInput} validator={minMaxLengthValidator} />
                            </div>
                            <div className="col-md-6">
                                <Field name="storeManagerName" label="Store Manager Name" component={FormInput} validator={minMaxLengthValidator} />
                            </div>
                            <div className="col-md-6">
                                <Field name="vendorCode" label="Vendor Code" component={FormInput} validator={minMaxLengthValidator} />
                            </div>
                            <div className="col-md-6">
                                <Field name="storeCode" label="Store Code" component={FormInput} validator={minMaxLengthValidator} />
                            </div>
                            <div className="col-md-6">
                                <Field name="sapCode" label="SAP Code" component={FormInput} validator={minMaxLengthValidator} />
                            </div>
                            <div className="col-md-6">
                                <Field name="storeManagerNumber" label="Store Manager Number" component={FormMaskedInput} validator={phoneValidator} mask="9999999999" />
                            </div>
                            <div className="col-md-6">
                                <Field
                                    name="personVisitId"
                                    label="Person Visit Name"
                                    required={true}
                                    component={FormDropDown}
                                    data={employees}
                                    textField="name"
                                    dataItemKey="id"
                                    loading={employeesLoading}
                                    disabled={employeesLoading || !!employeesError}
                                    placeholder={employeesLoading ? 'Loading...' : (employeesError ? 'Failed to load' : 'Select Employee')}
                                />
                                {employeesError && <div className="text-danger small mt-1">{employeesError}</div>}
                            </div>
                            <div className="col-md-6">
                                <Field name="storeMailId" label="Store Mail ID" component={FormInput} validator={emailValidator} />
                            </div>
                            <div className="col-md-6">
                                <Field name="storeAddress" label="Store Address" component={FormInput} validator={minMaxLengthValidator} />
                            </div>
                        </div>
                    </CustomFormFieldSet>
                    {/* Photos (Capture/Upload) */}
                    <CustomFormFieldSet legend="Photos (Capture/Upload)">
                        <div className="row">
                            <div className="col-12">
                                <UploadWithPreview
                                    value={photos}
                                    onChange={setPhotos}
                                    accept="image/*"
                                />
                            </div>
                        </div>
                    </CustomFormFieldSet>
                    {/* Site Visit Documents */}
                    <CustomFormFieldSet legend="Site Visit Documents">
                        <div className="row">
                            <div className="col-12">
                                <UploadWithPreview
                                    value={siteVisitDocument}
                                    onChange={setSiteVisitDocument}
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                    multiple={true}
                                />
                            </div>
                        </div>
                    </CustomFormFieldSet>
                    {/* Visiting line items */}
                    <CustomFormFieldSet legend="Visiting line items">
                        <div className="row">
                            <div className="col-12">
                                <EditableLineItemsGrid
                                    value={lineItems}
                                    onChange={setLineItems}
                                    columns={lineItemColumns}
                                />
                            </div>
                        </div>
                    </CustomFormFieldSet>
                    {/* Notes */}
                    <CustomFormFieldSet legend="Notes">
                        <div className="row">
                            <div className="col-12">
                                <Field
                                    name="notes"
                                    label="Notes"
                                    component={FormInput}
                                    colSpan={1}
                                />
                            </div>
                        </div>
                    </CustomFormFieldSet>
                    {/* ...existing code... */}
                    {/* Removed dialog for add/edit line item */}
                    {/* Success/Error Toast Message */}
                    {(errorMessage || successMessage) && (
                        <div style={{ marginBottom: 12 }}>
                            {errorMessage && <div className="error-box">{errorMessage}</div>}
                            {successMessage && <div className="success-box">{successMessage}</div>}
                        </div>
                    )}
                    <div className="row mt-4">
                        <div className="col-12 text-end">
                            <Button themeColor="primary" type="submit" disabled={!formRenderProps.allowSubmit}>
                                Save
                            </Button>
                            <Button onClick={formRenderProps.onFormReset} style={{ marginLeft: 12 }}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                </FormElement>
            )}
        />
    );
};

export default SiteVisitEdit;
