import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../server/firebase";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserPages = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [formData, setFormData] = useState({
    role: "",
    name: "",
    email: "",
    phone: "",
    hireDate: "",
    department: "",
    position: "",
    profilePicture: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingID, setEditingID] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterPosition, setFilterPosition] = useState("");
  const navigate = useNavigate();

  // Department and Position Data
  const departmentPositions = {
    IT: ["Frontend Developer", "Backend Developer", "Fullstack Developer", "UI/UX Designer"],
    HR: ["HR Manager", "Recruiter"],
    Finance: ["Akuntan", "Financial Analyst"],
  };

  // Fetch users from Firestore
  const fetchUsers = async () => {
    try {
      const userCollection = collection(db, "users");
      const userSnapshot = await getDocs(userCollection);
      const userList = userSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(userList);
      setFilteredUsers(userList);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users. Please try again.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "department") {
      setFormData({ ...formData, department: value, position: "" }); // Reset position when department changes
    }
  };

  // Handle file uploads for profile picture
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData({ ...formData, profilePicture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission for adding or editing a user
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.role || !formData.position) {
      toast.error("All fields are required!");
      return;
    }

    try {
      if (isEditing) {
        await updateDoc(doc(db, "users", editingID), formData);
        toast.success("User updated successfully!");
      } else {
        await addDoc(collection(db, "users"), formData);
        toast.success("User added successfully!");
      }
      fetchUsers();
      setFormData({
        role: "",
        name: "",
        email: "",
        phone: "",
        hireDate: "",
        department: "",
        position: "",
        profilePicture: "",
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving user:", error);
      toast.error("Failed to save user. Please try again.");
    }
  };

  // Handle deleting a user
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "users", id));
      toast.success("User deleted successfully!");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user. Please try again.");
    }
  };

  // Handle editing a user
  const handleEdit = (user) => {
    setIsEditing(true);
    setEditingID(user.id);
    setFormData(user);
  };

  // Handle filtering users
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === "filterDepartment") setFilterDepartment(value);
    if (name === "filterPosition") setFilterPosition(value);

    const filtered = users.filter(
      (user) =>
        (!filterDepartment || user.department === filterDepartment) &&
        (!filterPosition || user.position === filterPosition)
    );
    setFilteredUsers(filtered);
  };

  // Get positions based on selected department
  const availablePositions = formData.department
    ? departmentPositions[formData.department]
    : [];

  const filterPositions = filterDepartment
    ? departmentPositions[filterDepartment]
    : Object.values(departmentPositions).flat();

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-semibold text-gray-800 mb-6">User Management</h1>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-medium text-gray-700 mb-4">
          {isEditing ? "Edit User" : "Add New User"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="border rounded p-2 text-primary bg-gray-100"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="border rounded p-2 text-primary bg-gray-100"
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="border rounded p-2 text-primary bg-gray-100"
          >
            <option value="">Select Role</option>
            <option value="Admin">Admin</option>
            <option value="User">User</option>
            <option value="Manager">Manager</option>
          </select>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="border rounded p-2 text-primary bg-gray-100"
          />
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="border rounded p-2 text-primary bg-gray-100"
          >
            <option value="">Select Department</option>
            {Object.keys(departmentPositions).map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          <select
            name="position"
            value={formData.position}
            onChange={handleChange}
            className="border rounded p-2 text-primary bg-gray-100"
            disabled={!formData.department}
          >
            <option value="">Select Position</option>
            {availablePositions.map((position) => (
              <option key={position} value={position}>
                {position}
              </option>
            ))}
          </select>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border rounded p-2 text-primary bg-gray-100"
          />
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {isEditing ? "Update User" : "Add User"}
        </button>
      </form>

      {/* Filter Section */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-700">User List</h3>
        <div className="flex gap-4">
          <select
            name="filterDepartment"
            value={filterDepartment}
            onChange={handleFilterChange}
            className="border rounded p-2 text-primary bg-gray-100"
          >
            <option value="">All Departments</option>
            {Object.keys(departmentPositions).map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          <select
            name="filterPosition"
            value={filterPosition}
            onChange={handleFilterChange}
            className="border rounded p-2 text-primary bg-gray-100"
          >
            <option value="">All Positions</option>
            {filterPositions.map((position) => (
              <option key={position} value={position}>
                {position}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Section */}
      <table className="w-full bg-gray-100 text-primary shadow-md rounded-lg">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-4 text-left">Name</th>
            <th className="p-4 text-left">Email</th>
            <th className="p-4 text-left">Role</th>
            <th className="p-4 text-left">Department</th>
            <th className="p-4 text-left">Position</th>
            <th className="p-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="p-4 text-blue-500 cursor-pointer" onClick={() => navigate(`/User/${user.id}`)}>
                {user.name}
              </td>
              <td className="p-4 text-primary">{user.email}</td>
              <td className="p-4 text-primary">{user.role}</td>
              <td className="p-4 text-primary">{user.department}</td>
              <td className="p-4 text-primary">{user.position}</td>
              <td className="p-4 text-center">
                <button
                  onClick={() => handleEdit(user)}
                  className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default UserPages;
