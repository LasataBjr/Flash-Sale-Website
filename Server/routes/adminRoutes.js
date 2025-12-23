const express = require("express");
const User = require("../models/User");
const Business = require("../models/Business");
const auth = require("../middleware/auth");
const {
  uploadBusinessLogo,
  uploadVerificationDocument
} = require("../middleware/upload");
const { sendMail } = require("../utils/email");

const router = express.Router();

/* ================= LIST ================= */
router.get("/users", auth(["admin"]), async (req, res) => {
  res.json(await User.find().select("-password"));
});

router.get("/business", auth(["admin"]), async (req, res) => {
  res.json(await Business.find().select("-password"));
});

/* ================= APPROVE / REJECT ================= */
router.put("/business/approve/:id", auth(["admin"]), async (req, res) => {
  const business = await Business.findByIdAndUpdate(
    req.params.id,
    { status: "approved" },
    { new: true }
  );

  await sendMail(business.email, "Approved", "Your account is active");
  res.json({ success: true });
});

router.put("/business/reject/:id", auth(["admin"]), async (req, res) => {
  const business = await Business.findByIdAndUpdate(
    req.params.id,
    { status: "rejected" },
    { new: true }
  );

  await sendMail(business.email, "Rejected", "Account rejected");
  res.json({ success: true });
});

/* ================= ADMIN UPLOAD ================= */
router.post(
  "/business/upload-document/:id",
  auth(["admin"]),
  uploadVerificationDocument,
  async (req, res) => {
    const fileUrl = `/uploads/businessDocs/${req.file.filename}`;
    await Business.findByIdAndUpdate(req.params.id, {
      verificationDocument: fileUrl
    });
    res.json({ success: true, file: fileUrl });
  }
);

router.post(
  "/business/upload-logo/:id",
  auth(["admin"]),
  uploadBusinessLogo,
  async (req, res) => {
    const fileUrl = `/uploads/businessLogo/${req.file.filename}`;
    await Business.findByIdAndUpdate(req.params.id, {
      businessLogo: fileUrl
    });
    res.json({ success: true, file: fileUrl });
  }
);

module.exports = router;
