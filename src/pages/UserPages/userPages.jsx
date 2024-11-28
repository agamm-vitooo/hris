import React, { useState, useEffect } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { FaEye, FaEyeSlash } from "react-icons/fa";
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
    address: "",
    emergencyContact: "",
    salary: "",
    bankAccount: "",
    status: "Active",
    password: "", // untuk password akun
  };  

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const [isEditing, setIsEditing] = useState(false);
  const [editingID, setEditingID] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterPosition, setFilterPosition] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const departmentPositions = {
    IT: ["Frontend Developer", "Backend Developer", "Fullstack Developer"],
    HR: ["HR Manager", "Recruiter"],
    Finance: ["Accountant", "Financial Analyst"],
    Marketing: ["Marketing Manager", "SEO Specialist"],
    Sales: ["Sales Representative", "Sales Manager"],
    Operations: ["Operations Manager", "Project Manager"],
  };

  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    fetchUsers();
  }, []);

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
      toast.error("Failed to fetch users.");
    }
  };

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "department" && { position: "" }),
    }));
  };  

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

  const handleAccountSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);

      if (user) {
        await addDoc(collection(db, "accounts"), {
          email: user.email,
          userId: user.uid,
          password: password,
        });
        toast.success("Account created successfully");
        setEmail('');
        setPassword('');
        setLoading(false);
      }
    } catch (error) {
      toast.error("Error creating account");
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    if (name === "filterDepartment") {
      setFilterDepartment(value);
      setFilterPosition("");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;
  
    setLoading(true);
  
    try {
      if (isEditing) {
        await updateDoc(doc(db, "users", editingID), formData);
        toast.success("User updated successfully!");
      } else {
        const { email, password, ...userData } = formData;
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
  
        if (user) {
          const newUser = {
            ...userData,
            userID: user.uid,
            email: user.email,
          };
          await addDoc(collection(db, "users"), newUser);
          await addDoc(collection(db, "accounts"), { email, password, userId: user.uid });
          toast.success("Account and user added successfully!");
        }
      }
  
      fetchUsers();
      resetForm();
    } catch (error) {
      console.error("Error saving user:", error);
      toast.error("Failed to save user.");
    } finally {
      setLoading(false);
    }
  };  

  const validateFields = () => {
    for (const key in formData) {
      if (!formData[key] && key !== "userID" && key !== "profilePicture") {
        toast.error(`Field "${key}" is required!`);
        return false;
      }
    }
    return true;
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "users", id));
      toast.success("User deleted successfully!");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user.");
    }
  };

  const handleEdit = (user) => {
    setIsEditing(true);
    setEditingID(user.id);
    setFormData(user);
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setIsEditing(false);
    setEditingID("");
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const departmentPositionsList = filterDepartment
    ? departmentPositions[filterDepartment]
    : Object.values(departmentPositions).flat();

  return (
    <div className="bg-gray-100 p-8 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">User & Account Management</h1>

      {/* User Management Form */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-lg sm:text-xl font-medium text-gray-700 mb-4">
          {isEditing ? "Edit User" : "Add User"}
        </h2>
        <form onSubmit={handleSubmit}>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <input
      type="text"
      name="name"
      value={formData.name}
      onChange={handleUserChange}
      placeholder="Name"
      className="p-2 w-full border rounded text-gray-700 bg-gray-100"
      required
    />
    <input
      type="email"
      name="email"
      value={formData.email}
      onChange={handleUserChange}
      placeholder="Email"
      className="p-2 w-full border rounded text-gray-700 bg-gray-100"
      required
    />
<select
  name="role"
  value={formData.role}
  onChange={handleUserChange}
  className="border rounded p-2 text-gray-700 bg-gray-100"
>
  <option value="">Select Role</option>
  <option value="Admin">Admin</option>
  <option value="User">User</option>
  <option value="Manager">Manager</option>
</select>

    <input
      type={passwordVisible ? "text" : "password"}
      name="password"
      value={formData.password}
      onChange={handleUserChange}
      placeholder="Password"
      className="p-2 w-full border rounded text-gray-700 bg-gray-100"
      required
    />
            <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleUserChange}
          placeholder="Address"
          className="border rounded p-2 text-primary bg-gray-100"
        />
                <input
          type="text"
          name="emergencyContact"
          value={formData.emergencyContact}
          onChange={handleUserChange}
          placeholder="Emergency Contact"
          className="border rounded p-2 text-primary bg-gray-100"
        />
        <input
          type="number"
          name="salary"
          value={formData.salary}
          onChange={handleUserChange}
          placeholder="Salary"
          className="border rounded p-2 text-primary bg-gray-100"
        />
        <input
          type="text"
          name="bankAccount"
          value={formData.bankAccount}
          onChange={handleUserChange}
          placeholder="Bank Account"
          className="border rounded p-2 text-primary bg-gray-100"
        />
        <select
          name="status"
          value={formData.status}
          onChange={handleUserChange}
          className="border rounded p-2 text-primary bg-gray-100"
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="On Leave">On Leave</option>
        </select>
    <span onClick={togglePasswordVisibility}>
      {passwordVisible ? <FaEyeSlash /> : <FaEye />}
    </span>
    <input
      type="text"
      name="phone"
      value={formData.phone}
      onChange={handleUserChange}
      placeholder="Phone"
      className="p-2 w-full border rounded text-gray-700 bg-gray-100"
    />
    <input
      type="date"
      name="hireDate"
      value={formData.hireDate}
      onChange={handleUserChange}
      placeholder="Hire Date"
      className="p-2 w-full border rounded text-gray-700 bg-gray-100"
    />
    <select
      name="department"
      value={formData.department}
      onChange={handleUserChange}
      className="p-2 w-full border rounded text-gray-700 bg-gray-100"
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
      onChange={handleUserChange}
      className="p-2 w-full border rounded text-gray-700 bg-gray-100"
      disabled={!formData.department}
    >
      <option value="">Select Position</option>
      {(departmentPositions[formData.department] || []).map((position) => (
        <option key={position} value={position}>
          {position}
        </option>
      ))}
    </select>
    <input
      type="file"
      accept="image/*"
      onChange={handleFileChange}
      className="mb-4 text-gray-700 bg-gray-100"
    />
  </div>
  <button type="submit" className="w-full bg-green-500 text-white py-2 rounded">
    {isEditing ? "Update User & Account" : "Add User & Account"}
  </button>
</form>
      </div>
            {/* Filters for User Management */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-lg sm:text-xl font-medium text-gray-700 mb-4">Filter Users</h2>
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
            {departmentPositionsList.map((position) => (
              <option key={position} value={position}>
                {position}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* User List */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
        <h2 className="text-lg sm:text-xl font-medium text-gray-700 mb-4">Users List</h2>
        <ul>
          {filteredUsers.map((user) => (
            <li key={user.id} className="flex justify-between items-center py-2 text-gray-800">
              <div>
                <span className="font-bold">{user.name}</span> - {user.position}
              </div>
              <div>
                <button
                  onClick={() => handleEdit(user)}
                  className="bg-blue-500 text-white py-1 px-3 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="bg-red-500 text-white py-1 px-3 rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <ToastContainer />
    </div>
  );
};

export default UserPages;
