const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passportConfig = require("./lib/passportConfig");
const cors = require("cors");
const fs = require("fs");
const dotenv = require("dotenv").config(); 

const mongo_db = process.env.MONGO_URI;

// Connect to MongoDB
mongoose
  .connect(mongo_db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.error("MongoDB connection error:", err.message)); 

// Initializing directories
const publicDir = "./public";
const resumeDir = `${publicDir}/resume`;
const profileDir = `${publicDir}/profile`;

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}
if (!fs.existsSync(resumeDir)) {
  fs.mkdirSync(resumeDir);
}
if (!fs.existsSync(profileDir)) {
  fs.mkdirSync(profileDir);
}

const app = express();
const port = 4444;

app.use(bodyParser.json()); // Support JSON encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // Support URL encoded bodies

// Setting up middlewares

const allowedOrigins = [
  "https://job-webapp-gray.vercel.app",
  "http://localhost:3000", // For local development
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, origin);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(passportConfig.initialize());

// Routing
app.use("/auth", require("./routes/authRoutes"));
app.use("/api", require("./routes/apiRoutes"));
app.use("/upload", require("./routes/uploadRoutes"));
app.use("/host", require("./routes/downloadRoutes"));

app.listen(port, () => {
  console.log(`Server started on port ${port}!`);
});
