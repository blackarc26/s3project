document.getElementById("uploadForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const status = document.getElementById("status");
  status.textContent = "Uploading...";

  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];

  if (!file) {
    status.textContent = "Please select a file.";
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("https://your-backend-url/upload", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const result = await response.text();
      status.textContent = `File uploaded successfully: ${result}`;
    } else {
      status.textContent = "Failed to upload file. Please try again.";
    }
  } catch (error) {
    console.error(error);
    status.textContent = "An error occurred while uploading.";
  }
});
