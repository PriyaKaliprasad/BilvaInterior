import React, { useRef, useEffect, useState } from "react";
import { Spreadsheet } from "@progress/kendo-react-spreadsheet";
import { Button } from "@progress/kendo-react-buttons";
import * as XLSX from "xlsx";

/**
 * ExcelLoader
 *
 * Props:
 * - file: File | null
 * - onApply(updatedFile: File) => void
 * - onClose() => void
 *
 * Behavior:
 * - Loads `file` into Kendo Spreadsheet using fromFile(file)
 * - When user clicks "Apply & Close" -> tries spreadsheet.saveAsExcel()
 *   - If that returns a Blob => convert to File and onApply(updatedFile)
 *   - Otherwise fallback to building XLSX via spreadsheet.toJSON() while preserving merges & basic styles
 *
 * Notes:
 * - This preserves formatting to the extent Kendo supports and the fallback can map.
 * - Some Excel features (charts, advanced conditional formatting) may still be lost.
 */

const ExcelLoader = ({ file = null, onApply = () => {}, onClose = () => {} }) => {
  const spreadsheetRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (file && spreadsheetRef.current) {
      setLoading(true);
      spreadsheetRef.current
        .fromFile(file)
        .then(() => {
          setLoading(false);
          console.log("✅ File loaded into spreadsheet:", file.name);
        })
        .catch((err) => {
          setLoading(false);
          console.error("❌ Failed to load file:", err);
        });
    }
  }, [file]);

  // Utility: convert numeric row/col to Excel address like "A1"
  const addr = (r, c) => {
    const letters = (n) => {
      let s = "";
      while (n >= 0) {
        s = String.fromCharCode((n % 26) + 65) + s;
        n = Math.floor(n / 26) - 1;
      }
      return s;
    };
    return `${letters(c)}${r + 1}`;
  };

  // Fallback: convert Kendo spreadsheet JSON -> XLSX workbook preserving merges & basic styles
  const buildWorkbookFromKendoJSON = (json) => {
    const wb = XLSX.utils.book_new();

    (json.sheets || []).forEach((sheet, sheetIndex) => {
      // Build 2D array of values to create worksheet
      const rows = sheet.rows || [];
      const maxCols = rows.reduce((m, r) => Math.max(m, (r.cells || []).length), 0);
      const aoa = [];

      // We'll also build cell objects with styles to attach later
      const cellObjs = {}; // key: address -> { v, t, s, ... }

      // Collect merges in SheetJS format: {s:{r,c}, e:{r,c}}
      const merges = [];

      for (let r = 0; r < rows.length; r++) {
        const row = rows[r] || {};
        const cells = row.cells || [];
        aoa[r] = new Array(maxCols).fill(null);

        let cIndex = 0;
        for (let ci = 0; ci < cells.length; ci++) {
          const cell = cells[ci] || {};
          // skip placeholders (kendo may represent empty cells)
          // compute value
          const value = cell.value !== undefined ? cell.value : (cell.text ?? "");
          aoa[r][cIndex] = value;

          // Put cell object for styling
          const address = addr(r, cIndex);
          const cellEntry = {};

          // Determine type
          if (value === null || value === "") {
            // leave blank
          } else if (typeof value === "number") {
            cellEntry.t = "n";
            cellEntry.v = value;
          } else if (!isNaN(Number(value)) && String(value).trim() !== "") {
            // numeric looking string -> try number
            const num = Number(value);
            cellEntry.t = "n";
            cellEntry.v = num;
          } else {
            cellEntry.t = "s";
            cellEntry.v = value;
          }

          // Map basic styles where present
          const style = {};
          if (cell.background) {
            style.fill = { fgColor: { rgb: cell.background.replace("#", "").toUpperCase() } };
          }
          if (cell.format) {
            // map known formats (Kendo uses e.g. "n0", "c", etc.). Write as number format if available.
            style.numFmt = cell.format;
          }
          if (cell.bold || (cell.font && cell.font.bold)) {
            style.font = style.font || {};
            style.font.bold = true;
          }
          if (cell.italic || (cell.font && cell.font.italic)) {
            style.font = style.font || {};
            style.font.italic = true;
          }
          if (cell.color || (cell.font && cell.font.color)) {
            style.font = style.font || {};
            const ccol = cell.color || (cell.font && cell.font.color);
            if (ccol) style.font.color = { rgb: ccol.replace("#", "").toUpperCase() };
          }
          if (cell.halign || (cell.align && cell.align.horizontal)) {
            style.alignment = style.alignment || {};
            style.alignment.horizontal = cell.halign || (cell.align && cell.align.horizontal);
          }
          if (Object.keys(style).length > 0) {
            cellEntry.s = style;
          }

          if (Object.keys(cellEntry).length > 0) {
            cellObjs[address] = cellEntry;
          }

          // handle colSpan / rowSpan (merge)
          const colSpan = cell.colSpan || 1;
          const rowSpan = cell.rowSpan || 1;
          if (colSpan > 1 || rowSpan > 1) {
            merges.push({
              s: { r, c: cIndex },
              e: { r: r + (rowSpan - 1), c: cIndex + (colSpan - 1) },
            });
          }

          // advance by colSpan
          cIndex += colSpan;
        }
      }

      // Convert aoa to worksheet
      const ws = XLSX.utils.aoa_to_sheet(aoa);

      // attach merges if any
      if (merges.length > 0) {
        ws["!merges"] = merges;
      }

      // attach cell objects (values/types/styles)
      Object.keys(cellObjs).forEach((address) => {
        ws[address] = Object.assign(ws[address] || {}, cellObjs[address]);
      });

      // Append worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, sheet.name || `Sheet${sheetIndex + 1}`);
    });

    return wb;
  };

  // This function will attempt to get a Blob by using spreadsheet.saveAsExcel(). If not available/returns nothing,
  // it falls back to building an XLSX via toJSON + SheetJS.
  const exportWorkbookAsFile = async () => {
    if (!spreadsheetRef.current) return null;

    // 1) Try Kendo's saveAsExcel() first (best chance to preserve kendo formatting)
    try {
      const maybePromise = spreadsheetRef.current.saveAsExcel && spreadsheetRef.current.saveAsExcel();
      if (maybePromise && typeof maybePromise.then === "function") {
        // If it resolves to a Blob (some Kendo versions do)
        const result = await maybePromise;
        // result may be a Blob or undefined (if Kendo triggered the download directly)
        if (result instanceof Blob) {
          const updatedFile = new File([result], file.name, {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          return updatedFile;
        }
      }
    } catch (err) {
      // ignore and fallback
      console.warn("saveAsExcel() attempt failed or didn't return Blob — falling back to JSON->XLSX", err);
    }

    // 2) Fallback: try to build workbook from spreadsheet.toJSON()
    try {
      const json = typeof spreadsheetRef.current.toJSON === "function"
        ? spreadsheetRef.current.toJSON()
        : (spreadsheetRef.current.workbook && spreadsheetRef.current.workbook());

      if (!json) {
        console.error("Unable to get spreadsheet JSON/workbook for fallback export.");
        return null;
      }

      const wb = buildWorkbookFromKendoJSON(json);
      const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const updatedFile = new File([wbout], file.name, { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      return updatedFile;
    } catch (err) {
      console.error("Fallback XLSX export failed:", err);
      return null;
    }
  };

  // Handle Apply + Close
  const handleApplyAndClose = async () => {
    setLoading(true);
    try {
      const updatedFile = await exportWorkbookAsFile();
      if (updatedFile) {
        console.log("📦 Updated file ready:", updatedFile.name);
        onApply(updatedFile);
      } else {
        console.error("Failed to create updated file.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-2 bg-white rounded shadow-sm" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <strong>{file?.name}</strong>
        <div style={{ display: "flex", gap: 8 }}>
          <Button themeColor="primary" onClick={handleApplyAndClose} disabled={loading}>
            Apply & Close
          </Button>
          <Button themeColor="secondary" onClick={onClose} disabled={loading}>
            Close Without Saving
          </Button>
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 300, overflow: "auto" }}>
        <Spreadsheet ref={spreadsheetRef} />
      </div>
    </div>
  );
};

export default ExcelLoader;
