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
import AttendanceAdmin from "./pages/attendance/attendanceAdmin";
import Dashboard from "../client/pages/dashboard";
import PayrollsAdmin from "./pages/payrolls/payrollsAdmin";

//Client
import ProfilePage from "../client/pages/users/ProfilePage";
import AttendanceClient from "../client/pages/attendance/attendanceClient";
import PayrollsClient from "../client/pages/payrolls/payrollsClient";

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

const AppContent = () => {
  const location = useLocation();
  const hideNavbarRoutes = ["/"]; // Halaman yang tidak membutuhkan Navbar

  return (
    <>
      {/* Navbar akan disembunyikan pada halaman login */}
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      <ToastContainer />
      <Routes>
        {/* Halaman Login */}
        <Route path="/" element={<Login />} />
        <Route path="/LogOut" element={<LogOut />} />

        {/* Rute dengan proteksi */}
        <Route
          path="/Home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
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
          path="/ProfilePage"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
        path="/payrollsAdmin"
        element={
          <ProtectedRoute>
            <PayrollsAdmin/>
          </ProtectedRoute>
        }
        />
        <Route
        path="/payrollsClient"
        element={
          <ProtectedRoute>
            <PayrollsClient/>
          </ProtectedRoute>
        }
        />
      </Routes>
    </>
  );
};

export default App;
