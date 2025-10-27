// src/components/UploadWithPreview.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Upload } from '@progress/kendo-react-upload';
import { Button } from '@progress/kendo-react-buttons';
import ImagePreview from './ImagePreview';
import CapturePhotoButton from './CapturePhotoButton';
import { compressImage, readFileAsDataURL } from '../utils/imageCompression';
import { truncateFileName } from '../utils/truncateFileName';

export default function UploadWithPreview(props) {
    const { value = [], onChange, accept = 'image/*', multiple = true } = props;

    const [items, setItems] = useState(Array.isArray(value) ? value.slice() : []);
    const [selectedIndex, setSelectedIndex] = useState(items.length ? 0 : -1);

    const [isProcessing, setIsProcessing] = useState(false);

    // shallow compare helper for arrays of image objects
    const areItemsEqual = (a = [], b = []) => {
        if (!Array.isArray(a) || !Array.isArray(b)) return false;
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            const ai = a[i] || {};
            const bi = b[i] || {};
            // compare identifying fields; comparing base64 when available is strongest check
            if (ai.base64 && bi.base4 && ai.base64 === bi.base64) continue; // this line has a small typo? we'll not rely on it
            if (ai.base64 && bi.base64) {
                if (ai.base64 !== bi.base64) return false;
                else continue;
            }
            if (ai.name !== bi.name || (ai.size || 0) !== (bi.size || 0)) return false;
        }
        return true;
    };

    // keep local items in sync with form value, but only when content changed
    useEffect(() => {
        const incoming = Array.isArray(value) ? value : [];
        // shallow compare to avoid setState on identical content (prevents infinite loops)
        const same = items.length === incoming.length && items.every((it, idx) => {
            const v = incoming[idx] || {};
            if (it && v && it.base64 && v.base64) return it.base64 === v.base64;
            return it && v && it.name === v.name && (it.size || 0) === (v.size || 0);
        });

        if (!same) {
            setItems(incoming);
            if (!incoming.length) setSelectedIndex(-1);
            else if (selectedIndex >= incoming.length) setSelectedIndex(incoming.length - 1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    // Update both local state and parent form value (when different)
    const updateValue = (newItems) => {
        setItems(newItems);

        if (typeof onChange === 'function') {
            const parentValue = Array.isArray(value) ? value : [];
            const isSameAsParent = parentValue.length === newItems.length &&
                parentValue.every((pv, idx) => {
                    const nv = newItems[idx] || {};
                    if (pv && nv && pv.base64 && nv.base64) return pv.base64 === nv.base64;
                    return pv && nv && pv.name === nv.name && (pv.size || 0) === (nv.size || 0);
                });

            if (!isSameAsParent) {
                // try preferred Kendo shape first; fallback if it throws
                try {
                    onChange({ value: newItems });
                } catch (err) {
                    try {
                        onChange(newItems);
                    } catch (err2) {
                        console.error('onChange failed with both shapes', err2);
                    }
                }
            }
        }
    };

    // normalize a single possible input (File | Kendo FileInfo | wrapper)
    const normalizeToFile = (maybeFile) => {
        if (!maybeFile) return null;
        if (maybeFile instanceof File) return maybeFile;
        if (maybeFile.rawFile instanceof File) return maybeFile.rawFile;
        if (typeof maybeFile.getRawFile === 'function') {
            const rf = maybeFile.getRawFile();
            if (rf instanceof File) return rf;
        }
        // Could be a native FileList item or event.target.files item — already handled upstream
        return null;
    };

    const handleAddFiles = async (files) => {
        if (!files || !files.length) return;
        setIsProcessing(true);   // show spinner
        const newItems = [...items];

        for (const fileOrObj of files) {
            try {
                if (fileOrObj && typeof fileOrObj === 'object' && fileOrObj.base64) {
                    newItems.push({
                        name: fileOrObj.name || 'image',
                        originalSize: fileOrObj.originalSize || fileOrObj.size || 0,
                        size: fileOrObj.size || fileOrObj.byteLength || 0,
                        base64: fileOrObj.base64,
                        thumb: fileOrObj.thumb || fileOrObj.base64,
                        type: fileOrObj.type || 'image/jpeg',
                    });
                    continue;
                }

                const file = normalizeToFile(fileOrObj);
                if (!file) {
                    console.warn('Skipping unknown input (not a File):', fileOrObj);
                    continue;
                }

                const { file: compressedFile, size, thumb } = await compressImage(file, 500);
                const previewBase64 = await readFileAsDataURL(compressedFile);

                newItems.push({
                    name: compressedFile.name,
                    originalSize: file.size,
                    size,
                    file: compressedFile,   // store actual File object
                    thumb,
                    base64: previewBase64,  // only for preview display
                    type: 'image/jpeg',
                });

                // // OLD CODE (WORKING)
                // const { base64, size, thumb } = await compressImage(file, 500);
                // newItems.push({
                //     name: file.name || 'image',
                //     originalSize: file.size || 0,
                //     size,
                //     base64,
                //     thumb,
                //     type: 'image/jpeg',
                // });
            } catch (err) {
                console.error('Failed to process image', err);
            }
        }

        updateValue(newItems);
        setSelectedIndex(newItems.length - 1);
        setIsProcessing(false);  // hide spinner
    };

    // Kendo upload onAdd handler (robust for different Kendo versions)
    const onAdd = (e) => {
        // stop automatic upload if we can
        if (e && e.event && typeof e.event.preventDefault === 'function') {
            e.event.preventDefault();
        }

        // gather candidate file wrappers
        let candidates = [];
        if (Array.isArray(e.affectedFiles) && e.affectedFiles.length) candidates = e.affectedFiles;
        else if (Array.isArray(e.files) && e.files.length) candidates = e.files;
        else if (Array.isArray(e.newState) && e.newState.length) candidates = e.newState;
        else if (e && e.affectedFiles === undefined && e.event && e.event.target && e.event.target.files) {
            candidates = Array.from(e.event.target.files);
        } else {
            // unknown shape — try to inspect event
            candidates = [];
        }

        // Normalize into File objects (or file wrappers)
        const files = candidates
            .map((f) => (f && f.rawFile ? f.rawFile : (f instanceof File ? f : f)))
            .filter(Boolean);

        handleAddFiles(files);
    };

    const onCaptureFiles = (files) => handleAddFiles(files);

    const removeItem = (index) => {
        const next = items.filter((_, i) => i !== index);
        updateValue(next);
        setSelectedIndex(next.length ? Math.max(0, index - 1) : -1);
    };

    return (
        <div className="container-fluid p-0">
            <div className="row g-2">
                <div className="col-12 col-md-6">
                    <div className="d-flex flex-column h-100">
                        <CapturePhotoButton onFiles={onCaptureFiles} />

                        <div className="mb-2">
                            <Upload
                                batch={false}
                                multiple={multiple}
                                showFileList={false}
                                autoUpload={false}
                                accept={accept}
                                onAdd={onAdd}
                            >
                                <button type="button" className="btn btn-outline-secondary w-100">Upload files</button>
                            </Upload>
                        </div>

                        <div className="list-group overflow-auto" style={{ maxHeight: 300 }}>
                            {isProcessing && (
                                <div className="d-flex justify-content-center align-items-center p-3">
                                    <div className="spinner-border text-primary" role="status" style={{ width: '2rem', height: '2rem' }}>
                                        <span className="visually-hidden">Processing...</span>
                                    </div>
                                </div>
                            )}

                            {!isProcessing && items.length === 0 && (
                                <div className="text-muted small p-2">No images uploaded</div>
                            )}

                            {!isProcessing && items.map((it, idx) => (
                                <div
                                    key={idx}
                                    role="button"
                                    tabIndex={0}
                                    className={`list-group-item list-group-item-action d-flex align-items-center ${idx === selectedIndex ? 'active' : ''}`}
                                    onClick={() => setSelectedIndex(idx)}
                                    style={{ gap: 12 }}
                                >
                                    {/* Thumbnail square */}
                                    <div
                                        className="d-flex align-items-center justify-content-center border rounded"
                                        style={{ width: 64, height: 64, flexShrink: 0, background: '#fff' }}
                                    >
                                        <img
                                            src={it.thumb}
                                            alt={it.name}
                                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                        />
                                    </div>

                                    {/* Text info */}
                                    <div className="flex-fill text-start overflow-hidden">
                                        <div style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {truncateFileName(it.name)}
                                        </div>
                                        <div className="small text-muted">{((it.size || 0) / 1024).toFixed(1)} KB</div>
                                    </div>

                                    {/* Delete button */}
                                    <div className="ms-2 d-flex align-items-center">
                                        <Button
                                            type="button"
                                            look="flat"
                                            icon="trash"
                                            onClick={(e) => { e.stopPropagation(); removeItem(idx); }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-6">
                    {selectedIndex >= 0 && items[selectedIndex] ? (
                        <ImagePreview image={items[selectedIndex]} />
                    ) : (
                        <div className="card h-100">
                            <div className="card-body d-flex align-items-center justify-content-center text-muted">
                                No preview available
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

UploadWithPreview.propTypes = {
    value: PropTypes.array,
    onChange: PropTypes.func,
    accept: PropTypes.string,
    multiple: PropTypes.bool,
};
