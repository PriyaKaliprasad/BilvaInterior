import React, { useState, useEffect } from "react";
import CanvasJSReact from "../../canvasjs/canvasjs.react.jsx";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import api from "../../api/axios"; // your axios instance

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const Dashboard = () => {
    const [startYear, setStartYear] = useState(2026);
    const [yearOptions, setYearOptions] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const [companyRevenue, setCompanyRevenue] = useState([]);
    const [monthlyRevenue, setMonthlyRevenue] = useState({});

    // ------------------- LOAD START YEAR FROM BACKEND -------------------
    useEffect(() => {
        api.get("/api/dashboard/start-year").then(res => {
            const sy = res.data;
            setStartYear(sy);

            const currentYear = new Date().getFullYear();
            const years = [];

            for (let y = sy; y <= currentYear; y++) years.push(y);

            setYearOptions(years);
            setSelectedYear(currentYear);
        });
    }, []);

    // ------------------- LOAD REVENUE BASED ON SELECTED YEAR -------------------
    useEffect(() => {
        if (!selectedYear) return;

        api.get(`/api/dashboard/company-revenue/${selectedYear}`)
            .then(res => setCompanyRevenue(res.data));

        api.get(`/api/dashboard/monthly-revenue/${selectedYear}`)
            .then(res => setMonthlyRevenue(res.data));
    }, [selectedYear]);

    const months = Object.keys(monthlyRevenue);
    const values = Object.values(monthlyRevenue);

    // ---------- Bar Chart ----------
    const barOptions = {
        animationEnabled: true,
        theme: "light2",
        axisX: { title: "TieUpCompanies", labelAngle: -20 },
        axisY: { title: "Revenue in Rupees", lineThickness: 1, gridThickness: 1 },
        data: [{
            type: "column",
            dataPoints: companyRevenue.map(item => ({
                label: item.company,
                y: item.revenue
            }))
        }]
    };

    // ---------- Line Chart ----------
    const lineOptions = {
        animationEnabled: true,
        theme: "light2",
        axisX: { title: "Months" },
        axisY: { title: "Revenue in Rupees", lineThickness: 1, gridThickness: 1 },
        data: [{
            type: "line",
            markerSize: 6,
            dataPoints: months.map((m, i) => ({
                label: m,
                y: values[i]
            }))
        }]
    };

    return (
        <div className="container py-4">

            {/* Year Dropdown */}
            <div className="d-flex justify-content-end mb-4">
                <div style={{ maxWidth: "200px" }}>
                    <DropDownList
                        data={yearOptions}
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.value)}
                        className="w-100"
                    />
                </div>
            </div>


            {/* Charts */}
            <div className="card p-3 mb-4">
                <h4 className="text-center">Revenue by Project</h4>
                <CanvasJSChart options={barOptions} />
            </div>

            <div className="card p-3">
                <h4 className="text-center">Monthly Revenue Trend</h4>
                <CanvasJSChart options={lineOptions} />
            </div>

        </div>
    );
};

export default Dashboard;


// import React, { useState } from "react";
// import CanvasJSReact from "../../canvasjs/canvasjs.react.jsx";
// import { DropDownList } from "@progress/kendo-react-dropdowns";

// const CanvasJSChart = CanvasJSReact.CanvasJSChart;

// // Hardcoded data
// const chartData = [
//     { company: "Bilva1", revenue: 115 },
//     { company: "Company B", revenue: 250 },
//     { company: "Company C", revenue: 180 },
//     { company: "Company D", revenue: 95 },
//     { company: "Company E", revenue: 300 }
// ];

// const monthlyRevenue = {
//     Jan: 120, Feb: 140, Mar: 200, Apr: 180, May: 220, Jun: 260,
//     Jul: 300, Aug: 280, Sep: 240, Oct: 260, Nov: 300, Dec: 320
// };

// const allMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// const currentMonthIndex = new Date().getMonth();
// const monthsToShow = allMonths.slice(0, currentMonthIndex + 1);
// const monthRevenueValues = monthsToShow.map(m => monthlyRevenue[m]);

// const Dashboard = () => {

//     // --- Year Dropdown Logic ---
//     const startYear = 2020;
//     const currentYear = new Date().getFullYear();

//     const yearOptions = [];
//     for (let y = startYear; y <= currentYear; y++) {
//         yearOptions.push(y);
//     }

//     const [selectedYear, setSelectedYear] = useState(null);

//     // --- Bar Chart ---
//     const barOptions = {
//         animationEnabled: true,
//         theme: "light2",
//         axisX: { title: "Tie-up Companies", labelAngle: -20 },
//         axisY: {
//             title: "Revenue in Rupees",
//             lineThickness: 1,       // <-- Add this
//             gridThickness: 1
//         }, data: [
//             {
//                 type: "column",
//                 dataPoints: chartData.map(item => ({
//                     label: item.company,
//                     y: item.revenue
//                 }))
//             }
//         ]
//     };

//     // --- Line Chart ---
//     const lineOptions = {
//         animationEnabled: true,
//         theme: "light2",
//         axisX: { title: "Months" },
//         axisY: {
//             title: "Revenue in Rupees",
//             lineThickness: 1,       // <-- Add this
//             gridThickness: 1
//         }, data: [
//             {
//                 type: "line",
//                 markerSize: 8,
//                 dataPoints: monthsToShow.map((m, i) => ({
//                     label: m,
//                     y: monthRevenueValues[i]
//                 }))
//             }
//         ]
//     };

//     return (
//         <div className="container-fluid bg-light min-vh-100 py-4">

//             {/* Header */}
//             <div className="row mb-3">
//                 <div className="col-12 text-center text-md-start">
//                     <h1 className="fw-bold display-6">Billing Dashboard</h1>
//                     <p className="text-muted">Overview of revenue generation</p>
//                 </div>
//             </div>

//             {/* Year Dropdown */}
//             <div className="row mb-4 justify-content-end">
//                 <div className="col-12 col-md-2">
//                     <label className="fw-semibold mb-2">Select Year</label>
//                     <DropDownList
//                         data={yearOptions}
//                         value={selectedYear}
//                         onChange={(e) => setSelectedYear(e.value)}
//                         className="w-100"
//                         placeholder="Select Year"
//                     />
//                 </div>
//             </div>

//             {/* Bar Chart */}
//             <div className="row justify-content-center mb-5">
//                 <div className="col-12 col-lg-10 mx-auto">
//                     <div className="card shadow border-0 rounded-4">
//                         <div className="card-body">
//                             <h4 className="card-title text-center mb-3">Revenue by Company</h4>
//                             <CanvasJSChart options={barOptions} />
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Line Chart */}
//             <div className="row justify-content-center">
//                 <div className="col-12 col-lg-10 mx-auto">
//                     <div className="card shadow border-0 rounded-4">
//                         <div className="card-body">
//                             <h4 className="card-title text-center mb-3">Monthly Revenue Trend</h4>
//                             <CanvasJSChart options={lineOptions} />
//                         </div>
//                     </div>
//                 </div>
//             </div>

//         </div>
//     );
// };

// export default Dashboard;

