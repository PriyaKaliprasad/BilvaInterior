// import React from "react";
// import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";

// // 🎨 Styles
// const styles = StyleSheet.create({
//     page: {
//         padding: 40,
//         fontFamily: "Helvetica",
//         fontSize: 10,
//         lineHeight: 1.5,
//         color: "#000",
//     },
//     header: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         borderBottom: "2 solid #405189",
//         paddingBottom: 15,
//         marginBottom: 20,
//     },
//     titleLeft: {
//         fontSize: 22,
//         fontWeight: "bold",
//         color: "#405189",
//     },
//     titleRight: {
//         fontSize: 22,
//         color: "#405189",
//         fontWeight: "bold",
//     },
//     section: {
//         marginBottom: 16,
//     },
//     sectionTitle: {
//         fontSize: 12,
//         fontWeight: "bold",
//         color: "#405189",
//         marginBottom: 8,
//         textTransform: "uppercase",
//     },
//     box: {
//         border: "1 solid #ddd",
//         borderRadius: 4,
//         padding: 8,
//         backgroundColor: "#f9f9f9",
//     },
//     label: {
//         fontSize: 9,
//         color: "#555",
//     },
//     value: {
//         fontSize: 10,
//         color: "#000",
//         marginBottom: 4,
//     },
//     twoColumn: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         gap: 10,
//     },
//     halfBox: {
//         width: "48%",
//     },
//     tableHeader: {
//         flexDirection: "row",
//         backgroundColor: "#405189",
//         paddingVertical: 4,
//     },
//     tableHeaderText: {
//         fontSize: 9,
//         fontWeight: "bold",
//         color: "#fff",
//     },
//     tableRow: {
//         flexDirection: "row",
//         borderBottom: "0.5 solid #ccc",
//         paddingVertical: 3,
//     },
//     tableCell: {
//         fontSize: 9,
//     },
//     totalsContainer: {
//         marginTop: 10,
//         borderTop: "1 solid #ccc",
//         paddingTop: 8,
//         alignItems: "flex-end",
//     },
//     totalRow: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         width: "40%",
//     },
//     totalLabel: {
//         fontSize: 10,
//         color: "#333",
//     },
//     totalValue: {
//         fontSize: 10,
//         fontWeight: "bold",
//     },
//     footer: {
//         marginTop: 20,
//         borderTop: "1 solid #ccc",
//         paddingTop: 6,
//         fontSize: 8,
//         textAlign: "center",
//         color: "#666",
//     },
// });

// // 🕓 Helpers
// const formatDate = (date) => {
//     if (!date) return "-";
//     const d = new Date(date);
//     return d.toLocaleDateString("en-GB");
// };

// const formatGeneratedDateTime = () => {
//     const now = new Date();
//     return now.toLocaleString("en-GB", {
//         day: "2-digit",
//         month: "2-digit",
//         year: "numeric",
//         hour: "2-digit",
//         minute: "2-digit",
//         hour12: true,
//     });
// };

// // 🧾 PDF Layout
// const BillingPDFDocument = ({ billing }) => {
//     const lineItems = billing.lineItems || [];

//     return (
//         <Document>
//             <Page size="A4" style={styles.page}>
//                 {/* HEADER */}
//                 <View style={styles.header} fixed>
//                     <Text style={styles.titleLeft}>Bilva Interiors</Text>
//                     <Text style={styles.titleRight}>Invoice</Text>
//                 </View>

// {/* PROJECT DETAILS */}
// <View style={styles.section}>
//     <Text style={styles.sectionTitle}>Project Details</Text>
//     <View style={styles.box}>
//         <Text style={styles.label}>Project Name:</Text>
//         <Text style={styles.value}>{billing.projectName || "-"}</Text>
//         <Text style={styles.label}>Bill Number:</Text>
//         <Text style={styles.value}>{billing.billNumber || "-"}</Text>
//     </View>
// </View>

// {/* PARTIES */}
// <View style={styles.section}>
//     <Text style={styles.title}>Parties & Addresses</Text>

//     <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
//         {/* LEFT COLUMN */}
//         <View style={{ width: "49%" }}>
//             {/* Billing From */}
//             {/* Billing From */}
//             <View style={[styles.box, { marginBottom: 12 }]}>
//                 <Text style={styles.fieldTitle}>Billing From - Bilva Interiors</Text>

//                 {/* Address */}
//                 <View style={styles.field}>
//                     <Text style={[styles.fieldLabel, { fontWeight: "bold" }]}>Address</Text>
//                     <Text style={styles.fieldInput}>{billing.billingFromAddress || "-"}</Text>
//                 </View>

//                 {/* Row 1: State + State Code */}
//                 <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 4 }}>
//                     <View style={[styles.field, { width: "48%" }]}>
//                         <Text style={[styles.fieldLabel, { fontWeight: "bold" }]}>State</Text>
//                         <Text style={styles.fieldInput}>{billing.billingFromState || "-"}</Text>
//                     </View>
//                     <View style={[styles.field, { width: "48%" }]}>
//                         <Text style={[styles.fieldLabel, { fontWeight: "bold" }]}>State Code</Text>
//                         <Text style={styles.fieldInput}>{billing.billingFromStateCode || "-"}</Text>
//                     </View>
//                 </View>

//                 {/* Row 2: GSTIN + Brand */}
//                 <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 4 }}>
//                     <View style={[styles.field, { width: "48%" }]}>
//                         <Text style={[styles.fieldLabel, { fontWeight: "bold" }]}>GSTIN</Text>
//                         <Text style={styles.fieldInput}>{billing.billingFromGSTIN || "-"}</Text>
//                     </View>
//                     <View style={[styles.field, { width: "48%" }]}>
//                         <Text style={[styles.fieldLabel, { fontWeight: "bold" }]}>Brand</Text>
//                         <Text style={styles.fieldInput}>{billing.billingFromBrand || "-"}</Text>
//                     </View>
//                 </View>

//                 {/* Row 3: Contact */}
//                 <View style={{ marginTop: 4 }}>
//                     <Text style={[styles.fieldLabel, { fontWeight: "bold" }]}>Contact Email / Phone (Optional)</Text>
//                     <Text style={styles.fieldInput}>{billing.billingFromContact || "-"}</Text>
//                 </View>
//             </View>


//             {/* Billing To */}
//             <View style={[styles.box, { marginBottom: 12 }]}>
//                 <Text style={styles.fieldTitle}>Billing To</Text>

//                 <View style={styles.field}>
//                     <Text style={[styles.fieldLabel, { fontWeight: "bold" }]}>Address</Text>
//                     <Text style={styles.fieldInput}>{billing.billingToAddress || "-"}</Text>
//                 </View>

//                 <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
//                     <View style={[styles.field, { width: "55%" }]}>
//                         <Text style={[styles.fieldLabel, { fontWeight: "bold" }]}>State</Text>
//                         <Text style={styles.fieldInput}>{billing.billingToState || "-"}</Text>
//                     </View>
//                     <View style={[styles.field, { width: "55%" }]}>
//                         <Text style={[styles.fieldLabel, { fontWeight: "bold" }]}>State Code</Text>
//                         <Text style={styles.fieldInput}>{billing.billingToStateCode || "-"}</Text>
//                     </View>
//                     <View style={[styles.field, { width: "48%" }]}>
//                         <Text style={[styles.fieldLabel, { fontWeight: "bold" }]}>GSTIN</Text>
//                         <Text style={styles.fieldInput}>{billing.billingToGSTIN || "-"}</Text>
//                     </View>
//                 </View>
//             </View>
//         </View>

//         {/* RIGHT COLUMN */}
//         <View style={{ width: "49%" }}>
//             {/* Shipping Address */}
//             <View style={[styles.box, { marginBottom: 12 }]}>
//                 <Text style={styles.fieldTitle}>Shipping Address</Text>

//                 {/* Address */}
//                 <View style={styles.field}>
//                     <Text style={[styles.fieldLabel, { fontWeight: "bold" }]}>Address</Text>
//                     <Text style={styles.fieldInput}>{billing.shippingAddress || "-"}</Text>
//                 </View>

//                 {/* Row 1: State + State Code */}
//                 <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 4 }}>
//                     <View style={[styles.field, { width: "48%" }]}>
//                         <Text style={[styles.fieldLabel, { fontWeight: "bold" }]}>State</Text>
//                         <Text style={styles.fieldInput}>{billing.shippingState || "-"}</Text>
//                     </View>
//                     <View style={[styles.field, { width: "48%" }]}>
//                         <Text style={[styles.fieldLabel, { fontWeight: "bold" }]}>State Code</Text>
//                         <Text style={styles.fieldInput}>{billing.shippingStateCode || "-"}</Text>
//                     </View>
//                 </View>

//                 {/* Row 2: GSTIN + Brand */}
//                 <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 4 }}>
//                     <View style={[styles.field, { width: "48%" }]}>
//                         <Text style={[styles.fieldLabel, { fontWeight: "bold" }]}>GSTIN</Text>
//                         <Text style={styles.fieldInput}>{billing.shippingGSTIN || "-"}</Text>
//                     </View>
//                     <View style={[styles.field, { width: "48%" }]}>
//                         <Text style={[styles.fieldLabel, { fontWeight: "bold" }]}>Brand</Text>
//                         <Text style={styles.fieldInput}>{billing.shippingBrand || "-"}</Text>
//                     </View>
//                 </View>

//                 {/* Row 3: Contact */}
//                 <View style={{ marginTop: 4 }}>
//                     <Text style={[styles.fieldLabel, { fontWeight: "bold" }]}>Contact Email / Phone (Optional)</Text>
//                     <Text style={styles.fieldInput}>{billing.shippingContact || "-"}</Text>
//                 </View>
//             </View>


//             {/* Delivery Address */}
//             <View style={[styles.box]}>
//                 <Text style={styles.fieldTitle}>Delivery Address</Text>

//                 <View style={styles.field}>
//                     <Text style={[styles.fieldLabel, { fontWeight: "bold" }]}>Address</Text>
//                     <Text style={styles.fieldInput}>{billing.deliveryAddress || "-"}</Text>
//                 </View>

//                 <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
//                     <View style={[styles.field, { width: "32%" }]}>
//                         <Text style={[styles.fieldLabel, { fontWeight: "bold" }]}>Store Code</Text>
//                         <Text style={styles.fieldInput}>{billing.storeCode || "-"}</Text>
//                     </View>
//                     <View style={[styles.field, { width: "32%" }]}>
//                         <Text style={[styles.fieldLabel, { fontWeight: "bold" }]}>SAP Code</Text>
//                         <Text style={styles.fieldInput}>{billing.sapCode || "-"}</Text>
//                     </View>
//                     <View style={[styles.field, { width: "32%" }]}>
//                         <Text style={[styles.fieldLabel, { fontWeight: "bold" }]}>Vendor Code</Text>
//                         <Text style={styles.fieldInput}>{billing.vendorCode || "-"}</Text>
//                     </View>
//                 </View>
//             </View>
//         </View>
//     </View>
// </View>

// {/* 🧾 Invoice / Estimate Details */}
// {/* 🧾 Invoice / Estimate Details */}
// <View style={styles.section}>
//     <Text style={styles.title}>Invoice Details</Text>

//     {/* 🟦 Same box style as Parties & Addresses */}
//     <View style={[styles.box, { marginBottom: 12 }]}>
//         {[
//             { label: "Bill Number", value: billing.billNumber },
//             { label: "Bill Date", value: formatDate(billing.billDate) },
//             { label: "Estimate No", value: billing.estimateNo },
//             { label: "Date of Estimate", value: formatDate(billing.dateOfEstimate) },
//             { label: "Project ID", value: billing.projectId },
//             { label: "GST Number", value: billing.gstNumber },
//             { label: "PAN", value: billing.pan },
//             { label: "PO Number", value: billing.poNumber },
//             { label: "PO Date", value: formatDate(billing.poDate) },
//             { label: "PO Type", value: billing.poType },
//             { label: "Sub (Work Description)", value: billing.workDescription },
//             { label: "Invoice Title / Subject", value: billing.invoiceTitle },
//         ]
//             .reduce((rows, item, i) => {
//                 if (i % 3 === 0) rows.push([]);
//                 rows[rows.length - 1].push(item);
//                 return rows;
//             }, [])
//             .map((row, rowIndex) => (
//                 <View
//                     key={rowIndex}
//                     style={{
//                         flexDirection: "row",
//                         justifyContent: "space-between",
//                         marginTop: 4,
//                     }}
//                 >
//                     {row.map((item, i) => (
//                         <View key={i} style={[styles.field, { width: "32%" }]}>
//                             <Text style={[styles.fieldLabel, { fontWeight: "bold" }]}>{item.label}</Text>
//                             <Text style={styles.fieldInput}>{item.value || "-"}</Text>
//                         </View>
//                     ))}
//                 </View>
//             ))}
//     </View>
// </View>




//                 {/* LINE ITEMS */}
//                 <View style={styles.section}>
//                     <Text style={styles.sectionTitle}>Line Items</Text>

//                     {/* Table Header */}
//                     <View style={styles.tableHeader} fixed>
//                         <Text style={[styles.tableHeaderText, { width: "18%" }]}>Material</Text>
//                         <Text style={[styles.tableHeaderText, { width: "12%" }]}>HSN</Text>
//                         <Text style={[styles.tableHeaderText, { width: "30%" }]}>Description</Text>
//                         <Text style={[styles.tableHeaderText, { width: "10%" }]}>UOM</Text>
//                         <Text style={[styles.tableHeaderText, { width: "10%", textAlign: "right" }]}>Qty</Text>
//                         <Text style={[styles.tableHeaderText, { width: "10%", textAlign: "right" }]}>Rate</Text>
//                         <Text style={[styles.tableHeaderText, { width: "10%", textAlign: "right" }]}>Amount</Text>
//                     </View>

//                     {/* Table Rows */}
//                     {lineItems.length > 0 ? (
//                         lineItems.map((item, i) => (
//                             <View
//                                 key={i}
//                                 style={[
//                                     styles.tableRow,
//                                     i % 2 === 1 ? { backgroundColor: "#f9f9f9" } : { backgroundColor: "#fff" },
//                                 ]}
//                                 wrap={false}
//                             >
//                                 <Text style={[styles.tableCell, { width: "18%" }]}>{item.materialCode || "-"}</Text>
//                                 <Text style={[styles.tableCell, { width: "12%" }]}>{item.hsnCode || "-"}</Text>
//                                 <Text style={[styles.tableCell, { width: "30%" }]}>{item.description || "-"}</Text>
//                                 <Text style={[styles.tableCell, { width: "10%" }]}>{item.uom || "-"}</Text>
//                                 <Text style={[styles.tableCell, { width: "10%", textAlign: "right" }]}>{item.quantity || "-"}</Text>
//                                 <Text style={[styles.tableCell, { width: "10%", textAlign: "right" }]}>{item.rate || "-"}</Text>
//                                 <Text style={[styles.tableCell, { width: "10%", textAlign: "right" }]}>{item.amount || "-"}</Text>
//                             </View>
//                         ))
//                     ) : (
//                         <Text>No line items available</Text>
//                     )}
//                 </View>

//                     {/* Left side: Tax Details */}
//                     {/* TAX OPTIONS */}
//                     <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
//                         {/* Left side: Tax Details */}
//                         <View style={{ width: "40%" }}>
//                             <Text style={{ fontWeight: "bold", marginBottom: 6 }}>Tax Options</Text>

//                             {/* Render only non-zero taxes */}
//                             <TaxRow label={billing.tax1Option} percent={billing.tax1Percent} netTotal={billing.netTotal} />
//                             <TaxRow label={billing.tax2Option} percent={billing.tax2Percent} netTotal={billing.netTotal} />
//                             <TaxRow label={billing.tax3Option} percent={billing.tax3Percent} netTotal={billing.netTotal} />
//                         </View>

//                         {/* Right side: Totals */}
//                         <View style={{ width: "55%" }}>
//                             <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
//                                 <Text>Net Total:</Text>
//                                 <Text>{billing.netTotal ? billing.netTotal.toFixed(2) : "0.00"}</Text>
//                             </View>

//                             {/* Correct total tax calculation */}
//                             <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
//                                 <Text>Total Tax:</Text>
//                                 <Text>
//                                     {(
//                                         ((billing.netTotal || 0) * ((billing.tax1Percent || 0) + (billing.tax2Percent || 0) + (billing.tax3Percent || 0))) / 100
//                                     ).toFixed(2)}
//                                 </Text>
//                             </View>

//                             <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
//                                 <Text>Round Off:</Text>
//                                 <Text>{billing.roundOff ? billing.roundOff.toFixed(2) : "0.00"}</Text>
//                             </View>

//                             <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 4, fontWeight: "bold" }}>
//                                 <Text>Grand Total:</Text>
//                                 <Text>{billing.grandTotal ? billing.grandTotal.toFixed(2) : "0.00"}</Text>
//                             </View>
//                         </View>
//                     </View>




//                     {/* FOOTER */}
//                     <View style={styles.footer}>
//                         <Text>Generated on {formatGeneratedDateTime()}</Text>
//                     </View>
//             </Page>
//         </Document>
//     );
// };

// export { BillingPDFDocument };

// // 🔘 MAIN COMPONENT
// const BillingPDF = ({ billing }) => {
//     const handleDownload = async () => {
//         const blob = await pdf(<BillingPDFDocument billing={billing} />).toBlob();
//         const url = URL.createObjectURL(blob);
//         const link = document.createElement("a");
//         link.href = url;
//         link.download = `Billing_${billing.projectName || "Document"}.pdf`;
//         link.click();
//         URL.revokeObjectURL(url);
//     };

//     return (
//         <button type="button" onClick={handleDownload} className="btn btn-primary">
//             Download Billing PDF
//         </button>
//     );
// };

// export default BillingPDF;


import React from "react";
import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";

// 🎨 Styles (unchanged, except added page break logic)
const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: "Helvetica",
        fontSize: 10,
        lineHeight: 1.5,
        color: "#000",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottom: "2 solid #405189",
        paddingBottom: 15,
        marginBottom: 20,
    },
    titleLeft: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#405189",
    },
    titleRight: {
        fontSize: 22,
        color: "#405189",
        fontWeight: "bold",
    },
    section: {
        marginBottom: 16,
    },
    sectionTitle: {
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
        backgroundColor: "#f9f9f9",
    },
    label: {
        fontSize: 9,
        color: "#555",
    },
    value: {
        fontSize: 10,
        color: "#000",
        marginBottom: 4,
    },
    tableHeader: {
        flexDirection: "row",
        backgroundColor: "#405189",
        paddingVertical: 4,
    },
    tableHeaderText: {
        fontSize: 9,
        fontWeight: "bold",
        color: "#fff",
    },
    tableRow: {
        flexDirection: "row",
        borderBottom: "0.5 solid #ccc",
        paddingVertical: 3,
    },
    tableCell: {
        fontSize: 9,
    },
    footer: {
        marginTop: 20,
        borderTop: "1 solid #ccc",
        paddingTop: 6,
        fontSize: 8,
        textAlign: "center",
        color: "#666",
    },
});

// 🧮 Helper: Format Date
const formatDate = (date) => {
    if (!date) return "-";
    const d = new Date(date);
    return d.toLocaleDateString("en-GB");
};

// 🕓 Helper: Footer Time
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

// 💰 Helper to render tax row
const TaxRow = ({ label, percent, netTotal }) => {
    if (!label || !percent || percent === 0) return null;
    const taxAmount = ((netTotal || 0) * percent) / 100;
    return (
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 3 }}>
            <Text>{label}</Text>
            <Text>{taxAmount.toFixed(2)}</Text>
        </View>
    );
};

// 🧾 PDF Document
export const BillingPDFDocument = ({ billing }) => {
    const lineItems = billing.lineItems || [];

    const tax1Amount = ((billing.netTotal || 0) * (billing.tax1Percent || 0)) / 100;
    const tax2Amount = ((billing.netTotal || 0) * (billing.tax2Percent || 0)) / 100;
    const tax3Amount = ((billing.netTotal || 0) * (billing.tax3Percent || 0)) / 100;

    const totalTax = tax1Amount + tax2Amount + tax3Amount;
    const roundOff = billing.roundOff || 0;
    const grandTotal = (billing.netTotal || 0) + totalTax + roundOff;

    return (
        <Document>
            {/* PAGE 1: Header + Project/Party/Invoice details */}
            <Page size="A4" style={styles.page}>
                <View style={styles.header} fixed>
                    <Text style={styles.titleLeft}>Bilva Interiors</Text>
                    <Text style={styles.titleRight}>Invoice</Text>
                </View>

                {/* PROJECT DETAILS */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Project Details</Text>
                    <View style={styles.box}>
                        <Text style={styles.label}>Project Name:</Text>
                        <Text style={styles.value}>{billing.projectName || "-"}</Text>
                        <Text style={styles.label}>Bill Number:</Text>
                        <Text style={styles.value}>{billing.billNumber || "-"}</Text>
                    </View>
                </View>

                {/* PARTIES */}
                <View style={styles.section}>
                    <Text style={styles.title}>Parties & Addresses</Text>

                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        {/* LEFT COLUMN */}
                        <View style={{ width: "49%" }}>
                            {/* Billing From */}
                            {/* Billing From */}
                            <View style={[styles.box, { marginBottom: 12 }]}>
                                <Text style={styles.fieldTitle}>Billing From - Bilva Interiors</Text>

                                {/* Address */}
                                <View style={styles.field}>
                                    <Text style={[styles.fieldLabel, { fontWeight: "bold" }]}>Address</Text>
                                    <Text style={styles.fieldInput}>{billing.billingFromAddress || "-"}</Text>
                                </View>

                                {/* Row 1: State + State Code */}
                                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 4 }}>
                                    <View style={[styles.field, { width: "48%" }]}>
                                        <Text style={[styles.fieldLabel, { fontWeight: "bold" }]}>State</Text>
                                        <Text style={styles.fieldInput}>{billing.billingFromState || "-"}</Text>
                                    </View>
                                    <View style={[styles.field, { width: "48%" }]}>
                                        <Text style={[styles.fieldLabel, { fontWeight: "bold" }]}>State Code</Text>
                                        <Text style={styles.fieldInput}>{billing.billingFromStateCode || "-"}</Text>
                                    </View>
                                </View>

                                {/* Row 2: GSTIN + Brand */}
                                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 4 }}>
                                    <View style={[styles.field, { width: "48%" }]}>
                                        <Text style={[styles.fieldLabel, { fontWeight: "bold" }]}>GSTIN</Text>
                                        <Text style={styles.fieldInput}>{billing.billingFromGSTIN || "-"}</Text>
                                    </View>
                                    <View style={[styles.field, { width: "48%" }]}>
                                        <Text style={[styles.fieldLabel, { fontWeight: "bold" }]}>Brand</Text>
                                        <Text style={styles.fieldInput}>{billing.billingFromBrand || "-"}</Text>
                                    </View>
                                </View>

                                {/* Row 3: Contact */}
                                <View style={{ marginTop: 4 }}>
                                    <Text style={[styles.fieldLabel, { fontWeight: "bold" }]}>Contact Email / Phone (Optional)</Text>
                                    <Text style={styles.fieldInput}>{billing.billingFromContact || "-"}</Text>
                                </View>
                            </View>


                            {/* Billing To */}
                            <View style={[styles.box, { marginBottom: 12 }]}>
                                <Text style={styles.fieldTitle}>Billing To</Text>

                                <View style={styles.field}>
                                    <Text style={[styles.fieldLabel, { fontWeight: "bold" }]}>Address</Text>
                                    <Text style={styles.fieldInput}>{billing.billingToAddress || "-"}</Text>
                                </View>

                                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                    <View style={[styles.field, { width: "55%" }]}>
                                        <Text style={[styles.fieldLabel, { fontWeight: "bold" }]}>State</Text>
                                        <Text style={styles.fieldInput}>{billing.billingToState || "-"}</Text>
                                    </View>
                                    <View style={[styles.field, { width: "55%" }]}>
                                        <Text style={[styles.fieldLabel, { fontWeight: "bold" }]}>State Code</Text>
                                        <Text style={styles.fieldInput}>{billing.billingToStateCode || "-"}</Text>
                                    </View>
                                    <View style={[styles.field, { width: "48%" }]}>
                                        <Text style={[styles.fieldLabel, { fontWeight: "bold" }]}>GSTIN</Text>
                                        <Text style={styles.fieldInput}>{billing.billingToGSTIN || "-"}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* RIGHT COLUMN */}
                        <View style={{ width: "49%" }}>
                            {/* Shipping Address */}
                            <View style={[styles.box, { marginBottom: 12 }]}>
                                <Text style={styles.fieldTitle}>Shipping Address</Text>

                                {/* Address */}
                                <View style={styles.field}>
                                    <Text style={[styles.fieldLabel, { fontWeight: "bold" }]}>Address</Text>
                                    <Text style={styles.fieldInput}>{billing.shippingAddress || "-"}</Text>
                                </View>

                                {/* Row 1: State + State Code */}
                                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 4 }}>
                                    <View style={[styles.field, { width: "48%" }]}>
                                        <Text style={[styles.fieldLabel, { fontWeight: "bold" }]}>State</Text>
                                        <Text style={styles.fieldInput}>{billing.shippingState || "-"}</Text>
                                    </View>
                                    <View style={[styles.field, { width: "48%" }]}>
                                        <Text style={[styles.fieldLabel, { fontWeight: "bold" }]}>State Code</Text>
                                        <Text style={styles.fieldInput}>{billing.shippingStateCode || "-"}</Text>
                                    </View>
                                </View>

                                {/* Row 2: GSTIN + Brand */}
                                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 4 }}>
                                    <View style={[styles.field, { width: "48%" }]}>
                                        <Text style={[styles.fieldLabel, { fontWeight: "bold" }]}>GSTIN</Text>
                                        <Text style={styles.fieldInput}>{billing.shippingGSTIN || "-"}</Text>
                                    </View>
                                    <View style={[styles.field, { width: "48%" }]}>
                                        <Text style={[styles.fieldLabel, { fontWeight: "bold" }]}>Brand</Text>
                                        <Text style={styles.fieldInput}>{billing.shippingBrand || "-"}</Text>
                                    </View>
                                </View>

                                {/* Row 3: Contact */}
                                <View style={{ marginTop: 4 }}>
                                    <Text style={[styles.fieldLabel, { fontWeight: "bold" }]}>Contact Email / Phone (Optional)</Text>
                                    <Text style={styles.fieldInput}>{billing.shippingContact || "-"}</Text>
                                </View>
                            </View>


                            {/* Delivery Address */}
                            <View style={[styles.box]}>
                                <Text style={styles.fieldTitle}>Delivery Address</Text>

                                <View style={styles.field}>
                                    <Text style={[styles.fieldLabel, { fontWeight: "bold" }]}>Address</Text>
                                    <Text style={styles.fieldInput}>{billing.deliveryAddress || "-"}</Text>
                                </View>

                                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                    <View style={[styles.field, { width: "32%" }]}>
                                        <Text style={[styles.fieldLabel, { fontWeight: "bold" }]}>Store Code</Text>
                                        <Text style={styles.fieldInput}>{billing.storeCode || "-"}</Text>
                                    </View>
                                    <View style={[styles.field, { width: "32%" }]}>
                                        <Text style={[styles.fieldLabel, { fontWeight: "bold" }]}>SAP Code</Text>
                                        <Text style={styles.fieldInput}>{billing.sapCode || "-"}</Text>
                                    </View>
                                    <View style={[styles.field, { width: "32%" }]}>
                                        <Text style={[styles.fieldLabel, { fontWeight: "bold" }]}>Vendor Code</Text>
                                        <Text style={styles.fieldInput}>{billing.vendorCode || "-"}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                {/* 🧾 Invoice / Estimate Details */}
                {/* 🧾 Invoice / Estimate Details */}
                <View style={styles.section}>
                    <Text style={styles.title}>Invoice Details</Text>

                    {/* 🟦 Same box style as Parties & Addresses */}
                    <View style={[styles.box, { marginBottom: 12 }]}>
                        {[
                            { label: "Bill Number", value: billing.billNumber },
                            { label: "Bill Date", value: formatDate(billing.billDate) },
                            { label: "Estimate No", value: billing.estimateNo },
                            { label: "Date of Estimate", value: formatDate(billing.dateOfEstimate) },
                            { label: "Project ID", value: billing.projectId },
                            { label: "GST Number", value: billing.gstNumber },
                            { label: "PAN", value: billing.pan },
                            { label: "PO Number", value: billing.poNumber },
                            { label: "PO Date", value: formatDate(billing.poDate) },
                            { label: "PO Type", value: billing.poType },
                            { label: "Sub (Work Description)", value: billing.workDescription },
                            { label: "Invoice Title / Subject", value: billing.invoiceTitle },
                        ]
                            .reduce((rows, item, i) => {
                                if (i % 3 === 0) rows.push([]);
                                rows[rows.length - 1].push(item);
                                return rows;
                            }, [])
                            .map((row, rowIndex) => (
                                <View
                                    key={rowIndex}
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        marginTop: 4,
                                    }}
                                >
                                    {row.map((item, i) => (
                                        <View key={i} style={[styles.field, { width: "32%" }]}>
                                            <Text style={[styles.fieldLabel, { fontWeight: "bold" }]}>{item.label}</Text>
                                            <Text style={styles.fieldInput}>{item.value || "-"}</Text>
                                        </View>
                                    ))}
                                </View>
                            ))}
                    </View>
                </View>
                </Page>

                {/* PAGE 2: Line Items + Tax + Totals */}
                <Page size="A4" style={styles.page}>
                    {/* LINE ITEMS */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Line Items</Text>

                        {/* Table Header */}
                        <View style={styles.tableHeader} fixed>
                            <Text style={[styles.tableHeaderText, { width: "18%" }]}>Material</Text>
                            <Text style={[styles.tableHeaderText, { width: "12%" }]}>HSN</Text>
                            <Text style={[styles.tableHeaderText, { width: "30%" }]}>Description</Text>
                            <Text style={[styles.tableHeaderText, { width: "10%" }]}>UOM</Text>
                            <Text style={[styles.tableHeaderText, { width: "10%", textAlign: "right" }]}>Qty</Text>
                            <Text style={[styles.tableHeaderText, { width: "10%", textAlign: "right" }]}>Rate</Text>
                            <Text style={[styles.tableHeaderText, { width: "10%", textAlign: "right" }]}>Amount</Text>
                        </View>

                        {/* Table Rows */}
                        {lineItems.length > 0 ? (
                            lineItems.map((item, i) => (
                                <View
                                    key={i}
                                    style={[
                                        styles.tableRow,
                                        i % 2 === 1 ? { backgroundColor: "#f9f9f9" } : { backgroundColor: "#fff" },
                                    ]}
                                    wrap={false}
                                >
                                    <Text style={[styles.tableCell, { width: "18%" }]}>{item.materialCode || "-"}</Text>
                                    <Text style={[styles.tableCell, { width: "12%" }]}>{item.hsnCode || "-"}</Text>
                                    <Text style={[styles.tableCell, { width: "30%" }]}>{item.description || "-"}</Text>
                                    <Text style={[styles.tableCell, { width: "10%" }]}>{item.uom || "-"}</Text>
                                    <Text style={[styles.tableCell, { width: "10%", textAlign: "right" }]}>{item.quantity || "-"}</Text>
                                    <Text style={[styles.tableCell, { width: "10%", textAlign: "right" }]}>{item.rate || "-"}</Text>
                                    <Text style={[styles.tableCell, { width: "10%", textAlign: "right" }]}>{item.amount || "-"}</Text>
                                </View>
                            ))
                        ) : (
                            <Text>No line items available</Text>
                        )}
                    </View>

                    {/* TAX AND TOTALS */}
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
                        <View style={{ width: "40%" }}>
                            <Text style={{ fontWeight: "bold", marginBottom: 6 }}>Tax Options</Text>
                            <TaxRow label={billing.tax1Option} percent={billing.tax1Percent} netTotal={billing.netTotal} />
                            <TaxRow label={billing.tax2Option} percent={billing.tax2Percent} netTotal={billing.netTotal} />
                            <TaxRow label={billing.tax3Option} percent={billing.tax3Percent} netTotal={billing.netTotal} />
                        </View>

                        <View style={{ width: "55%" }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
                                <Text>Net Total:</Text>
                                <Text>{(billing.netTotal || 0).toFixed(2)}</Text>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
                                <Text>Total Tax:</Text>
                                <Text>{totalTax.toFixed(2)}</Text>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
                                <Text>Round Off:</Text>
                                <Text>{roundOff.toFixed(2)}</Text>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 4 }}>
                                <Text style={{ fontWeight: "bold" }}>Grand Total:</Text>
                                <Text style={{ fontWeight: "bold" }}>{grandTotal.toFixed(2)}</Text>
                            </View>
                        </View>
                    </View>

                    {/* FOOTER */}
                    <View style={styles.footer}>
                        <Text>Generated on {formatGeneratedDateTime()}</Text>
                    </View>
                </Page>
        </Document>
    );
};

export default BillingPDFDocument;

