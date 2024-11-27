import React, { useState, useEffect } from "react";
import EmployeeForm from "../components/layout/employee/employee.form";
import EmployeeTable from "../components/layout/employee/employee.table";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../server/firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EmployeePages = () => {
  const initialFormState = {
    employeeID: "",
    address: "",
    birthDate: "",
    emergencyContact: "",
    salary: "",
    bankAccount: "",
    status: "active", // Default status
    managerID: "",
  };

  const [employees, setEmployees] = useState([]);
  const [users, setUsers] = useState([]); // Data dari koleksi users
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const [isEditing, setIsEditing] = useState(false);
  const [editingID, setEditingID] = useState("");

  useEffect(() => {
    fetchUsers(); // Memuat data users untuk koneksi
    fetchEmployees(); // Memuat data employees
  }, []);

  // Fetch users
  const fetchUsers = async () => {
    try {
      const userCollection = collection(db, "users");
      const userSnapshot = await getDocs(userCollection);
      const userList = userSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(userList);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users.");
    }
  };

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      const employeeCollection = collection(db, "employees");
      const employeeSnapshot = await getDocs(employeeCollection);
      const employeeList = employeeSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEmployees(employeeList);
      setFilteredEmployees(employeeList);
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error("Failed to fetch employees.");
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validate fields
  const validateFields = () => {
    for (const key in formData) {
      if (!formData[key] && key !== "managerID") {
        toast.error(`Field "${key}" is required!`);
        return false;
      }
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;

    try {
      if (isEditing) {
        await updateDoc(doc(db, "employees", editingID), formData);
        toast.success("Employee updated successfully!");
      } else {
        await addDoc(collection(db, "employees"), formData);
        toast.success("Employee added successfully!");
      }
      fetchEmployees();
      resetForm();
    } catch (error) {
      console.error("Error saving employee:", error);
      toast.error("Failed to save employee.");
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData(initialFormState);
    setIsEditing(false);
    setEditingID("");
  };

  // Handle deleting an employee
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "employees", id));
      toast.success("Employee deleted successfully!");
      fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.error("Failed to delete employee.");
    }
  };

  // Handle editing an employee
  const handleEdit = (employee) => {
    setIsEditing(true);
    setEditingID(employee.id);
    setFormData(employee);
  };

  // Generate employee list with connected user data
  const connectedEmployees = employees.map((employee) => {
    const user = users.find((u) => u.userID === employee.employeeID);
    return {
      ...employee,
      userName: user ? user.name : "Unknown",
      userEmail: user ? user.email : "Unknown",
    };
  });

  return (
    <div className="p-4 sm:p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl sm:text-4xl font-semibold text-gray-800 mb-4 sm:mb-6">
        Employee Management
      </h1>

      {/* Employee Form */}
      <EmployeeForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        isEditing={isEditing}
      />

      {/* Employee Table */}
      <EmployeeTable
        employees={connectedEmployees}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default EmployeePages;
