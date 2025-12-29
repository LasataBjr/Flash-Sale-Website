const express = require("express");
const router = express.Router();
const multer = require("multer");
const auth = require("../middleware/auth");
const { uploadProductImages } = require("../middleware/upload");
const {
  createProduct,
  getMyProducts,
  getSingleProduct,
  deleteProduct,
  updateProduct,
} = require("../controller/productController");


const handleMulterError = (uploadMiddleware) => (req, res, next) => {
  uploadMiddleware(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred (e.g., file limit exceeded)
      return res.status(400).json({ success: false, message: `Multer Error: ${err.message}` });
    } else if (err) {
      // Other errors (e.g., from fileFilter)
      return res.status(400).json({ success: false, message: `Upload Error: ${err.message}` });
    }
    // Success: move to the next middleware/controller
    next();
  });
};

// CREATE
router.post(
  "/",
  auth(["business"]),
  // Use the helper to properly wrap the upload middleware
  handleMulterError(uploadProductImages),
  createProduct
);

// READ ALL (business products)
router.get(
  "/my-products",
  auth(["business"]),
  getMyProducts
);

// READ SINGLE PRODUCT
router.get("/:id", auth(["business"]), getSingleProduct);

// UPDATE
router.put(
  "/:id",
  auth(["business"]),
  handleMulterError(uploadProductImages),
  updateProduct
);

//Toggling Status
router.patch("/:id/status", auth(["business"]), async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      business: req.user._id,
    });

    if (!product)
      return res.status(404).json({ success: false, message: "Not found" });

    product.status = req.body.status;
    await product.save();
    res.json({ success: true, product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


// DELETE
router.delete(
  "/:id",
  auth(["business"]),
  deleteProduct
);

module.exports = router;
