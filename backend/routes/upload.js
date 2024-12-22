// routes/upload.js
const express = require("express");
const multer = require("multer");
const router = express.Router();

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

router.post("/profile-picture", upload.single("profilePicture"), (req, res) => {
  res.status(200).json({ filePath: `/uploads/${req.file.filename}` });
});

module.exports = router;
