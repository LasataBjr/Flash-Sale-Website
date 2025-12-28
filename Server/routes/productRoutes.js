const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { uploadProductImages } = require("../middleware/upload");
const {
  createProduct,
  getMyProducts,
  deleteProduct,
  updateProduct,
} = require("../controller/productController");

// CREATE
router.post(
  "/",
  auth(["business"]),
  uploadProductImages,
  createProduct
);

// READ
router.get(
  "/my-products",
  auth(["business"]),
  getMyProducts
);

// UPDATE
router.put(
  "/:id",
  auth(["business"]),
  uploadProductImages,
  updateProduct
);

// DELETE
router.delete(
  "/:id",
  auth(["business"]),
  deleteProduct
);

module.exports = router;
