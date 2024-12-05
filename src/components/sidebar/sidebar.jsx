import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { logOut } from "../../server/firebaseAuth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { db } from "../../server/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { FaUser, FaCog, FaSignOutAlt, FaUsers } from "react-icons/fa"; // Importing icons from React Icons

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
        className={`fixed top-0 left-0 h-full w-64 z-50 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"} bg-blue-600`} // bg-blue-700 applied here
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
              <Link
                to="/UserPages"
                className="py-2.5 px-4 hover:bg-white hover:text-gray-800 transition flex items-center"
              >
                <FaUsers className="mr-2" /> {/* Icon for Admin Users */}
                Admin Users
              </Link>
              {/* Admin specific Attendance link */}
              <Link
                to="/AttendanceAdmin"
                className="py-2.5 px-4 hover:bg-white hover:text-gray-800 transition flex items-center"
              >
                <FaUser className="mr-2" /> {/* Icon for Attendance (Admin) */}
                Attendance (Admin)
              </Link>
            </>
          )}

          {/* Show User link only if role is 'User' */}
          {role === "User" && (
            <>
              <Link
                to="/ProfilePage"
                className="py-2.5 px-4 hover:bg-white hover:text-gray-800 transition flex items-center"
              >
                <FaUser className="mr-2" /> {/* Icon for Client Users */}
                Client Users
              </Link>
              {/* User specific Attendance link */}
              <Link
                to="/AttendanceClient"
                className="py-2.5 px-4 hover:bg-white hover:text-gray-800 transition flex items-center"
              >
                <FaUser className="mr-2" /> {/* Icon for Attendance (User) */}
                Attendance (User)
              </Link>
            </>
          )}

          {/* Common links */}
          <Link
            to="/payrolls"
            className="py-2.5 px-4 hover:bg-white hover:text-gray-800 transition flex items-center"
          >
            <FaCog className="mr-2" /> {/* Icon for Payrolls */}
            Payrolls
          </Link>
          <Link
            to="/leave-requests"
            className="py-2.5 px-4 hover:bg-white hover:text-gray-800 transition flex items-center"
          >
            <FaCog className="mr-2" /> {/* Icon for Leave Requests */}
            Leave Requests
          </Link>
          <Link
            to="/account"
            className="py-2.5 px-4 hover:bg-white hover:text-gray-800 transition flex items-center"
          >
            <FaCog className="mr-2" /> {/* Icon for Account */}
            Account
          </Link>
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
