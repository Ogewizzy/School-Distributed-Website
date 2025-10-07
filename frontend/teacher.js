// ==========================
// TEACHER DASHBOARD SCRIPT
// ==========================

// Select DOM elements
const uploadForm = document.getElementById("uploadForm");
const fileInput = document.getElementById("fileInput");
const uploadMessage = document.getElementById("uploadMessage");
const fileList = document.getElementById("fileList");

// Backend base URL
const BASE_URL = "http://localhost:5000/api/files";

// ==========================
// UPLOAD FILE FUNCTION
// ==========================
if (uploadForm) {
  uploadForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const file = fileInput.files[0];
    if (!file) {
      uploadMessage.textContent = "Please select a file to upload.";
      uploadMessage.style.color = "red";
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("uploaderRole", "Teacher"); // ✅ Add role info

    try {
      const response = await fetch(`${BASE_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        uploadMessage.textContent = "✅ File uploaded successfully!";
        uploadMessage.style.color = "green";
        fileInput.value = "";
        fetchFiles(); // refresh the file list
      } else {
        uploadMessage.textContent = data.message || "❌ Upload failed.";
        uploadMessage.style.color = "red";
      }
    } catch (error) {
      console.error("Upload Error:", error);
      uploadMessage.textContent = "⚠ Server error while uploading.";
      uploadMessage.style.color = "red";
    }
  });
}

// ==========================
// FETCH FILES FUNCTION
// ==========================
async function fetchFiles() {
  try {
    const response = await fetch(BASE_URL);
    const files = await response.json();

    // Clear list
    fileList.innerHTML = "";

    if (files.length === 0) {
      fileList.innerHTML = "<p>No files uploaded yet.</p>";
      return;
    }

    files.forEach((file) => {
      const listItem = document.createElement("li");
      listItem.innerHTML = `
        📄 ${file.filename}
        <small style="color: gray;">— Uploaded by Teacher </small>
        <button onclick="downloadFile('${file.filename}')">⬇ Download</button>
      `;
      fileList.appendChild(listItem);
    });
  } catch (error) {
    console.error("Fetch Files Error:", error);
    fileList.innerHTML = "<p style='color:red;'>Error fetching files.</p>";
  }
}

// ==========================
// DOWNLOAD FILE FUNCTION
// ==========================
function downloadFile(filename) {
  window.open(`${BASE_URL}/download/${filename}`, "_blank");
}

// Load files on page load
document.addEventListener("DOMContentLoaded", fetchFiles);
