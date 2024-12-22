const User = require("../models/User"); // Ensure User model is imported
const express = require("express");
const router = express.Router();
const { auth, adminAuth } = require("../middleware/auth");
const Attendance = require("../models/Attendance");

// Mark Attendance for authenticated user (students or admin)
router.post("/", auth, async (req, res) => {
  const { date, time, user } = req.body;
  try {
    const newAttendance = new Attendance({ user, date, time });
    const savedAttendance = await newAttendance.save();
    console.log("Attendance successfully saved:", savedAttendance);
    res.json(savedAttendance);
  } catch (err) {
    console.error("Error during attendance save:", err.message);
    if (err.errors) {
      // Mongoose validation errors
      console.error("Validation errors:", err.errors);
      res.status(400).json({ msg: "Invalid data", errors: err.errors });
    } else {
      res.status(500).json({ msg: "Server error", error: err.message });
    }
  }
});

// Get Attendance Records for Logged-in User
router.get("/user", auth, async (req, res) => {
  const email = req.query.email;
  try {
    const records = await Attendance.find({ "user.email": email });
    res.json(records);
  } catch (err) {
    console.error("Error fetching attendance:", err.message);
    res.status(500).send("Server error");
  }
});

// Get Attendance Records for All Users (Admin)
router.get("/", adminAuth, async (req, res) => {
  try {
    const records = await Attendance.find();
    res.json(records);
  } catch (err) {
    console.error("Error fetching attendance:", err.message);
    res.status(500).send("Server error");
  }
});

// Delete Attendance
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndDelete(req.params.id);
    if (!attendance) {
      return res.status(404).json({ msg: "Attendance record not found" });
    }
    console.log("Attendance record removed:", req.params.id);
    res.json({ msg: "Attendance record removed" });
  } catch (err) {
    console.error("Couldn't delete attendance:", err.message);
    res.status(500).send("Server error");
  }
});

// Update Attendance
router.put("/:id", adminAuth, async (req, res) => {
  const { date, time, user } = req.body;

  try {
    const attendance = await Attendance.findById(req.params.id);
    if (!attendance) {
      return res.status(404).json({ msg: "Attendance record not found" });
    }

    // Validate the user field
    if (!user || !user.name || !user.email) {
      return res.status(400).json({ msg: "Invalid user details provided" });
    }

    // Update fields
    attendance.date = date;
    attendance.time = time;
    attendance.user = user;

    await attendance.save();
    res.json(attendance);
  } catch (err) {
    console.error("Error updating attendance:", err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
