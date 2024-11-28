import React from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const UserForm = ({
  formData,
  handleUserChange,
  handleSubmit,
  handleFileChange,
  isEditing,
  togglePasswordVisibility,
  passwordVisible,
  departmentPositions,
}) => {
  return (
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
  );
};

export default UserForm;
