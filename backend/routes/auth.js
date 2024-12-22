const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { auth, adminAuth } = require("../middleware/auth");
require("dotenv").config();
const multer = require("multer");

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Register User
router.post("/register", upload.single("profilePicture"), async (req, res) => {
  const { name, email, password } = req.body;
  if (!req.file) {
    return res.status(400).json({ msg: "Profile picture is required" });
  }
  const profilePicture = `/uploads/${req.file.filename}`.replace(/\\/g, "/");
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }
    user = new User({ name, email, password, profilePicture });
    await user.save();
    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Login User
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Get User Profile
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update User Profile
router.put(
  "/profile",
  auth,
  upload.single("profilePicture"),
  async (req, res) => {
    const { name, email, password } = req.body;
    const userId = req.user.id;

    console.log("Received update request for user:", userId);
    console.log("Received data in request:", req.body);

    try {
      const updateData = {};

      if (name) {
        updateData.name = name;
        console.log("Name to update:", name);
      }
      if (email) {
        updateData.email = email;
        console.log("Email to update:", email);
      }
      if (req.file) {
        updateData.profilePicture = `/uploads/${req.file.filename}`.replace(
          /\\/g,
          "/"
        );
        console.log("Profile Picture to update:", updateData.profilePicture);
      }

      if (password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        updateData.password = hashedPassword;
        console.log("New hashed password to update:", hashedPassword);
      } else {
        console.log("No password to update.");
      }

      console.log("Update data prepared:", updateData);

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true, runValidators: true }
      ).select("-password");

      if (!updatedUser) {
        console.error("User not found during update");
        return res.status(400).json({ message: "User not found" });
      }

      console.log("User updated successfully:", updatedUser);

      res
        .status(200)
        .json({ message: "Profile updated successfully", user: updatedUser });
    } catch (err) {
      console.error("Profile update error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Admin registration
router.post(
  "/register-admin",
  upload.single("profilePicture"),
  async (req, res) => {
    const { name, email, password } = req.body;
    if (!req.file) {
      return res.status(400).json({ msg: "Profile picture is required" });
    }
    const profilePicture = `/uploads/${req.file.filename}`.replace(/\\/g, "/");
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: "User already exists" });
      }
      user = new User({ name, email, password, profilePicture, isAdmin: true });
      await user.save();
      const payload = { user: { id: user.id } };
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: "1h" },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// Admin Login
router.post("/admin-login", async (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt:", email);
  try {
    let user = await User.findOne({ email });
    if (!user) {
      console.log("User not found");
      return res.status(400).json({ msg: "User not found" });
    }
    if (!user.isAdmin) {
      console.log("Not an admin user");
      return res.status(400).json({ msg: "Not an admin" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password does not match");
      return res.status(400).json({ msg: "Wrong Password" });
    }
    const payload = { user: { id: user.id, isAdmin: user.isAdmin } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Get User Details for Attendance
router.get("/user", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
