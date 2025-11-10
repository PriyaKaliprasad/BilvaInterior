import React from "react";
import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";

// 🎨 Styles
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
    twoColumn: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 10,
    },
    halfBox: {
        width: "48%",
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
    totalsContainer: {
        marginTop: 10,
        borderTop: "1 solid #ccc",
        paddingTop: 8,
        alignItems: "flex-end",
    },
    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "40%",
    },
    totalLabel: {
        fontSize: 10,
        color: "#333",
    },
    totalValue: {
        fontSize: 10,
        fontWeight: "bold",
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

// 🕓 Helpers
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

// 🧾 PDF Layout
const BillingPDFDocument = ({ billing }) => {
    const lineItems = billing.lineItems || [];

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* HEADER */}
                <View style={styles.header} fixed>
                    <Text style={styles.titleLeft}>Bilva Interiors</Text>
                    <Text style={styles.titleRight}>Billing</Text>
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
                            <View style={[styles.box, { marginBottom: 12 }]}>
                                <Text style={styles.fieldTitle}>Billing From (Bilva Interiors)</Text>

                                <View style={styles.field}>
                                    <Text style={styles.fieldLabel}>Address</Text>
                                    <Text style={styles.fieldInput}>{quotation.billingFromAddress || "-"}</Text>
                                </View>

                                <View style={[styles.field, { width: "48%" }]}>
                                        <Text style={styles.fieldLabel}>State</Text>
                                        <Text style={styles.fieldInput}>{quotation.billingFromState || "-"}</Text>
                                    </View>

                                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                    <View style={[styles.field, { width: "48%" }]}>
                                        <Text style={styles.fieldLabel}>State Code</Text>
                                        <Text style={styles.fieldInput}>{quotation.billingFromStateCode || "-"}</Text>
                                    </View>
                                    <View style={[styles.field, { width: "48%" }]}>
                                        <Text style={styles.fieldLabel}>GSTIN</Text>
                                        <Text style={styles.fieldInput}>{quotation.billingFromGSTIN || "-"}</Text>
                                    </View>

                                    <View style={[styles.field, { width: "48%" }]}>
                                        <Text style={styles.fieldLabel}>State Code</Text>
                                        <Text style={styles.fieldInput}>{quotation.billingFromStateCode || "-"}</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Billing To */}
                            <View style={[styles.box, { marginBottom: 12 }]}>
                                <Text style={styles.fieldTitle}>Billing To</Text>

                                <View style={styles.field}>
                                    <Text style={styles.fieldLabel}>Address</Text>
                                    <Text style={styles.fieldInput}>{quotation.billingToAddress || "-"}</Text>
                                </View>

                                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                    <View style={[styles.field, { width: "48%" }]}>
                                        <Text style={styles.fieldLabel}>GSTIN (Consignee)</Text>
                                        <Text style={styles.fieldInput}>{quotation.gstinConsignee || "-"}</Text>
                                    </View>
                                    <View style={[styles.field, { width: "48%" }]}>
                                        <Text style={styles.fieldLabel}>GSTIN (Buyer)</Text>
                                        <Text style={styles.fieldInput}>{quotation.gstinBuyer || "-"}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* RIGHT COLUMN */}
                        <View style={{ width: "49%" }}>
                            {/* Shipping Address */}
                            <View style={[styles.box, { marginBottom: 12 }]}>
                                <Text style={styles.fieldTitle}>Shipping Address</Text>

                                <View style={styles.field}>
                                    <Text style={styles.fieldLabel}>Address</Text>
                                    <Text style={styles.fieldInput}>{quotation.shippingAddress || "-"}</Text>
                                </View>

                                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                    <View style={[styles.field, { width: "48%" }]}>
                                        <Text style={styles.fieldLabel}>GSTIN</Text>
                                        <Text style={styles.fieldInput}>{quotation.billingFromGSTIN || "-"}</Text>
                                    </View>
                                    <View style={[styles.field, { width: "48%" }]}>
                                        <Text style={styles.fieldLabel}>Brand / Sub-brand</Text>
                                        <Text style={styles.fieldInput}>{quotation.subBrand || "-"}</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Delivery Address */}
                            <View style={[styles.box]}>
                                <Text style={styles.fieldTitle}>Delivery Address</Text>

                                <View style={styles.field}>
                                    <Text style={styles.fieldLabel}>Address</Text>
                                    <Text style={styles.fieldInput}>{quotation.deliveryAddress || "-"}</Text>
                                </View>

                                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                    <View style={[styles.field, { width: "32%" }]}>
                                        <Text style={styles.fieldLabel}>Store Code</Text>
                                        <Text style={styles.fieldInput}>{quotation.storeCode || "-"}</Text>
                                    </View>
                                    <View style={[styles.field, { width: "32%" }]}>
                                        <Text style={styles.fieldLabel}>SAP Code</Text>
                                        <Text style={styles.fieldInput}>{quotation.sapCode || "-"}</Text>
                                    </View>
                                    <View style={[styles.field, { width: "32%" }]}>
                                        <Text style={styles.fieldLabel}>Vendor Code</Text>
                                        <Text style={styles.fieldInput}>{quotation.vendorCode || "-"}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

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

                {/* TOTALS */}
                <View style={styles.totalsContainer}>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Net Total:</Text>
                        <Text style={styles.totalValue}>{billing.netTotal || "-"}</Text>
                    </View>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Tax:</Text>
                        <Text style={styles.totalValue}>{billing.tax || "-"}</Text>
                    </View>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Round Off:</Text>
                        <Text style={styles.totalValue}>{billing.roundOff || "-"}</Text>
                    </View>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Grand Total:</Text>
                        <Text style={styles.totalValue}>{billing.grandTotal || "-"}</Text>
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

export { BillingPDFDocument };

// 🔘 MAIN COMPONENT
const BillingPDF = ({ billing }) => {
    const handleDownload = async () => {
        const blob = await pdf(<BillingPDFDocument billing={billing} />).toBlob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `Billing_${billing.projectName || "Document"}.pdf`;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <button type="button" onClick={handleDownload} className="btn btn-primary">
            Download Billing PDF
        </button>
    );
};

export default BillingPDF;
