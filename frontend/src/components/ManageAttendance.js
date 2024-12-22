import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const ManageAttendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    user: {
      name: "",
      email: "",
    },
  });
  const [editData, setEditData] = useState(null); // Holds data for the record being edited

  // Fetch attendance records on component mount
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/attendance", {
          headers: { Authorization: `Bearer ${token}` },
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

  // Handle form input changes for add attendance
  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === "name" || name === "email") {
      setFormData((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle form input changes for update attendance
  const onEditChange = (e) => {
    const { name, value } = e.target;
    if (name === "name" || name === "email") {
      setEditData((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          [name]: value,
        },
      }));
    } else {
      setEditData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Create a new attendance record
  const createAttendance = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const newFormData = {
        ...formData,
        time: formData.time, // Already in 24-hour format from the time input
      };

      const res = await axios.post(
        "http://localhost:5000/api/attendance",
        newFormData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAttendanceRecords([...attendanceRecords, res.data]);
      toast.success("Attendance created successfully!");
    } catch (err) {
      toast.error(
        "Error creating attendance record:",
        err.response?.data || err.message
      );
    }
  };

  // Open edit form for updating attendance
  const openEditForm = (record) => {
    setEditData({ ...record }); // Set the record in 24-hour format as-is
  };

  // Update an existing attendance record
  const updateAttendance = async () => {
    try {
      const token = localStorage.getItem("token");
      const updatedRecord = {
        ...editData,
      };

      const res = await axios.put(
        `http://localhost:5000/api/attendance/${editData._id}`,
        updatedRecord,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAttendanceRecords(
        attendanceRecords.map((record) =>
          record._id === editData._id ? res.data : record
        )
      );
      setEditData(null); // Close the edit form after saving
      toast.success("Attendance updated successfully!");
    } catch (err) {
      toast.error(
        "Error updating attendance record:",
        err.response?.data || err.message
      );
    }
  };

  // Delete an attendance record
  const deleteAttendance = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(
        `http://localhost:5000/api/attendance/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.status === 200) {
        setAttendanceRecords(
          attendanceRecords.filter((record) => record._id !== id)
        );
        toast.success("Attendance deleted successfully!");
      } else {
        toast.error(
          "Error deleting attendance:",
          res.data?.msg || "Unknown error"
        );
      }
    } catch (err) {
      toast.error(
        "Error deleting attendance record:",
        err.response?.data || err.message
      );
    }
  };

  return (
    <div className="container px-4 py-6 mx-auto">
      <h1 className="mb-6 text-3xl font-bold">Manage Attendance</h1>

      {/* Add Attendance Form */}
      <form
        onSubmit={createAttendance}
        className="p-6 mb-8 bg-white rounded-lg shadow-md">
        <div className="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-4">
          {/* Date Input */}
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={onChange}
            className="p-2 mb-4 border rounded"
            required
          />
          {/* Time Input */}
          <input
            type="time" // Time picker input in 24-hour format
            name="time"
            value={formData.time}
            onChange={onChange}
            className="p-2 mb-4 border rounded"
            required
          />
          {/* User Name Input */}
          <input
            type="text"
            name="name"
            value={formData.user.name}
            onChange={onChange}
            className="p-2 mb-4 border rounded"
            required
            placeholder="User Name"
          />
          {/* User Email Input */}
          <input
            type="email"
            name="email"
            value={formData.user.email}
            onChange={onChange}
            className="p-2 mb-4 border rounded"
            required
            placeholder="User Email"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 text-white transition bg-blue-600 rounded shadow hover:bg-blue-700">
          Add Attendance
        </button>
      </form>

      {/* Attendance List */}
      {loading ? (
        <div className="text-center">
          <div className="w-12 h-12 mx-auto border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
          <p className="mt-4">Loading...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 overflow-y-auto sm:grid-cols-2 lg:grid-cols-3">
          {attendanceRecords.length > 0 ? (
            attendanceRecords.map((record) => (
              <div
                key={record._id}
                className="p-4 bg-white rounded-lg shadow-md">
                <p className="text-gray-700">
                  <strong>Date:</strong>{" "}
                  {new Date(record.date).toLocaleDateString()}
                </p>
                <p className="text-gray-700">
                  <strong>Time:</strong> {record.time}
                </p>
                <p className="text-gray-700">
                  <strong>User:</strong> {record.user.name} ({record.user.email}
                  )
                </p>
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => openEditForm(record)}
                    className="px-4 py-2 text-white transition bg-blue-600 rounded shadow hover:bg-blue-700">
                    Update
                  </button>
                  <button
                    onClick={() => deleteAttendance(record._id)}
                    className="px-4 py-2 text-white transition bg-red-600 rounded shadow hover:bg-red-700">
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-700 col-span-full">
              No attendance records found.
            </div>
          )}
        </div>
      )}

      {/* Edit Attendance Form */}
      {editData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="mb-4 text-2xl font-bold">Edit Attendance</h2>
            <form>
              <input
                type="date"
                name="date"
                value={editData.date}
                onChange={onEditChange}
                className="p-2 mb-4 border rounded"
                required
              />
              <input
                type="time" // Time picker input in 24-hour format
                name="time"
                value={editData.time}
                onChange={onEditChange}
                className="p-2 mb-4 border rounded"
                required
              />
              <input
                type="text"
                name="name"
                value={editData.user.name}
                onChange={onEditChange}
                className="p-2 mb-4 border rounded"
                required
                placeholder="User Name"
              />
              <input
                type="email"
                name="email"
                value={editData.user.email}
                onChange={onEditChange}
                className="p-2 mb-4 border rounded"
                required
                placeholder="User Email"
              />
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setEditData(null)}
                  className="px-4 py-2 text-gray-700 transition bg-gray-200 rounded shadow hover:bg-gray-300">
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={updateAttendance}
                  className="px-4 py-2 text-white transition bg-green-600 rounded shadow hover:bg-green-700">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAttendance;
