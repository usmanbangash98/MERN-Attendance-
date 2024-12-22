// users can submit leave request from users dashboard
import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const SubmitLeave = () => {
  const [formData, setFormData] = useState({
    fromDate: "",
    toDate: "",
    reason: "",
  });
  const [userDetails, setUserDetails] = useState({ name: "", email: "" });
  const [leaveSubmitted, setLeaveSubmitted] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found, please log in again.");
        }

        const res = await axios.get("http://localhost:5000/api/auth/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserDetails({ name: res.data.name, email: res.data.email });
        checkLeaveStatus(res.data.email);
      } catch (err) {
        toast.error(
          "Error fetching user details:",
          err.response?.data || err.message
        );
      }
    };

    const checkLeaveStatus = async (email) => {
      const today = new Date().toLocaleDateString();
      const leaveStatus = localStorage.getItem(`leave_${email}_${today}`);
      if (leaveStatus) {
        setLeaveSubmitted(true);
      } else {
        try {
          const token = localStorage.getItem("token");
          const res = await axios.get(
            `http://localhost:5000/api/leaveRequest/user?email=${email}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const alreadySubmitted = res.data.some(
            (record) => record.date === today
          );
          if (alreadySubmitted) {
            localStorage.setItem(`leave_${email}_${today}`, "submitted");
          }
          setLeaveSubmitted(alreadySubmitted);
        } catch (err) {
          toast.error(
            "Error checking leave status:",
            err.response?.data || err.message
          );
        }
      }
    };

    fetchUserDetails();
  }, []);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();

    if (leaveSubmitted) {
      toast("You have already submitted a leave request for today.");
      return;
    }

    const leaveData = {
      ...formData,
      user: userDetails,
    };

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found, please log in again.");
      }

      const res = await axios.post(
        "http://localhost:5000/api/leaveRequest",
        leaveData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLeaveSubmitted(true);
      localStorage.setItem(
        `leave_${userDetails.email}_${new Date().toLocaleDateString()}`,
        "submitted"
      );
      toast.success("Leave request submitted successfully!");
      setFormData({
        fromDate: "",
        toDate: "",
        reason: "",
      });
    } catch (err) {
      toast.error(
        "Error submitting leave request:",
        err.response?.data || err.message
      );
    }
  };

  return (
    <div className="max-w-xl p-6 mx-auto bg-white rounded-lg shadow-md">
      <h1 className="mb-6 text-3xl font-bold text-center text-gray-800">
        Submit Leave Request
      </h1>
      <form className="space-y-6" onSubmit={onSubmit}>
        <div>
          <label
            className="block mb-2 text-sm font-bold text-gray-700"
            htmlFor="fromDate">
            From Date
          </label>
          <input
            type="date"
            className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            id="fromDate"
            name="fromDate"
            value={formData.fromDate}
            onChange={onChange}
            required
            disabled={leaveSubmitted}
          />
        </div>
        <div>
          <label
            className="block mb-2 text-sm font-bold text-gray-700"
            htmlFor="toDate">
            To Date
          </label>
          <input
            type="date"
            className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            id="toDate"
            name="toDate"
            value={formData.toDate}
            onChange={onChange}
            required
            disabled={leaveSubmitted}
          />
        </div>
        <div>
          <label
            className="block mb-2 text-sm font-bold text-gray-700"
            htmlFor="reason">
            Reason
          </label>
          <textarea
            className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={onChange}
            required
            disabled={leaveSubmitted}></textarea>
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className={`w-full py-2 px-4 text-white font-bold rounded-lg focus:outline-none focus:shadow-outline ${
              leaveSubmitted
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-700"
            }`}
            disabled={leaveSubmitted}>
            {leaveSubmitted ? "Leave Already Submitted" : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubmitLeave;
