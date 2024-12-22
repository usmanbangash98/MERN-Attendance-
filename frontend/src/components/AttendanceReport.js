// this component will display all the users attendances
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AttendanceReport = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // Convert time to 12-hour format (with AM/PM)
  const convertTo12Hour = (time) => {
    const [hour, minute] = time.split(":").map(Number);
    const period = hour >= 12 ? "PM" : "AM";
    const adjustedHour = hour % 12 || 12; // Convert 0 to 12 for midnight
    return `${adjustedHour}:${minute < 10 ? `0${minute}` : minute} ${period}`;
  };

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Token not found");
          throw new Error("No token found");
        }

        // Fetch all attendance records for admin
        const res = await axios.get("http://localhost:5000/api/attendance", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAttendanceRecords(res.data);
        setLoading(false);
      } catch (err) {
        toast.error(
          "Error fetching attendance records:",
          err.response?.data || err.message
        );
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  return (
    <div className="max-w-6xl p-4 mx-auto">
      <h1 className="mb-6 text-2xl font-bold text-center text-gray-800">
        Attendance Records
      </h1>
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="w-12 h-12 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : attendanceRecords.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse table-auto">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 border">Date</th>
                <th className="px-4 py-2 border">Time</th>
                <th className="px-4 py-2 border">User</th>
                <th className="px-4 py-2 border">Email</th>
              </tr>
            </thead>
            <tbody>
              {attendanceRecords.map((record) => (
                <tr key={record._id} className="odd:bg-white even:bg-gray-100">
                  <td className="px-4 py-2 border">
                    {new Date(record.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 border">
                    {convertTo12Hour(record.time)}
                  </td>
                  <td className="px-4 py-2 border">{record.user.name}</td>
                  <td className="px-4 py-2 border">{record.user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center text-gray-700">
          No attendance records found.
        </div>
      )}
    </div>
  );
};

export default AttendanceReport;
