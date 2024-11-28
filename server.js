const express = require("express");
const AWS = require("aws-sdk");
const multer = require("multer");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// Configure AWS S3
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

// File upload setup using Multer
const upload = multer({ storage: multer.memoryStorage() });

// Enable CORS for frontend access
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Upload a file to S3
app.post("/upload", upload.single("file"), (req, res) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: req.file.originalname,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  };

  s3.upload(params, (error, data) => {
    if (error) {
      res.status(500).send("Error uploading file.");
    } else {
      res.status(200).send(`File uploaded: ${data.Location}`);
    }
  });
});

// Retrieve a file from S3
app.get("/retrieve", (req, res) => {
  const { bucketName, fileName } = req.query;

  const params = {
    Bucket: bucketName,
    Key: fileName,
  };

  s3.getObject(params, (error, data) => {
    if (error) {
      res.status(500).send("Error retrieving file.");
    } else {
      res.writeHead(200, { "Content-Type": data.ContentType });
      res.write(data.Body);
      res.end();
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
