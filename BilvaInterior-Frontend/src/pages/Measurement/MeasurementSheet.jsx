// ✅ src/pages/MeasurementSheet.jsx
import React, { useState, useEffect } from "react";
import * as XLSX from 'xlsx';
import api from "../../api/axios";
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { Upload } from '@progress/kendo-react-upload';
import { Button } from '@progress/kendo-react-buttons';
import { Grid, GridColumn, GridColumnMenuFilter } from '@progress/kendo-react-grid';
import { process } from '@progress/kendo-data-query';
import { filterIcon } from '@progress/kendo-svg-icons';
import { FieldWrapper } from '@progress/kendo-react-form';
import FloatingLabelWrapper from '../../components/Form/FloatingLabelWrapper/FloatingLabelWrapper';
import ExcelLoader from './ExcelLoader';

const MeasurementSheet = () => {
    // Kendo column menu helper for filters
    const ColumnMenu = (props) => <GridColumnMenuFilter {...props} expanded={true} />;

    const [filter, setFilter] = useState({ logic: 'and', filters: [] });

    const handleFilterChange = (e) => {
        setFilter(e.filter);
    };
    // 🔹 Dropdown-related states
    const [projects, setProjects] = useState([]);
    const [projectsLoading, setProjectsLoading] = useState(false);
    const [projectsError, setProjectsError] = useState(null);
    const [selectedProjectId, setSelectedProjectId] = useState("");

    // 🔹 File + Preview
    const [excelFiles, setExcelFiles] = useState([]);
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
    const [fileTotals, setFileTotals] = useState([]);
    const [fileWorkbooks, setFileWorkbooks] = useState([]);
    const [previewIndex, setPreviewIndex] = useState(null);
    const [measurementsLoading, setMeasurementsLoading] = useState(false);
    const [measurementsError, setMeasurementsError] = useState(null);
    const [viewMode, setViewMode] = useState('list'); // 'list' | 'add'
    const [measurementList, setMeasurementList] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteItem, setDeleteItem] = useState(null);
    const [deleting, setDeleting] = useState(false);
    // Edit-mode states
    const [editMeasurementItem, setEditMeasurementItem] = useState(null);
    const [editFile, setEditFile] = useState(null); // File loaded from backend for editing
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState(null);
    const [editModified, setEditModified] = useState(false);

    // Helper: extract totals from Kendo JSON workbook
    const extractTotalsFromJSON = async (json) => {
        // json expected to have a `sheets` array with rows -> cells -> { value }
        const totals = [];
        const sheets = json.sheets || json.workbook?.sheets || json;
        if (!Array.isArray(sheets)) return totals;

        for (const sheet of sheets) {
            const rows = sheet.rows || [];
            for (const row of rows) {
                const cells = row.cells || [];
                for (let idx = 0; idx < cells.length; idx++) {
                    const cellVal = cells[idx]?.value;
                    if (typeof cellVal === 'string' && cellVal.toLowerCase().includes('grand total')) {
                        const next = cells[idx + 1]?.value;
                        if (next !== undefined && next !== null && !isNaN(parseFloat(next))) {
                            totals.push(parseFloat(next));
                        } else {
                            const prev = cells[idx - 1]?.value;
                            if (prev !== undefined && prev !== null && !isNaN(parseFloat(prev))) {
                                totals.push(parseFloat(prev));
                            }
                        }
                    }
                }
            }
        }

        // NOTE: No fallback. Only values explicitly labeled with 'total' are considered.

        return totals;
    };

    // Helper: extract totals from binary Excel file or from Kendo JSON file
    const extractTotalsFromFile = async (file) => {
        // If file is a JSON representation produced by ExcelLoader, parse and extract
        if (!file) return [];
        const isJson = (file.type && file.type.includes('json')) || file.name?.toLowerCase().endsWith('.json');
        if (isJson) {
            // read as text and parse JSON
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = async (e) => {
                    try {
                        const json = JSON.parse(e.target.result);
                        const totals = await extractTotalsFromJSON(json);
                        resolve(totals);
                    } catch (err) {
                        reject(err);
                    }
                };
                reader.onerror = reject;
                reader.readAsText(file);
            });
        }

        // Fallback: treat as binary Excel and use SheetJS as before
        // NOTE: Do NOT perform any numerical fallback — only labelled 'total' cells are valid.
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    let totals = [];
                    workbook.SheetNames.forEach(sheetName => {
                        const sheet = workbook.Sheets[sheetName];
                        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
                        rows.forEach(row => {
                            row.forEach((cell, idx) => {
                                if (typeof cell === 'string' && cell.toLowerCase().includes('grand total')) {
                                    // Try right-hand side
                                    const nextCell = row[idx + 1];
                                    if (nextCell && !isNaN(parseFloat(nextCell))) {
                                        totals.push(parseFloat(nextCell));
                                    } else if (row[idx - 1] && !isNaN(parseFloat(row[idx - 1]))) {
                                        totals.push(parseFloat(row[idx - 1]));
                                    }
                                }
                            });
                        });
                    });
                    // No numeric fallback: if no labelled totals were found, return empty array
                    resolve(totals);
                } catch (err) {
                    reject(err);
                }
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    };
    // Submit handler: extract totals, build FormData, log key-value pairs
    const handleSubmit = async () => {
        setSubmitError("");
        if (!selectedProjectId) {
            setSubmitError("Please select a project first!");
            return;
        }
        if (!excelFiles || excelFiles.length === 0) {
            setSubmitError("Please choose at least one Excel file!");
            return;
        }
        let fileTotalArr = [];
        for (let i = 0; i < excelFiles.length; i++) {
            const file = excelFiles[i];
            try {
                const totals = await extractTotalsFromFile(file);
                if (!totals || totals.length === 0) {
                    setSubmitError(`No total value found in file: ${file.name}`);
                    return;
                }
                fileTotalArr.push({ file, total: totals });
            } catch (err) {
                setSubmitError(`Error reading file: ${file.name}`);
                return;
            }
        }
        // Build FormData
        const formData = new FormData();
        formData.append("projectId", selectedProjectId);
        fileTotalArr.forEach((item, idx) => {
            // Append each file using the same key 'files' so backend receives multiple parts under 'files'
            formData.append('files', item.file);
            // Append primary numeric total as a value (not JSON array)
            const primaryTotal = Array.isArray(item.total) ? item.total[0] : item.total;
            formData.append(`totals[${idx}]`, primaryTotal);
        });


        // Log every key/value pair in formData for debugging
        for (const [key, value] of formData.entries()) {
            if (value instanceof File) {
            console.log(`${key}: File{name="${value.name}", size=${value.size}, type=${value.type}}`);
            } else if (value instanceof Blob) {
            console.log(`${key}: Blob(size=${value.size}, type=${value.type})`);
            } else {
            console.log(`${key}:`, value);
            }
        }

        // POST to backend
        setUploading(true);
        try {
            // Let axios set multipart boundary; override content-type accordingly
            const res = await api.post('/api/measurementsheet', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // Success toast (auto-hide after 5s)
            setToast({ visible: true, message: (res && res.data && res.data.message) ? res.data.message : 'Measurement sheet submitted successfully', type: 'success' });
            setTimeout(() => {
                setToast({ visible: false, message: '', type: 'success' });
            }, 5000);

            // Clear uploaded files, totals and preview
            setExcelFiles([]);
            setFileTotals([]);
            setFileWorkbooks([]);
            setPreviewIndex(null);
            // Reset selected project and close add view
            setSelectedProjectId('');
            setViewMode('list');
            // Refresh the grid to show newly added measurement(s)
            await refreshMeasurementList();
        } catch (err) {
            console.error('MeasurementSheet submit error:', err);
            // Persisting error toast until next success
            const errMsg = err?.response?.data?.message || err.message || 'Failed to submit measurement sheet';
            setToast({ visible: true, message: errMsg, type: 'error' });
        } finally {
            setUploading(false);
        }
    };

    // ✅ Fetch all projects on mount
    useEffect(() => {
        const fetchProjects = async () => {
            setProjectsLoading(true);
            try {
                console.log("📡 Fetching projects from /api/Projects ...");
                const res = await api.get("/api/Projects");
                console.log("✅ Projects response:", res.data);
                setProjects(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.error("❌ Failed to load projects:", err);
                setProjectsError("Failed to load projects.");
            } finally {
                setProjectsLoading(false);
            }
        };
        fetchProjects();
    }, []);

    // Clear file-upload error toast when the selected project changes (safety net)
    useEffect(() => {
        if (toast.visible && toast.type === 'error') {
            setToast({ visible: false, message: '', type: 'error' });
        }
    }, [selectedProjectId]);

    // Fetch/refresh measurement sheets (for the list view)
    const refreshMeasurementList = async () => {
        setMeasurementsLoading(true);
        try {
            const res = await api.get('/api/measurementsheet/all');
            setMeasurementList(Array.isArray(res.data) ? res.data : []);
            setMeasurementsError(null);
        } catch (err) {
            console.error('Failed to fetch measurement sheets list:', err);
            setMeasurementsError('Failed to load measurement sheets.');
        } finally {
            setMeasurementsLoading(false);
        }
    };

    useEffect(() => {
        refreshMeasurementList();
    }, []);

    // Handler to open edit view and load file from backend
    const handleEditMeasurement = async (item) => {
        // start by switching view so grid is hidden immediately
        setViewMode('edit');
        setEditMeasurementItem(item || null);
        setEditFile(null);
        setEditError(null);

        // Resolve filePath from common possible keys
        const filePath = item?.filePath || item?.fileUrl || item?.file || item?.measurementFilePath;
        const fileNameFromItem = item?.fileName || item?.fileNameOriginal || (filePath ? filePath.split('/').pop() : null);

        if (!filePath) {
            setEditError('No file path available for this measurement.');
            return;
        }

        setEditLoading(true);
        try {
            const base = import.meta.env.VITE_API_BASE_URL || '';
            const url = `${base}${filePath}`;

            const res = await fetch(url, {
                method: 'GET'
            });
            if (!res.ok) throw new Error(`Failed to fetch file: ${res.status} ${res.statusText}`);
            const blob = await res.blob();

            // Guess file type if missing
            const guessedType = blob.type || (fileNameFromItem && fileNameFromItem.toLowerCase().endsWith('.json') ? 'application/json' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            const loadedFile = new File([blob], fileNameFromItem || 'measurement.xlsx', { type: guessedType });

            setEditFile(loadedFile);
            setEditModified(false);
        } catch (err) {
            console.error('Failed to load edit file:', err);
            setEditError(err.message || 'Failed to load file');
        } finally {
            setEditLoading(false);
        }
    };

    const handleDeleteMeasurement = (item) => {
        // Open confirmation modal with selected item
        setDeleteItem(item);
        setShowDeleteModal(true);
    };

    const confirmDeleteMeasurement = async () => {
        if (!deleteItem) return;
        // Resolve possible id fields used by API
        const id = deleteItem.id || deleteItem.measurementId || deleteItem._id || deleteItem.measurementSheetId;
        if (!id) {
            console.error('No id found on deleteItem:', deleteItem);
            setToast({ visible: true, message: 'Unable to determine id for deletion', type: 'error' });
            return;
        }

        try {
            setDeleting(true);
            console.log('Deleting measurement sheet id:', id);
            // send DELETE to backend (path param)
            const res = await api.delete(`/api/measurementsheet/${id}`);
            console.log('Delete response:', res);
            // on success, close modal and refresh grid
            setShowDeleteModal(false);
            setDeleteItem(null);
            setToast({ visible: true, message: 'Measurement sheet deleted successfully', type: 'success' });
            setTimeout(() => setToast({ visible: false, message: '', type: 'success' }), 5000);
            await refreshMeasurementList();
        } catch (err) {
            console.error('Failed to delete measurement sheet:', err);
            const errMsg = err?.response?.data?.message || err.message || 'Failed to delete measurement sheet';
            setToast({ visible: true, message: errMsg, type: 'error' });
        } finally {
            setDeleting(false);
        }
    };

    // ✅ File change (Kendo Upload) - compute totals for each uploaded file
    const handleFileChange = async (event) => {
        const newState = event.newState || [];
        const rawFiles = newState.map(f => f.getRawFile());

        const acceptedFiles = [];
        const totalsArr = [];
        const rejectedFiles = [];

        for (let i = 0; i < rawFiles.length; i++) {
            const file = rawFiles[i];
            try {
                const totals = await extractTotalsFromFile(file);
                if (totals && totals.length > 0) {
                    acceptedFiles.push(file);
                    totalsArr.push({ file, totals });
                } else {
                    // Reject file without labelled total
                    rejectedFiles.push(file.name || file.name === 0 ? file.name : `File ${i + 1}`);
                }
            } catch (err) {
                // treat parse errors as rejection
                rejectedFiles.push(file.name || `File ${i + 1}`);
            }
        }

        // Update accepted files only
        setExcelFiles(acceptedFiles);
        setFileTotals(totalsArr);

        // initialize workbooks entries for accepted files
        setFileWorkbooks(prev => acceptedFiles.map((f, i) => prev[i] || null));
        setPreviewIndex(null);

        // If any files were rejected, show persistent error toast (until successful submit)
        if (rejectedFiles.length > 0) {
            const names = rejectedFiles.join(', ');
            setToast({ visible: true, message: `No labelled total found in: ${names}`, type: 'error' });
        }
    };

    // Note: keep all existing content exactly as before — render only when in 'add' mode
    const addContent = (
        <div className="py-2">
            <div className="row">
                {/* Project Dropdown */}
                <div className="col-12 col-md-6 mb-4">
                    <FieldWrapper>
                        <FloatingLabelWrapper label={'Project'}>
                            <DropDownList
                                data={projects}
                                textField="projectName"
                                dataItemKey="id"
                                value={projects.find(p => p.id === selectedProjectId) || null}
                                onChange={e => {
                                    const newId = e.value ? e.value.id : '';
                                    setSelectedProjectId(newId);
                                    // Clear persistent file-upload error toast when project changes
                                    if (toast.visible && toast.type === 'error') {
                                        setToast({ visible: false, message: '', type: 'error' });
                                    }
                                    // Clear inline submitError as well when changing project
                                    if (submitError) setSubmitError('');
                                }}
                                loading={projectsLoading}
                                disabled={projectsLoading || !!projectsError}
                                style={{ width: "100%" }}
                                size={'large'}
                                placeholder={projectsLoading ? 'Loading...' : (projectsError ? 'Failed to load' : 'Select Project')}
                            />
                        </FloatingLabelWrapper>
                        {projectsError && <div className="text-danger small mt-1">{projectsError}</div>}
                    </FieldWrapper>
                </div>

                {/* File Upload */}
                <div className="col-12 col-md-6 mb-4">
                    <FieldWrapper>
                        <FloatingLabelWrapper label={'Excel Upload'}>
                            <Upload
                                batch={false}
                                autoUpload={false}
                                multiple={true}
                                withCredentials={false}
                                accept={'.xls,.xlsx'}
                                files={excelFiles.map((f, i) => ({
                                    name: f.name,
                                    size: f.size,
                                    uid: String(i),
                                    getRawFile: () => f,
                                }))}
                                onAdd={handleFileChange}
                                showActionButtons={false}
                                showFileList={false}
                                style={{ width: '100%' }}
                            />
                        </FloatingLabelWrapper>
                    </FieldWrapper>
                </div>
            </div>


            {/* Error Toast */}
            {submitError && (
                <div className="error-box" style={{ marginBottom: 12 }}>{submitError}</div>
            )}

            {/* File totals grid (Bootstrap) - shows only when files are uploaded */}
            {excelFiles && excelFiles.length > 0 && (
                <div className="mb-3">
                    <div className="table-responsive">
                        <table className="table table-striped table-sm">
                            <thead>
                                <tr>
                                    <th>File Name</th>
                                    <th>Totals</th>
                                    <th style={{ width: 140 }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {excelFiles.map((file, idx) => {
                                    const item = fileTotals[idx] || {};
                                    const totals = item.totals || [];
                                    return (
                                        <tr key={idx}>
                                            <td style={{ verticalAlign: 'middle' }}>{file.name}</td>
                                            <td style={{ verticalAlign: 'middle' }}>{totals.length > 0 ? totals.join(', ') : '—'}</td>
                                            <td>
                                                <div className="d-flex gap-2">
                                                    <Button type="button" themeColor={'primary'} onClick={() => {
                                                        // open preview/editor for this file
                                                        setPreviewIndex(idx);
                                                    }}>
                                                        Preview
                                                    </Button>
                                                    <Button type="button" onClick={() => {
                                                        // remove file at idx
                                                        setExcelFiles(prev => prev.filter((_, i) => i !== idx));
                                                        setFileTotals(prev => prev.filter((_, i) => i !== idx));
                                                        setFileWorkbooks(prev => prev.filter((_, i) => i !== idx));
                                                        // if current preview was this or out of bounds, clear
                                                        setPreviewIndex(prevIdx => {
                                                            if (prevIdx === null) return null;
                                                            if (prevIdx === idx) return null;
                                                            // if preview index shifts due to removal, adjust
                                                            return prevIdx > idx ? prevIdx - 1 : prevIdx;
                                                        });
                                                    }}>
                                                        Remove
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Preview / Spreadsheet Editor Section */}
            {previewIndex !== null && (
                <div className="mb-4">
                    <h5 className="mb-3">Preview: {excelFiles[previewIndex]?.name}</h5>
                    <div className="border rounded p-3 bg-light">
                        <ExcelLoader
                            file={excelFiles[previewIndex]}
                            onApply={async (updatedFile) => {
                                const newFiles = [...excelFiles];
                                newFiles[previewIndex] = updatedFile;
                                setExcelFiles(newFiles);

                                // Recalculate totals for this file
                                try {
                                    const totals = await extractTotalsFromFile(updatedFile);
                                    const newTotals = [...fileTotals];
                                    newTotals[previewIndex] = { file: updatedFile, totals };
                                    setFileTotals(newTotals);
                                } catch (err) {
                                    console.error("Error re-extracting totals:", err);
                                }

                                setPreviewIndex(null); // Close preview overlay
                            }}
                            onClose={() => setPreviewIndex(null)}
                        />
                    </div>

                </div>
            )}

            {/* Submit Button */}
            {/* Toast (persistent until success) - shows above submit button */}
            {toast.visible && toast.type === 'error' && (
                <div className="error-box" style={{ marginBottom: 12 }}>{toast.message}</div>
            )}
            {toast.visible && toast.type === 'success' && (
                <div className="alert alert-success" style={{ marginBottom: 12 }}>{toast.message}</div>
            )}

            <div className="mb-4">
                <Button
                    themeColor="primary"
                    onClick={handleSubmit}
                    disabled={excelFiles.length === 0 || !selectedProjectId}
                    size="large"
                >
                    Submit
                </Button>
            </div>
        </div>
    );

    // Edit view content
    const editContent = (
        <div className="py-2">
            <div className="row mb-3">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                        <div>
                            <Button themeColor="secondary" onClick={() => {
                                // reset edit state and go back to list
                                setViewMode('list');
                                setEditMeasurementItem(null);
                                setEditFile(null);
                                setEditError(null);
                            }}>
                                <span className="d-none d-sm-inline">Back</span>
                                <span className="d-inline d-sm-none">←</span>
                            </Button>
                        </div>
                        <div />
                    </div>
                </div>
            </div>

            {editLoading && (
                <div className="mb-3">Loading file for edit…</div>
            )}
            {editError && (
                <div className="error-box mb-3">{editError}</div>
            )}

            {!editLoading && !editError && editMeasurementItem && (
                <div>
                    <div className="mb-3">
                        <div className="row g-2 align-items-center">
                            <div className="col-12 col-md-4">
                                <div className="small text-muted">File</div>
                                <div><strong>{editFile?.name || editMeasurementItem?.fileName || '—'}</strong></div>
                            </div>
                            <div className="col-12 col-md-4">
                                <div className="small text-muted">Project</div>
                                <div>{editMeasurementItem?.projectName || '—'}</div>
                            </div>
                            <div className="col-12 col-md-4">
                                <div className="small text-muted">Total</div>
                                <div>{editMeasurementItem?.total ?? '—'}</div>
                            </div>
                        </div>
                    </div>

                    <div className="border rounded p-3 bg-light">
                        <ExcelLoader
                            file={editFile}
                            onApply={async (updatedFile) => {
                                // Save updated file blob into state for this edit session
                                setEditFile(updatedFile);
                                setEditModified(true);
                                // Try to re-extract totals and update local display
                                try {
                                    const totals = await extractTotalsFromFile(updatedFile);
                                    setEditMeasurementItem(prev => prev ? { ...prev, total: Array.isArray(totals) ? totals[0] : totals } : prev);
                                } catch (err) {
                                    console.error('Error re-extracting totals from updated file:', err);
                                }
                            }}
                            onClose={() => { /* Keep on edit page when closed without saving */ }}
                            showCancel={false}
                        />
                    </div>
                    <div className="mt-3">
                        <Button
                            themeColor="primary"
                            onClick={async () => {
                                // Build form data that will be sent to backend and log it
                                const formData = new FormData();
                                const projectId = editMeasurementItem?.projectId || selectedProjectId || '';
                                const primaryTotal = editMeasurementItem?.total ?? '';
                                if (editFile) {
                                    // append as 'files' to match create behavior
                                    formData.append('file', editFile);
                                }
                                formData.append('projectId', projectId);
                                formData.append('total', primaryTotal);

                                // Log FormData entries
                                for (const [key, value] of formData.entries()) {
                                    if (value instanceof File) {
                                        console.log(`${key}: File{name="${value.name}", size=${value.size}, type=${value.type}}`);
                                    } else if (value instanceof Blob) {
                                        console.log(`${key}: Blob(size=${value.size}, type=${value.type})`);
                                    } else {
                                        console.log(`${key}:`, value);
                                    }
                                }

                                // Send PUT to backend
                                const id = editMeasurementItem?.id || editMeasurementItem?.measurementId || editMeasurementItem?._id || editMeasurementItem?.measurementSheetId;
                                if (!id) {
                                    console.error('No id available for update on item:', editMeasurementItem);
                                    setToast({ visible: true, message: 'Unable to determine id for update', type: 'error' });
                                    return;
                                }

                                try {
                                    setEditLoading(true);
                                    const res = await api.put(`/api/measurementsheet/${id}`, formData, {
                                        headers: { 'Content-Type': 'multipart/form-data' }
                                    });
                                    console.log('Update response:', res);
                                    setToast({ visible: true, message: (res && res.data && res.data.message) ? res.data.message : 'Measurement sheet updated', type: 'success' });
                                    setTimeout(() => setToast({ visible: false, message: '', type: 'success' }), 5000);

                                    // After successful update, refresh list and mark not modified
                                    setEditModified(false);
                                    await refreshMeasurementList();
                                } catch (err) {
                                    console.error('Failed to update measurement sheet:', err);
                                    const errMsg = err?.response?.data?.message || err.message || 'Failed to update measurement sheet';
                                    setToast({ visible: true, message: errMsg, type: 'error' });
                                } finally {
                                    setEditLoading(false);
                                }
                            }}
                            disabled={!editModified || editLoading}
                        >
                            Update
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );

    // List view: show kendo grid with measurement sheets and Add button
    return (
        <div className="container-fluid py-2">
            <div className="row mb-3">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                        <div>
                            {viewMode === 'list' && (
                                <Button themeColor="secondary" onClick={refreshMeasurementList} style={{ marginRight: 8 }}>
                                    <span className="d-none d-sm-inline">Refresh</span>
                                    <span className="d-inline d-sm-none">↻</span>
                                </Button>
                            )}
                        </div>
                        <div>
                            {viewMode === 'list' && (
                                <Button themeColor="primary" onClick={() => setViewMode('add')}>
                                    <span className="d-none d-sm-inline">Add new sheet</span>
                                    <span className="d-inline d-sm-none">Add</span>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {viewMode === 'list' ? (
                <div className="row">
                    <div className="col-12">
                        <div className="table-responsive">
                            {/* Delete confirmation modal (Bootstrap) */}
                            {showDeleteModal && (
                                <>
                                    <div className="modal fade show" tabIndex={-1} role="dialog" style={{ display: 'block' }}>
                                        <div className="modal-dialog modal-dialog-centered" role="document">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h5 className="modal-title">Confirm delete</h5>
                                                    <button type="button" className="btn-close" aria-label="Close" onClick={() => { setShowDeleteModal(false); setDeleteItem(null); }}></button>
                                                </div>
                                                <div className="modal-body">
                                                    <p>Are you sure you want to delete the measurement sheet <strong>{deleteItem?.fileName}</strong> for project <strong>{deleteItem?.projectName}</strong>?</p>
                                                </div>
                                                <div className="modal-footer">
                                                    <Button themeColor="base" onClick={() => { setShowDeleteModal(false); setDeleteItem(null); }} disabled={deleting}>Cancel</Button>
                                                    <Button themeColor="error" onClick={confirmDeleteMeasurement} disabled={deleting}>
                                                        {deleting ? 'Deleting…' : 'Delete'}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-backdrop fade show"></div>
                                </>
                            )}
                            <Grid 
                                data={process(measurementList, { filter }).data}
                                resizable={true}
                                scrollable="scrollable"
                                filter={filter}
                                onFilterChange={handleFilterChange}
                                columnMenuIcon={filterIcon}
                                dataItemKey="id"
                            >
                                <GridColumn field="projectName" title="Project Name" width="100px" headerClassName="text-start" className="text-start" columnMenu={ColumnMenu} />
                                <GridColumn field="fileName" title="Measurement Sheet" width="100px" headerClassName="text-start" className="text-start" columnMenu={ColumnMenu} />
                                <GridColumn field="total" title="Total" width="60px" headerClassName="text-start" className="text-start" />
                                <GridColumn
                                    title="Actions"
                                    width="80px"
                                    headerClassName="text-start"
                                    className="text-start"
                                    cell={(props) => {
                                        const item = props.dataItem;
                                        return (
                                            <td style={{ verticalAlign: 'middle' }}>
                                                <div className="d-flex gap-2">
                                                    <Button size="small" themeColor="primary" onClick={() => handleEditMeasurement(item)}>Edit</Button>
                                                    <Button size="small" themeColor="secondary" onClick={() => handleDeleteMeasurement(item)}>Delete</Button>
                                                </div>
                                            </td>
                                        );
                                    }}
                                />
                            </Grid>
                        </div>
                    </div>
                </div>
            ) : viewMode === 'add' ? (
                <div className="row">
                    <div className="col-12">
                        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                            <div>
                                <Button themeColor="secondary" onClick={() => setViewMode('list')}>
                                    <span className="d-none d-sm-inline">Back</span>
                                    <span className="d-inline d-sm-none">←</span>
                                </Button>
                            </div>
                            <div>
                                {/* keep Add button hidden when in add view */}
                            </div>
                        </div>

                        {addContent}
                    </div>
                </div>
            ) : (
                <div className="row">
                    <div className="col-12">
                        {editContent}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MeasurementSheet;
