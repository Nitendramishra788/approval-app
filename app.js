// app.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");

const app = express();

const PORT = process.env.PORT || 3000;

// MongoDB Connect
mongoose.connect(process.env.MONGO_URL)
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

// Start Server
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
