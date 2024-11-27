import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/auth/LoginPages";
import Navbar from "./components/navbar/Navbar";
import Home from "./pages/homePages";
import Register from "./pages/auth/RegisterPages";
import LogOut from "./components/LogOutButton";
import ProtectedRoute from "./pages/auth/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PhoneAuth from "./pages/auth/PhoneAuth";
import UserPages from "./pages/UserPages/userPages";
import UserDetail from "./components/layout/UserDetails";
import AboutPage from "./pages/aboutPages";
import EmployeePages from "./pages/employeePages";

// Impor firebaseAuth untuk memulai auto logout dan memantau status login
import './server/firebaseAuth'; 

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

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
          path="/About"
          element={
            <ProtectedRoute>
              <AboutPage />
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
        <Route
          path="/EmployeePages"
          element={
            <ProtectedRoute>
              <EmployeePages />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;
