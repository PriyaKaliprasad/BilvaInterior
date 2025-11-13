// import React from "react";
// import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";

// // 🎨 Styles
// const styles = StyleSheet.create({
//   page: {
//     padding: 40,
//     fontFamily: "Helvetica",
//     fontSize: 10,
//     lineHeight: 1.5,
//     color: "#000",
//   },
//   section: {
//     marginBottom: 16,
//   },
//   header: {
//     textAlign: "center",
//     borderBottom: "2 solid #405189",
//     paddingBottom: 10,
//     marginBottom: 16,
//   },
//   companyName: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#405189",
//   },
//   title: {
//     fontSize: 12,
//     fontWeight: "bold",
//     color: "#405189",
//     marginBottom: 8,
//     textTransform: "uppercase",
//   },
//   box: {
//     border: "1 solid #ddd",
//     borderRadius: 4,
//     padding: 8,
//     marginBottom: 8,
//     backgroundColor: "#f9f9f9",
//   },
//   label: {
//     fontSize: 9,
//     color: "#555",
//     marginBottom: 2,
//   },
//   value: {
//     fontSize: 10,
//     color: "#000",
//     marginBottom: 4,
//   },
//   // --- NEW UI STYLES FOR PARTY & DOCUMENT DETAILS ---
//   sectionBox: {
//     backgroundColor: "#f4f5f8",
//     padding: 10,
//     borderRadius: 6,
//   },
//   twoColumn: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     gap: 10,
//   },
//   card: {
//     backgroundColor: "#fff",
//     border: "1 solid #e0e0e0",
//     borderRadius: 5,
//     padding: 8,
//     flex: 1,
//   },
//   cardTitle: {
//     fontSize: 9,
//     fontWeight: "bold",
//     color: "#333",
//     marginBottom: 4,
//   },
//   fieldRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     gap: 6,
//     marginTop: 4,
//   },
//   fieldBox: {
//     border: "1 solid #e0e0e0",
//     borderRadius: 3,
//     backgroundColor: "#fff",
//     padding: 3,
//     flex: 1,
//   },
//   fieldLabel: {
//     fontSize: 7,
//     color: "#888",
//   },
//   fieldValue: {
//     fontSize: 8,
//     color: "#000",
//   },
//   grid2Col: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "space-between",
//     gap: 8,
//   },
//   gridItem: {
//     backgroundColor: "#fff",
//     border: "1 solid #e0e0e0",
//     borderRadius: 4,
//     padding: 6,
//     width: "48%",
//   },
//   // --- END NEW UI STYLES ---
//   tableHeader: {
//     flexDirection: "row",
//     borderBottom: "1 solid #405189",
//     backgroundColor: "#f1f3f8",
//     paddingVertical: 4,
//     fontWeight: "bold",
//   },
//   tableRow: {
//     flexDirection: "row",
//     borderBottom: "0.5 solid #ccc",
//     paddingVertical: 3,
//   },
//   tableCell: {
//     fontSize: 9,
//     paddingRight: 6,
//   },
//   colMaterial: { width: "18%" },
//   colHSN: { width: "10%" },
//   colDesc: { width: "32%" },
//   colUom: { width: "10%" },
//   colQty: { width: "8%", textAlign: "right" },
//   colRate: { width: "10%", textAlign: "right" },
//   colAmt: { width: "12%", textAlign: "right" },
//   totalsContainer: {
//     marginTop: 10,
//     borderTop: "1 solid #ccc",
//     paddingTop: 8,
//     alignItems: "flex-end",
//   },
//   totalRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     width: "40%",
//   },
//   totalLabel: {
//     fontSize: 10,
//     color: "#333",
//   },
//   totalValue: {
//     fontSize: 10,
//     color: "#000",
//     fontWeight: "bold",
//   },
//   footer: {
//     marginTop: 20,
//     borderTop: "1 solid #ccc",
//     paddingTop: 6,
//     fontSize: 8,
//     textAlign: "center",
//     color: "#666",
//   },
//   // --- DOCUMENT DETAILS 3-PER-ROW BOX ---
//   groupBox: {
//     border: "1 solid #ddd",
//     borderRadius: 6,
//     padding: 10,
//     backgroundColor: "#f9f9f9",
//   },
//   row: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 6,
//   },
//   cell: {
//     width: "32%", // 3 items per row
//   },
//   inlineText: {
//     fontSize: 9,
//     flexDirection: "row",
//   },
//   labelInline: {
//     fontWeight: "bold",
//     color: "#333",
//   },
//   valueInline: {
//     color: "#000",
//   },
//   tableTitleRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 6,
//   },
//   tableTitle: {
//     fontSize: 12,
//     fontWeight: "bold",
//     color: "#405189", // dark blue
//   },
//   tableTitleCount: {
//     fontSize: 9,
//     fontWeight: "bold",
//     color: "#405189", // dark blue
//   },
//   tableRowAlt: {
//     backgroundColor: "#f3f3f9", // light blue
//   }


//   // --- END DOCUMENT DETAILS 3-PER-ROW BOX ---

// });

// // 🕓 Helpers
// const formatDate = (date) => {
//   if (!date) return "-";
//   const d = new Date(date);
//   return d.toLocaleDateString("en-GB");
// };
// const formatGeneratedDateTime = () => {
//   const now = new Date();
//   return now.toLocaleString("en-GB", {
//     day: "2-digit",
//     month: "2-digit",
//     year: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//     hour12: true,
//   });
// };

// // 🧾 PDF Layout
// const QuotationPDFDocument = ({ quotation }) => {
//   const lineItems = quotation.lineItems || [];

//   return (
//     <Document>
//       <Page size="A4" style={styles.page}>
//         {/* HEADER */}
//         {/* HEADER */}
//         <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 16, borderBottom: "2 solid #405189", paddingBottom: 20 }} fixed>
//           <Text style={{ fontSize: 24, fontWeight: "bold", color: "#405189" }}>Bilva Interiors</Text>
//           <Text style={{ fontSize: 24, fontWeight: "50", color: "#405189" }}>Quotation</Text>
//         </View>

//         {/* PROJECT DETAILS */}
//         <View style={styles.section}>
//           <Text style={styles.title}>Project Details</Text>
//           <View style={styles.box}>
//             <Text style={styles.label}>Project Name</Text>
//             <Text style={styles.value}>{quotation.projectName || "-"}</Text>
//             <Text style={styles.label}>Bill Number</Text>
//             <Text style={styles.value}>{quotation.billNumber || "-"}</Text>
//           </View>
//         </View>

//         {/* 🎨 PARTIES & ADDRESSES */}
//         {/* 🧾 PARTIES & ADDRESSES (Clean Box Input Style) */}
//         <View style={styles.section}>
//           <Text style={styles.title}>Parties & Addresses</Text>

//           <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
//             {/* LEFT COLUMN */}
//             <View style={{ width: "49%" }}>
//               {/* Billing From */}
//               <View style={[styles.box, { marginBottom: 12 }]}>
//                 <Text style={styles.fieldTitle}>Billing From - Bilva Interiors</Text>

//                 <View style={styles.field}>
//                   <Text style={styles.fieldLabel}>Address</Text>
//                   <Text style={styles.fieldInput}>{quotation.billingFromAddress || "-"}</Text>
//                 </View>

//                 <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
//                   <View style={[styles.field, { width: "48%" }]}>
//                     <Text style={styles.fieldLabel}>State Code</Text>
//                     <Text style={styles.fieldInput}>{quotation.billingFromStateCode || "-"}</Text>
//                   </View>
//                   <View style={[styles.field, { width: "48%" }]}>
//                     <Text style={styles.fieldLabel}>GSTIN</Text>
//                     <Text style={styles.fieldInput}>{quotation.billingFromGSTIN || "-"}</Text>
//                   </View>
//                 </View>
//               </View>

//               {/* Billing To */}
//               <View style={[styles.box, { marginBottom: 12 }]}>
//                 <Text style={styles.fieldTitle}>Billing To</Text>

//                 <View style={styles.field}>
//                   <Text style={styles.fieldLabel}>Address</Text>
//                   <Text style={styles.fieldInput}>{quotation.billingToAddress || "-"}</Text>
//                 </View>

//                 <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
//                   <View style={[styles.field, { width: "48%" }]}>
//                     <Text style={styles.fieldLabel}>GSTIN (Consignee)</Text>
//                     <Text style={styles.fieldInput}>{quotation.gstinConsignee || "-"}</Text>
//                   </View>
//                   <View style={[styles.field, { width: "48%" }]}>
//                     <Text style={styles.fieldLabel}>GSTIN (Buyer)</Text>
//                     <Text style={styles.fieldInput}>{quotation.gstinBuyer || "-"}</Text>
//                   </View>
//                 </View>
//               </View>
//             </View>

//             {/* RIGHT COLUMN */}
//             <View style={{ width: "49%" }}>
//               {/* Shipping Address */}
//               <View style={[styles.box, { marginBottom: 12 }]}>
//                 <Text style={styles.fieldTitle}>Shipping Address</Text>

//                 <View style={styles.field}>
//                   <Text style={styles.fieldLabel}>Address</Text>
//                   <Text style={styles.fieldInput}>{quotation.shippingAddress || "-"}</Text>
//                 </View>

//                 <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
//                   <View style={[styles.field, { width: "48%" }]}>
//                     <Text style={styles.fieldLabel}>GSTIN</Text>
//                     <Text style={styles.fieldInput}>{quotation.billingFromGSTIN || "-"}</Text>
//                   </View>
//                   <View style={[styles.field, { width: "48%" }]}>
//                     <Text style={styles.fieldLabel}>Brand / Sub-brand</Text>
//                     <Text style={styles.fieldInput}>{quotation.subBrand || "-"}</Text>
//                   </View>
//                 </View>
//               </View>

//               {/* Delivery Address */}
//               <View style={[styles.box]}>
//                 <Text style={styles.fieldTitle}>Delivery Address</Text>

//                 <View style={styles.field}>
//                   <Text style={styles.fieldLabel}>Address</Text>
//                   <Text style={styles.fieldInput}>{quotation.deliveryAddress || "-"}</Text>
//                 </View>

//                 <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
//                   <View style={[styles.field, { width: "32%" }]}>
//                     <Text style={styles.fieldLabel}>Store Code</Text>
//                     <Text style={styles.fieldInput}>{quotation.storeCode || "-"}</Text>
//                   </View>
//                   <View style={[styles.field, { width: "32%" }]}>
//                     <Text style={styles.fieldLabel}>SAP Code</Text>
//                     <Text style={styles.fieldInput}>{quotation.sapCode || "-"}</Text>
//                   </View>
//                   <View style={[styles.field, { width: "32%" }]}>
//                     <Text style={styles.fieldLabel}>Vendor Code</Text>
//                     <Text style={styles.fieldInput}>{quotation.vendorCode || "-"}</Text>
//                   </View>
//                 </View>
//               </View>
//             </View>
//           </View>
//         </View>

//         {/* 🎨 DOCUMENT DETAILS */}
//         <View style={styles.section}>
//           <Text style={styles.title}>Document Details</Text>
//           <View style={styles.groupBox}>
//             {[
//               { label: "Bill Number", value: quotation.billNumber },
//               { label: "Bill Date", value: formatDate(quotation.billDate) },
//               { label: "GST Number", value: quotation.gstNumber },
//               { label: "PAN", value: quotation.pan },
//               { label: "Estimate No", value: quotation.estimateNo },
//               { label: "Date of Estimate", value: formatDate(quotation.dateOfEstimate) },
//               { label: "Project ID", value: quotation.projectId },
//               { label: "PO Number", value: quotation.poNumber },
//               { label: "PO Date", value: formatDate(quotation.poDate) },
//               { label: "PO Type", value: quotation.poType },
//               { label: "Brand Name / Sub-brand", value: quotation.brandName },
//               { label: "Sub (Work Description)", value: quotation.workDescription },
//             ]
//               .reduce((rows, item, i) => {
//                 if (i % 3 === 0) rows.push([]);
//                 rows[rows.length - 1].push(item);
//                 return rows;
//               }, [])
//               .map((row, rowIndex) => (
//                 <View key={rowIndex} style={styles.row}>
//                   {row.map((item, i) => (
//                     <View key={i} style={styles.cell}>
//                       <Text style={styles.inlineText}>
//                         <Text style={styles.labelInline}>{item.label}: </Text>
//                         <Text style={styles.valueInline}>{item.value || "-"}</Text>
//                       </Text>
//                     </View>
//                   ))}
//                 </View>
//               ))}
//           </View>
//         </View>


//         {/* LINE ITEMS (updated & fixed) */}
//         <View style={styles.tableContainer}>
//           {(() => {
//             const filteredLineItems = lineItems.filter(
//               item =>
//                 item &&
//                 (item.materialCode ||
//                   item.hsnCode ||
//                   item.description ||
//                   item.uom ||
//                   item.quantity ||
//                   item.rate ||
//                   item.amount)
//             );

//             return (
//               <>
//                 {/* Table Title Row */}
//                 <View style={styles.tableTitleRow}>
//                   <Text style={styles.tableTitle}>Line Items</Text>
//                   <Text style={styles.tableTitleCount}>
//                     Total Items: {filteredLineItems.length}
//                   </Text>
//                 </View>

//                 {/* Table Header */}
//                 <View style={[styles.tableHeader, { backgroundColor: "#405189" }]} fixed>
//                   <Text style={[styles.tableHeaderText, { width: "15%", fontWeight: "bold", color: "#f1f3f8" }]}>Material</Text>
//                   <Text style={[styles.tableHeaderText, { width: "10%", fontWeight: "bold", color: "#f1f3f8" }]}>HSN</Text>
//                   <Text style={[styles.tableHeaderText, { width: "32%", fontWeight: "bold", color: "#f1f3f8", textAlign: "left" }]}>Description</Text>
//                   <Text style={[styles.tableHeaderText, { width: "10%", fontWeight: "bold", color: "#f1f3f8" }]}>UOM</Text>
//                   <Text style={[styles.tableHeaderText, { width: "8%", fontWeight: "bold", color: "#f1f3f8", textAlign: "right" }]}>Qty</Text>
//                   <Text style={[styles.tableHeaderText, { width: "12%", fontWeight: "bold", color: "#f1f3f8", textAlign: "right" }]}>Rate</Text>
//                   <Text style={[styles.tableHeaderText, { width: "13%", fontWeight: "bold", color: "#f1f3f8", textAlign: "right" }]}>Amount</Text>
//                 </View>

//                 {/* Table Rows */}
//                 {filteredLineItems.length > 0 ? (
//                   filteredLineItems.map((item, i) => (
//                     <View
//                       key={i}
//                       style={[
//                         styles.tableRow,
//                         i % 2 === 1 ? { backgroundColor: "#f9f9f9" } : { backgroundColor: "#ffffff" }
//                       ]}
//                       wrap={false}
//                     >
//                       <Text style={[styles.tableCell, { width: "15%" }]}>{item.materialCode || '-'}</Text>
//                       <Text style={[styles.tableCell, { width: "10%" }]}>{item.hsnCode || '-'}</Text>
//                       <Text style={[styles.tableCell, { width: "32%", textAlign: "left" }]}>{item.description || '-'}</Text>
//                       <Text style={[styles.tableCell, { width: "10%" }]}>{item.uom || '-'}</Text>
//                       <Text style={[styles.tableCell, { width: "8%", textAlign: "right" }]}>{item.quantity || '-'}</Text>
//                       <Text style={[styles.tableCell, { width: "12%", textAlign: "right" }]}>{item.rate || '-'}</Text>
//                       <Text style={[styles.tableCell, { width: "13%", textAlign: "right" }]}>{item.amount || '-'}</Text>
//                     </View>
//                   ))
//                 ) : (
//                   <Text>No items available</Text>
//                 )}
//               </>
//             );
//           })()}
//         </View>

//         {/* TOTALS */}
//         <View style={styles.totalsContainer}>
//           <View style={styles.totalRow}>
//             <Text style={styles.totalLabel}>Net Total:</Text>
//             <Text style={styles.totalValue}>{quotation.netTotal || "-"}</Text>
//           </View>
//           <View style={styles.totalRow}>
//             <Text style={styles.totalLabel}>IGST:</Text>
//             <Text style={styles.totalValue}>{quotation.igst || "-"}</Text>
//           </View>
//           <View style={styles.totalRow}>
//             <Text style={styles.totalLabel}>Round Off:</Text>
//             <Text style={styles.totalValue}>{quotation.roundOff || "-"}</Text>
//           </View>
//           <View style={styles.totalRow}>
//             <Text style={styles.totalLabel}>Grand Total:</Text>
//             <Text style={styles.totalValue}>{quotation.grandTotal || "-"}</Text>
//           </View>
//         </View>

//         {/* FOOTER */}
//         <View style={styles.footer}>
//           <Text>Generated on {formatGeneratedDateTime()}</Text>
//         </View>
//       </Page>
//     </Document>
//   );
// };

// // 🔘 MAIN COMPONENT
// const QuotationPDF = ({ quotation }) => {
//   const handleDownload = async () => {
//     const blob = await pdf(<QuotationPDFDocument quotation={quotation} />).toBlob();

//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = `Quotation_${quotation.projectName || "Document"}.pdf`;
//     link.click();
//     URL.revokeObjectURL(url);
//   };

//   return (
//     <button type="button" onClick={handleDownload} className="btn btn-primary">
//       Download Quotation PDF
//     </button>
//   );
// };

// export default QuotationPDF;

import React from "react";
import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";

/* Styles */
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.5,
    color: "#000",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    borderBottom: "2 solid #405189",
    paddingBottom: 20,
  },
  companyTitle: { fontSize: 24, fontWeight: "bold", color: "#405189" },
  section: { marginBottom: 16 },
  title: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#405189",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  box: {
    border: "1 solid #ddd",
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
    backgroundColor: "#f9f9f9",
  },
  label: { fontSize: 9, color: "#555", marginBottom: 2 },
  value: { fontSize: 10, color: "#000", marginBottom: 4 },

  groupBox: {
    border: "1 solid #ddd",
    borderRadius: 6,
    padding: 10,
    backgroundColor: "#f9f9f9",
  },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  cell: { width: "32%" },
  inlineText: { fontSize: 9, flexDirection: "row" },
  labelInline: { fontWeight: "bold", color: "#333" },
  valueInline: { color: "#000" },

  tableTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  tableTitle: { fontSize: 12, fontWeight: "bold", color: "#405189" },
  tableTitleCount: { fontSize: 9, fontWeight: "bold", color: "#405189" },

  tableHeader: {
    flexDirection: "row",
    borderBottom: "1 solid #405189",
    backgroundColor: "#f1f3f8",
    paddingVertical: 4,
    fontWeight: "bold",
  },
  tableRow: { flexDirection: "row", borderBottom: "0.5 solid #ccc", paddingVertical: 3 },
  tableCell: { fontSize: 9, paddingRight: 6 },
  colMaterial: { width: "15%" },
  colHSN: { width: "10%" },
  colDesc: { width: "32%" },
  colUom: { width: "10%" },
  colQty: { width: "8%", textAlign: "right" },
  colRate: { width: "12%", textAlign: "right" },
  colAmt: { width: "13%", textAlign: "right" },

  totalsMainContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    borderTop: "1 solid #ccc",
    paddingTop: 8,
  },
  taxContainer: {
    width: "50%",
    borderRight: "1 solid #ccc",
    paddingRight: 10,
  },
  taxRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  totalsContainer: {
    width: "45%",
    alignItems: "flex-end",
  },
  totalRow: { flexDirection: "row", justifyContent: "space-between", width: "100%" },
  totalLabel: { fontSize: 10, color: "#333" },
  totalValue: { fontSize: 10, color: "#000", fontWeight: "bold" },

  footer: { marginTop: 20, borderTop: "1 solid #ccc", paddingTop: 6, fontSize: 8, textAlign: "center", color: "#666" },
});

const formatDate = (date) => {
  if (!date) return "-";
  const d = new Date(date);
  return d.toLocaleDateString("en-GB");
};
const formatGeneratedDateTime = () => {
  const now = new Date();
  return now.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const QuotationPDFDocument = ({ quotation }) => {
  const lineItems = quotation.lineItems || [];

  const filteredLineItems = (lineItems || []).filter(
    (item) =>
      item &&
      (item.materialCode ||
        item.hsnCode ||
        item.description ||
        item.uom ||
        item.quantity ||
        item.rate ||
        item.amount)
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerRow} fixed>
          <Text style={styles.companyTitle}>Bilva Interiors</Text>
          <Text style={{ fontSize: 24, fontWeight: "500", color: "#405189" }}>Quotation</Text>
        </View>

        {/* Project Details */}
        <View style={styles.section}>
          <Text style={styles.title}>Project Details</Text>
          <View style={styles.box}>
            <Text style={styles.label}>Project Name</Text>
            <Text style={styles.value}>{quotation.projectName || "-"}</Text>
            <Text style={styles.label}>Bill Number</Text>
            <Text style={styles.value}>{quotation.billNumber || "-"}</Text>
          </View>
        </View>

        {/* Parties & Addresses - concise */}
        <View style={styles.section}>
          <Text style={styles.title}>Parties & Addresses</Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <View style={{ width: "49%" }}>
              <View style={[styles.box, { marginBottom: 12 }]}>
                <Text style={{ fontSize: 10, fontWeight: "bold" }}>Billing From - Bilva Interiors</Text>
                <Text style={styles.label}>Address</Text>
                <Text style={styles.value}>{quotation.billingFromAddress || "-"}</Text>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <View style={{ width: "48%" }}>
                    <Text style={styles.label}>State Code</Text>
                    <Text style={styles.value}>{quotation.billingFromStateCode || "-"}</Text>
                  </View>
                  <View style={{ width: "48%" }}>
                    <Text style={styles.label}>GSTIN</Text>
                    <Text style={styles.value}>{quotation.billingFromGSTIN || "-"}</Text>
                  </View>
                </View>
              </View>

              <View style={[styles.box, { marginBottom: 12 }]}>
                <Text style={{ fontSize: 10, fontWeight: "bold" }}>Billing To</Text>
                <Text style={styles.label}>Address</Text>
                <Text style={styles.value}>{quotation.billingToAddress || "-"}</Text>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <View style={{ width: "48%" }}>
                    <Text style={styles.label}>GSTIN (Consignee)</Text>
                    <Text style={styles.value}>{quotation.gstinConsignee || "-"}</Text>
                  </View>
                  <View style={{ width: "48%" }}>
                    <Text style={styles.label}>GSTIN (Buyer)</Text>
                    <Text style={styles.value}>{quotation.gstinBuyer || "-"}</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={{ width: "49%" }}>
              <View style={[styles.box, { marginBottom: 12 }]}>
                <Text style={{ fontSize: 10, fontWeight: "bold" }}>Shipping Address</Text>
                <Text style={styles.label}>Address</Text>
                <Text style={styles.value}>{quotation.shippingAddress || "-"}</Text>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <View style={{ width: "48%" }}>
                    <Text style={styles.label}>GSTIN</Text>
                    <Text style={styles.value}>{quotation.shippingGSTIN || "-"}</Text>
                  </View>
                  <View style={{ width: "48%" }}>
                    <Text style={styles.label}>Brand / Sub-brand</Text>
                    <Text style={styles.value}>{quotation.subBrand || "-"}</Text>
                  </View>
                </View>
              </View>

              <View style={[styles.box]}>
                <Text style={{ fontSize: 10, fontWeight: "bold" }}>Delivery Address</Text>
                <Text style={styles.label}>Address</Text>
                <Text style={styles.value}>{quotation.deliveryAddress || "-"}</Text>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <View style={{ width: "32%" }}>
                    <Text style={styles.label}>Store Code</Text>
                    <Text style={styles.value}>{quotation.storeCode || "-"}</Text>
                  </View>
                  <View style={{ width: "32%" }}>
                    <Text style={styles.label}>SAP Code</Text>
                    <Text style={styles.value}>{quotation.sapCode || "-"}</Text>
                  </View>
                  <View style={{ width: "32%" }}>
                    <Text style={styles.label}>Vendor Code</Text>
                    <Text style={styles.value}>{quotation.vendorCode || "-"}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Document Details 3-per-row */}
        <View style={styles.section}>
          <Text style={styles.title}>Document Details</Text>
          <View style={styles.groupBox}>
            {[
              { label: "Bill Number", value: quotation.billNumber },
              { label: "Bill Date", value: formatDate(quotation.billDate) },
              { label: "GST Number", value: quotation.gstNumber },
              { label: "PAN", value: quotation.pan },
              { label: "Estimate No", value: quotation.estimateNo },
              { label: "Date of Estimate", value: formatDate(quotation.dateOfEstimate) },
              { label: "Project ID", value: quotation.projectID },
              { label: "PO Number", value: quotation.poNumber },
              { label: "PO Date", value: formatDate(quotation.poDate) },
              { label: "PO Type", value: quotation.poType },
              { label: "Brand Name / Sub-brand", value: quotation.brandNameSubBrand },
              { label: "Sub (Work Description)", value: quotation.subWorkDescription },
            ]
              .reduce((rows, item, i) => {
                if (i % 3 === 0) rows.push([]);
                rows[rows.length - 1].push(item);
                return rows;
              }, [])
              .map((row, rowIndex) => (
                <View key={rowIndex} style={styles.row}>
                  {row.map((item, i) => (
                    <View key={i} style={styles.cell}>
                      <Text style={styles.inlineText}>
                        <Text style={styles.labelInline}>{item.label}: </Text>
                        <Text style={styles.valueInline}>{item.value || "-"}</Text>
                      </Text>
                    </View>
                  ))}
                </View>
              ))}
          </View>
        </View>

        {/* Line Items */}
        <View>
          <View style={styles.tableTitleRow}>
            <Text style={styles.tableTitle}>Line Items</Text>
            <Text style={styles.tableTitleCount}>Total Items: {filteredLineItems.length}</Text>
          </View>

          <View style={styles.tableHeader} fixed>
            <Text style={[styles.tableCell, { width: "15%", fontWeight: "bold" }]}>Material</Text>
            <Text style={[styles.tableCell, { width: "10%", fontWeight: "bold" }]}>HSN</Text>
            <Text style={[styles.tableCell, { width: "32%", fontWeight: "bold" }]}>Description</Text>
            <Text style={[styles.tableCell, { width: "10%", fontWeight: "bold" }]}>UOM</Text>
            <Text style={[styles.tableCell, { width: "8%", fontWeight: "bold", textAlign: "right" }]}>Qty</Text>
            <Text style={[styles.tableCell, { width: "12%", fontWeight: "bold", textAlign: "right" }]}>Rate</Text>
            <Text style={[styles.tableCell, { width: "13%", fontWeight: "bold", textAlign: "right" }]}>Amount</Text>
          </View>

          {filteredLineItems.length > 0 ? (
            filteredLineItems.map((item, i) => (
              <View
                key={i}
                style={[
                  styles.tableRow,
                  i % 2 === 1 ? { backgroundColor: "#f9f9f9" } : { backgroundColor: "#ffffff" },
                ]}
                wrap={false}
              >
                <Text style={[styles.tableCell, { width: "15%" }]}>{item.materialCode || "-"}</Text>
                <Text style={[styles.tableCell, { width: "10%" }]}>{item.hsnCode || "-"}</Text>
                <Text style={[styles.tableCell, { width: "32%", textAlign: "left" }]}>{item.description || "-"}</Text>
                <Text style={[styles.tableCell, { width: "10%" }]}>{item.uom || "-"}</Text>
                <Text style={[styles.tableCell, { width: "8%", textAlign: "right" }]}>{item.quantity ?? "-"}</Text>
                <Text style={[styles.tableCell, { width: "12%", textAlign: "right" }]}>{item.rate ?? "-"}</Text>
                <Text style={[styles.tableCell, { width: "13%", textAlign: "right" }]}>{item.amount ?? "-"}</Text>
              </View>
            ))
          ) : (
            <Text>No items available</Text>
          )}
        </View>

        {/* TAX + TOTAL SECTION SIDE BY SIDE */}
        <View style={styles.totalsMainContainer}>
          {/* LEFT SIDE: TAX DETAILS */}
          <View style={styles.taxContainer}>
            <Text style={[styles.title, { fontSize: 11 }]}>Tax Details</Text>
            <View style={styles.taxRow}>
              <Text style={styles.totalLabel}>IGST ({quotation.taxPercent1 || 0}%):</Text>
              <Text style={styles.totalValue}>
                {((quotation.netTotal * (quotation.taxPercent1 || 0)) / 100).toFixed(2)}
              </Text>
            </View>
            <View style={styles.taxRow}>
              <Text style={styles.totalLabel}>CGST ({quotation.taxPercent2 || 0}%):</Text>
              <Text style={styles.totalValue}>
                {((quotation.netTotal * (quotation.taxPercent2 || 0)) / 100).toFixed(2)}
              </Text>
            </View>
            <View style={styles.taxRow}>
              <Text style={styles.totalLabel}>SGST ({quotation.taxPercent3 || 0}%):</Text>
              <Text style={styles.totalValue}>
                {((quotation.netTotal * (quotation.taxPercent3 || 0)) / 100).toFixed(2)}
              </Text>
            </View>
          </View>

          {/* RIGHT SIDE: TOTALS */}
          <View style={styles.totalsContainer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Net Total:</Text>
              <Text style={styles.totalValue}>{quotation.netTotal ?? "-"}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Tax:</Text>
              <Text style={styles.totalValue}>{quotation.igst ?? "-"}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Round Off:</Text>
              <Text style={styles.totalValue}>{quotation.roundOff ?? "-"}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Grand Total:</Text>
              <Text style={styles.totalValue}>{quotation.grandTotal ?? "-"}</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Generated on {formatGeneratedDateTime()}</Text>
        </View>
      </Page>
    </Document>
  );
};

/* Export used in Quotations.jsx */
export async function generateQuotationPDF(quotation) {
  try {
    const doc = <QuotationPDFDocument quotation={quotation} />;
    const blob = await pdf(doc).toBlob();

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const safeName = (quotation.projectName || "Quotation").replace(/[^\w\-() ]+/g, "");
    link.href = url;
    link.download = `Quotation_${safeName}_${new Date().getTime()}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Error generating PDF:", err);
    throw err;
  }
}

/* default export kept if some code expects default (optional) */
export default generateQuotationPDF;