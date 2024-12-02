import React from "react";

const UserTables = ({ users, handleDelete, handleEdit }) => {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
      <h2 className="text-lg sm:text-xl font-medium text-gray-700 mb-4">Users List</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id} className="flex justify-between items-center py-2 text-gray-800">
            <div className="flex-1">
              <span className="font-bold">{user.name}</span> - {user.position}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(user)}
                className="bg-blue-500 text-white py-1 px-3 rounded"
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
  );
};

export default UserTables;
