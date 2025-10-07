
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { uploadFile, getFiles, downloadFile } = require("../controllers/fileController");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// =====================
// Routes
// =====================

// Upload file
router.post("/upload", upload.single("file"), uploadFile);

// Get all files
router.get("/", getFiles);

// Download file
router.get("/download/:filename", downloadFile);

module.exports = router;