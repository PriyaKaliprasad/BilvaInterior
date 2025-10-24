import React, { useState, useEffect } from "react";
import { Upload } from "@progress/kendo-react-upload";
import { Button } from "@progress/kendo-react-buttons";
import api from "../api/axios";

const Testpage = () => {
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);

    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    // Convert backend documents → Kendo-compatible file objects
    const toKendoFile = (doc) => ({
        uid: doc.id?.toString() || crypto.randomUUID(),
        name: doc.fileName,
        extension: doc.fileName.substring(doc.fileName.lastIndexOf(".")),
        size: 0, // unknown from backend
        rawFile: null,
        src: `${BASE_URL}${doc.filePathOrUrl}`,
        fromServer: true,
    });

    // Fetch existing documents
    useEffect(() => {
        const fetchSiteVisit = async () => {
            try {
                const response = await api.get("/api/sitevisit/4");
                const docs = response.data.documents || [];
                const existingFiles = docs.map(toKendoFile);
                setFiles(existingFiles);
                if (existingFiles.length > 0) setSelectedFile(existingFiles[0]);
                console.log("Fetched Documents:", existingFiles);
            } catch (error) {
                console.error("API Error:", error);
            }
        };
        fetchSiteVisit();
    }, []);

    // Automatically select first file whenever the list changes
    useEffect(() => {
        if (files.length > 0 && !selectedFile) {
            setSelectedFile(files[0]);
        } else if (files.length === 0) {
            setSelectedFile(null);
        }
    }, [files]);

    // Handle upload addition
    const onAdd = (event) => {
        const newFiles = event.affectedFiles.map((file) => ({
            ...file,
            fromServer: false,
        }));
        setFiles((prev) => [...prev, ...newFiles]);
    };

    // Handle file removal
    const handleDelete = (uid) => {
        setFiles((prev) => {
            const updated = prev.filter((f) => f.uid !== uid);
            if (selectedFile?.uid === uid) {
                setSelectedFile(updated[0] || null);
            }
            return updated;
        });
    };

const handleSubmit = () => {
    const formData = new FormData();

    // Add other fields
    formData.append("siteVisitId", 4);
    formData.append("reportType", 1);

    files.forEach((file) => {
        if (!file.fromServer && file.getRawFile) {
            // Only new files are appended as IFormFile
            formData.append("documents", file.getRawFile());
        }
        // If you want to delete old files, you can track them separately
        // e.g., formData.append("deletedFileIds", file.uid) for removed server files
    });

    // Log for debug
    for (let [key, value] of formData.entries()) {
        console.log(key, value);
    }
};

    // Handle selection
    const handleSelect = (file) => {
        setSelectedFile(file);
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

    return (
        <>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "20px",
                    width: "80%",
                    margin: "40px auto",
                }}
            >
                {/* Left: Upload + List */}
                <div style={{ flex: "1" }}>
                    <Upload
                        multiple={true}
                        autoUpload={false}
                        showFileList={false}
                        showActionButtons={false}
                        saveUrl=""
                        removeUrl=""
                        onAdd={onAdd}
                    />

                    {/* File List */}
                    {files.length > 0 && (
                        <ul style={{ listStyle: "none", padding: 0, marginTop: "20px" }}>
                            {files.map((file) => (
                                <li
                                    key={file.uid}
                                    onClick={() => handleSelect(file)}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        marginBottom: "8px",
                                        padding: "8px 12px",
                                        border: "1px solid #ccc",
                                        borderRadius: "6px",
                                        cursor: "pointer",
                                        backgroundColor:
                                            selectedFile?.uid === file.uid
                                                ? "#e3f2fd"
                                                : "white",
                                    }}
                                >
                                    <div>
                                        <strong>{file.name}</strong>
                                        {!file.fromServer && file.size > 0 && (
                                            <div
                                                style={{ fontSize: "0.85em", color: "#666" }}
                                            >
                                                {(file.size / 1024).toFixed(2)} KB
                                            </div>
                                        )}
                                    </div>
                                    <Button
                                        look="outline"
                                        // themeColor="error"
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(file.uid);
                                        }}
                                    >
                                        {/* use a compact close glyph instead of the word 'Delete' */}
                                        ✕
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Right: Image Preview */}
                <div
                    style={{
                        flex: "1",
                        border: "1px solid #ccc",
                        borderRadius: "6px",
                        minHeight: "300px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#fafafa",
                    }}
                >
                    {previewUrl ? (
                        <img
                            src={previewUrl}
                            alt={selectedFile?.name}
                            style={{
                                maxWidth: "100%",
                                maxHeight: "100%",
                                borderRadius: "6px",
                                objectFit: "contain",
                            }}
                        />
                    ) : (
                        <p style={{ color: "#888" }}>No image selected</p>
                    )}
                </div>
                <Button
                    themeColor="primary"
                    onClick={handleSubmit}
                    style={{ marginTop: "20px" }}
                >
                    Submit
                </Button>
            </div>
            <div style={{ marginTop: 20 }}>
                <h4>Files in State:</h4>
                <pre>{JSON.stringify(files, null, 2)}</pre>
            </div>
        </>
    );
};

export default Testpage;
