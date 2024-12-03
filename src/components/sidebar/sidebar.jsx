import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { logOut } from "../../server/firebaseAuth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { db } from "../../server/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const auth = getAuth();

  // Fetch user role from Firestore based on userID (uid)
  const fetchUserRole = async (userId) => {
    try {
      console.log("Fetching user role for userId:", userId); // Debugging
      const userRef = collection(db, "users");
      const q = query(userRef, where("userID", "==", userId)); // Fetch user by uid
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.log("User not found in Firestore");
        toast.error("Pengguna tidak ditemukan di database!");
        navigate("/"); 
        return;
      }

      // If user found, get role from Firestore
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        setRole(userData.role); // Set role in state
        console.log("Fetched Role:", userData.role); // Debugging
      });
    } catch (error) {
      console.error("Error fetching user role:", error);
      toast.error("Gagal memuat data pengguna.");
    } finally {
      setLoading(false); // Stop loading when done
    }
  };

  // Run once when component is mounted
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      console.log("Authenticated user:", user); // Debugging
      fetchUserRole(user.uid); // Fetch role based on uid
    } else {
      console.log("No authenticated user found");
      toast.error("Pengguna tidak terautentikasi.");
      navigate("/"); // Redirect to login if not authenticated
    }
  }, [auth]);

  // Display loading while fetching role
  if (loading) return <div>Loading...</div>;

  // Logout handler
  const handleLogout = async () => {
    try {
      await logOut();
      toast.success("Logged out successfully!");
      navigate("/"); // Redirect to homepage after logout
    } catch (error) {
      toast.error("Failed to log out: " + error.message);
    }
  };

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
          {/* Show Admin link only if role is 'Admin' */}
          {role === "Admin" && (
            <>
              <Link
                to="/UserPages"
                className="block py-2.5 px-4 hover:bg-blue-700 hover:text-white transition"
              >
                Admin Users
              </Link>
              {/* Admin specific Attendance link */}
              <Link
                to="/AttendanceAdmin"
                className="block py-2.5 px-4 hover:bg-blue-700 hover:text-white transition"
              >
                Attendance (Admin)
              </Link>
            </>
          )}
          
          {/* Show User link only if role is 'User' */}
          {role === "User" && (
            <>
              <Link
                to="/ProfilePage"
                className="block py-2.5 px-4 hover:bg-blue-700 hover:text-white transition"
              >
                Client Users
              </Link>
              {/* User specific Attendance link */}
              <Link
                to="/AttendanceClient"
                className="block py-2.5 px-4 hover:bg-blue-700 hover:text-white transition"
              >
                Attendance (User)
              </Link>
            </>
          )}

          {/* Common links */}
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
            to="/account"
            className="block py-2.5 px-4 hover:bg-blue-700 hover:text-white transition"
          >
            Account
          </Link>
        </nav>
        {/* Logout Button */}
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
