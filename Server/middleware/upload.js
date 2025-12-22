const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure folders exist
const ensureDir = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

// ----------------------
// DOCUMENT UPLOAD (PDF)
// ----------------------
const docFolder = path.join(__dirname, "../uploads/businessDocs");
ensureDir(docFolder);

const docStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, docFolder);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + "-DOC" + ext);
  }
});

const uploadDocument = multer({
  storage: docStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB max
  },
  fileFilter: (req, file, cb) => {
    const allowed = ["application/pdf"];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Only PDF documents allowed"));
    }
    cb(null, true);
  }
});

// ----------------------
// IMAGE UPLOAD (Logo/Image)
// ----------------------
const imageFolder = path.join(__dirname, "../uploads/businessLogos");
ensureDir(imageFolder);

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imageFolder);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, Date.now() + "-IMG" + ext);
  }
});

const uploadImage = multer({
  storage: imageStorage,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2 MB max
  },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Only JPG, JPEG, PNG images allowed"));
    }
    cb(null, true);
  }
});

module.exports = {
  uploadDocument,
  uploadImage
};