const express = require("express");
const router = express.Router();
const { auth, adminAuth } = require("../middleware/auth");
const LeaveRequest = require("../models/LeaveRequest");

// Submit Leave Request
router.post("/", auth, async (req, res) => {
  const { fromDate, toDate, reason, user } = req.body;

  try {
    // Check if the user has already submitted a leave request for today
    const existingLeave = await LeaveRequest.findOne({
      "user.email": user.email,
      fromDate,
    });
    if (existingLeave) {
      return res
        .status(400)
        .json({ msg: "Leave request already submitted for today." });
    }

    const newLeaveRequest = new LeaveRequest({
      user,
      fromDate,
      toDate,
      reason,
    });

    const leaveRequest = await newLeaveRequest.save();
    res.json(leaveRequest);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Get Leave Requests for Logged-in User
router.get("/user", auth, async (req, res) => {
  const email = req.query.email;

  try {
    const records = await LeaveRequest.find({ "user.email": email });
    res.json(records);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Get Leave Requests for All Users (Admin)
router.get("/", adminAuth, async (req, res) => {
  console.log("Fetching leave requests for all users");
  try {
    const records = await LeaveRequest.find().populate("user");
    res.json(records);
  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).send("Server error");
  }
});

// Update Leave Request Status
router.put("/:id", adminAuth, async (req, res) => {
  const { status } = req.body; // The new status ("Accepted" or "Rejected")

  try {
    const leaveRequest = await LeaveRequest.findById(req.params.id);
    if (!leaveRequest) {
      return res.status(404).json({ msg: "Leave request not found" });
    }

    leaveRequest.status = status; // Update the status

    const updatedLeaveRequest = await leaveRequest.save();
    res.json(updatedLeaveRequest); // Return the updated leave request
  } catch (err) {
    console.error("Error updating leave request status:", err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
