import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../sidebar/sidebar";
import logo from "../../assets/icon.png";
import { getAuth } from "firebase/auth";
import { db } from "../../server/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { toast } from "react-toastify";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState(null);  // State untuk menyimpan peran pengguna

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  // Fetch user role from Firestore based on user ID
  const fetchUserRole = async (userId) => {
    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("userID", "==", userId)); // Fetch user by uid
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast.error("Pengguna tidak ditemukan di database!");
        return;
      }

      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        setRole(userData.role); // Set role in state
      });
    } catch (error) {
      console.error("Error fetching user role:", error);
      toast.error("Gagal memuat data pengguna.");
    }
  };

  // Fetch user role when component mounts
  useEffect(() => {
    const user = getAuth().currentUser;
    if (user) {
      fetchUserRole(user.uid); // Fetch role based on uid
    }
  }, []);

  // Set link destination based on user role
  const getLogoLink = () => {
    if (role === "Admin") {
      return "/Home"; // Admin logo links to homePages
    } else if (role === "User") {
      return "/dashboard"; // User logo links to dashboard
    }
    return "/"; // Default to home if role is not set yet
  };

  return (
    <div>
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <div className="nav flex items-center justify-between bg-slate-100 p-3">
        {/* Sidebar Toggle Button */}
        <div className="flex items-center">
          <button className="text-gray-600 mr-4" onClick={toggleSidebar}>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>

          {/* Logo and HRIS Text */}
          <Link
            to={getLogoLink()} // Dynamically set the link based on role
            className="navLogo flex items-center text-black font-semibold text-xl"
          >
            {/* Logo Image */}
            <img
              src={logo} // Menggunakan logo dari import
              alt="HRIS Logo"
              className="w-6 h-6 mr-2" // Atur ukuran logo
            />
            HRIS
          </Link>
        </div>

        {/* About and Contact on the Right */}
        <div className="flex items-center space-x-6">
          <Link
            to="/about"
            className="text-black hover:text-blue-600 transition duration-200"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="text-black hover:text-blue-600 transition duration-200"
          >
            Contact
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
