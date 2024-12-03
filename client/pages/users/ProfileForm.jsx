import React, { useState } from "react";

const ProfileForm = ({ formData, handleChange, handleSubmit, loading }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    if (name === "newPassword") {
      setNewPassword(value);
    } else if (name === "confirmPassword") {
      setConfirmPassword(value);
    }
  };

  const isPasswordValid = newPassword === confirmPassword;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-lg font-medium text-gray-700">Name</label>
        <input
          id="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-2 p-3 w-full border bg-gray-100 text-gray-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-lg font-medium text-gray-700">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          disabled
          className="mt-2 p-3 w-full bg-gray-100 text-gray-800 border border-gray-300 rounded-lg cursor-not-allowed"
        />
      </div>

      {/* Phone Field */}
      <div>
        <label htmlFor="phone" className="block text-lg font-medium text-gray-700">Phone</label>
        <input
          id="phone"
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          className="mt-2 p-3 w-full bg-gray-100 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Department Field */}
      <div>
        <label htmlFor="department" className="block text-lg font-medium text-gray-700">Department</label>
        <input
          id="department"
          type="text"
          name="department"
          value={formData.department}
          onChange={handleChange}
          required
          className="mt-2 p-3 w-full border bg-gray-100 text-gray-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Position Field */}
      <div>
        <label htmlFor="position" className="block text-lg font-medium text-gray-700">Position</label>
        <input
          id="position"
          type="text"
          name="position"
          value={formData.position}
          onChange={handleChange}
          required
          className="mt-2 p-3 w-full border bg-gray-100 text-gray-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* New Password Field */}
      <div>
        <label htmlFor="newPassword" className="block text-lg font-medium text-gray-700">New Password</label>
        <input
          id="newPassword"
          type="password"
          name="newPassword"
          value={newPassword}
          onChange={handlePasswordChange}
          className="mt-2 p-3 w-full border bg-gray-100 text-gray-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Confirm Password Field */}
      <div>
        <label htmlFor="confirmPassword" className="block text-lg font-medium text-gray-700">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={handlePasswordChange}
          className="mt-2 p-3 w-full border bg-gray-100 text-gray-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-center text-primary">
        <button
          type="submit"
          disabled={!isPasswordValid || loading}
          className="w-full py-3 bg-indigo-800 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-300"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;
