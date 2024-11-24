import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/auth/LoginPages";
import Navbar from "./components/navbar/Navbar";
import Home from "./pages/HomePages";
import Register from "./pages/auth/RegisterPages";
import LogOut from "./components/LogOutButton";
import ProtectedRoute from "./pages/auth/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PhoneAuth from "./pages/auth/PhoneAuth";
import UserPages from "./pages/sidebar/UserPages";
import UserDetail from "./components/layout/UserDetails";

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

const AppContent = () => {
  const location = useLocation();
  const hideNavbarRoutes = ["/Login", "/", "/PhoneAuth"];

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/PhoneAuth" element={<PhoneAuth />} />
        <Route path="/LogOut" element={<LogOut />} />
        <Route
          path="/Home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/UserPages"
          element={
            <ProtectedRoute>
              <UserPages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/User/:id"
          element={
            <ProtectedRoute>
              <UserDetail />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;
