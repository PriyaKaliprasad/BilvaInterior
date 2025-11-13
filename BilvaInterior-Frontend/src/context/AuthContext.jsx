import { createContext, useContext, useEffect, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import api from "../api/axios";

const AuthContext = createContext(null);

// ✅ Added BASE URL (from backend)
const API_BASE_URL = "https://localhost:7142";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [signOutMessage, setSignOutMessage] = useState('');
  const { data, loading, error, refetch } = useFetch("/api/auth/me");

  useEffect(() => {
    if (data) {
      setUser(data);
    } else if (error) {
      setUser(null);
    }
  }, [data, error]);

  // flush browser cached page so that auth is re-verified on back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      refetch();   // verify auth again when user navigates with browser buttons
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const login = async (credentials) => {
    try {
      // ✅ Fixed URL: prepend backend base path
      const response = await api.post(`${API_BASE_URL}/api/auth/login`, credentials);
      // After successful login, refetch user data
      await refetch();
      return { success: true, data: response.data };
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please try again.";
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      // ✅ Fixed URL: prepend backend base path
      await api.post(`${API_BASE_URL}/api/auth/logout`);
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      setSignOutMessage('Signed out successfully.');   // set the message here
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      loading,
      login,
      logout,
      isAuthenticated: !!user,
      signOutMessage,
      setSignOutMessage
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
