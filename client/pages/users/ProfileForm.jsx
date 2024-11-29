import React, { useState, useEffect } from 'react';

const ProfileForm = ({ userData, isEditing, handleUpdateProfile, handleEditToggle, loading }) => {
  const [formData, setFormData] = useState({ ...userData });

  useEffect(() => {
    setFormData({ ...userData });
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUpdateProfile(formData);
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-6">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="p-2 w-full border rounded text-gray-700 bg-gray-100"
            disabled={!isEditing}
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="p-2 w-full border rounded text-gray-700 bg-gray-100"
            disabled={!isEditing}
            required
          />
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="p-2 w-full border rounded text-gray-700 bg-gray-100"
            disabled={!isEditing}
          />
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
            className="p-2 w-full border rounded text-gray-700 bg-gray-100"
            disabled={!isEditing}
          />
        </div>

        <div className="flex justify-between mt-4">
          {isEditing ? (
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Save Changes'}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleEditToggle}
              className="bg-yellow-500 text-white py-2 px-4 rounded"
            >
              Edit Profile
            </button>
          )}

          {isEditing && (
            <button
              type="button"
              onClick={handleEditToggle}
              className="bg-gray-500 text-white py-2 px-4 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
