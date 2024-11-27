import React from "react";

const EmployeeTable = ({ employees, handleEdit, handleDelete }) => {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
      <h2 className="text-lg sm:text-xl font-medium text-gray-700 mb-4">
        Employee List
      </h2>

      {/* Table for larger screens */}
      <div className="hidden sm:block">
        <table className="w-full border-collapse bg-gray-100 text-left text-gray-700">
          <thead>
            <tr>
              <th className="border p-2">#</th>
              <th className="border p-2">Employee ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Address</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.length > 0 ? (
              employees.map((employee, index) => (
                <tr key={employee.id} className="hover:bg-gray-200">
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">{employee.employeeID}</td>
                  <td className="border p-2">{employee.userName || "N/A"}</td>
                  <td className="border p-2">{employee.userEmail || "N/A"}</td>
                  <td className="border p-2">{employee.address || "N/A"}</td>
                  <td className="border p-2">{employee.status || "N/A"}</td>
                  <td className="border p-2 space-x-2">
                    <button
                      onClick={() => handleEdit(employee)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(employee.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="border p-2 text-center">
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Cards for smaller screens */}
      <div className="sm:hidden">
        {employees.length > 0 ? (
          employees.map((employee, index) => (
            <div
              key={employee.id}
              className="mb-4 p-4 border rounded-lg bg-gray-50 shadow-sm text-gray-700"
            >
              <p className="text-sm font-medium">
                <span className="font-semibold">#{index + 1}</span>
              </p>
              <p className="text-sm">
                <span className="font-semibold">Employee ID:</span>{" "}
                {employee.employeeID}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Name:</span>{" "}
                {employee.userName || "N/A"}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Email:</span>{" "}
                {employee.userEmail || "N/A"}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Address:</span>{" "}
                {employee.address || "N/A"}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Status:</span>{" "}
                {employee.status || "N/A"}
              </p>
              <div className="mt-2 space-x-2">
                <button
                  onClick={() => handleEdit(employee)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(employee.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">No employees found.</p>
        )}
      </div>
    </div>
  );
};

export default EmployeeTable;
