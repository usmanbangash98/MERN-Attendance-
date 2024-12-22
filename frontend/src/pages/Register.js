import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Register = () => {
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
        "http://localhost:5000/api/auth/register",
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
        setTimeout(() => {
          navigate("/login");
        }, 2000);
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
    <div className="container max-w-md p-6 mx-auto mt-10 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="mb-5 text-3xl font-bold">Register</h1>
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
            Name
          </label>
          <input
            type="text"
            className="block w-full p-1 mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            name="name"
            value={formData.name}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            className="block w-full p-1 mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            name="email"
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
            className="block w-full p-1 mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            name="password"
            value={formData.password}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Profile Picture
          </label>
          <input
            type="file"
            className="block w-full p-1 mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            name="profilePicture"
            onChange={onChange}
            accept="image/*"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Register
        </button>
        <h3>
          Already have an account?&nbsp;
          <Link
            to="/login"
            className="font-semibold text-blue-400 hover:underline hover:text-blue-600">
            Login here
          </Link>
        </h3>
      </form>
    </div>
  );
};

export default Register;
