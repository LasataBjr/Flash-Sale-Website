const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ensure upload folders exist
const folders = [
  "uploads",
  "uploads/profiles",
  "uploads/businessLogo",
  "uploads/businessDocs"
];

folders.forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "profileImage") return cb(null, "uploads/profiles");
    if (file.fieldname === "businessLogo") return cb(null, "uploads/businessLogo");
    if (file.fieldname === "verificationDocument")
      return cb(null, "uploads/businessDocs");

    cb(null, "uploads"); // fallback
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const imageTypes = ["image/jpeg", "image/png", "image/jpg"];
const pdfTypes = ["application/pdf"];

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "businessLogo" || file.fieldname === "profileImage") {
    if (!imageTypes.includes(file.mimetype))
      return cb(new Error("Only JPG/JPEG/PNG allowed"));
  }

  if (file.fieldname === "verificationDocument") {
    if (!pdfTypes.includes(file.mimetype))
      return cb(new Error("Only PDF allowed"));
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
});

const uploadProfileImage = upload.single("profileImage");
const uploadBusinessLogo = upload.single("businessLogo");
const uploadVerificationDocument = upload.single("verificationDocument");

const multiUpload = upload.fields([
  { name: "businessLogo", maxCount: 1 },
  { name: "verificationDocument", maxCount: 1 },
  { name: "profileImage", maxCount: 1 }
]);

module.exports = {
  uploadProfileImage,
  uploadBusinessLogo,
  uploadVerificationDocument,
  multiUpload
};
