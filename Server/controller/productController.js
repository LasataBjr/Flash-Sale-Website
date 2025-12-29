const Product = require("../models/Product");

// CREATE
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create({
      business: req.user._id,
      ...req.body,
      images: req.files.map(f => `/uploads/products/${f.filename}`),
    });

    res.status(201).json({ success: true, product });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// READ (business only)
exports.getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ business: req.user._id });
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// READ SINGLE PRODUCT
exports.getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      business: req.user._id,
    });

    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      business: req.user._id,
    });

    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    // Update fields
    Object.assign(product, req.body);

    // Handle images
    let updatedImages = [];
    if (req.body.existingImages) {
      try {
        updatedImages = JSON.parse(req.body.existingImages);
      } catch (err) {
        return res.status(400).json({ success: false, message: "Invalid existingImages format" });
      }
    }

    if (req.files?.length) {
      const newImages = req.files.map(f => `/uploads/products/${f.filename}`);
      updatedImages = [...updatedImages, ...newImages];
    }

    product.images = updatedImages;

    await product.save();
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE
exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findOneAndDelete({
      _id: req.params.id,
      business: req.user._id,
    });

    if (!deleted) return res.status(404).json({ success: false, message: "Product not found" });

    res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
