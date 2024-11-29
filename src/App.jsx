import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/auth/LoginPages";
import Navbar from "./components/navbar/Navbar";
import Home from "./pages/homePages";
import LogOut from "./components/LogOutButton";
import ProtectedRoute from "./pages/auth/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserPages from "./pages/UserPages/userPages";
import UserDetail from "./components/layout/UserDetails";
import AboutPage from "./pages/aboutPages";
import AccountPages from "./pages/account/accountPages";
import ClientPage from "../client/pages/attendance/attendance"; // Halaman Client
import AdminPage from "./pages/attendance/attendancePages"; // Halaman Admin
import ProfilePage from "../client/pages/users/ProfilePage"; // Halaman Profil Pengguna
import './server/firebaseAuth'; 
import AttendanceAdmin from "./pages/attendance/attendancePages";
import AttendanceClient from "../client/pages/attendance/attendance";

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

const AppContent = () => {
  const location = useLocation();
  const hideNavbarRoutes = ["/"]; // Navbar tidak ditampilkan di halaman login

  return (
    <>
      {/* Tampilkan Navbar jika bukan halaman login */}
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      <ToastContainer />
      <Routes>
        {/* Halaman Login */}
        <Route path="/" element={<Login />} />
        
        {/* Logout */}
        <Route path="/LogOut" element={<LogOut />} />
        
        {/* Halaman yang memerlukan proteksi login */}
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
          path="/AccountPages"
          element={
            <ProtectedRoute>
              <AccountPages />
            </ProtectedRoute>
          }
        />

        {/* Halaman Client */}
        <Route
          path="/AttendanceClient"
          element={
            <ProtectedRoute>
              <AttendanceClient />
            </ProtectedRoute>
          }
        />

        {/* Halaman Admin */}
        <Route
          path="/AttendanceAdmin"
          element={
            <ProtectedRoute>
              <AttendanceAdmin />
            </ProtectedRoute>
          }
        />

        {/* Halaman Profil Pengguna */}
        <Route
          path="/Profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;
