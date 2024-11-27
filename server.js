const express = require("express");
const AWS = require("aws-sdk");
const multer = require("multer");
const upload = multer(); // To parse file uploads

const app = express();
const port = 3000;

// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "us-west-2", // Adjust the region as needed
});

const s3 = new AWS.S3();

// Handle file uploads
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    const params = {
      Bucket: "your-s3-bucket-name",
      Key: file.originalname,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const uploadResult = await s3.upload(params).promise();
    res.status(200).send(uploadResult.Location);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error uploading file");
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
