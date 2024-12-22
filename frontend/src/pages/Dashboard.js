import React, { useState, useEffect } from "react";
import axios from "axios";
import MarkAttendance from "../components/MarkAttendance";
import SubmitLeave from "../components/SubmitLeave";
import UserReport from "../components/UserReport";
import Settings from "../components/Settings";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [activeComponent, setActiveComponent] = useState("markAttendance");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [userData, setUserData] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserData(null); //clear the userData state
    toast("Logged out");
    setTimeout(() => {
      window.location.href = "/login";
    }, 1000);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const res = await axios.get("http://localhost:5000/api/auth/user", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUserData({
            name: res.data.name,
            email: res.data.email,
            profilePicture: res.data.profilePicture,
          });
        }
      } catch (err) {
        console.error(
          "Error fetching user data:",
          err.response?.data || err.message
        );
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    return () => {
      window.removeEventListener("beforeunload", handleLogout);
    };
  }, [handleLogout]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case "submitLeave":
        return <SubmitLeave />;
      case "viewAttendance":
        return <UserReport />;
      case "settings":
        return <Settings />;
      default:
        return <MarkAttendance />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <nav
        className={`bg-gray-200 transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-16"
        } flex flex-col`}>
        <div className="flex items-center justify-between p-4">
          <button className="text-gray-800" onClick={toggleSidebar}>
            <i
              className={`fas ${
                isSidebarOpen ? "fa-chevron-left" : "fa-chevron-right"
              }`}></i>
          </button>
        </div>
        <ul className="flex-grow space-y-3">
          <li>
            <button
              className={`w-full flex items-center px-4 py-2 border  hover:border-stone-300 ${
                activeComponent === "markAttendance"
                  ? "bg-gray-500 text-white"
                  : "text-gray-800"
              }`}
              onClick={() => setActiveComponent("markAttendance")}>
              <i className="mr-2 fas fa-calendar-check"></i>
              {isSidebarOpen && <span>Mark Attendance</span>}
            </button>
          </li>
          <li>
            <button
              className={`w-full flex items-center px-4 py-2 border hover:border-stone-300 ${
                activeComponent === "submitLeave"
                  ? "bg-gray-500 text-white"
                  : "text-gray-800"
              }`}
              onClick={() => setActiveComponent("submitLeave")}>
              <i className="mr-2 fas fa-envelope"></i>
              {isSidebarOpen && <span>Submit Leave Request</span>}
            </button>
          </li>
          <li>
            <button
              className={`w-full flex items-center px-4 py-2 border hover:border-stone-300 ${
                activeComponent === "viewAttendance"
                  ? "bg-gray-500 text-white"
                  : "text-gray-800"
              }`}
              onClick={() => setActiveComponent("viewAttendance")}>
              <i className="mr-2 fas fa-eye"></i>
              {isSidebarOpen && <span>View Reports</span>}
            </button>
          </li>
          <li>
            <button
              className={`w-full flex items-center px-4 py-2 border hover:border-stone-300 ${
                activeComponent === "settings"
                  ? "bg-gray-500 text-white"
                  : "text-gray-800"
              }`}
              onClick={() => setActiveComponent("settings")}>
              <i className="mr-2 fas fa-gear"></i>
              {isSidebarOpen && <span>Settings</span>}
            </button>
          </li>
        </ul>
      </nav>

      <main className="flex-1 overflow-y-auto bg-gray-100">
        <header className="flex items-center justify-between p-4 mb-6 border-b">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          {userData && (
            <div className="hidden md:block sm:hidden">
              <h2>
                <span>Welcome </span>
                <span className="font-serif text-xl hover:underline">
                  {userData.name}
                </span>
              </h2>
            </div>
          )}
          <div className="relative">
            <button onClick={() => setShowLogout(!showLogout)}>
              {userData && userData.profilePicture ? (
                <img
                  src={
                    userData.profilePicture.startsWith("/")
                      ? `http://localhost:5000${userData.profilePicture}`
                      : `http://localhost:5000/${userData.profilePicture}`
                  }
                  alt="User"
                  className="object-cover w-10 h-10 rounded-full"
                />
              ) : (
                <img
                  src="../../public/download.jpeg"
                  alt="User"
                  className="object-cover w-10 h-10 rounded-full"
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
        <div className="p-4">{renderComponent()}</div>
      </main>
    </div>
  );
};

export default Dashboard;
