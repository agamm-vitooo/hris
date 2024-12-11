import React from 'react';

const FilterSection = ({ roles, departments, onFilterChange }) => {
  return (
    <div className="mb-4 p-4 border border-gray-200 rounded-lg">
      <h2 className="text-xl font-semibold mb-3">Filter</h2>
      <div className="space-y-4">
        {/* Filter Role */}
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
          <select
            id="role"
            className="mt-1 bg-gray-100 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            onChange={(e) => onFilterChange('role', e.target.value)}
          >
            <option value="">All Roles</option>
            {roles.map((role, index) => (
              <option key={index} value={role}>{role}</option>
            ))}
          </select>
        </div>

        {/* Filter Department */}
        <div>
          <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
          <select
            id="department"
            className="mt-1 bg-gray-100 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            onChange={(e) => onFilterChange('department', e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map((department, index) => (
              <option key={index} value={department}>{department}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
