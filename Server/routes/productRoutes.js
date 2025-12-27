const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { uploadProductImages } = require("../middleware/upload");
const {
  createProduct,
  getMyProducts,
  deleteProduct,
  updateProduct
} = require("../controller/productController");

/**
 * BUSINESS ONLY
 * Status must be approved
 */

router.post("/", auth(["business"]), uploadProductImages, createProduct);
router.get("/my-products", auth(["business"]), getMyProducts);
router.put("/:id", auth(["business"]), uploadProductImages, updateProduct);
router.delete("/:id", auth(["business"]), deleteProduct);


module.exports = router;
