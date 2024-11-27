import React from "react";

const UserForm = ({
  formData,
  handleChange,
  handleSubmit,
  handleFileChange,
  isEditing,
  departmentPositions,
}) => {
  const availablePositions = formData.department
    ? departmentPositions[formData.department]
    : [];

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-6 sm:mb-8"
    >
      <h2 className="text-lg sm:text-2xl font-medium text-gray-700 mb-4">
        {isEditing ? "Edit User" : "Add New User"}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Input fields */}
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          className="border rounded p-2 text-primary bg-gray-100"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="border rounded p-2 text-primary bg-gray-100"
        />
        <input
          type="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="border rounded p-2 text-primary bg-gray-100"
        />
        <input
          type="date"
          name="hireDate"
          value={formData.hireDate}
          onChange={handleChange}
          placeholder="Hire Date"
          className="border rounded p-2 text-primary bg-gray-100"
        />
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="border rounded p-2 text-primary bg-gray-100"
        >
          <option value="">Select Role</option>
          <option value="Admin">Admin</option>
          <option value="User">User</option>
          <option value="Manager">Manager</option>
        </select>
        {/* Department & Position */}
        <select
          name="department"
          value={formData.department}
          onChange={handleChange}
          className="border rounded p-2 text-primary bg-gray-100"
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
          onChange={handleChange}
          className="border rounded p-2 text-primary bg-gray-100"
          disabled={!formData.department}
        >
          <option value="">Select Position</option>
          {availablePositions.map((position) => (
            <option key={position} value={position}>
              {position}
            </option>
          ))}
        </select>
        {/* File Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="border rounded p-2 text-primary bg-gray-100"
        />
      </div>
      <button
        type="submit"
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full sm:w-auto"
      >
        {isEditing ? "Update User" : "Add User"}
      </button>
    </form>
  );
};

export default UserForm;
