import React, { useState, useEffect } from 'react';
// import { Grid, GridColumn } from '@progress/kendo-react-grid';
import EditableLineItemsGrid from '../../components/EditableLineItemsGrid';
import { Form, Field, FormElement, FieldWrapper } from '@progress/kendo-react-form';
import { Button } from '@progress/kendo-react-buttons';
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import FormInput from '../../components/Form/FormInput';
import FormMaskedInput from '../../components/Form/FormMaskedInput';
import FormDatePicker from '../../components/Form/FormDatePicker';
import FormDropDown from '../../components/Form/FormDropDown';
import FormUpload from '../../components/Form/FormUpload';
import UploadWithPreview from '../../components/UploadWithPreview';
import CustomFormFieldSet from '../../components/Form/CustomFormFieldSet';
import { nameValidator, emailValidator, emailWarning, phoneValidator, phoneWarning, requiredValidator, minMaxLengthValidator, minMaxLengthWarning } from '../../utils/validators';
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

const SiteVisitNew = () => {
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

	// Initial data with one empty row at the end
	const [lineItems, setLineItems] = useState([
		createEmptyLineItem(1),
	]);

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
				// Format date as ISO string
				formData.append(key, value.toISOString());
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
		const lineItemsPayload = nonEmptyLineItems.map(item => ({
			description: item.description,
			uom: item.uom,
			boq: item.boqQty,
			onsiteWorkQuantity: item.onsiteQty,
			finalReview: item.finalReview,
			remarks: item.remarks
		}));
		// formData.append('lineItems', JSON.stringify(lineItemsPayload));
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
			const response = await api.post('/api/sitevisit', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
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


	return (
		<Form
			onSubmit={handleSubmit}
			render={(formRenderProps) => (
				<FormElement className="container py-4">

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
								<Field name="storeName" label="Store Name" component={FormInput}  />
								{minMaxLengthWarning(formRenderProps.valueGetter('storeName')) && (
									<div className="text-warning small mt-1">{minMaxLengthWarning(formRenderProps.valueGetter('storeName'))}</div>
								)}
							</div>
							<div className="col-md-6">
								<Field name="storeLocation" label="Store Location" component={FormInput}  />
								{minMaxLengthWarning(formRenderProps.valueGetter('storeLocation')) && (
									<div className="text-warning small mt-1">{minMaxLengthWarning(formRenderProps.valueGetter('storeLocation'))}</div>
								)}
							</div>

							<div className="col-md-6">
								<Field name="storeManagerName" label="Store Manager Name" component={FormInput}  />
								{minMaxLengthWarning(formRenderProps.valueGetter('storeManagerName')) && (
									<div className="text-warning small mt-1">{minMaxLengthWarning(formRenderProps.valueGetter('storeManagerName'))}</div>
								)}
							</div>
							<div className="col-md-6">
								<Field name="vendorCode" label="Vendor Code" component={FormInput}  />
								{minMaxLengthWarning(formRenderProps.valueGetter('vendorCode')) && (
									<div className="text-warning small mt-1">{minMaxLengthWarning(formRenderProps.valueGetter('vendorCode'))}</div>
								)}
							</div>


							<div className="col-md-6">
								<Field name="storeCode" label="Store Code" component={FormInput}  />
								{minMaxLengthWarning(formRenderProps.valueGetter('storeCode')) && (
									<div className="text-warning small mt-1">{minMaxLengthWarning(formRenderProps.valueGetter('storeCode'))}</div>
								)}
							</div>
							<div className="col-md-6">
								<Field name="sapCode" label="SAP Code" component={FormInput}  />
								{minMaxLengthWarning(formRenderProps.valueGetter('sapCode')) && (
									<div className="text-warning small mt-1">{minMaxLengthWarning(formRenderProps.valueGetter('sapCode'))}</div>
								)}
							</div>

							<div className="col-md-6">
								<Field name="storeManagerNumber" label="Store Manager Number" component={FormMaskedInput} mask="9999999999" />
								{phoneWarning(formRenderProps.valueGetter('storeManagerNumber')) && (
									<div className="text-warning small mt-1">{phoneWarning(formRenderProps.valueGetter('storeManagerNumber'))}</div>
								)}
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
								<Field name="storeMailId" label="Store Mail ID" component={FormInput} />
								{emailWarning(formRenderProps.valueGetter('storeMailId')) && (
									<div className="text-warning small mt-1">{emailWarning(formRenderProps.valueGetter('storeMailId'))}</div>
								)}
							</div>
							<div className="col-md-6">
								<Field name="storeAddress" label="Store Address" component={FormInput}  />
								{minMaxLengthWarning(formRenderProps.valueGetter('storeAddress')) && (
									<div className="text-warning small mt-1">{minMaxLengthWarning(formRenderProps.valueGetter('storeAddress'))}</div>
								)}
							</div>
						</div>
					</CustomFormFieldSet>

					{/* Photos (Capture/Upload) */}
					{/* Intentionally left empty as requested */}
					<CustomFormFieldSet legend="Photos (Capture/Upload)">
						<div className="row">
							<div className="col-12">
								<Field
									name="photos"
									component={UploadWithPreview}
									accept="image/*"
								// multiple default true; set multiple={false} if you want single-image only
								/>
							</div>
						</div>
					</CustomFormFieldSet>

					{/* Site Visit Documents */}
					<CustomFormFieldSet legend="Site Visit Documents">
						<div className="row">
							<div className="col-12">
								<Field
									name="siteVisitDocument"
									component={FormUpload}
									label="Upload Document"
									accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
									allowedFormatsArray={[".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png"]}
									colSpan={1}
									multiple
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

export default SiteVisitNew;
