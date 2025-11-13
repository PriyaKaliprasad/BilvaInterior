// ✅ src/pages/MeasurementSheet.jsx
import React, { useState, useEffect } from "react";
import * as XLSX from 'xlsx';
import api from "../../api/axios";
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { Upload } from '@progress/kendo-react-upload';
import { Button } from '@progress/kendo-react-buttons';
import { FieldWrapper } from '@progress/kendo-react-form';
import FloatingLabelWrapper from '../../components/Form/FloatingLabelWrapper/FloatingLabelWrapper';
import ExcelLoader from './ExcelLoader';

const MeasurementSheet = () => {
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
    const [fileTotals, setFileTotals] = useState([]);
    const [fileWorkbooks, setFileWorkbooks] = useState([]);
    const [previewIndex, setPreviewIndex] = useState(null);

    // Helper: extract totals from file (ExcelLoader logic)
    const extractTotalsFromFile = async (file) => {
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
                                if (typeof cell === 'string' && cell.toLowerCase().includes('total')) {
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
                    // Fallback: last positive number if no labeled totals
                    if (totals.length === 0) {
                        workbook.SheetNames.forEach(sheetName => {
                            const sheet = workbook.Sheets[sheetName];
                            const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
                            for (let i = rows.length - 1; i >= 0; i--) {
                                const row = rows[i];
                                for (let j = row.length - 1; j >= 0; j--) {
                                    const val = row[j];
                                    if (val !== null && val !== "" && !isNaN(parseFloat(val)) && parseFloat(val) > 0) {
                                        totals.push(parseFloat(val));
                                        break;
                                    }
                                }
                                if (totals.length > 0) break;
                            }
                        });
                    }
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
            formData.append(`files[${idx}]`, item.file);
            formData.append(`totals[${idx}]`, JSON.stringify(item.total));
        });
        // Log all key-value pairs
        for (let pair of formData.entries()) {
            console.log(pair[0] + ':', pair[1]);
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

    // ✅ File change (Kendo Upload) - compute totals for each uploaded file
    const handleFileChange = async (event) => {
        const newState = event.newState || [];
        const rawFiles = newState.map(f => f.getRawFile());
        setExcelFiles(rawFiles);

        // compute totals for each file and store aligned by index
        const totalsArr = [];
        for (let i = 0; i < rawFiles.length; i++) {
            const file = rawFiles[i];
            try {
                const totals = await extractTotalsFromFile(file);
                totalsArr.push({ file, totals });
            } catch (err) {
                totalsArr.push({ file, totals: [] });
            }
        }
        setFileTotals(totalsArr);
        // clear any preview if files changed - keep previewIndex valid
        setFileWorkbooks(prev => {
            // initialize workbooks entries for new files
            const arr = rawFiles.map((f, i) => prev[i] || null);
            return arr;
        });
        setPreviewIndex(null);
    };

    // Note: Process Sheet functionality removed per request

    return (
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
                                onChange={e => setSelectedProjectId(e.value ? e.value.id : '')}
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
};

export default MeasurementSheet;
