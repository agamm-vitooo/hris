import React, { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../sidebar/sidebar";
import logo from "../../assets/icon.png"; 

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
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
            to="/home"
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
