const path = require("path");
const fs = require("fs");
const File = require("../models/fileModel");


// Upload File

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Get uploader role: either from auth, frontend body, or fallback
    const uploaderRole =
      (req.user && req.user.role) ||
      req.body.uploaderRole ||
      "teacher"; 

    // Save file info in MongoDB
    const newFile = new File({
      filename: req.file.filename,
      uploaderRole,
    });
    await newFile.save();

    res.status(200).json({
      message: "✅ File uploaded successfully",
      filename: req.file.filename,
      uploaderRole,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
};


// Get All Files 

exports.getFiles = async (req, res) => {
  try {
    const uploadDir = path.join(process.cwd(), "uploads");
    const storedFiles = await File.find().sort({ createdAt: -1 });

    // Remove database records for files missing on disk
    const validFiles = [];
    for (const file of storedFiles) {
      const filePath = path.join(uploadDir, file.filename);
      if (fs.existsSync(filePath)) {
        validFiles.push(file);
      } else {
        // Delete record from DB if file no longer exists
        await File.findByIdAndDelete(file._id);
      }
    }

    res.status(200).json(validFiles);
  } catch (error) {
    console.error("Get files error:", error);
    res.status(500).json({ message: "Failed to retrieve files" });
  }
};


// Download File

exports.downloadFile = (req, res) => {
  try {
    const filePath = path.join(process.cwd(), "uploads", req.params.filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" });
    }

    res.download(filePath, (err) => {
      if (err) {
        console.error("Download error:", err);
        res.status(500).json({ message: "Error downloading file" });
      }
    });
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ message: "Failed to download file" });
  }
};