import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const MarkAttendance = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userDetails, setUserDetails] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [attendanceMarked, setAttendanceMarked] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("You are not logged in. Redirecting to login page.");
        window.location.href = "/login";
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/api/auth/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserDetails({ name: res.data.name, email: res.data.email });
        checkAttendance(res.data.email);
      } catch (err) {
        toast.error(
          "Error fetching user details:",
          err.response?.data || err.message
        );
        toast(
          "Your session has expired or the token is invalid. Redirecting to login page."
        );
        localStorage.removeItem("token");
        window.location.href = "/login";
      } finally {
        setLoading(false);
      }
    };

    const checkAttendance = async (email) => {
      const today = new Date().toLocaleDateString();
      const markedStatus = localStorage.getItem(`attendance_${email}_${today}`);

      if (markedStatus) {
        setAttendanceMarked(true);
      } else {
        try {
          const token = localStorage.getItem("token");
          const res = await axios.get(
            `http://localhost:5000/api/attendance/user?email=${email}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const alreadyMarked = res.data.some(
            (record) => record.date === today
          );

          if (alreadyMarked) {
            localStorage.setItem(`attendance_${email}_${today}`, "marked");
          }
          setAttendanceMarked(alreadyMarked);
        } catch (err) {
          toast.error(
            "Error checking attendance:",
            err.response?.data || err.message
          );
        }
      }
    };

    fetchUserDetails();

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const markAttendance = async () => {
    if (attendanceMarked) {
      toast("You have already marked your attendance for today.");
      return;
    }

    const attendanceData = {
      date: currentTime.toISOString().split("T")[0], // YYYY-MM-DD format
      time: currentTime.toTimeString().split(" ")[0].slice(0, 5), // HH:mm format
      user: userDetails,
    };

    const token = localStorage.getItem("token");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/attendance",
        attendanceData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Attendance marked successfully!");
      setAttendanceMarked(true);
      localStorage.setItem(
        `attendance_${userDetails.email}_${currentTime.toLocaleDateString()}`,
        "marked"
      );
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "An unknown error occurred.";
      toast.error(err.response?.data || err.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-full max-w-md p-8 text-center bg-white rounded-lg shadow-lg">
        {loading ? (
          <div className="text-gray-700">Loading...</div>
        ) : (
          <>
            <h1 className="mb-4 text-2xl font-bold text-gray-800">
              Mark Attendance
            </h1>
            <p className="mb-2 text-gray-600">
              <strong>Date:</strong> {currentTime.toLocaleDateString()}
            </p>
            <p className="mb-4 text-gray-600">
              <strong>Time:</strong>{" "}
              {currentTime.toTimeString().split(" ")[0].slice(0, 5)}
            </p>
            <button
              onClick={markAttendance}
              className={`px-6 py-2 text-white rounded-lg ${
                attendanceMarked
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
              disabled={attendanceMarked}>
              {attendanceMarked
                ? "Attendance Already Marked"
                : "Mark Attendance"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default MarkAttendance;
