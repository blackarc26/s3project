document.getElementById("uploadForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const uploadStatus = document.getElementById("uploadStatus");
  uploadStatus.textContent = "Uploading...";

  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];

  if (!file) {
    uploadStatus.textContent = "Please select a file.";
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("http://localhost:3000/upload", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const result = await response.text();
      uploadStatus.textContent = `File uploaded successfully: ${result}`;
    } else {
      uploadStatus.textContent = "Failed to upload file. Please try again.";
    }
  } catch (error) {
    console.error(error);
    uploadStatus.textContent = "An error occurred while uploading.";
  }
});

document
  .getElementById("retrieveForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const retrieveStatus = document.getElementById("retrieveStatus");
    retrieveStatus.textContent = "Retrieving file...";

    const bucketName = document.getElementById("bucketName").value.trim();
    const fileName = document.getElementById("fileName").value.trim();

    if (!bucketName || !fileName) {
      retrieveStatus.textContent =
        "Please provide both bucket name and file name.";
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/retrieve?bucketName=${bucketName}&fileName=${fileName}`
      );
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        link.textContent = `Download ${fileName}`;
        document.getElementById("fileContent").innerHTML = "";
        document.getElementById("fileContent").appendChild(link);
        retrieveStatus.textContent = "File retrieved successfully!";
      } else {
        retrieveStatus.textContent =
          "Failed to retrieve file. Please try again.";
      }
    } catch (error) {
      console.error(error);
      retrieveStatus.textContent =
        "An error occurred while retrieving the file.";
    }
  });
