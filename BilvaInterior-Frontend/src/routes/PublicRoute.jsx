import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = () => {
  const { user, loading } = useAuth();

  // Show loading while checking authentication status
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <p>Loading...</p>
      </div>
    );
  }

  // If already authenticated, redirect to dashboard
  if (user) {
    console.log(user);
    return <Navigate to="/dashboard" replace />;
  }

  // If not authenticated, render the public component (login page)
  return <Outlet />;
};

export default PublicRoute;