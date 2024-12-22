const mongoose = require("mongoose");

const LeaveRequestSchema = new mongoose.Schema({
  user: {
    name: { type: String, required: true },
    email: { type: String, required: true },
  },
  fromDate: { type: String, required: true },
  toDate: { type: String, required: true },
  reason: { type: String, required: true },
  status: { type: String, default: "Pending" },
});

module.exports = mongoose.model("LeaveRequest", LeaveRequestSchema);
