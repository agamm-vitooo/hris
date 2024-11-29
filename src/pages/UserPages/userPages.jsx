import React, { useState, useEffect } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import UserForm from '../../components/layout/user/userForm';
import UserTables from '../../components/layout/user/userTable';
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
    password: "",
  };

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const [isEditing, setIsEditing] = useState(false);
  const [editingID, setEditingID] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterPosition, setFilterPosition] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleUserSubmit = async (formData, isEditing, editingID) => {
    setLoading(true);
    try {
      if (isEditing) {
        await updateDoc(doc(db, "users", editingID), formData);
        toast.success("User updated successfully!");
      } else {
        const { email, password, ...userData } = formData;
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        if (user) {
          const newUser = { ...userData, userID: user.uid, email: user.email };
          await addDoc(collection(db, "users"), newUser);
          await addDoc(collection(db, "accounts"), { email, password, userId: user.uid });
          toast.success("Account and user added successfully!");
        }
      }
      fetchUsers();
      resetForm();
    } catch (error) {
      toast.error("Failed to save user.");
      console.error("Error saving user:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setIsEditing(false);
    setEditingID("");
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "users", id));
      toast.success("User deleted successfully!");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to delete user.");
      console.error("Error deleting user:", error);
    }
  };

  const departmentPositions = {
    IT: ["Frontend Developer", "Backend Developer", "Fullstack Developer"],
    HR: ["HR Manager", "Recruiter"],
    Finance: ["Accountant", "Financial Analyst"],
    Marketing: ["Marketing Manager", "SEO Specialist"],
    Sales: ["Sales Representative", "Sales Manager"],
    Operations: ["Operations Manager", "Project Manager"],
  };

  const departmentPositionsList = filterDepartment
    ? departmentPositions[filterDepartment]
    : Object.values(departmentPositions).flat();

  return (
    <div className="bg-gray-100 p-8 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">User & Account Management</h1>

      <UserForm
        formData={formData}
        setFormData={setFormData}
        isEditing={isEditing}
        handleUserSubmit={handleUserSubmit}
        departmentPositions={departmentPositions}
        loading={loading}
      />

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

      <UserTables
        users={filteredUsers}
        handleDelete={handleDelete}
        handleEdit={setFormData}
      />

      <ToastContainer />
    </div>
  );
};

export default UserPages;
