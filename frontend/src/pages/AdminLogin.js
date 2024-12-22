// AdminLogin component
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const config = { headers: { "Content-Type": "application/json" } };
    const body = JSON.stringify(formData);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/admin-login",
        body,
        config
      );
      setMessage("Login successful!");
      localStorage.setItem("token", res.data.token);
      setTimeout(() => {
        navigate("/admin-dashboard");
      }, 2000);
    } catch (err) {
      toast.error("Error:", err.response ? err.response.data : err.message);
      setMessage(err.response ? err.response.data.msg : "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 bg-gray-900 rounded-lg shadow-lg">
        <h1 className="mb-6 text-4xl text-center text-white">Admin Login</h1>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-white">
              Email
            </label>
            <input
              type="email"
              className="w-full p-1 mt-2 text-white bg-gray-700 border-2 border-gray-600 rounded-md focus:border-blue-500"
              name="email"
              value={formData.email}
              onChange={onChange}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-semibold text-white">
              Password
            </label>
            <input
              type="password"
              className="w-full p-1 mt-2 text-white bg-gray-700 border-2 border-gray-600 rounded-md focus:border-blue-500"
              name="password"
              value={formData.password}
              onChange={onChange}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Login
          </button>
          {message && (
            <p
              className={`mt-4 text-center ${
                message.includes("failed") ? "text-red-500" : "text-green-500"
              }`}>
              {message}
            </p>
          )}
        </form>
        <h3 className="pt-3 text-white">
          Don't have an account ? &nbsp;
          <Link
            to="/register-admin"
            className="font-semibold text-blue-400 hover:underline hover:text-blue-600">
            Register here
          </Link>
        </h3>
      </div>
    </div>
  );
};

export default AdminLogin;
