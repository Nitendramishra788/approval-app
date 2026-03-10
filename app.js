// app.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");

const app = express();
const port = 3000;

// Connect MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/approvalApp")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

// Routes
const approvalRoutes = require("./routes/approval");
app.use("/", approvalRoutes);

// Start server
app.listen(port, () => console.log(`Server running on port ${port}`));