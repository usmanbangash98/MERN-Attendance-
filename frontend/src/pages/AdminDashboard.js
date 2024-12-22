import React, { useState, useEffect } from "react";
import axios from "axios";
import AttendanceReport from "../components/AttendanceReport";
import LeaveReport from "../components/LeaveReport";
import Reports from "../components/Reports";
import ManageAttendance from "../components/ManageAttendance";
import Settings from "../components/Settings";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const [activeComponent, setActiveComponent] = useState("manageAttendance");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/auth/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAdminData(res.data);
      } catch (err) {
        console.error(
          "Error fetching admin data:",
          err.response?.data || err.message
        );
      }
    };

    fetchAdminData();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case "submitLeave":
        return <LeaveReport />;
      case "viewAttendance":
        return <Reports />;
      case "manageAttendance":
        return <ManageAttendance />;
      case "settings":
        return <Settings />;
      default:
        return <AttendanceReport />;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast("Logging Out");
    setTimeout(() => {
      window.location.href = "/admin-login";
    }, 1000);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <nav
        className={`bg-slate-500 transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-16"
        } flex flex-col fixed h-full`}>
        <div className="flex items-center justify-between p-4">
          <button className="text-gray-800" onClick={toggleSidebar}>
            <i
              className={`fas ${
                isSidebarOpen ? "fa-chevron-left" : "fa-chevron-right"
              }`}></i>
          </button>
        </div>
        <ul className="flex-grow space-y-2">
          <li>
            <button
              className={`w-full flex items-center px-4 py-2 rounded-md ${
                activeComponent === "manageAttendance"
                  ? "bg-blue-500 text-white"
                  : "text-gray-800"
              }`}
              onClick={() => setActiveComponent("manageAttendance")}>
              <i className="mr-2 fas fa-file-pen"></i>
              {isSidebarOpen && <span> Manage Attendance</span>}
            </button>
          </li>
          <li>
            <button
              className={`w-full flex items-center px-4 py-2 rounded-md ${
                activeComponent === "markAttendance"
                  ? "bg-blue-500 text-white"
                  : "text-gray-800"
              }`}
              onClick={() => setActiveComponent("markAttendance")}>
              <i className="mr-2 fas fa-calendar-check"></i>
              {isSidebarOpen && <span> Attendance Report</span>}
            </button>
          </li>
          <li>
            <button
              className={`w-full flex items-center px-4 py-2 rounded-md ${
                activeComponent === "submitLeave"
                  ? "bg-blue-500 text-white"
                  : "text-gray-800"
              }`}
              onClick={() => setActiveComponent("submitLeave")}>
              <i className="mr-2 fas fa-envelope"></i>
              {isSidebarOpen && <span>Leave Report</span>}
            </button>
          </li>
          <li>
            <button
              className={`w-full flex items-center px-4 py-2 rounded-md ${
                activeComponent === "settings"
                  ? "bg-blue-500 text-white"
                  : "text-gray-800"
              }`}
              onClick={() => setActiveComponent("settings")}>
              <i className="mr-2 fas fa-gear"></i>
              {isSidebarOpen && <span>Settings</span>}
            </button>
          </li>
        </ul>
      </nav>

      <main className="flex-1 ml-16 overflow-y-auto bg-slate-300">
        <header className="flex items-center justify-between p-4 text-white bg-slate-400">
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          <div className="relative">
            <button onClick={() => setShowLogout(!showLogout)}>
              {adminData && adminData.profilePicture ? (
                <img
                  src={`http://localhost:5000${adminData.profilePicture}`}
                  alt="User"
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <img
                  src="path/to/default-user-picture.jpg"
                  alt="User"
                  className="w-10 h-10 rounded-full"
                />
              )}
              {showLogout && (
                <button
                  className="absolute right-0 px-4 py-2 text-gray-800 bg-white border rounded-md shadow-lg top-12"
                  onClick={handleLogout}>
                  Logout
                </button>
              )}
            </button>
          </div>
        </header>
        <div className="p-6">{renderComponent()}</div>
      </main>
    </div>
  );
};

export default AdminDashboard;
