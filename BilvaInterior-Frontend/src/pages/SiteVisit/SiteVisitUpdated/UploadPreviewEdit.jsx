    import React, { useState, useEffect } from "react";
    import { Upload } from "@progress/kendo-react-upload";
    import { Button } from "@progress/kendo-react-buttons";
    import { truncateFileName } from "../../../utils/truncateFileName";
    import { compressImage } from "../../../utils/imageCompression";

    // Reusable upload/preview component for images
    const UploadPreviewEdit = ({ initialFiles = [], onFilesChange }) => {
        const [files, setFiles] = useState([]);
        const [selectedFile, setSelectedFile] = useState(null);
        const [selectedIndex, setSelectedIndex] = useState(-1);

        const BASE_URL = import.meta.env.VITE_API_BASE_URL;

        // Convert backend documents → Kendo-compatible file objects
        const toKendoFile = (doc) => ({
            uid: doc.id?.toString() || crypto.randomUUID(),
            name: doc.fileName,
            extension: doc.fileName.substring(doc.fileName.lastIndexOf(".")),
            size: doc.fileSize || 0,
            rawFile: null,
            src: `${BASE_URL}${doc.filePathOrUrl}`,
            fromServer: true,
        });

        // Initialize files from props (only images)
        useEffect(() => {
            const imageDocs = initialFiles.filter(doc => doc.fileType && doc.fileType.startsWith('image/'));
            const existingFiles = imageDocs.map(toKendoFile);
            setFiles(existingFiles);
            if (existingFiles.length > 0) {
                setSelectedFile(existingFiles[0]);
                setSelectedIndex(0);
            }
        }, [initialFiles]);

        // Notify parent on files change
        useEffect(() => {
            if (onFilesChange) onFilesChange(files);
        }, [files, onFilesChange]);

        // Automatically select first file whenever the list changes
        useEffect(() => {
            if (files.length > 0 && !selectedFile) {
                setSelectedFile(files[0]);
            } else if (files.length === 0) {
                setSelectedFile(null);
            }
        }, [files]);

        // Handle upload addition with compression for files > 50KB
        const onAdd = async (event) => {
            const processedFiles = await Promise.all(
                event.affectedFiles.map(async (file) => {
                    // Only compress if file size > 50KB
                    const raw = file.getRawFile ? file.getRawFile() : file.rawFile;
                    if (raw && raw.size > 50 * 1024) {
                        try {
                            const { file: compressed } = await compressImage(raw, 50);
                            return {
                                ...file,
                                rawFile: compressed,
                                size: compressed.size,
                                name: compressed.name,
                                fromServer: false,
                                getRawFile: () => compressed,
                            };
                        } catch (err) {
                            // Fallback to original if compression fails
                            return {
                                ...file,
                                fromServer: false,
                            };
                        }
                    } else {
                        return {
                            ...file,
                            fromServer: false,
                        };
                    }
                })
            );
            setFiles((prev) => [...prev, ...processedFiles]);
        };

        // Handle file removal
        const handleDelete = (uid, idx) => {
            setFiles((prev) => {
                const updated = prev.filter((f) => f.uid !== uid);
                if (selectedFile?.uid === uid) {
                    // If the selected file was deleted, always select the first image if any
                    setSelectedFile(updated[0] || null);
                    setSelectedIndex(updated.length ? 0 : -1);
                } else {
                    // If another file was deleted, update selectedIndex to its new position
                    const newIdx = updated.findIndex(f => f.uid === selectedFile?.uid);
                    setSelectedIndex(newIdx);
                }
                return updated;
            });
        };

        // Handle selection
        const handleSelect = (file, idx) => {
            setSelectedFile(file);
            setSelectedIndex(idx);
        };

        // Determine preview URL
        const getPreviewUrl = (file) => {
            if (!file) return null;
            if (file.fromServer) return file.src;
            if (file.getRawFile) return URL.createObjectURL(file.getRawFile());
            if (file.rawFile) return URL.createObjectURL(file.rawFile);
            return null;
        };

        const previewUrl = getPreviewUrl(selectedFile);

        // Format file size
        const formatSize = (size) => {
            if (!size) return '';
            if (size < 1024) return `${size} B`;
            if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
            return `${(size / (1024 * 1024)).toFixed(1)} MB`;
        };

        return (
            <div className="container-fluid p-0">
                <div className="row g-2">
                    <div className="col-12 col-md-6">
                        <div className="d-flex flex-column h-100">
                            <div className="mb-2">
                                <Upload
                                    batch={false}
                                    multiple={true}
                                    showFileList={false}
                                    autoUpload={false}
                                    accept="image/*"
                                    onAdd={onAdd}
                                >
                                    <button type="button" className="btn btn-outline-secondary w-100">Upload files</button>
                                </Upload>
                            </div>

                            <div className="list-group overflow-auto" style={{ maxHeight: 300 }}>
                                {files.length === 0 && (
                                    <div className="text-muted small p-2">No images uploaded</div>
                                )}

                                {files.map((file, idx) => (
                                    <div
                                        key={file.uid}
                                        role="button"
                                        tabIndex={0}
                                        className={`list-group-item list-group-item-action d-flex align-items-center ${idx === selectedIndex ? 'active' : ''}`}
                                        onClick={() => handleSelect(file, idx)}
                                        style={{ gap: 12 }}
                                    >
                                        {/* Thumbnail square */}
                                        <div
                                            className="d-flex align-items-center justify-content-center border rounded"
                                            style={{ width: 64, height: 64, flexShrink: 0, background: '#fff' }}
                                        >
                                            <img
                                                src={getPreviewUrl(file)}
                                                alt={file.name}
                                                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                            />
                                        </div>

                                        {/* Text info */}
                                        <div className="flex-fill text-start overflow-hidden">
                                            <div style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {truncateFileName(file.name)}
                                            </div>
                                            {!file.fromServer && <div className="small text-muted">{((file.size || 0) / 1024).toFixed(1)} KB</div>}
                                        </div>

                                        {/* Delete button */}
                                        <div className="ms-2 d-flex align-items-center">
                                            <Button
                                                type="button"
                                                look="flat"
                                                icon="trash"
                                                onClick={(e) => { e.stopPropagation(); handleDelete(file.uid, idx); }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        {selectedIndex >= 0 && selectedFile ? (
                            <div className="card" style={{ height: 400 }}>
                                <div className="card-body p-2 d-flex flex-column align-items-center" style={{ overflow: 'hidden' }}>
                                    <div className="mb-2 text-center" style={{ fontWeight: 500, flexShrink: 0 }}>
                                        {selectedFile.name} 
                                        {!selectedFile.fromServer && <small className="text-muted"> ({formatSize(selectedFile.size)})</small>}
                                    </div>
                                    <div className="flex-fill d-flex align-items-center justify-content-center" style={{ overflow: 'hidden', width: '100%' }}>
                                        <img
                                            src={previewUrl}
                                            alt={selectedFile.name}
                                            className="img-fluid"
                                            style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', borderRadius: 8, border: '1px solid #e9e9e9' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="card" style={{ height: 400 }}>
                                <div className="card-body p-2 d-flex align-items-center justify-content-center text-muted">
                                    No preview available
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    export default UploadPreviewEdit;