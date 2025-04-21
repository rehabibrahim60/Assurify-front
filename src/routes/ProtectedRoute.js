import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ role, children }) => {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/" />;
    }

    const decoded = JSON.parse(atob(token.split(".")[1])); // Decode JWT
    if (decoded.role !== role) {
        return <Navigate to="/" />;
    }

    return children; // Ensure it renders children properly
};

export default ProtectedRoute;
