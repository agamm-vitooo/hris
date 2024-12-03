// PhotoUpload.jsx
import React from "react";

const PhotoUpload = ({ handlePhotoChange }) => (
  <div className="mb-4">
    <label className="block text-gray-700 mb-2">Upload Photo</label>
    <input
      type="file"
      onChange={handlePhotoChange}
      className="border rounded p-2 w-full"
    />
  </div>
);

export default PhotoUpload;
