import React, { useState, useEffect } from "react";
import UserForm from "../../components/layout/user/userForm";
import UserTable from "../../components/layout/user/userTable";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../server/firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserPages = () => {
  const initialFormState = {
    userID: "",
    role: "",
    name: "",
    email: "",
    phone: "",
    hireDate: "",
    department: "",
    position: "",
    profilePicture: "",
  };

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const [isEditing, setIsEditing] = useState(false);
  const [editingID, setEditingID] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterPosition, setFilterPosition] = useState("");

  const departmentPositions = {
    IT: ["Frontend Developer", "Backend Developer", "Fullstack Developer"],
    HR: ["HR Manager", "Recruiter"],
    Finance: ["Accountant", "Financial Analyst"],
    Marketing: ["Marketing Manager", "SEO Specialist"],
    Sales: ["Sales Representative", "Sales Manager"],
    Operations: ["Operations Manager", "Project Manager"],
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "department" && { position: "" }), // Reset position when department changes
    }));
  };

  // Handle file uploads for profile picture
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({ ...prev, profilePicture: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Validate all fields
  const validateFields = () => {
    for (const key in formData) {
      if (!formData[key] && key !== "userID" && key !== "profilePicture") {
        toast.error(`Field "${key}" is required!`);
        return false;
      }
    }
    return true;
  };

  // Handle form submission for adding or editing a user
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;

    try {
      if (isEditing) {
        await updateDoc(doc(db, "users", editingID), formData);
        toast.success("User updated successfully!");
      } else {
        const newUser = {
          ...formData,
          userID: Date.now().toString(), // Generate unique userID
        };
        await addDoc(collection(db, "users"), newUser);
        toast.success("User added successfully!");
      }
      fetchUsers();
      resetForm();
    } catch (error) {
      console.error("Error saving user:", error);
      toast.error("Failed to save user. Please try again.");
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData(initialFormState);
    setIsEditing(false);
    setEditingID("");
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

    if (name === "filterDepartment") {
      setFilterDepartment(value);
      setFilterPosition(""); // Reset position filter when department changes
    }

    if (name === "filterPosition") {
      setFilterPosition(value);
    }

    const filtered = users.filter(
      (user) =>
        (!value || user[name.replace("filter", "").toLowerCase()] === value) &&
        (!filterDepartment || user.department === filterDepartment) &&
        (!filterPosition || user.position === filterPosition)
    );
    setFilteredUsers(filtered);
  };

  const filterPositions = filterDepartment
    ? departmentPositions[filterDepartment]
    : Object.values(departmentPositions).flat();

  return (
    <div className="p-4 sm:p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl sm:text-4xl font-semibold text-gray-800 mb-4 sm:mb-6">
        User Management
      </h1>

      {/* Filters */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-lg sm:text-xl font-medium text-gray-700 mb-4">
          Filter Users
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            disabled={!filterDepartment}
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

      {/* User Form */}
      <UserForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleFileChange={handleFileChange}
        isEditing={isEditing}
        departmentPositions={departmentPositions}
      />

      {/* User Table */}
      <UserTable
        users={filteredUsers}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default UserPages;
