import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const Reports = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/reports", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setReports(res.data);
      } catch (err) {
        toast.error(err.response.data);
      }
    };
    fetchReports();
  }, []);

  return (
    <div className="container mt-5">
      <h1>Attendance Reports</h1>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>User</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report._id}>
              <td>{report.user.name}</td>
              <td>{new Date(report.date).toLocaleDateString()}</td>
              <td>{report.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Reports;
