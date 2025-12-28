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
  const products = await Product.find({ business: req.user._id });
  res.json({ success: true, products });
};

// UPDATE
exports.updateProduct = async (req, res) => {
  const product = await Product.findOne({
    _id: req.params.id,
    business: req.user._id,
  });

  if (!product) {
    return res.status(404).json({ success: false, message: "Not found" });
  }

  Object.assign(product, req.body);

  if (req.files?.length) {
    product.images = req.files.map(f => `/uploads/products/${f.filename}`);
  }

  await product.save();
  res.json({ success: true, product });
};

// DELETE
exports.deleteProduct = async (req, res) => {
  await Product.findOneAndDelete({
    _id: req.params.id,
    business: req.user._id,
  });

  res.json({ success: true, message: "Product deleted" });
};
