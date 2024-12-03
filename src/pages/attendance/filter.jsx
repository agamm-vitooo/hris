import React from "react";

const Filters = ({ dateFilter, setDateFilter, statusFilter, setStatusFilter }) => {
  return (
    <div className="flex space-x-4 mb-6">
      <div>
        <label htmlFor="dateFilter" className="block text-gray-700">
          Filter by Date:
        </label>
        <input
          type="date"
          id="dateFilter"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border p-2 rounded text-primary bg-gray-100"
        />
      </div>
      <div>
        <label htmlFor="statusFilter" className="block text-gray-700">
          Filter by Status:
        </label>
        <select
          id="statusFilter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border p-2 rounded text-primary bg-gray-100"
        >
          <option value="">All Statuses</option>
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
        </select>
      </div>
    </div>
  );
};

export default Filters;
