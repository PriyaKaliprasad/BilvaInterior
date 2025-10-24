
import React, { useState, useEffect } from 'react';
import EditableLineItemsGrid from '../../../components/EditableLineItemsGrid';
import { Button } from '@progress/kendo-react-buttons';
import { Input, MaskedTextBox } from '@progress/kendo-react-inputs';
import { DatePicker } from '@progress/kendo-react-dateinputs';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import api from '../../../api/axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../SiteVisit/SiteVisitDialog.css';
import { nameValidator, emailValidator, phoneValidator, requiredValidator, minMaxLengthValidator } from '../../../utils/validators';

const reportTypes = [
	{ text: 'Site Visit', value: 0 },
	{ text: 'Work Completion', value: 1 },
	{ text: 'Handover', value: 2 },
	{ text: 'Delivery Challan', value: 3 },
];

// Image preview component for documents
const ImageDocumentsPreview = ({ documents, onRemove }) => {
	const apiBase = import.meta.env.VITE_API_BASE_URL;
	return (
		<div className="d-flex flex-wrap gap-2">
			{documents.filter(doc => doc.fileType && doc.fileType.startsWith('image')).map(doc => (
				<div key={doc.id} className="position-relative" style={{ width: 120 }}>
					<img
						src={apiBase + doc.filePathOrUrl}
						alt={doc.fileName}
						style={{ width: '100px', height: '100px', objectFit: 'cover', border: '1px solid #ccc', borderRadius: 8 }}
					/>
					<Button
						style={{ position: 'absolute', top: 2, right: 2, minWidth: 24, padding: 0 }}
						themeColor="error"
						size="small"
						onClick={() => onRemove(doc.id)}
					>
						×
					</Button>
				</div>
			))}
		</div>
	);
};

const SiteVisitEdit = ({ siteVisitId }) => {
	// State for form fields
	const [form, setForm] = useState({});
	const [loading, setLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState('');
	const [successMessage, setSuccessMessage] = useState('');

	// Projects and employees
	const [projects, setProjects] = useState([]);
	const [employees, setEmployees] = useState([]);
	const [projectsError, setProjectsError] = useState(null);
	const [employeesError, setEmployeesError] = useState(null);
	const [projectsLoading, setProjectsLoading] = useState(false);
	const [employeesLoading, setEmployeesLoading] = useState(false);

	// Line items
	const [lineItems, setLineItems] = useState([{ id: 1, description: '', uom: '', boqQty: '', onsiteQty: '', finalReview: '', remarks: '' }]);
	// Photos and documents
	const [photos, setPhotos] = useState([]);
	const [documents, setDocuments] = useState([]);

	// Fetch projects and employees
	useEffect(() => {
		setProjectsLoading(true);
		setEmployeesLoading(true);
		Promise.all([
			api.get('/api/projects'),
			api.get('/api/employee')
		]).then(([projRes, empRes]) => {
			const sortedProjects = (projRes.data || []).slice().sort((a, b) => {
				if (!a.projectName) return -1;
				if (!b.projectName) return 1;
				return a.projectName.localeCompare(b.projectName);
			});
			setProjects(sortedProjects);
			setProjectsLoading(false);
			setEmployees((empRes.data || []).map(emp => ({
				...emp,
				name: [emp.firstName, emp.lastName].filter(Boolean).join(' ').trim() || emp.name || '',
			})));
			setEmployeesLoading(false);
		}).catch(() => {
			setProjectsError('Failed to load projects');
			setEmployeesError('Failed to load employees');
			setProjectsLoading(false);
			setEmployeesLoading(false);
		});
	}, []);

	// Fetch site visit data
	useEffect(() => {
		if (!siteVisitId) return;
		setLoading(true);
		api.get(`/api/sitevisit/${siteVisitId}`)
			.then(res => {
				const data = res.data;
				// Project
				let projectValue = '';
				if (data.projectId && Array.isArray(projects)) {
					const foundProject = projects.find(p => p.id === data.projectId);
					projectValue = foundProject ? foundProject.id : data.projectId;
				}
				// Employee
				let personVisitValue = '';
				if (data.personVisit && Array.isArray(employees)) {
					const foundEmployee = employees.find(e => e.id === data.personVisit.id);
					personVisitValue = foundEmployee ? foundEmployee.id : data.personVisit.id;
				}
				// Date
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
				setForm({
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
				});
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
					setLineItems([...mappedLineItems, { id: mappedLineItems.length + 1, description: '', uom: '', boqQty: '', onsiteQty: '', finalReview: '', remarks: '' }]);
				}
				// Photos
				setPhotos(Array.isArray(data.photos) ? data.photos : []);
				// Documents
				setDocuments(Array.isArray(data.documents) ? data.documents : []);
				setLoading(false);
			})
			.catch(() => {
				setErrorMessage('Failed to load site visit data');
				setLoading(false);
			});
	}, [siteVisitId, projects, employees]);

	// Validation helpers
	const validateField = (name, value) => {
		switch (name) {
			case 'storeName':
			case 'storeLocation':
			case 'storeManagerName':
			case 'vendorCode':
			case 'storeCode':
			case 'sapCode':
			case 'storeAddress':
				return minMaxLengthValidator(value);
			case 'storeMailId':
				return emailValidator(value);
			case 'storeManagerNumber':
				return phoneValidator(value);
			case 'projectId':
			case 'personVisitId':
				return requiredValidator(value);
			default:
				return undefined;
		}
	};

	// Controlled input change
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setForm(prev => ({ ...prev, [name]: value }));
	};
	const handleDropDownChange = (name, value) => {
		setForm(prev => ({ ...prev, [name]: value }));
	};
	const handleDateChange = (name, value) => {
		setForm(prev => ({ ...prev, [name]: value }));
	};

	// Remove image document
	const handleRemoveDocument = (id) => {
		setDocuments(prev => prev.filter(doc => doc.id !== id));
	};

	// Submit handler
	const handleSubmit = async (e) => {
		e.preventDefault();
		// Validate required fields
		let hasError = false;
		Object.entries(form).forEach(([key, value]) => {
			const err = validateField(key, value);
			if (err) hasError = true;
		});
		if (hasError) {
			setErrorMessage('Please fix validation errors.');
			return;
		}
		// Prepare FormData
		const formData = new FormData();
		Object.entries(form).forEach(([key, value]) => {
			if (key === 'reportDate' && value instanceof Date) {
				const utcDate = new Date(value.getTime() - (5.5 * 60 * 60 * 1000));
				formData.append(key, utcDate.toISOString());
			} else {
				formData.append(key, value);
			}
		});
		// Line items: exclude the last empty row
		const nonEmptyLineItems = lineItems.filter((item, idx) => {
			// If last row, check if all fields except id are empty
			if (idx === lineItems.length - 1) {
				return Object.keys(item).filter(k => k !== 'id').some(k => item[k]);
			}
			return true;
		});
		nonEmptyLineItems.forEach((item, index) => {
			formData.append(`LineItems[${index}].Description`, item.description || '');
			formData.append(`LineItems[${index}].UOM`, item.uom || '');
			formData.append(`LineItems[${index}].BOQ`, item.boqQty || '');
			formData.append(`LineItems[${index}].OnsiteWorkQuantity`, item.onsiteQty || '');
			formData.append(`LineItems[${index}].FinalReview`, item.finalReview || '');
			formData.append(`LineItems[${index}].Remarks`, item.remarks || '');
		});
		// Photos and documents upload logic can be added here
		try {
			let response;
			if (siteVisitId) {
				response = await api.put(`/api/sitevisit/${siteVisitId}`, formData, {
					headers: { 'Content-Type': 'multipart/form-data' },
				});
			} else {
				response = await api.post('/api/sitevisit', formData, {
					headers: { 'Content-Type': 'multipart/form-data' },
				});
			}
			setSuccessMessage('✅ Site visit submitted successfully!');
			setErrorMessage('');
			setTimeout(() => setSuccessMessage(''), 5000);
		} catch (error) {
			setErrorMessage('❌ Submission failed.');
			setSuccessMessage('');
			setTimeout(() => setErrorMessage(''), 5000);
		}
	};

	if (loading) return <div>Loading...</div>;

	return (
		<form className="container py-4" onSubmit={handleSubmit}>

			{/* Project Dropdown */}
			<div className="mb-4 col-12 col-md-6">
				<label className="form-label">Project</label>
				<DropDownList
					data={projects}
					textField="projectName"
					dataItemKey="id"
					value={projects.find(p => p.id === form.projectId) || null}
					onChange={e => handleDropDownChange('projectId', e.value ? e.value.id : null)}
					loading={projectsLoading}
					disabled={projectsLoading || !!projectsError}
					style={{ width: "100%" }}
					size={'large'}
					placeholder={projectsLoading ? 'Loading...' : (projectsError ? 'Failed to load' : 'Select Project')}
				/>
				{projectsError && <div className="text-danger small mt-1">{projectsError}</div>}
			</div>
			{/* Report Info */}
			<fieldset className="mb-4">
				<legend>Report Info</legend>
				<div className="row g-3">
					<div className="col-md-6">
						<label className="form-label">Report Type</label>
						<DropDownList
							data={reportTypes}
							textField="text"
							dataItemKey="value"
							value={reportTypes.find(rt => rt.value === form.reportType) || null}
							onChange={e => handleDropDownChange('reportType', e.value ? e.value.value : null)}
							style={{ width: "100%" }}
						/>
					</div>
					<div className="col-md-6">
						<label className="form-label">Report Date</label>
						<DatePicker
							value={form.reportDate || null}
							onChange={e => handleDateChange('reportDate', e.value)}
							style={{ width: "100%" }}
						/>
					</div>
				</div>
			</fieldset>
			{/* Store/Project Details */}
			<fieldset className="mb-4">
				<legend>Store/Project Details</legend>
				<div className="row g-3">
					<div className="col-md-6">
						<label className="form-label">Store Name</label>
						<Input
							name="storeName"
							value={form.storeName || ''}
							onChange={handleInputChange}
							style={{ width: "100%" }}
						/>
					</div>
					<div className="col-md-6">
						<label className="form-label">Store Location</label>
						<Input
							name="storeLocation"
							value={form.storeLocation || ''}
							onChange={handleInputChange}
							style={{ width: "100%" }}
						/>
					</div>
					<div className="col-md-6">
						<label className="form-label">Store Manager Name</label>
						<Input
							name="storeManagerName"
							value={form.storeManagerName || ''}
							onChange={handleInputChange}
							style={{ width: "100%" }}
						/>
					</div>
					<div className="col-md-6">
						<label className="form-label">Vendor Code</label>
						<Input
							name="vendorCode"
							value={form.vendorCode || ''}
							onChange={handleInputChange}
							style={{ width: "100%" }}
						/>
					</div>
					<div className="col-md-6">
						<label className="form-label">Store Code</label>
						<Input
							name="storeCode"
							value={form.storeCode || ''}
							onChange={handleInputChange}
							style={{ width: "100%" }}
						/>
					</div>
					<div className="col-md-6">
						<label className="form-label">SAP Code</label>
						<Input
							name="sapCode"
							value={form.sapCode || ''}
							onChange={handleInputChange}
							style={{ width: "100%" }}
						/>
					</div>
					<div className="col-md-6">
						<label className="form-label">Store Manager Number</label>
						<MaskedTextBox
							name="storeManagerNumber"
							value={form.storeManagerNumber || ''}
							onChange={handleInputChange}
							mask="9999999999"
							style={{ width: "100%" }}
						/>
					</div>
					<div className="col-md-6">
						<label className="form-label">Person Visit Name</label>
						<DropDownList
							data={employees}
							textField="name"
							dataItemKey="id"
							value={employees.find(e => e.id === form.personVisitId) || null}
							onChange={e => handleDropDownChange('personVisitId', e.value ? e.value.id : null)}
							loading={employeesLoading}
							disabled={employeesLoading || !!employeesError}
							style={{ width: "100%" }}
							placeholder={employeesLoading ? 'Loading...' : (employeesError ? 'Failed to load' : 'Select Employee')}
						/>
						{employeesError && <div className="text-danger small mt-1">{employeesError}</div>}
					</div>
					<div className="col-md-6">
						<label className="form-label">Store Mail ID</label>
						<Input
							name="storeMailId"
							value={form.storeMailId || ''}
							onChange={handleInputChange}
							style={{ width: "100%" }}
						/>
					</div>
					<div className="col-md-6">
						<label className="form-label">Store Address</label>
						<Input
							name="storeAddress"
							value={form.storeAddress || ''}
							onChange={handleInputChange}
							style={{ width: "100%" }}
						/>
					</div>
				</div>
			</fieldset>
			{/* Photos (Capture/Upload) */}
			<fieldset className="mb-4">
				<legend>Photos (Capture/Upload)</legend>
				<div className="row">
					<div className="col-12">
						{/* Implement photo upload/preview as needed */}
						{/* ...existing code... */}
					</div>
				</div>
			</fieldset>
			{/* Site Visit Documents (Image Preview) */}
			<fieldset className="mb-4">
				<legend>Site Visit Documents</legend>
				<ImageDocumentsPreview documents={documents} onRemove={handleRemoveDocument} />
			</fieldset>
			{/* Visiting line items */}
			<fieldset className="mb-4">
				<legend>Visiting line items</legend>
				<EditableLineItemsGrid
					value={lineItems}
					onChange={setLineItems}
					columns={[{ field: 'description', title: 'Description' }, { field: 'uom', title: 'UOM' }, { field: 'boqQty', title: 'BOQ quantity', type: 'numeric' }, { field: 'onsiteQty', title: 'On-site work quantity', type: 'numeric' }, { field: 'finalReview', title: 'Final Review' }, { field: 'remarks', title: 'Remarks' }]}
				/>
			</fieldset>
			{/* Notes */}
			<fieldset className="mb-4">
				<legend>Notes</legend>
				<div className="row">
					<div className="col-12">
						<Input
							name="notes"
							value={form.notes || ''}
							onChange={handleInputChange}
							style={{ width: "100%" }}
						/>
					</div>
				</div>
			</fieldset>
			{(errorMessage || successMessage) && (
				<div style={{ marginBottom: 12 }}>
					{errorMessage && <div className="error-box">{errorMessage}</div>}
					{successMessage && <div className="success-box">{successMessage}</div>}
				</div>
			)}
			<div className="row mt-4">
				<div className="col-12 text-end">
					<Button themeColor="primary" type="submit">
						Save
					</Button>
					<Button type="reset" style={{ marginLeft: 12 }}>
						Cancel
					</Button>
				</div>
			</div>
		</form>
	);
};

export default SiteVisitEdit;
