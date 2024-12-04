import React from "react";

const AttendanceList = ({ filteredData, handleMarkAbsent }) => {
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
              <th className="border-b p-2 text-left">Location</th> {/* Added Location Column */}
              <th className="border-b p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((attendance) => (
              <tr key={attendance.id}>
                <td className="border-b p-2">{attendance.name}</td>
                <td className="border-b p-2">{attendance.date}</td>
                <td className="border-b p-2">{attendance.status}</td>
                <td className="border-b p-2">{attendance.location}</td> {/* Display Location */}
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceList;
