import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const UserReport = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [leaveRecords, setLeaveRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");

  const fetchUserData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const userRes = await axios.get("http://localhost:5000/api/auth/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserEmail(userRes.data.email);
      return userRes.data.email;
    } catch (err) {
      toast.error(
        "Error fetching user data:",
        err.response?.data || err.message
      );
      return null;
    }
  }, []);

  const fetchRecords = useCallback(async (email) => {
    if (!email) return;

    try {
      const token = localStorage.getItem("token");

      // Fetch attendance records
      const attendanceRes = await axios.get(
        `http://localhost:5000/api/attendance/user?email=${email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Fetch leave records
      const leaveRes = await axios.get(
        `http://localhost:5000/api/leaveRequest/user?email=${email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAttendanceRecords(attendanceRes.data);
      setLeaveRecords(leaveRes.data);
    } catch (err) {
      toast.error("Error fetching records:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshData = useCallback(async () => {
    setLoading(true);
    const email = await fetchUserData();
    await fetchRecords(email);
  }, [fetchUserData, fetchRecords]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // This function can be called when the user updates their profile
  const handleProfileUpdate = () => {
    refreshData();
  };

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <h1 className="mb-6 text-2xl font-bold text-center text-gray-800">
        Attendance & Leave Records
      </h1>
      <button
        onClick={handleProfileUpdate}
        className="px-4 py-2 mb-4 text-white transition-colors bg-blue-500 rounded hover:bg-blue-600">
        Refresh Data
      </button>
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="w-12 h-12 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Attendance Records */}
          <section>
            <h2 className="mb-4 text-xl font-semibold text-gray-700">
              Attendance Records
            </h2>
            {attendanceRecords.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full bg-white rounded-lg shadow-md">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-left text-gray-700">
                        Date
                      </th>
                      <th className="px-4 py-2 text-left text-gray-700">
                        Time
                      </th>
                      <th className="px-4 py-2 text-left text-gray-700">
                        User
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceRecords.map((record) => (
                      <tr key={record._id} className="border-t">
                        <td className="px-4 py-2">
                          {new Date(record.date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2">{record.time}</td>
                        <td className="px-4 py-2">
                          {record.user.name} ({record.user.email})
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-700">No attendance records found.</p>
            )}
          </section>

          {/* Leave Records */}
          <section>
            <h2 className="mb-4 text-xl font-semibold text-gray-700">
              Leave Records
            </h2>
            {leaveRecords.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full bg-white rounded-lg shadow-md">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-left text-gray-700">
                        From Date
                      </th>
                      <th className="px-4 py-2 text-left text-gray-700">
                        To Date
                      </th>
                      <th className="px-4 py-2 text-left text-gray-700">
                        Reason
                      </th>
                      <th className="px-4 py-2 text-left text-gray-700">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaveRecords.map((record) => (
                      <tr key={record._id} className="border-t">
                        <td className="px-4 py-2">
                          {new Date(record.fromDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2">
                          {new Date(record.toDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2">{record.reason}</td>
                        <td className="px-4 py-2">
                          <span
                            className={`font-semibold ${
                              record.status === "Accepted"
                                ? "text-green-500"
                                : record.status === "Rejected"
                                ? "text-red-500"
                                : "text-yellow-500"
                            }`}>
                            {record.status || "Pending"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-700">No leave records found.</p>
            )}
          </section>
        </div>
      )}
    </div>
  );
};

export default UserReport;
