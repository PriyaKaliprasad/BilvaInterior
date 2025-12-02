import React, { useRef, useEffect, useState } from "react";
import { Spreadsheet } from "@progress/kendo-react-spreadsheet";
import { Button } from "@progress/kendo-react-buttons";
import * as XLSX from "xlsx";

const ExcelLoader = ({ file = null, onApply = () => { }, onClose = () => { }, showCancel = true }) => {
  const spreadsheetRef = useRef(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Load Excel into spreadsheet
  useEffect(() => {
    if (file && spreadsheetRef.current) {
      setLoading(true);

      const isJson = (file.type && file.type.includes('json')) || file.name?.toLowerCase().endsWith('.json');

      if (isJson) {
        // Read JSON produced by saveJSON and load via fromJSON
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const json = JSON.parse(e.target.result);
            // fromJSON expects the workbook object
            await spreadsheetRef.current.fromJSON(json);
            console.log("✅ JSON workbook loaded:", file.name);
          } catch (err) {
            console.error("❌ Failed to load JSON workbook:", err);
          } finally {
            setLoading(false);
          }
        };
        reader.onerror = (err) => {
          console.error("❌ Failed to read JSON file:", err);
          setLoading(false);
        };
        reader.readAsText(file);
      } else {
        // Binary Excel file (xlsx/xls) — use fromFile
        spreadsheetRef.current
          .fromFile(file)
          .then(() => {
            console.log("✅ File loaded:", file.name);
            setLoading(false);
          })
          .catch((err) => {
            console.error("❌ Failed to load file:", err);
            setLoading(false);
          });
      }
    }
  }, [file]);

  // 🔹 Export current spreadsheet to XLSX file while preserving formatting
  const exportWorkbookAsFile = async () => {
    if (!spreadsheetRef.current) return null;
    try {
      // Use Kendo's saveJSON to preserve formatting and embedded images
      const json = await spreadsheetRef.current.saveJSON();

      // Create a JSON file containing the Kendo workbook representation
      const blob = new Blob([JSON.stringify(json)], { type: 'application/json' });
      // const updatedFile = new File([blob], file.name, { type: 'application/json' });
      const updatedFile = new File([blob], file.name.replace('.xlsx', '.json'), {
        type: "application/json"
      });
      return updatedFile;
    } catch (err) {
      console.error("❌ Export failed:", err);
      return null;
    }
  };

  // 🔹 Handle Apply & Close
  const handleApplyAndClose = async () => {
    setLoading(true);
    try {
      const updatedFile = await exportWorkbookAsFile();
      if (updatedFile) {
        console.log("📦 Updated file ready:", updatedFile.name);
        onApply(updatedFile);
      } else {
        console.error("Failed to generate updated file.");
      }
    } finally {
      setLoading(false);
    }
  };

  // --------------------------
  // ⭐ NEW: Export as Excel
  // --------------------------
  const exportAsExcelFile = () => {
    if (!spreadsheetRef.current) return;

    spreadsheetRef.current.saveAsExcel({
      fileName: file?.name?.replace('.json', '.xlsx') || "export.xlsx"
    });
  };
  // --------------------------

  return (
    <div className="p-2 bg-white rounded shadow-sm" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <strong>{file?.name}</strong>
        <div style={{ display: "flex", gap: 8 }}>
          {/* ⭐ NEW BUTTON */}
          <Button
            themeColor="info"
            onClick={exportAsExcelFile}
            disabled={loading}
          >
            Export as Excel
          </Button>
          <Button themeColor="primary" onClick={handleApplyAndClose} disabled={loading}>
            Save
          </Button>
          {showCancel && (
            <Button themeColor="secondary" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
          )}
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 300, overflow: "auto" }}>
        <Spreadsheet ref={spreadsheetRef} />
      </div>
    </div>
  );
};

export default ExcelLoader;
