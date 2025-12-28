const multer = require("multer");
const path = require("path");
const fs = require("fs");

const folders = {
  root: "uploads",
  profiles: "uploads/profiles",
  businessLogo: "uploads/businessLogo",
  businessDocs: "uploads/businessDocs",
  products: "uploads/products",
};

Object.values(folders).forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const map = {
      profileImage: folders.profiles,
      businessLogo: folders.businessLogo,
      verificationDocument: folders.businessDocs,
      productImages: folders.products,
    };
    cb(null, map[file.fieldname] || folders.root);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const imageTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
const pdfTypes = ["application/pdf"];

const fileFilter = (req, file, cb) => {
  console.log("Incoming file:", file.fieldname, file.mimetype);
  if (["profileImage", "businessLogo", "productImages"].includes(file.fieldname)) {
    if (!imageTypes.includes(file.mimetype)) {
      return cb(new Error("Only image files allowed"), false);
    }
  }
  if (file.fieldname === "verificationDocument") {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF allowed"), false);
    }
  }
  cb(null, true);
};


const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

module.exports = {
  uploadProfileImage: upload.single("profileImage"),
  uploadBusinessLogo: upload.single("businessLogo"),
  uploadVerificationDocument: upload.single("verificationDocument"),
  multiUpload: upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "businessLogo", maxCount: 1 },
    { name: "verificationDocument", maxCount: 1 },
  ]),
  uploadProductImages: upload.array("productImages", 5),
};
