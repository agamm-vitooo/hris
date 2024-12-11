import React from 'react';

const UsersList = ({ filteredUsers, handleSelectUser }) => {
  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold text-primary">Users List</h3>
      <table className="w-full table-auto mt-4 text-primary">
        <thead>
          <tr>
            <th className="py-2 px-4 border">Name</th>
            <th className="py-2 px-4 border">Role</th>
            <th className="py-2 px-4 border">Department</th>
            <th className="py-2 px-4 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td className="py-2 px-4 border">{user.name}</td>
              <td className="py-2 px-4 border">{user.role}</td>
              <td className="py-2 px-4 border">{user.department}</td>
              <td className="py-2 px-4 border">
              <button
                onClick={() => {
                  console.log("Edit button clicked for", user.name);
                  handleSelectUser(user);
                }}
                className="bg-blue-600 text-white py-1 px-4 rounded-lg hover:bg-blue-700"
              >
                Edit Payroll
              </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersList;
