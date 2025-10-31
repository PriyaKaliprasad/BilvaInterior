// src/api/axios.js
import axios from "axios";

const base = import.meta.env.VITE_API_BASE_URL || "https://localhost:7142";
console.log("Frontend: VITE_API_BASE_URL =", base); // helpful debug line

const api = axios.create({
    baseURL: base,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

export default api;
