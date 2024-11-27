import React from "react";
import { Link } from "react-router-dom";
import { logOut } from "../../server/firebaseAuth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      toast.success("Logged out successfully!");
      navigate("/");
    } catch (error) {
      toast.error("Failed to log out: " + error.message);
    }
  };

  return (
    <>
      {/* Overlay to close sidebar on outside click */}
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
          <Link
            to="/UserPages"
            className="block py-2.5 px-4 hover:bg-blue-700 hover:text-white transition"
          >
            Users
          </Link>
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
            to="/accountPages"
            className="block py-2.5 px-4 hover:bg-blue-700 hover:text-white transition"
          >
            Account
          </Link>
        </nav>
        {/* Centered Logout Button */}
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
