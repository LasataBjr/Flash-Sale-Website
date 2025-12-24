const express = require("express");
const path = require("path");
const User = require("../models/User");
const Business = require("../models/Business");
const auth = require("../middleware/auth");
const { sendMail } = require("../utils/email");
const {
  uploadBusinessLogo,
  uploadVerificationDocument
} = require("../middleware/upload");
const router = express.Router();

// GET all users
router.get("/users", auth(["admin"]), async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

// GET all businesses
router.get("/business", auth(["admin"]), async (req, res) => {
  const business = await Business.find().select("-password");
  res.json(business);
});

// DELETE a user
router.delete("/users/:id", auth(["admin"]), async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
});

// DELETE a business
router.delete("/business/:id", auth(["admin"]), async (req, res) => {
  await Business.findByIdAndDelete(req.params.id);
  res.json({ message: "Business account deleted" });
});

// MAKE someone admin
router.put("/make-admin/:id", auth(["admin"]), async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { role: "admin" });
  res.json({ message: "Role updated to Admin" });
});

//Approve an account
router.put("/business/approve/:id", auth(["admin"]), async (req, res) => {
  const business = await Business.findByIdAndUpdate(
    req.params.id,
    { status: "approved" },
    { new: true }
  );

  await sendMail(business.email, "Business Approved", `Your account is now active.`);
  res.json({ success: true });
});

//Reject an account
router.put("/business/reject/:id", auth(["admin"]), async (req, res) => {
  const business = await Business.findByIdAndUpdate(
    req.params.id,
    { status: "rejected" },
    { new: true }
  );

  await sendMail(business.email, "Business Rejected", "Sorry, rejected.");
  res.json({ success: true });
});

// Upload Business Verification Document (PDF)
router.post(
  "/business/upload-document/:id",
  auth(["admin"]),
  uploadVerificationDocument,
  async (req, res) => {
    if (!req.file) return res.status(400).json({ message: "PDF required" });

    const fileUrl = `/uploads/businessDocs/${req.file.filename}`;

    const business = await Business.findByIdAndUpdate(
      req.params.id,
      { verificationDocument: fileUrl },
      { new: true }
    );

    res.json({ success: true, file: fileUrl });
  }
);

// Upload Business Profile Logo (PNG/JPG)
router.post(
  "/business/upload-logo/:id",
  auth(["admin"]),
  uploadBusinessLogo,
  async (req, res) => {
    if (!req.file) return res.status(400).json({ message: "Logo required" });

    const fileUrl = `/uploads/businessLogo/${req.file.filename}`;

    const business = await Business.findByIdAndUpdate(
      req.params.id,
      { businessLogo: fileUrl },
      { new: true }
    );

    res.json({ success: true, file: fileUrl });
  }
);

module.exports = router;
