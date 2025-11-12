import axios from "axios";

// ✅ Safe base URL fallback (in case .env is not loaded)
const baseURL =
  (import.meta.env.VITE_API_BASE_URL &&
    import.meta.env.VITE_API_BASE_URL.replace(/\/+$/, "")) ||
  "https://localhost:7142";

const api = axios.create({
  baseURL: baseURL, // ✅ always valid now
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // ensures cookies are sent with requests
});

// Request Interceptor
// api.interceptors.request.use(
//   (config) => {
//     // No need to manually attach JWT since it's in HttpOnly cookie
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// Response Interceptor
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response) {
//       // Example: if JWT expired → clear state / redirect
//       if (error.response.status === 401) {
//         console.error("Unauthorized: JWT may have expired.");
//         // Optionally trigger logout
//         window.location.href = "/login";
//       }
//     }
//     return Promise.reject(error);
//   }
// );

export default api;
