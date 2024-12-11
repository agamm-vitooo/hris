import React from 'react';

const FilterSection = ({ roles, departments, selectedRole, selectedDepartment, setSelectedRole, setSelectedDepartment }) => {
  return (
    <div className="mb-6">
      <div className="flex gap-4">
        <div className="w-1/4">
          <label className="block text-lg mb-2 text-primary">Filter by Role</label>
          <select
            className="w-full p-2 border border-gray-300 rounded bg-gray-100 text-primary"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="">Select Role</option>
            {roles.map((role, index) => (
              <option key={index} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        <div className="w-1/4">
          <label className="block text-lg mb-2 text-primary">Filter by Department</label>
          <select
            className="w-full p-2 border border-gray-300 rounded bg-gray-100 text-primary"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option value="">Select Department</option>
            {departments.map((department, index) => (
              <option key={index} value={department}>
                {department}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
