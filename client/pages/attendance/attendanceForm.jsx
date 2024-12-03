// AttendanceForm.jsx
import React from "react";

const AttendanceForm = ({ date, setDate, status, setStatus, handleAttendanceSubmit }) => {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-6">
      <form onSubmit={handleAttendanceSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border rounded p-2 w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border rounded p-2 w-full"
          >
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </select>
        </div>

        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Submit Attendance
        </button>
      </form>
    </div>
  );
};

export default AttendanceForm;
