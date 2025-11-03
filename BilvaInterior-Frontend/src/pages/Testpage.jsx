import React, { useState, useEffect } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
} from "@react-pdf/renderer";

const Testpage = () => {
    return (
    <PDFViewer width="100%" height="1000">
      <InvoiceDocument />
    </PDFViewer>
  );
};

const form = {
  projectId: 1,
  reportType: 1,
  reportDate: "2025-11-03",
  personVisitId: 1,
  storeName: "Orion Mall Store",
  storeCode: "BLR001",
  vendorCode: "VBL001",
  sapCode: "SAP560",
  storeLocation: "Bengaluru",
  storeManagerName: "Ramesh Gowda",
  storeManagerNumber: "9845012345",
  storeMailId: "orionblr@store.com",
  storeAddress: "Orion Mall, Brigade Gateway, Dr Rajkumar Road, Rajajinagar, Bengaluru, Karnataka 560055, India",
  notes:
    "All inspection activities were completed successfully. Minor electrical issues to be resolved by next visit.",
};

const reportTypes = [
  { value: 1, text: "Site Visit" },
  { value: 2, text: "Billing" },
];

const projects = [{ id: 1, projectName: "Interior Fitout - Bengaluru" }];

const employees = [{ id: 1, name: "Ananya Reddy" }];

const lineItems = [
  { description: "Ceiling Light Installation", uom: "Nos", boqQty: 20, onsiteQty: 18, finalReview: "Satisfactory", remarks: "2 units pending" },
  { description: "Wall Painting - Texture", uom: "Sqft", boqQty: 400, onsiteQty: 380, finalReview: "Good", remarks: "Touch up needed on north wall" },
  { description: "Modular Furniture Setup", uom: "Sets", boqQty: 10, onsiteQty: 10, finalReview: "Excellent", remarks: "-" },
  { description: "False Ceiling Grid", uom: "Sqft", boqQty: 250, onsiteQty: 200, finalReview: "Pending", remarks: "Material delay" },
  { description: "Glass Partition Installation", uom: "Nos", boqQty: 8, onsiteQty: 8, finalReview: "Good", remarks: "-" },
  { description: "Flooring - Vinyl", uom: "Sqft", boqQty: 600, onsiteQty: 600, finalReview: "Excellent", remarks: "-" },
  { description: "Main Door Fitting", uom: "Nos", boqQty: 2, onsiteQty: 2, finalReview: "Satisfactory", remarks: "-" },
  { description: "Window Blinds", uom: "Nos", boqQty: 12, onsiteQty: 10, finalReview: "Pending", remarks: "2 to be delivered" },
  { description: "HVAC Ducting", uom: "Rmt", boqQty: 50, onsiteQty: 45, finalReview: "Good", remarks: "5 rmt to be completed" },
  { description: "Fire Alarm System", uom: "Nos", boqQty: 15, onsiteQty: 15, finalReview: "Excellent", remarks: "-" },
  { description: "CCTV Camera Setup", uom: "Nos", boqQty: 6, onsiteQty: 6, finalReview: "Good", remarks: "-" },
  { description: "Server Rack Installation", uom: "Nos", boqQty: 1, onsiteQty: 1, finalReview: "Excellent", remarks: "-" },
  { description: "Reception Counter", uom: "Nos", boqQty: 1, onsiteQty: 1, finalReview: "Good", remarks: "Minor scratch" },
  { description: "Conference Table", uom: "Nos", boqQty: 1, onsiteQty: 1, finalReview: "Excellent", remarks: "-" },
  { description: "Pantry Sink Fitting", uom: "Nos", boqQty: 1, onsiteQty: 1, finalReview: "Good", remarks: "-" },
  { description: "Electrical Switches", uom: "Nos", boqQty: 40, onsiteQty: 38, finalReview: "Pending", remarks: "2 to be fixed" },
  { description: "Network Cabling", uom: "Mtr", boqQty: 300, onsiteQty: 300, finalReview: "Excellent", remarks: "-" },
  { description: "Toilet Partition", uom: "Nos", boqQty: 3, onsiteQty: 3, finalReview: "Good", remarks: "-" },
  { description: "Signage Board", uom: "Nos", boqQty: 2, onsiteQty: 2, finalReview: "Satisfactory", remarks: "-" },
  { description: "Emergency Exit Light", uom: "Nos", boqQty: 4, onsiteQty: 4, finalReview: "Excellent", remarks: "-" },
];

// ---------- PDF STYLES ----------
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    lineHeight: 1.4,
  },
  headerContainer: {
    marginBottom: 25,
    borderBottom: "2 solid #405189",
    paddingBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  companyName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#405189",
    marginBottom: 8,
  },
  documentTitle: {
    fontSize: 14,
    color: "#405189",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  infoGrid: {
    marginBottom: 5,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  infoColumn: {
    flex: 1,
    paddingRight: 15,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#405189",
    textTransform: "uppercase",
    marginBottom: 8,
    borderBottom: "1 solid #ddd",
    paddingBottom: 4,
  },
  infoItemRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  infoLabel: {
    fontSize: 9,
    color: "#666",
    width: 120,
  },
  infoValue: {
    fontSize: 9,
    color: "#000",
    flex: 1,
  },
  storeDetailsBox: {
    backgroundColor: "#ffffff",
    // padding: 12,
    // marginBottom: 20,
    // borderRadius: 4,
    // border: "1 solid #e0e0e0",
  },
  storeTwoColumn: {
    flexDirection: "row",
    marginBottom: 5,
  },
  storeColumnLeft: {
    flex: 1,
    paddingRight: 10,
  },
  storeColumnRight: {
    flex: 1,
    paddingLeft: 10,
  },
  storeRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  storeLabel: {
    fontSize: 9,
    color: "#666",
    width: 120,
  },
  storeValue: {
    fontSize: 9,
    color: "#000",
    flex: 1,
  },
  tableContainer: {
    marginTop: 20,
    marginBottom: 60,
  },
  tableTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    alignItems: "center",
  },
  tableTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#405189",
    textTransform: "uppercase",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#405189",
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  tableHeaderText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "bold",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1 solid #e0e0e0",
    paddingVertical: 6,
    paddingHorizontal: 6,
    minHeight: 20,
  },
  tableRowAlt: {
    backgroundColor: "#f3f3f9",
  },
  tableCell: {
    fontSize: 9,
    color: "#333",
    textAlign: "center",
    paddingHorizontal: 3,
  },
  tableCellLeft: {
    textAlign: "left",
  },
  colSerial: { width: "6%" },
  colDescription: { width: "28%" },
  colUom: { width: "10%" },
  colBoq: { width: "12%" },
  colOnsite: { width: "12%" },
  colReview: { width: "16%" },
  colRemarks: { width: "16%" },
  notesContainer: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#fffef7",
    border: "1 solid #e0e0e0",
    borderRadius: 4,
  },
  notesTitle: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#405189",
  },
  notesText: {
    fontSize: 9,
    color: "#555",
    lineHeight: 1.5,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 8,
    color: "#888",
    borderTop: "1 solid #ddd",
    paddingTop: 8,
    textAlign: "center",
  },
});

// ---------- HELPER ----------
const formatGeneratedDateTime = () => {
  const now = new Date();
  return now.toLocaleString("en-IN", { hour12: true });
};

// ---------- PDF DOCUMENT ----------
const InvoiceDocument = () => {
  const filteredLineItems = lineItems.filter((i) => i.description);

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.companyName}>Bilva Interiors</Text>
          <Text style={styles.documentTitle}>
            {reportTypes.find((r) => r.value === form.reportType)?.text} Report
          </Text>
        </View>

        {/* Info */}
        <View style={styles.infoGrid}>
          <View style={styles.infoRow}>
            <View style={styles.infoColumn}>
              <Text style={styles.sectionTitle}>Report Information</Text>
              <View style={styles.infoItemRow}>
                <Text style={styles.infoLabel}>Project Name:</Text>
                <Text style={styles.infoValue}>
                  {projects.find((p) => p.id === form.projectId)?.projectName}
                </Text>
              </View>
              <View style={styles.infoItemRow}>
                <Text style={styles.infoLabel}>Report Type:</Text>
                <Text style={styles.infoValue}>
                  {reportTypes.find((r) => r.value === form.reportType)?.text}
                </Text>
              </View>
            </View>
            <View style={styles.infoColumn}>
              <Text style={styles.sectionTitle}>Visit Details</Text>
              <View style={styles.infoItemRow}>
                <Text style={styles.infoLabel}>Report Date:</Text>
                <Text style={styles.infoValue}>
                  {new Date(form.reportDate).toLocaleDateString("en-IN")}
                </Text>
              </View>
              <View style={styles.infoItemRow}>
                <Text style={styles.infoLabel}>Visited By:</Text>
                <Text style={styles.infoValue}>
                  {employees.find((e) => e.id === form.personVisitId)?.name}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Store Details */}
        <View style={styles.storeDetailsBox}>
          <Text style={styles.sectionTitle}>Store / Project Details</Text>

          <View style={styles.storeTwoColumn}>
            <View style={styles.storeColumnLeft}>
              <View style={styles.storeRow}>
                <Text style={styles.storeLabel}>Store Name:</Text>
                <Text style={styles.storeValue}>{form.storeName}</Text>
              </View>
              <View style={styles.storeRow}>
                <Text style={styles.storeLabel}>Location:</Text>
                <Text style={styles.storeValue}>{form.storeLocation}</Text>
              </View>
              <View style={styles.storeRow}>
                <Text style={styles.storeLabel}>Manager:</Text>
                <Text style={styles.storeValue}>{form.storeManagerName}</Text>
              </View>
              <View style={styles.storeRow}>
                <Text style={styles.storeLabel}>Phone:</Text>
                <Text style={styles.storeValue}>{form.storeManagerNumber}</Text>
              </View>
              <View style={styles.storeRow}>
                <Text style={styles.storeLabel}>Email:</Text>
                <Text style={styles.storeValue}>{form.storeMailId}</Text>
              </View>
            </View>

            <View style={styles.storeColumnRight}>
              <View style={styles.storeRow}>
                <Text style={styles.storeLabel}>Store Code:</Text>
                <Text style={styles.storeValue}>{form.storeCode}</Text>
              </View>
              <View style={styles.storeRow}>
                <Text style={styles.storeLabel}>Vendor Code:</Text>
                <Text style={styles.storeValue}>{form.vendorCode}</Text>
              </View>
              <View style={styles.storeRow}>
                <Text style={styles.storeLabel}>SAP Code:</Text>
                <Text style={styles.storeValue}>{form.sapCode}</Text>
              </View>
            </View>
          </View>

          <View
            style={[
              styles.storeRow,
            //   { marginTop: 5, paddingTop: 8, borderTop: "1 solid #e0e0e0" },
            ]}
          >
            <Text style={styles.storeLabel}>Store Address:</Text>
            <Text style={styles.storeValue}>{form.storeAddress}</Text>
          </View>
        </View>

        {/* Table */}
        <View style={styles.tableContainer}>
          <View style={styles.tableTitleRow}>
            <Text style={styles.tableTitle}>Line Items</Text>
            <Text style={{ fontSize: 9, color: "#666" }}>
              Total Items: {filteredLineItems.length}
            </Text>
          </View>

          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.colSerial]}>#</Text>
            <Text
              style={[
                styles.tableHeaderText,
                styles.colDescription,
                { textAlign: "left" },
              ]}
            >
              Description
            </Text>
            <Text style={[styles.tableHeaderText, styles.colUom]}>UOM</Text>
            <Text style={[styles.tableHeaderText, styles.colBoq]}>BOQ</Text>
            <Text style={[styles.tableHeaderText, styles.colOnsite]}>
              Onsite
            </Text>
            <Text style={[styles.tableHeaderText, styles.colReview]}>
              Review
            </Text>
            <Text style={[styles.tableHeaderText, styles.colRemarks]}>
              Remarks
            </Text>
          </View>

          {filteredLineItems.map((item, i) => (
            <View
              key={i}
              style={[styles.tableRow, i % 2 === 1 && styles.tableRowAlt]}
              wrap={false}
            >
              <Text style={[styles.tableCell, styles.colSerial]}>
                {i + 1}
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.colDescription,
                  styles.tableCellLeft,
                ]}
              >
                {item.description}
              </Text>
              <Text style={[styles.tableCell, styles.colUom]}>{item.uom}</Text>
              <Text style={[styles.tableCell, styles.colBoq]}>
                {item.boqQty}
              </Text>
              <Text style={[styles.tableCell, styles.colOnsite]}>
                {item.onsiteQty}
              </Text>
              <Text style={[styles.tableCell, styles.colReview]}>
                {item.finalReview}
              </Text>
              <Text style={[styles.tableCell, styles.colRemarks]}>
                {item.remarks}
              </Text>
            </View>
          ))}
        </View>

        {/* Notes */}
        {form.notes && (
          <View style={styles.notesContainer}>
            <Text style={styles.notesTitle}>Additional Notes</Text>
            <Text style={styles.notesText}>{form.notes}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text>Generated on {formatGeneratedDateTime()}, Bilva Interiors.</Text>
        </View>
      </Page>
    </Document>
  );
};

export default Testpage;
