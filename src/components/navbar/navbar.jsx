import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../sidebar/sidebar";
import { logOut } from "../../server/firebaseAuth";
import { toast } from "react-toastify";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      await logOut();
      toast.success("Logged out successfully!");
      navigate("/Login");
    } catch (error) {
      toast.error("Failed to log out: " + error.message);
    }
  };

  return (
    <div>
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <div className="nav flex items-center justify-between bg-slate-100 p-3">
        <button className="text-gray-600" onClick={toggleSidebar}>
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

        <Link to="/home" className="navLogo text-black ml-4 font-semibold text-xl">
          HRIS
        </Link>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Navbar;
