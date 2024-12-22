const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
  user: {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
  },
  date: {
    type: String,
    required: true,
    validate: {
      validator: (v) => /\d{4}-\d{2}-\d{2}/.test(v), // Validate YYYY-MM-DD format
      message: (props) => `${props.value} is not a valid date format!`,
    },
  },
  time: {
    type: String,
    required: true,
    validate: {
      validator: (v) => /\d{2}:\d{2}/.test(v), // Validate HH:mm format
      message: (props) => `${props.value} is not a valid time format!`,
    },
  },
});

module.exports = mongoose.model("Attendance", AttendanceSchema);
