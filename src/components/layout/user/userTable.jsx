import React from "react";
import { Link } from "react-router-dom";

const UserTable = ({ users, handleEdit, handleDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-gray-100 text-primary shadow-md rounded-lg">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-4 text-left">ID</th>
            <th className="p-4 text-left">Name</th>
            <th className="p-4 text-left">Email</th>
            <th className="p-4 text-left">Role</th>
            <th className="p-4 text-left">Phone</th>
            <th className="p-4 text-left">Hire Date</th>
            <th className="p-4 text-left">Department</th>
            <th className="p-4 text-left">Position</th>
            <th className="p-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="p-4 text-primary">{user.userID}</td>
              <td className="p-4 text-primary">{user.name}</td>
              <td className="p-4 text-primary">{user.email}</td>
              <td className="p-4 text-primary">{user.role}</td>
              <td className="p-4 text-primary">{user.phone}</td>
              <td className="p-4 text-primary">{user.hireDate}</td>
              <td className="p-4 text-primary">{user.department}</td>
              <td className="p-4 text-primary">{user.position}</td>
              <td className="p-4 text-center">
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <button
                    onClick={() => handleEdit(user)}
                    className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                  <Link
                    to={`/Employee/${user.employeeID}`}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    View Employee
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
