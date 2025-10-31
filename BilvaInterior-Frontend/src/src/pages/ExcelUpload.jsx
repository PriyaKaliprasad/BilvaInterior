// src/pages/ExcelUpload.jsx
import React, { useState } from "react";
import * as XLSX from "xlsx";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import "@progress/kendo-theme-default/dist/all.css";

export default function ExcelUpload() {
    const [fileName, setFileName] = useState("");
    const [sheetNames, setSheetNames] = useState([]);
    const [activeSheetName, setActiveSheetName] = useState(null);
    const [rawData, setRawData] = useState([]); // raw 2D array
    const [tableData, setTableData] = useState([]); // formatted objects for grid
    const [message, setMessage] = useState("");

    // when user selects file
    const handleFile = (e) => {
        setMessage("");
        const f = e.target.files?.[0];
        if (!f) return;
        setFileName(f.name);
        const reader = new FileReader();
        reader.onload = (evt) => {
            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, { type: "binary" });
            setSheetNames(wb.SheetNames || []);
            // default: load first sheet
            if (wb.SheetNames && wb.SheetNames.length > 0) {
                const wsname = wb.SheetNames[0];
                loadSheet(wb, wsname);
            }
        };
        reader.readAsBinaryString(f);
    };

    // load a sheet by name from workbook (wb can be created from file)
    const loadSheet = (wb, sheetName) => {
        try {
            const ws = wb.Sheets[sheetName];
            const arr = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" }); // 2D array
            setActiveSheetName(sheetName);
            setRawData(arr);
            // convert header + rows into objects
            if (arr.length > 0) {
                const headers = arr[0].map(h => ("" + h).trim());
                const rows = arr.slice(1).map((row, idx) => {
                    const obj = { _rowIndex: idx + 1 };
                    headers.forEach((h, i) => {
                        obj[h || `col${i + 1}`] = row[i] ?? "";
                    });
                    return obj;
                });
                setTableData(rows);
            } else {
                setTableData([]);
            }
        } catch (err) {
            console.error(err);
            setMessage("Error parsing sheet: " + err.message);
        }
    };

    // If user picks a different sheetName from dropdown:
    const handleSheetChange = (e) => {
        const sheetName = e.target.value;
        if (!sheetName) return;
        // reparse using FileReader again (simpler)
        const input = document.getElementById("excel-file-input");
        const file = input?.files?.[0];
        if (!file) return setMessage("Please re-select file");
        const reader = new FileReader();
        reader.onload = (evt) => {
            const wb = XLSX.read(evt.target.result, { type: "binary" });
            loadSheet(wb, sheetName);
        };
        reader.readAsBinaryString(file);
    };

    // "Process" button clicked -> e.g., send to backend or transform
    const handleProcess = async () => {
        setMessage("");
        if (!tableData || tableData.length === 0) {
            setMessage("No data to process. Upload and select sheet first.");
            return;
        }

        // Example: map to expected model fields (adjust names as per sheet)
        // Suppose sheet columns: "Name", "Phone", "Email", "Qty"
        const payload = tableData.map(r => ({
            name: r["Name"] ?? r["name"] ?? r["Item"] ?? "",
            phone: r["Phone"] ?? r["phone"] ?? "",
            email: r["Email"] ?? r["email"] ?? "",
            qty: Number(r["Qty"] ?? r["Quantity"] ?? r["qty"] ?? 0)
        }));
        console.log("Processed payload:", payload);
        setMessage(`Prepared ${payload.length} rows. (See console)`);
        // TODO: send to backend with fetch/axios:
        // await api.post("/api/materials/bulk", payload)  // example
    };

    return (
        <div style={{ padding: 18 }}>
            <h2>📥 Excel Upload</h2>

            <div style={{ marginBottom: 12 }}>
                <input id="excel-file-input" type="file" accept=".xlsx,.xls" onChange={handleFile} />
                <div style={{ marginTop: 8, fontSize: 13, color: "#444" }}>
                    {fileName ? <>Selected: <b>{fileName}</b></> : "No file chosen"}
                </div>
            </div>

            {sheetNames.length > 0 && (
                <div style={{ marginBottom: 12 }}>
                    <label>Select sheet: </label>
                    <select value={activeSheetName || ""} onChange={handleSheetChange}>
                        {sheetNames.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            )}

            <div style={{ marginTop: 10 }}>
                <button onClick={handleProcess}>Process Sheet</button>
            </div>

            {message && <div style={{ marginTop: 12, color: "green" }}>{message}</div>}

            <div style={{ marginTop: 18 }}>
                <h4>Preview</h4>
                {tableData.length === 0 ? (
                    <div style={{ color: "#888" }}>No rows to preview.</div>
                ) : (
                    <div style={{ maxHeight: 400, overflow: "auto" }}>
                        <Grid data={tableData}>
                            {Object.keys(tableData[0]).map(k => (
                                <GridColumn key={k} field={k} title={k} />
                            ))}
                        </Grid>
                    </div>
                )}
            </div>
        </div>
    );
}
