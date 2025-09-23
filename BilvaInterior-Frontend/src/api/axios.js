import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // ensures cookies are sent with requests
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    // No need to manually attach JWT since it's in HttpOnly cookie
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Example: if JWT expired → clear state / redirect
      if (error.response.status === 401) {
        console.error("Unauthorized: JWT may have expired.");
        // Optionally trigger logout
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
