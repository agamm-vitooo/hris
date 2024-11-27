import React from "react";

const EmployeeForm = ({ formData, handleChange, handleSubmit, isEditing }) => {
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white text-gray-800 p-4 sm:p-6 rounded-lg shadow-md mb-6"
    >
      <h2 className="text-lg sm:text-xl font-medium mb-4">
        {isEditing ? "Edit Employee" : "Add New Employee"}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="text"
          name="employeeID"
          value={formData.employeeID}
          onChange={handleChange}
          placeholder="Employee ID"
          className="border rounded p-2 w-full text-primary bg-gray-100"
          required
          disabled={isEditing} // Disable editing of employeeID during updates
        />
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
          className="border rounded p-2 w-full text-primary bg-gray-100"
        />
        <input
          type="date"
          name="birthDate"
          value={formData.birthDate}
          onChange={handleChange}
          placeholder="Birth Date"
          className="border rounded p-2 w-full text-primary bg-gray-100"
        />
        <input
          type="text"
          name="emergencyContact"
          value={formData.emergencyContact}
          onChange={handleChange}
          placeholder="Emergency Contact"
          className="border rounded p-2 w-full text-primary bg-gray-100"
        />
        <input
          type="number"
          name="salary"
          value={formData.salary}
          onChange={handleChange}
          placeholder="Salary"
          className="border rounded p-2 w-full text-primary bg-gray-100"
        />
        <input
          type="text"
          name="bankAccount"
          value={formData.bankAccount}
          onChange={handleChange}
          placeholder="Bank Account"
          className="border rounded p-2 w-full text-primary bg-gray-100"
        />
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="border rounded p-2 w-full text-primary bg-gray-100"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="on-leave">On Leave</option>
        </select>
        <input
          type="text"
          name="managerID"
          value={formData.managerID}
          onChange={handleChange}
          placeholder="Manager ID"
          className="border rounded p-2 w-full text-primary bg-gray-100"
        />
      </div>
      <button
        type="submit"
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        {isEditing ? "Update Employee" : "Add Employee"}
      </button>
    </form>
  );
};

export default EmployeeForm;
