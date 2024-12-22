const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Check if user exists
router.get("/check", async (req, res) => {
  const { email, name } = req.query;

  try {
    const user = await User.findOne({ email, name });
    if (user) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
