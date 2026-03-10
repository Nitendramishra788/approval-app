// routes/approval.js
const express = require("express");
const router = express.Router();
const Approval = require("../models/approval");
const nodemailer = require("nodemailer");

// NodeMailer config
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Partner 1 submit
router.get("/approval/form", (req,res) => {
  res.render("approvalForm");
});

router.post("/approval/create", async (req,res)=>{
  const { statement, partner1Signature, partner2Email } = req.body;
  if(partner1Signature.toLowerCase() !== "yes")
    return res.send("Partner 1 must type YES to confirm!");
  
  const approval = new Approval({ statement, partner1Signature });
  approval.logs.push({ user:"Partner 1", action:"Created and signed" });
  await approval.save();

  // Send email to partner 2
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: partner2Email,
    subject: "New Statement Approval Request",
    text: `Partner 1 submitted: ${statement}\nClick to approve: http://localhost:3000/approval/${approval._id}/view`
  });

  res.send("Sent to Partner 2 for approval!");
});

// Partner 2 view
router.get("/approval/:id/view", async (req,res)=>{
  const approval = await Approval.findById(req.params.id);
  res.render("approvalView",{ approval });
});

// Partner 2 approve/cancel
router.post("/approval/:id/approve", async (req,res)=>{
  const { partner2Signature } = req.body;
  const approval = await Approval.findById(req.params.id);

  approval.partner2Signature = partner2Signature;
  approval.logs.push({ user:"Partner 2", action:`Marked as ${partner2Signature}` });
  await approval.save();

  res.send(`Approval status updated to: ${partner2Signature}`);
});

// Full history/status page
router.get("/approvals/history", async (req,res)=>{
  const approvals = await Approval.find({}).sort({ createdAt:-1 });
  res.render("approvalHistory",{ approvals });
});

module.exports = router;