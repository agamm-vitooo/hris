// LocationButton.jsx
import React from "react";
import clsx from "clsx";

const LocationButton = ({ handleGetLocation, error }) => (
  <div className="mb-4">
    <label className="block text-gray-700 mb-2">Location</label>
    <button
      type="button"
      onClick={handleGetLocation}
      className={clsx("border rounded p-2 w-full", {
        "bg-blue-500": !error,
        "bg-gray-500": error,
      })}
    >
      Get Current Location
    </button>
  </div>
);

export default LocationButton;
