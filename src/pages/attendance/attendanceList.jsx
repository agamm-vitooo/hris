import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const AttendanceList = ({ filteredData, handleMarkAbsent }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleOpenModal = (location) => {
    setSelectedLocation(location);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLocation(null);
  };

  const defaultCoordinates = [0, 0]; // Default coordinates if location is empty

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-lg sm:text-xl font-medium text-gray-700 mb-4">
        User Attendance List
      </h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse text-primary bg-gray-100">
          <thead>
            <tr>
              <th className="border-b p-2 text-left">Name</th>
              <th className="border-b p-2 text-left">Date</th>
              <th className="border-b p-2 text-left">Status</th>
              <th className="border-b p-2 text-left">Location</th>
              <th className="border-b p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((attendance) => {
              const location = attendance.location
                ? attendance.location.split(",") // Extract latitude and longitude
                : [];
              const lat = parseFloat(location[0]) || 0; // Set latitude
              const lon = parseFloat(location[1]) || 0; // Set longitude

              return (
                <tr key={attendance.id}>
                  <td className="border-b p-2">{attendance.name}</td>
                  <td className="border-b p-2">{attendance.date}</td>
                  <td className="border-b p-2">{attendance.status}</td>
                  <td className="border-b p-2">
                    {/* Location */}
                    {attendance.location && (
                      <div>
                        <button
                          onClick={() => handleOpenModal({ lat, lon })}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          View Map
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="border-b p-2">
                    {attendance.status !== "Absent" && (
                      <button
                        onClick={() => handleMarkAbsent(attendance.id)}
                        className="bg-red-500 text-white p-2 rounded"
                      >
                        Mark Absent
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              &times; {/* Close button */}
            </button>
            <h3 className="text-lg font-medium text-gray-700 mb-4">Location on Map</h3>
            <MapContainer
              center={[selectedLocation.lat, selectedLocation.lon]}
              zoom={13}
              style={{ height: "300px", width: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[selectedLocation.lat, selectedLocation.lon]}>
                <Popup>{`Location: ${selectedLocation.lat}, ${selectedLocation.lon}`}</Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceList;
