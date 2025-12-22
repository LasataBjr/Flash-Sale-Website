const express = require("express");
const User = require("../models/User");
const Business = require("../models/Business");
const auth = require("../middleware/auth");
const nodemailer = require("nodemailer");
const { sendMail } = require("../utils/email");
// const adminCon = require("../controller/adminController");
const { uploadDocument, uploadImage } = require("../middleware/upload");
const router = express.Router();

// const { getBusinesses, approveBusiness, rejectBusiness } = adminCon;
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

// GET all pending accounts (Users + Business)
router.get("/pending", auth(["admin"]), async (req, res) => {
  const users = await User.find({ status: "pending" }).select("-password");
  const businesses = await Business.find({ status: "pending" }).select("-password");

  res.json({ users, businesses });
});

//Approve an account
router.put("/business/approve/:id", auth(["admin"]), async (req, res) => {
  try {
    const business = await Business.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );

    await sendMail(
      business.email,
      "Your Business Account is Approved",
      `<p>Congratulations! Your account has been approved and is now active.</p>`
    );

    res.json({ success: true, message: "Business Approved & Email Sent" });

  } catch (error) {
    console.log(error);
    sendError(res, 500, "Mail failed");
  }
});



//Reject an account
router.put("/business/reject/:id", auth(["admin"]), async (req, res) => {
  try {
    const business = await Business.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );

    await sendMail(
      business.email,
      "Your Business Account is Rejected",
      `<p>Sorry, your account was not approved. Contact support for details.</p>`
    );

    res.json({ success: true, message: "Business Rejected & Email Sent" });

  } catch (error) {
    console.log(error);
    sendError(res, 500, "Mail failed");
  }
});


//Undo a rejected account → set back to pending
router.patch("/pending/:id", auth(["admin"]), async (req, res) => {
  let account = await User.findById(req.params.id) || await Business.findById(req.params.id);

  if (!account) return res.status(404).json({ message: "Account not found" });

  account.status = "pending";
  await account.save();

  res.json({ message: "Account moved back to Pending" });
});

//to view file metadata
router.get("/business/file/:id", auth(["admin"]), async (req, res) => {
  const business = await Business.findById(req.params.id);

  if (!business || !business.document) {
    return res.status(404).json({ message: "No document found" });
  }

  res.json({
    filename: path.basename(business.document),
    url: `/api/admin/file-stream/${business._id}`
  });
});

//Stream file to browser
router.get("/file-stream/:id", auth(["admin"]), async (req, res) => {
  const business = await Business.findById(req.params.id);
  if (!business || !business.document) return res.sendStatus(404);

  const filePath = path.join(__dirname, "..", business.document);
  res.sendFile(filePath);
});

// Upload Business Verification Document (PDF)
router.post(
  "/business/upload-document/:id",
  auth(["admin"]),
  uploadDocument.single("document"),
  async (req, res) => {
    try {
      const business = await Business.findByIdAndUpdate(
        req.params.id,
        { document: req.file.path },
        { new: true }
      );

      res.json({
        success: true,
        message: "Document uploaded successfully",
        file: business.document
      });
    } catch (err) {
      res.status(500).json({ success: false, message: "Upload failed" });
    }
  }
);

// Upload Business Profile Logo (PNG/JPG)
router.post(
  "/business/upload-logo/:id",
  auth(["admin"]),
  uploadImage.single("logo"),
  async (req, res) => {
    try {
      const business = await Business.findByIdAndUpdate(
        req.params.id,
        { logo: req.file.path },
        { new: true }
      );

      res.json({
        success: true,
        message: "Logo uploaded successfully",
        file: business.logo
      });
    } catch (err) {
      res.status(500).json({ success: false, message: "Upload failed" });
    }
  }
);




module.exports = router;
