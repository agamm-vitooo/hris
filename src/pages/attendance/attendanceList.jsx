import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import PropTypes from "prop-types";

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

  const defaultCoordinates = [0, 0];

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
            {(Array.isArray(filteredData) && filteredData.length > 0) ? (
              filteredData.map((attendance) => {
                let lat = 0;
                let lon = 0;

                // Check if location is a string or an object
                if (typeof attendance.location === "string") {
                  const location = attendance.location.split(", ");
                  lat = parseFloat(location[0]) || 0;
                  lon = parseFloat(location[1]) || 0;
                } else if (typeof attendance.location === "object" && attendance.location.lat && attendance.location.lon) {
                  lat = attendance.location.lat;
                  lon = attendance.location.lon;
                }

                return (
                  <tr key={attendance.id}>
                    <td className="border-b p-2">{attendance.name}</td>
                    <td className="border-b p-2">{attendance.date}</td>
                    <td className="border-b p-2">{attendance.status}</td>
                    <td className="border-b p-2">
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
              })
            ) : (
              <tr>
                <td colSpan="5" className="border-b p-2 text-center text-gray-500">
                  No attendance records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && selectedLocation && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              &times;
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

AttendanceList.propTypes = {
  filteredData: PropTypes.array.isRequired,
  handleMarkAbsent: PropTypes.func.isRequired,
};

AttendanceList.defaultProps = {
  filteredData: [],
};

export default AttendanceList;
