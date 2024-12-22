import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Updated from useHistory

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const config = { headers: { "Content-Type": "application/json" } };
    const body = JSON.stringify(formData);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        body,
        config
      );
      setMessage("Login successful!");
      // Store token in localStorage
      localStorage.setItem("token", res.data.token);

      // Navigate to dashboard page after successful login
      navigate("/dashboard");
    } catch (err) {
      setMessage(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="container max-w-md p-6 mx-auto mt-10 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="mb-5 text-4xl font-bold text-center text-indigo-600">
        Login
      </h1>
      {message && (
        <div
          className={`p-4 mb-4 ${
            message.includes("successful")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          } rounded`}>
          {message}
        </div>
      )}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            className="block w-full p-1 mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            name="email"
            placeholder="your email address"
            value={formData.email}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            className="block w-full p-1 mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={onChange}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Login
        </button>
        <h3>
          Don't have an account ? &nbsp;
          <Link
            to="/register"
            className="font-semibold text-blue-400 hover:underline hover:text-blue-600">
            Register here
          </Link>
        </h3>
      </form>
    </div>
  );
};

export default Login;
