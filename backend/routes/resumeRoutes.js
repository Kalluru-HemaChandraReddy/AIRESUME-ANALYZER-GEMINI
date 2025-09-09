const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();

// Use memory storage (keeps file in memory buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Simple test upload endpoint
router.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Just to confirm file details
    res.json({
      message: "Resume uploaded successfully!",
      fileName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
