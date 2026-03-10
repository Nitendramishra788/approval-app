// models/approval.js
const mongoose = require("mongoose");

const approvalSchema = new mongoose.Schema({
  statement: String,
  partner1Signature: { type: String, enum: ["yes","no"] },
  partner2Signature: { type: String, enum: ["pending","yes","no"], default: "pending" },
  logs: [
    {
      user: String,
      action: String,
      timestamp: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Approval", approvalSchema);