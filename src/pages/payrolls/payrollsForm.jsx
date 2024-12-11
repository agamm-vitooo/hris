import React from 'react';

const PayrollForm = ({ payrollData, setPayrollData, handlePayrollSubmit, handleDeletePayroll, editingPayroll }) => {
  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold text-primary">Edit Payroll</h3>
      <form onSubmit={handlePayrollSubmit}>
        <div className="mb-4">
          <label className="block text-lg mb-2 text-primary">Basic Salary</label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded bg-gray-100 text-primary"
            value={payrollData.basicSalary}
            onChange={(e) => setPayrollData({ ...payrollData, basicSalary: e.target.value })}
          />
        </div>

        <h3 className="text-lg font-semibold mb-2 text-primary">Tunjangan</h3>
        {/* Add more inputs for allowances, deductions, etc. */}
        
        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
          >
            {editingPayroll ? 'Update Payroll' : 'Save Payroll'}
          </button>
          <button
            type="button"
            onClick={handleDeletePayroll}
            className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
          >
            Delete Payroll
          </button>
        </div>
      </form>
    </div>
  );
};

export default PayrollForm;
