const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  multiUpload,
  uploadBusinessLogo
} = require("../middleware/upload");
const Business = require("../models/Business");
const auth = require("../middleware/auth");

const router = express.Router();
const sendError = (res, code, msg) =>
  res.status(code).json({ success: false, message: msg });

/* ================= BUSINESS REGISTER ================= */
router.post("/register", multiUpload, async (req, res) => {
  try {
    const {
      businessName,
      ownerName,
      phone,
      email,
      password,
      businessType,
      address
    } = req.body;

    if (!businessName || !ownerName || !email || !password)
      return sendError(res, 400, "Missing fields");

    const exists = await Business.findOne({ email });
    if (exists) return sendError(res, 400, "Email exists");

    const hashed = await bcrypt.hash(password, 10);

    const verificationDocument =
      req.files?.verificationDocument?.[0]
        ? `/uploads/businessDocs/${req.files.verificationDocument[0].filename}`
        : null;

    const businessLogo =
      req.files?.businessLogo?.[0]
        ? `/uploads/businessLogo/${req.files.businessLogo[0].filename}`
        : null;

    if (!verificationDocument)
      return sendError(res, 400, "Verification PDF required");

    await new Business({
      businessName,
      ownerName,
      phone,
      email,
      password: hashed,
      businessType,
      address,
      role: "business",
      status: "pending",
      businessLogo,
      verificationDocument
    }).save();

    res.json({
      success: true,
      message: "Business registered (Pending approval)"
    });
  } catch (err) {
    console.log(err);
    sendError(res, 500, "Registration failed");
  }
});

/* ================= BUSINESS LOGIN ================= */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const business = await Business.findOne({ email });
  if (!business) return sendError(res, 400, "Account not found");

  if (business.status === "pending")
    return res.status(403).json({ status: "pending" });

  if (business.status === "rejected")
    return res.status(403).json({ status: "rejected" });

  const match = await bcrypt.compare(password, business.password);
  if (!match) return sendError(res, 400, "Wrong password");

  const token = jwt.sign(
    { id: business._id, role: "business" },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

    res.json({
    success: true,
    token,
    user: {
      id: business._id,
      email: business.email,
      role: "business",
      status: business.status
    }
  });
});

/* ================= UPDATE BUSINESS LOGO ================= */
router.put(
  "/logo",
  auth(["business"]),
  uploadBusinessLogo,
  async (req, res) => {
    if (!req.file) return sendError(res, 400, "No logo");

    const fileUrl = `/uploads/businessLogo/${req.file.filename}`;
    await Business.findByIdAndUpdate(req.user.id, { businessLogo: fileUrl });

    res.json({ success: true, file: fileUrl });
  }
);

module.exports = router;
