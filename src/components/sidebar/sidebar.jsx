import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { logOut } from "../../server/firebaseAuth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { db } from "../../server/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { FaUserAlt, FaUsersCog, FaSignOutAlt, FaClipboardList, FaTachometerAlt, FaBuilding } from "react-icons/fa"; // Ikon-ikon baru

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const auth = getAuth();
  const location = useLocation(); // Get current location/path

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

  // Function to check if current path matches the link
  const isActiveLink = (path) => location.pathname === path;

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
        className={`fixed top-0 left-0 h-full w-64 z-50 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"} bg-blue-600`}
      >
        <div className="p-4 text-lg font-bold bg-blue-600 relative">
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
              <NavLink
                to="/UserPages"
                className={`py-2.5 px-4 transition flex items-center ${isActiveLink("/UserPages") ? "bg-white text-gray-800" : "hover:bg-white hover:text-gray-800"}`}
              >
                <FaUsersCog className="mr-2" /> {/* Icon for Admin Users */}
                Admin Users
              </NavLink>
              {/* Admin specific Attendance link */}
              <NavLink
                to="/AttendanceAdmin"
                className={`py-2.5 px-4 transition flex items-center ${isActiveLink("/AttendanceAdmin") ? "bg-white text-gray-800" : "hover:bg-white hover:text-gray-800"}`}
              >
                <FaClipboardList className="mr-2" /> {/* Icon for Attendance (Admin) */}
                Attendance (Admin)
              </NavLink>
            </>
          )}

          {/* Show User link only if role is 'User' */}
          {role === "User" && (
            <>
              <NavLink
                to="/ProfilePage"
                className={`py-2.5 px-4 transition flex items-center ${isActiveLink("/ProfilePage") ? "bg-white text-gray-800" : "hover:bg-white hover:text-gray-800"}`}
              >
                <FaUserAlt className="mr-2" /> {/* Icon for Client Users */}
                Client Users
              </NavLink>
              {/* User specific Attendance link */}
              <NavLink
                to="/AttendanceClient"
                className={`py-2.5 px-4 transition flex items-center ${isActiveLink("/AttendanceClient") ? "bg-white text-gray-800" : "hover:bg-white hover:text-gray-800"}`}
              >
                <FaClipboardList className="mr-2" /> {/* Icon for Attendance (User) */}
                Attendance (User)
              </NavLink>
            </>
          )}

          {/* Common links */}
          <NavLink
            to="/payrolls"
            className={`py-2.5 px-4 transition flex items-center ${isActiveLink("/payrolls") ? "bg-white text-gray-800" : "hover:bg-white hover:text-gray-800"}`}
          >
            <FaTachometerAlt className="mr-2" /> {/* Icon for Payrolls */}
            Payrolls
          </NavLink>
          <NavLink
            to="/leave-requests"
            className={`py-2.5 px-4 transition flex items-center ${isActiveLink("/leave-requests") ? "bg-white text-gray-800" : "hover:bg-white hover:text-gray-800"}`}
          >
            <FaBuilding className="mr-2" /> {/* Icon for Leave Requests */}
            Leave Requests
          </NavLink>
          <NavLink
            to="/account"
            className={`py-2.5 px-4 transition flex items-center ${isActiveLink("/account") ? "bg-white text-gray-800" : "hover:bg-white hover:text-gray-800"}`}
          >
            <FaUserAlt className="mr-2" /> {/* Icon for Account */}
            Account
          </NavLink>
        </nav>
        {/* Logout Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white py-2.5 px-6 rounded-lg hover:bg-red-600 transition flex items-center"
          >
            <FaSignOutAlt className="mr-2" /> {/* Icon for Logout */}
            Log Out
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
