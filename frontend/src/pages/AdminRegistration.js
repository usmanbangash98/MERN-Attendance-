import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const RegisterAdmin = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profilePicture: null,
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const onChange = (e) => {
    if (e.target.name === "profilePicture") {
      setFormData({ ...formData, profilePicture: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!formData.profilePicture) {
      setMessage("Profile picture is required");
      return;
    }

    if (formData.password.length < 6) {
      setMessage("Password must be at least 6 characters long");
      return;
    }

    try {
      // Create FormData object
      const formDataPic = new FormData();
      formDataPic.append("name", formData.name);
      formDataPic.append("email", formData.email);
      formDataPic.append("password", formData.password);
      formDataPic.append("profilePicture", formData.profilePicture);

      const config = { headers: { "Content-Type": "multipart/form-data" } };

      const res = await axios.post(
        "http://localhost:5000/api/auth/register-admin",
        formDataPic,
        config
      );

      if (res && res.data) {
        setMessage("Registration successful!");
        setFormData({
          name: "",
          email: "",
          password: "",
          profilePicture: null,
        });

        setTimeout(() => navigate("/admin-login"), 2000);
      } else {
        setMessage("Registration succeeded, but no response data received.");
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setMessage(err.response.data.message || "Registration failed");
      } else {
        setMessage("Registration failed. Please try again later.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 bg-gray-900 rounded-lg shadow-lg">
        <h1 className="mb-6 text-4xl text-center text-white">Admin Register</h1>
        {message && (
          <p
            className={`p-2 mb-4 text-center rounded ${
              message.includes("successful")
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}>
            {message}
          </p>
        )}
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-white">
              Name
            </label>
            <input
              type="text"
              className="w-full p-1 mt-2 text-white bg-gray-700 border-2 border-gray-600 rounded-md focus:border-blue-500"
              name="name"
              value={formData.name}
              onChange={onChange}
              required
            />
          </div>
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
          <div className="mb-4">
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
          <div className="mb-6">
            <label className="block text-sm font-semibold text-white">
              Profile Picture
            </label>
            <input
              type="file"
              className="w-full p-1 mt-2 text-white bg-gray-700 border-2 border-gray-600 rounded-md focus:border-blue-500"
              name="profilePicture"
              onChange={onChange}
              accept="image/*"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Register
          </button>
        </form>
        <h3 className="pt-3 text-white">
          Already have an account?&nbsp;
          <Link
            to="/admin-login"
            className="font-semibold text-blue-400 hover:underline hover:text-blue-600">
            Login here
          </Link>
        </h3>
      </div>
    </div>
  );
};

export default RegisterAdmin;
