
import React, { useState, useEffect } from 'react';
import EditableLineItemsGrid from '../../../components/EditableLineItemsGrid';
import { Button } from '@progress/kendo-react-buttons';
import { TextBox, MaskedTextBox } from '@progress/kendo-react-inputs';
import { DatePicker } from '@progress/kendo-react-dateinputs';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import api from '../../../api/axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../SiteVisit/SiteVisitDialog.css';
import { nameValidator, emailValidator, phoneValidator, requiredValidator, minMaxLengthValidator } from '../../../utils/validators';
import { minMaxLengthWarning, emailWarning, phoneWarning } from '../../../utils/validators';
import UploadPreviewEdit from './UploadPreviewEdit';
import UploadPreviewDocuments from './UploadPreviewDocuments';
import CustomFormFieldSet from '../../../components/Form/CustomFormFieldSet';
import FloatingLabelWrapper from '../../../components/Form/FloatingLabelWrapper/FloatingLabelWrapper';
import { FieldWrapper } from '@progress/kendo-react-form';

const reportTypes = [
	{ text: 'Site Visit', value: 0 },
	{ text: 'Work Completion', value: 1 },
	{ text: 'Handover', value: 2 },
	{ text: 'Delivery Challan', value: 3 },
];

const SiteVisitEdit = ({ siteVisitId, onBack }) => {
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
	const [imageFiles, setImageFiles] = useState([]); // for UploadPreviewEdit (images)
	const [docFiles, setDocFiles] = useState([]); // for UploadPreviewDocuments (non-images)

	// Last modified info
	const [lastModifiedBy, setLastModifiedBy] = useState('');
	const [lastModifiedAt, setLastModifiedAt] = useState(null);

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
				console.log(data);
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
				// Last modified info
				let modifiedBy = '';
				if (data.lastModifiedBy && typeof data.lastModifiedBy === 'object' && data.lastModifiedBy.email) {
					modifiedBy = data.lastModifiedBy.email;
				} else if (typeof data.lastModifiedBy === 'string') {
					modifiedBy = data.lastModifiedBy;
				} else if (data.lastModifiedByName) {
					modifiedBy = data.lastModifiedByName;
				}
				setLastModifiedBy(modifiedBy);
				setLastModifiedAt(data.lastModifiedUtc || null);
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

		// Add images from imageFiles (from UploadPreviewEdit)
		const fetchBlob = async (url) => {
			const response = await fetch(url);
			return await response.blob();
		};
		// Helper to append files (images or docs)
		const appendFilesToFormData = async (filesArr) => {
			const promises = (filesArr || []).map(async (file) => {
				if (!file.fromServer && file.getRawFile) {
					formData.append('documents', file.getRawFile(), file.name);
				} else if (file.fromServer && file.src) {
					try {
						const blob = await fetchBlob(file.src);
						formData.append('documents', blob, file.name);
					} catch (err) {
						console.error('Failed to fetch blob for', file.name, err);
					}
				}
			});
			await Promise.all(promises);
		};
		await appendFilesToFormData(imageFiles);
		await appendFilesToFormData(docFiles);

		// For debugging: log FormData keys and values
		for (let pair of formData.entries()) {
			console.log(pair[0] + ':', pair[1]);
		}

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


	// Format last modified date to DD/MM/YY and IST time
	const getLastModifiedDisplay = () => {
		if (!lastModifiedAt) return '';
		const d = new Date(lastModifiedAt);
		// Convert to IST
		const istOffset = 5.5 * 60 * 60 * 1000;
		const istDate = new Date(d.getTime() + istOffset);
		const day = String(istDate.getDate()).padStart(2, '0');
		const month = String(istDate.getMonth() + 1).padStart(2, '0');
		const year = String(istDate.getFullYear()).slice(-2);
		const hours = String(istDate.getHours()).padStart(2, '0');
		const mins = String(istDate.getMinutes()).padStart(2, '0');
		return `${day}/${month}/${year} ${hours}:${mins} IST`;
	};

	if (loading) return <div>Loading...</div>;

	return (
		<>
			{/* Header with back button and last modified info */}
			<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: '0.5rem' }}>
				<Button
					icon="arrow-left"
					size="small"
					onClick={onBack}
					className="action-btn back-btn"
				>
					<span className="tieup-action-btn-text">Back</span>
				</Button>
				
				{/* Last modified info on right side */}
				{(lastModifiedBy || lastModifiedAt) && (
					<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
						{lastModifiedBy && (
							<span className="text-muted small" style={{ fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
								<span style={{ fontWeight: 500 }}>Last modified by:</span> {lastModifiedBy}
							</span>
						)}
						{lastModifiedAt && (
							<span className="text-muted small" style={{ fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
								<span style={{ fontWeight: 500 }}>Last modified at:</span> {getLastModifiedDisplay()}
							</span>
						)}
					</div>
				)}
			</div>

		<form className="container py-4" onSubmit={handleSubmit}>

			{/* Project Dropdown */}
			<FieldWrapper>
				<div className="k-form-field-wrap mb-4 col-12 col-md-6">
					<FloatingLabelWrapper label={'Project'}>
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
					</FloatingLabelWrapper>
					{projectsError && <div className="text-danger small mt-1">{projectsError}</div>}
				</div>
			</FieldWrapper>

			{/* Report Info */}
			<CustomFormFieldSet legend="Report Info">
				<div className="mt-4">
					<div className="row g-3">
						<div className="col-md-6">
							<FloatingLabelWrapper label="Report Type">
								<DropDownList
									data={reportTypes}
									textField="text"
									dataItemKey="value"
									value={reportTypes.find(rt => rt.value === form.reportType) || null}
									onChange={e => handleDropDownChange('reportType', e.value ? e.value.value : null)}
									style={{ width: "100%" }}
									size="large"
									className="mb-3"
								/>
							</FloatingLabelWrapper>
						</div>
						<div className="col-md-6">
							<FloatingLabelWrapper label="Report Date" value={form.reportDate}>
								<DatePicker
									value={form.reportDate || null}
									onChange={e => handleDateChange('reportDate', e.value)}
									style={{ width: "100%" }}
									size="large"
									className="mb-3"
								/>
							</FloatingLabelWrapper>
						</div>
					</div>
				</div>
			</CustomFormFieldSet>

			{/* Store/Project Details */}
			<CustomFormFieldSet legend="Store/Project Details">
				<div className="mt-4">
					<div className="row g-3">
						<div className="col-md-6">
							<FloatingLabelWrapper label="Store Name" value={form.storeName}>
								<TextBox
									name="storeName"
									value={form.storeName || ''}
									onChange={handleInputChange}
									style={{ width: "100%" }}
									size={"large"}
									className="mb-3"
								/>
							</FloatingLabelWrapper>
							{minMaxLengthWarning(form.storeName) && (
								<div className="text-warning small mt-1">{minMaxLengthWarning(form.storeName)}</div>
							)}
						</div>
						<div className="col-md-6">
							<FloatingLabelWrapper label="Store Location" value={form.storeLocation}>
								<TextBox
									name="storeLocation"
									value={form.storeLocation || ''}
									onChange={handleInputChange}
									style={{ width: "100%" }}
									size="large"
									className="mb-3"
								/>
							</FloatingLabelWrapper>
							{minMaxLengthWarning(form.storeLocation) && (
								<div className="text-warning small mt-1">{minMaxLengthWarning(form.storeLocation)}</div>
							)}
						</div>
						<div className="col-md-6">
							<FloatingLabelWrapper label="Store Manager Name" value={form.storeManagerName}>
								<TextBox
									name="storeManagerName"
									value={form.storeManagerName || ''}
									onChange={handleInputChange}
									style={{ width: "100%" }}
									size="large"
									className="mb-3"
								/>
							</FloatingLabelWrapper>
							{minMaxLengthWarning(form.storeManagerName) && (
								<div className="text-warning small mt-1">{minMaxLengthWarning(form.storeManagerName)}</div>
							)}
						</div>
						<div className="col-md-6">
							<FloatingLabelWrapper label="Vendor Code" value={form.vendorCode}>
								<TextBox
									name="vendorCode"
									value={form.vendorCode || ''}
									onChange={handleInputChange}
									style={{ width: "100%" }}
									size="large"
									className="mb-3"
								/>
							</FloatingLabelWrapper>
							{minMaxLengthWarning(form.vendorCode) && (
								<div className="text-warning small mt-1">{minMaxLengthWarning(form.vendorCode)}</div>
							)}
						</div>
						<div className="col-md-6">
							<FloatingLabelWrapper label="Store Code" value={form.storeCode}>
								<TextBox
									name="storeCode"
									value={form.storeCode || ''}
									onChange={handleInputChange}
									style={{ width: "100%" }}
									size="large"
									className="mb-3"
								/>
							</FloatingLabelWrapper>
							{minMaxLengthWarning(form.storeCode) && (
								<div className="text-warning small mt-1">{minMaxLengthWarning(form.storeCode)}</div>
							)}
						</div>
						<div className="col-md-6">
							<FloatingLabelWrapper label="SAP Code" value={form.sapCode}>
								<TextBox
									name="sapCode"
									value={form.sapCode || ''}
									onChange={handleInputChange}
									style={{ width: "100%" }}
									size="large"
									className="mb-3"
								/>
							</FloatingLabelWrapper>
							{minMaxLengthWarning(form.sapCode) && (
								<div className="text-warning small mt-1">{minMaxLengthWarning(form.sapCode)}</div>
							)}
						</div>
						<div className="col-md-6">
							<FloatingLabelWrapper label="Store Manager Number" value={form.storeManagerNumber}>
								<MaskedTextBox
									name="storeManagerNumber"
									value={form.storeManagerNumber || ''}
									onChange={handleInputChange}
									mask="9999999999"
									style={{ width: "100%" }}
									size="large"
									className="mb-3"
								/>
							</FloatingLabelWrapper>
							{phoneWarning(form.storeManagerNumber) && (
								<div className="text-warning small mt-1">{phoneWarning(form.storeManagerNumber)}</div>
							)}
						</div>
						<div className="col-md-6">
							<FloatingLabelWrapper label="Person Visit Name">
								<DropDownList
									data={employees}
									textField="name"
									dataItemKey="id"
									value={employees.find(e => e.id === form.personVisitId) || null}
									onChange={e => handleDropDownChange('personVisitId', e.value ? e.value.id : null)}
									loading={employeesLoading}
									disabled={employeesLoading || !!employeesError}
									style={{ width: "100%" }}
									size="large"
									placeholder={employeesLoading ? 'Loading...' : (employeesError ? 'Failed to load' : 'Select Employee')}
									className="mb-3"
								/>
							</FloatingLabelWrapper>
							{employeesError && <div className="text-danger small mt-1">{employeesError}</div>}
						</div>
						<div className="col-md-6">
							<FloatingLabelWrapper label="Store Mail ID" value={form.storeMailId}>
								<TextBox
									name="storeMailId"
									value={form.storeMailId || ''}
									onChange={handleInputChange}
									style={{ width: "100%" }}
									size="large"
									className="mb-3"
								/>
							</FloatingLabelWrapper>
							{emailWarning(form.storeMailId) && (
								<div className="text-warning small mt-1">{emailWarning(form.storeMailId)}</div>
							)}
						</div>
						<div className="col-md-6">
							<FloatingLabelWrapper label="Store Address" value={form.storeAddress}>
								<TextBox
									name="storeAddress"
									value={form.storeAddress || ''}
									onChange={handleInputChange}
									style={{ width: "100%" }}
									size="large"
									className="mb-3"
								/>
							</FloatingLabelWrapper>
							{minMaxLengthWarning(form.storeAddress) && (
								<div className="text-warning small mt-1">{minMaxLengthWarning(form.storeAddress)}</div>
							)}
						</div>
					</div>
				</div>
			</CustomFormFieldSet>

			{/* Photos (Capture/Upload) */}
			<CustomFormFieldSet legend="Photos (Capture/Upload)">
				<div className="row">
					<div className="col-12">
						<UploadPreviewEdit
							initialFiles={documents}
							onFilesChange={setImageFiles}
						/>
					</div>
				</div>
			</CustomFormFieldSet>

			{/* Site Visit Documents (Non-image preview/upload) */}
			<CustomFormFieldSet legend="Site Visit Documents">
				<div className="row">
					<div className="col-12">
						<UploadPreviewDocuments
							initialFiles={documents}
							onFilesChange={setDocFiles}
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
							columns={[{ field: 'description', title: 'Description' }, { field: 'uom', title: 'UOM' }, { field: 'boqQty', title: 'BOQ quantity', type: 'numeric' }, { field: 'onsiteQty', title: 'On-site work quantity', type: 'numeric' }, { field: 'finalReview', title: 'Final Review' }, { field: 'remarks', title: 'Remarks' }]}
						/>
					</div>
				</div>
			</CustomFormFieldSet>

			{/* Notes */}
			<CustomFormFieldSet legend="Notes">
				<div className="row">
					<div className="col-12">
						<FloatingLabelWrapper label="Notes" value={form.notes}>
							<TextBox
								name="notes"
								value={form.notes || ''}
								onChange={handleInputChange}
								style={{ width: "100%" }}
								size="large"
								className="mb-3"
							/>
						</FloatingLabelWrapper>
					</div>
				</div>
			</CustomFormFieldSet>
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
		</>
	);
};

export default SiteVisitEdit;
