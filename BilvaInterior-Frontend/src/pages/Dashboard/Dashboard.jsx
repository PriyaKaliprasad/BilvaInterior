import React, { useState, useEffect } from "react";
import CanvasJSReact from "../../canvasjs/canvasjs.react.jsx";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import api from "../../api/axios"; // your axios instance
import { Button } from "@progress/kendo-react-buttons";


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
        axisX: { title: "Tie Up Companies", labelAngle: -20 },
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
            <div className="d-flex justify-content-end align-items-center gap-2 mb-4">

                {/* Year Dropdown */}
                <div style={{ maxWidth: "200px" }}>
                    <DropDownList
                        data={yearOptions}
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.value)}
                        className="w-100"
                    />
                </div>

                {/* Refresh Button */}
                <Button
                    icon="refresh"
                            className="action-btn refresh-btn"
                    title="Refresh Charts"
                    onClick={() => {
                        api.get(`/api/dashboard/company-revenue/${selectedYear}`)
                            .then(res => setCompanyRevenue(res.data));

                        api.get(`/api/dashboard/monthly-revenue/${selectedYear}`)
                            .then(res => setMonthlyRevenue(res.data));
                    }}
                >
                    Refresh
                </Button>


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
