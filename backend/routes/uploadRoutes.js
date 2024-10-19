const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { promisify } = require("util");
const { pipeline } = require("stream");

const router = express.Router();
const upload = multer();
const pipelineAsync = promisify(pipeline);

router.post("/resume", upload.single("file"), (req, res) => {
  const { file } = req;
  if (file.detectedFileExtension !== ".pdf") {
    return res.status(400).json({ message: "Invalid format" });
  }

  const filename = `${uuidv4()}${file.detectedFileExtension}`;

  pipelineAsync(
    file.stream,
    fs.createWriteStream(`${__dirname}/../public/resume/${filename}`)
  )
    .then(() => {
      res.send({
        message: "File uploaded successfully",
        url: `/host/resume/${filename}`,
      });
    })
    .catch((err) => {
      console.error(err); // Log the error for debugging
      res.status(400).json({ message: "Error while uploading" });
    });
});

router.post("/profile", upload.single("file"), (req, res) => {
  const { file } = req;
  if (file.detectedFileExtension !== ".jpg" && file.detectedFileExtension !== ".png") {
    return res.status(400).json({ message: "Invalid format" });
  }

  const filename = `${uuidv4()}${file.detectedFileExtension}`;

  pipelineAsync(
    file.stream,
    fs.createWriteStream(`${__dirname}/../public/profile/${filename}`)
  )
    .then(() => {
      res.send({
        message: "Profile image uploaded successfully",
        url: `/host/profile/${filename}`,
      });
    })
    .catch((err) => {
      console.error(err); // Log the error for debugging
      res.status(400).json({ message: "Error while uploading" });
    });
});

module.exports = router;
