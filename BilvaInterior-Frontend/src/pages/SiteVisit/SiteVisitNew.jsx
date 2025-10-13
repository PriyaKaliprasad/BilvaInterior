import React, { useState, useEffect } from 'react';
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { Form, Field, FormElement, FieldWrapper } from '@progress/kendo-react-form';
import { Button } from '@progress/kendo-react-buttons';
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import FormInput from '../../components/Form/FormInput';
import FormDatePicker from '../../components/Form/FormDatePicker';
import FormDropDown from '../../components/Form/FormDropDown';
import FormUpload from '../../components/Form/FormUpload';
import UploadWithPreview from '../../components/UploadWithPreview';
import CustomFormFieldSet from '../../components/Form/CustomFormFieldSet';
import { nameValidator, emailValidator, phoneValidator, requiredValidator } from '../../utils/validators';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SiteVisitDialog.css';
import api from '../../api/axios';
import FloatingLabelWrapper from '../../components/Form/FloatingLabelWrapper/FloatingLabelWrapper';
import { DropDownList } from '@progress/kendo-react-dropdowns';

const reportTypes = [
	{ text: 'Site Visit', value: 'sitevisit' },
	{ text: 'Completion', value: 'completion' },
	{ text: 'Hand-Over', value: 'handover' },
];

const SiteVisitNew = () => {

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
				setProjects(res.data || []);
			} catch (err) {
				setProjectsError('Failed to load projects');
			} finally {
				setProjectsLoading(false);
			}
		};
		fetchProjects();
	}, []);

	// Sample data for grid
	const [lineItems, setLineItems] = useState([
		{
			id: 1,
			description: 'Wall Painting',
			uom: 'Sqft',
			boqQty: 120,
			onsiteQty: 110,
			finalReview: 'OK',
			remarks: 'Minor touchups',
		},
		{
			id: 2,
			description: 'Floor Tiling',
			uom: 'Sqft',
			boqQty: 200,
			onsiteQty: 195,
			finalReview: 'Good',
			remarks: 'Completed',
		},
		{
			id: 3,
			description: 'Ceiling Lights',
			uom: 'Nos',
			boqQty: 30,
			onsiteQty: 28,
			finalReview: 'Pending',
			remarks: 'Awaiting delivery',
		},
	]);

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
		setLineItems(lineItems.filter(item => item.id !== id));
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

		// Example: append line items (if needed)
		// formData.append('lineItems', JSON.stringify(lineItems));

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
		} catch (error) {
			if (error.response) {
				// Server responded with a status other than 2xx
				console.error('Submission failed:', error.response.status, error.response.data);
			} else if (error.request) {
				// Request was made but no response received
				console.error('No response received:', error.request);
			} else {
				// Something else happened
				console.error('Error during submission:', error.message);
			}
		}
	};


	return (
		<Form
			onSubmit={handleSubmit}
			render={(formRenderProps) => (
				<FormElement className="container py-4">

					{/* Project Dropdown */}
					<FieldWrapper>
						<div className="k-form-field-wrap mb-4 w-50">
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
											filterable={true}
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
									validator={nameValidator}
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
									validator={nameValidator}
								/>
							</div>
						</div>
					</CustomFormFieldSet>

					{/* Store/Project Details */}
					<CustomFormFieldSet legend="Store/Project Details">
						<div className="row g-3">
							<div className="col-md-6">
								<Field name="storeName" label="Store Name" component={FormInput} validator={nameValidator} />
							</div>
							<div className="col-md-6">
								<Field name="storeCode" label="Store Code" component={FormInput} validator={nameValidator} />
							</div>

							<div className="col-md-6">
								<Field name="storeManagerName" label="Store Manager Name" component={FormInput} validator={nameValidator} />
							</div>
							<div className="col-md-6">
								<Field name="vendorCode" label="Vendor Code" component={FormInput} validator={nameValidator} />
							</div>

							<div className="col-md-6">
								<Field name="storeLocation" label="Store Location" component={FormInput} validator={nameValidator} />
							</div>
							<div className="col-md-6">
								<Field name="sapCode" label="SAP Code" component={FormInput} validator={nameValidator} />
							</div>

							<div className="col-md-6">
								<Field name="storeManagerNumber" label="Store Manager Number" component={FormInput} validator={phoneValidator} />
							</div>
							<div className="col-md-6">
								<Field name="personVisitName" label="Person Visit Name" component={FormInput} validator={nameValidator} />
							</div>

							<div className="col-md-6">
								<Field name="storeMailId" label="Store Mail ID" component={FormInput} validator={emailValidator} />
							</div>
							<div className="col-md-6">
								<Field name="storeAddress" label="Store Address" component={FormInput} validator={nameValidator} />
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
								/>
							</div>
						</div>
					</CustomFormFieldSet>

					{/* Visiting line items */}
					<CustomFormFieldSet legend="Visiting line items">
						<div className="row mb-2">
							<div className="col-12 text-end">
								<Button themeColor="primary" type="button" onClick={handleAddLineItem}>
									Add item
								</Button>
							</div>
						</div>
						<div className="row">
							<div className="col-12">
								<div className="table-responsive" style={{ overflowX: 'auto' }}>
									<Grid
										style={{ minHeight: 200, minWidth: 900 }}
										data={lineItems}
										pageable={false}
										resizable={true}
										className="k-table-bordered w-100"
									>
										<GridColumn field="description" title="Description" />
										<GridColumn field="uom" title="UOM" />
										<GridColumn field="boqQty" title="BOQ quantity" />
										<GridColumn field="onsiteQty" title="On-site work quantity" />
										<GridColumn field="finalReview" title="Final Review" />
										<GridColumn field="remarks" title="Remarks" />
										<GridColumn
											title="Actions"
											cell={props => (
												<td>
													<Button type="button" size="small" icon="edit" onClick={() => handleEditLineItem(props.dataItem)} />
													<Button type="button" size="small" icon="delete" style={{ marginLeft: 8 }} onClick={() => handleDeleteLineItem(props.dataItem.id)} />
												</td>
											)}
										/>
									</Grid>
								</div>
								{/* Kendo Dialog for add/edit */}

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

					{dialogOpen && (
						<Dialog
							title={dialogMode === 'add' ? 'Add Line Item' : 'Edit Line Item'}
							onClose={() => setDialogOpen(false)}
						>
							<CustomFormFieldSet>
								<div className="row g-2">
									<div className="col-12 col-md-6 mb-2">
										<FormInput
											label="Description"
											name="description"
											value={dialogData.description}
											onChange={handleDialogInputChange}
										/>
									</div>
									<div className="col-12 col-md-6 mb-2">
										<FormInput
											label="UOM"
											name="uom"
											value={dialogData.uom}
											onChange={handleDialogInputChange}
										/>
									</div>
									<div className="col-12 col-md-6 mb-2">
										<FormInput
											label="BOQ quantity"
											name="boqQty"
											type="number"
											value={dialogData.boqQty}
											onChange={handleDialogInputChange}
										/>
									</div>
									<div className="col-12 col-md-6 mb-2">
										<FormInput
											label="On-site work quantity"
											name="onsiteQty"
											type="number"
											value={dialogData.onsiteQty}
											onChange={handleDialogInputChange}
										/>
									</div>
									<div className="col-12 col-md-6 mb-2">
										<FormInput
											label="Final Review"
											name="finalReview"
											value={dialogData.finalReview}
											onChange={handleDialogInputChange}
										/>
									</div>
									<div className="col-12 col-md-6 mb-2">
										<FormInput
											label="Remarks"
											name="remarks"
											value={dialogData.remarks}
											onChange={handleDialogInputChange}
										/>
									</div>
								</div>
							</CustomFormFieldSet>

							<DialogActionsBar>
								<Button
									themeColor="primary"
									onClick={handleDialogSave}
									style={{ minWidth: 100 }}
								>
									{dialogMode === 'add' ? 'Add' : 'Save'}
								</Button>
								<Button
									onClick={() => setDialogOpen(false)}
									style={{ minWidth: 100, marginLeft: 10 }}
								>
									Cancel
								</Button>
							</DialogActionsBar>
						</Dialog>
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
