const API_URL = "http://localhost:8080/api";

// Get elements
const form = document.getElementById("uploadForm");
const statusDiv = document.getElementById("status");
const resultsDiv = document.getElementById("results");
const submitButton = form.querySelector("button");

// Handle form submission
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const fileInput = document.getElementById("pdfFiles");
  const files = fileInput.files;

  if (files.length === 0) {
    showStatus("Please select files", "error");
    return;
  }

  // Create form data
  const formData = new FormData();
  for (let file of files) {
    formData.append("files", file);
  }

  // Show loading
  showStatus("Uploading and processing files...", "loading");
  submitButton.disabled = true;
  resultsDiv.innerHTML = "";

  try {
    // Upload and process files
    const response = await fetch(`${API_URL}/process`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Processing failed");
    }

    const result = await response.json();

    // Show success
    showStatus("Processing complete!", "success");

    // Display download links
    displayResults(result);
  } catch (error) {
    showStatus("Error: " + error.message, "error");
  } finally {
    submitButton.disabled = false;
  }
});

// Show status message
function showStatus(message, type) {
  statusDiv.textContent = message;
  statusDiv.className = type;
}

// Display download links
function displayResults(result) {
  resultsDiv.innerHTML = "<h3>Download Redacted Files:</h3>";

  result.files.forEach((filename) => {
    const link = document.createElement("a");
    link.href = `${API_URL}/download/${result.id}/${filename}`;
    link.className = "download-link";
    link.textContent = filename;
    link.download = filename;
    resultsDiv.appendChild(link);
  });

  // Add download all button
  if (result.files.length > 1) {
    const downloadAllLink = document.createElement("a");
    downloadAllLink.href = `${API_URL}/download/${result.id}`;
    downloadAllLink.className = "download-link";
    downloadAllLink.textContent = "📦 Download All (ZIP)";
    downloadAllLink.style.background = "#667eea";
    downloadAllLink.style.color = "white";
    downloadAllLink.style.fontWeight = "bold";
    downloadAllLink.download = "redacted_files.zip";
    resultsDiv.appendChild(downloadAllLink);
  }
}
