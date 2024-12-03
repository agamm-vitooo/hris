import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";

const UserForm = ({ formData, setFormData, isEditing, handleUserSubmit, departmentPositions, loading, onCancel }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "department" && { position: "" }),
    }));
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-lg sm:text-xl font-medium text-gray-700 mb-4">
        {isEditing ? "Edit User" : "Add User"}
      </h2>
      <form onSubmit={(e) => { e.preventDefault(); handleUserSubmit(formData, isEditing, formData.userID); }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Input Fields */}
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
            className="p-2 w-full border rounded text-gray-700 bg-gray-100"
          >
            <option value="">Select Role</option>
            <option value="Admin">Admin</option>
            <option value="User">User</option>
          </select>
          <div className="relative">
            <input
              type={passwordVisible ? "text" : "password"}
              name="password"
              value={formData.password || ""}
              onChange={handleUserChange}
              placeholder="Password"
              className="p-2 w-full border rounded text-gray-700 bg-gray-100"
            />
            <span 
              onClick={togglePasswordVisibility}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
            >
              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Other Fields */}
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

          <input type="file" accept="image/*" className="mb-4 text-gray-700 bg-gray-100" />
        </div>

        {/* Flex container for buttons */}
        <div className="flex justify-end mt-4">
          {/* Submit button */}
          <button 
            type="submit" 
            className="w-full bg-green-500 text-white py-2 rounded"
          >
            {isEditing ? "Update User & Account" : "Add User & Account"}
          </button>

          {/* Cancel button */}
          <button 
            type="button"
            onClick={onCancel}  // Fungsi untuk cancel (reset form atau kembali)
            className="ml-4 w-12 h-12 bg-red-600 text-white rounded-md flex items-center justify-center"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
