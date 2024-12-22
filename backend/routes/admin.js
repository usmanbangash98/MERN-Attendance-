const express = require("express");
const router = express.Router();
const { auth, adminAuth } = require("../middleware/auth");
const Attendance = require("../models/Attendance");
const LeaveRequest = require("../models/LeaveRequest");
const User = require("../models/User");

// Get all students
router.get("/students", adminAuth, async (req, res) => {
  try {
    const students = await User.find();
    res.json(students);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Manage attendance records
router.get("/attendance", adminAuth, async (req, res) => {
  try {
    const attendanceRecords = await Attendance.find().populate("user");
    res.json(attendanceRecords);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Manage leave requests
router.get("/leave-requests", adminAuth, async (req, res) => {
  try {
    const leaveRequests = await LeaveRequest.find().populate("user");
    res.json(leaveRequests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Generate reports
router.get("/reports", adminAuth, async (req, res) => {
  try {
    const reports = await Attendance.find().populate("user");
    res.json(reports);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
