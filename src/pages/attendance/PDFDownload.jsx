import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { AttendancePDF } from "./AttendancePDF";

const PDFDownload = ({ dateFilter, filteredData }) => {
  return (
    <div className="mb-4">
      <PDFDownloadLink
        document={<AttendancePDF dateFilter={dateFilter} filteredData={filteredData} />}
        fileName={`attendance_report_${dateFilter || "all_dates"}.pdf`}
      >
        {({ loading }) =>
          loading ? (
            <button className="bg-gray-500 text-white p-2 rounded">
              Generating PDF...
            </button>
          ) : (
            <button className="bg-blue-500 text-white p-2 rounded">
              Download PDF
            </button>
          )
        }
      </PDFDownloadLink>
    </div>
  );
};

export default PDFDownload;
