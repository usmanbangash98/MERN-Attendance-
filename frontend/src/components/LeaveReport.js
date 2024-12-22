// admin can either accept or reqest the submited leave requests
// this is an admin panel component
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const LeaveReport = () => {
  const [leaveRecords, setLeaveRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaveRecords = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Token not found in localStorage");
          throw new Error("No token found");
        }

        console.log("Token being used:", token); // Log token for debugging

        // Fetch all leave records for admin
        const res = await axios.get("http://localhost:5000/api/leaveRequest", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Leave records fetched:", res.data); // Log fetched records for debugging
        setLeaveRecords(res.data);
        setLoading(false);
      } catch (err) {
        toast.error(
          "Error fetching leave records:",
          err.response?.data || err.message
        );
        setLoading(false);
      }
    };
    fetchLeaveRecords();
  }, []);

  // Function to update the leave request status
  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:5000/api/leaveRequest/${id}`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Update the UI with the new status
      setLeaveRecords((prevRecords) =>
        prevRecords.map((record) =>
          record._id === id ? { ...record, status: res.data.status } : record
        )
      );
      toast.success("Status updated successfully");
    } catch (err) {
      toast.error("Error updating status:", err.response?.data || err.message);
    }
  };

  return (
    <div className="max-w-4xl p-4 mx-auto">
      <h1 className="mb-6 text-2xl font-bold text-center text-gray-800">
        Leave Records
      </h1>
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="w-12 h-12 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {leaveRecords.length > 0 ? (
            leaveRecords.map((record) => (
              <div
                key={record._id}
                className="p-4 transition-shadow duration-300 bg-white rounded-lg shadow-md hover:shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {record.user.name}
                  </h2>
                  <span
                    className={`px-2 py-1 text-xs font-semibold text-white rounded ${
                      record.status === "Accepted"
                        ? "bg-green-600"
                        : record.status === "Rejected"
                        ? "bg-red-600"
                        : "bg-yellow-600"
                    }`}>
                    {record.status}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-gray-700">
                    <strong>Email:</strong> {record.user.email}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Start Date:</strong>{" "}
                    {new Date(record.fromDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>End Date:</strong>{" "}
                    {new Date(record.toDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Reason:</strong> {record.reason}
                  </p>
                </div>

                {/* Action buttons for changing the status */}
                {record.status === "Pending" && (
                  <div className="flex gap-4 mt-4">
                    <button
                      onClick={() => updateStatus(record._id, "Accepted")}
                      className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700">
                      Accept
                    </button>
                    <button
                      onClick={() => updateStatus(record._id, "Rejected")}
                      className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700">
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center text-gray-700 col-span-full">
              No leave records found.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LeaveReport;
