import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element }) => {

    const { isAuthenticated } = useContext(AuthContext);

    return isAuthenticated ? element : <Navigate to="/" />;
};

export default ProtectedRoute;
