import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../server/firebase";

const EmployeePages = () => {
  const { userID } = useParams(); // Ambil userID dari URL
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const employeeDoc = await getDoc(doc(db, "employees", userID));
        if (employeeDoc.exists()) {
          setEmployee(employeeDoc.data());
        } else {
          toast.error("Employee data not found.");
        }
      } catch (error) {
        console.error("Error fetching employee data:", error);
        toast.error("Error fetching employee data.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [userID]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!employee) {
    return <div>No employee data found.</div>;
  }

  return (
    <div className="p-4 sm:p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl sm:text-4xl font-semibold text-gray-800 mb-4 sm:mb-6">Employee Details</h1>
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
        <p><strong>Name:</strong> {employee.name}</p>
        <p><strong>Address:</strong> {employee.address}</p>
        <p><strong>Birth Date:</strong> {employee.birthDate}</p>
        <p><strong>Salary:</strong> ${employee.salary}</p>
        <p><strong>Status:</strong> {employee.status}</p>
        <p><strong>Manager:</strong> {employee.managerID}</p>
      </div>
    </div>
  );
};

export default EmployeePages;
