import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <>
      {/* Overlay to close sidebar on outside click */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar} // Close sidebar when overlay is clicked
        ></div>
      )}
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 w-64 z-50`}
      >
        <div className="p-4 text-lg font-bold bg-gray-900">
          HRIS Dashboard
          <button
            onClick={toggleSidebar}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
          >
            ✕
          </button>
        </div>
        <nav className="mt-4">
          <Link
            to="/UserPages"
            className="block py-2.5 px-4 hover:bg-gray-700 transition"
          >
            Users
          </Link>
          <Link
            to="/employees"
            className="block py-2.5 px-4 hover:bg-gray-700 transition"
          >
            Employees
          </Link>
          <Link
            to="/attendance"
            className="block py-2.5 px-4 hover:bg-gray-700 transition"
          >
            Attendance
          </Link>
          <Link
            to="/payrolls"
            className="block py-2.5 px-4 hover:bg-gray-700 transition"
          >
            Payrolls
          </Link>
          <Link
            to="/leave-requests"
            className="block py-2.5 px-4 hover:bg-gray-700 transition"
          >
            Leave Requests
          </Link>
          <Link
            to="/tasks"
            className="block py-2.5 px-4 hover:bg-gray-700 transition"
          >
            Tasks
          </Link>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
