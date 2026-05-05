import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export const PublicRoute = ({ element }) => {
    const { isAuthenticated } = useContext(AuthContext);
    return !isAuthenticated ? element : <Navigate to="/dashboard" replace />;
};