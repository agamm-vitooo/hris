import React from "react";
import { Navigate } from "react-router-dom";
import { auth } from '../../server/firebase'; // Import auth instance

const ProtectedRoute = ({ children }) => {
    const user = auth.currentUser; // Periksa apakah ada pengguna yang login

    return user ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
