import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { logOut } from "../../server/firebaseAuth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { db } from "../../server/firebase";
import { collection, getDocs } from "firebase/firestore";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const auth = getAuth();

  // Mengambil role pengguna dari Firestore
  const fetchUserRole = async (userId) => {
    try {
      console.log("Fetching user role for userId:", userId);  // Verifikasi userId yang diterima
      const userRef = collection(db, "users");
      const snapshot = await getDocs(userRef);
      const userDoc = snapshot.docs.find(doc => doc.id === userId);

      if (userDoc) {
        // Jika ditemukan, set role
        setRole(userDoc.data().role);
        console.log("Fetched Role:", userDoc.data().role);  // Verifikasi role yang diambil
      } else {
        console.log("User not found in Firestore"); // Log jika user tidak ditemukan
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    } finally {
      setLoading(false);  // Selesai mengambil data
    }
  };

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      console.log("Authenticated user:", user);  // Verifikasi user yang sedang login
      fetchUserRole(user.uid);  // Ambil role berdasarkan uid
    } else {
      console.log("No authenticated user found");
    }
  }, [auth]);

  useEffect(() => {
    console.log("User Role:", role);  // Verifikasi nilai role yang disimpan di state
  }, [role]);

  const handleLogout = async () => {
    try {
      await logOut();
      toast.success("Logged out successfully!");
      navigate("/"); // Redirect to homepage after logout
    } catch (error) {
      toast.error("Failed to log out: " + error.message);
    }
  };

  if (loading) return <div>Loading...</div>; // Menampilkan loading jika data masih diambil

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        ></div>
      )}
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-slate-100 text-black transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 w-64 z-50`}
      >
        <div className="p-4 text-lg font-bold bg-slate-200 relative">
          HRIS Dashboard
          <button
            onClick={toggleSidebar}
            className="absolute top-4 right-4 text-slate-900 hover:text-gray-300"
          >
            ✕
          </button>
        </div>
        <nav className="mt-4">
          {/* Hanya tampilkan link untuk Admin jika role = 'Admin' */}
          {role === "Admin" && (
            <Link
              to="/UserPages"
              className="block py-2.5 px-4 hover:bg-blue-700 hover:text-white transition"
            >
              Admin Users
            </Link>
          )}
          {/* Hanya tampilkan link untuk User jika role = 'User' */}
          {role === "User" && (
            <Link
              to="/ProfilePage"
              className="block py-2.5 px-4 hover:bg-blue-700 hover:text-white transition"
            >
              Client Users
            </Link>
          )}
          <Link
            to="/attendance"
            className="block py-2.5 px-4 hover:bg-blue-700 hover:text-white transition"
          >
            Attendance
          </Link>
          <Link
            to="/payrolls"
            className="block py-2.5 px-4 hover:bg-blue-700 hover:text-white transition"
          >
            Payrolls
          </Link>
          <Link
            to="/leave-requests"
            className="block py-2.5 px-4 hover:bg-blue-700 hover:text-white transition"
          >
            Leave Requests
          </Link>
          <Link
            to="/tasks"
            className="block py-2.5 px-4 hover:bg-blue-700 hover:text-white transition"
          >
            Tasks
          </Link>
          <Link
            to="/account"
            className="block py-2.5 px-4 hover:bg-blue-700 hover:text-white transition"
          >
            Account
          </Link>
        </nav>
        {/* Tombol Logout */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white py-2.5 px-6 rounded-lg hover:bg-red-600 transition"
          >
            Log Out
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
