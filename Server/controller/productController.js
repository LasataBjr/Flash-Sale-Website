const Product = require("../models/Product");

// ================= CREATE =================
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create({
      business: req.user._id,
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      discount: req.body.discount || 0,

      // ✅ FIXED FIELD NAMES
      stockQuantity: req.body.stockQuantity,
      category: req.body.category,
      dealType: req.body.dealType,
      redirectUrl: req.body.redirectUrl,
      expiryDate: req.body.expiryDate,

      images:
        req.files?.map(
          (file) => `/uploads/products/${file.filename}`
        ) || [],
    });

    res.status(201).json({ success: true, product });
    console.log("REQ.BODY:", req.body);
    console.log("REQ.FILES:", req.files);
  } catch (err) {
    console.error("CREATE PRODUCT ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ================= READ (Business) =================
exports.getMyProducts = async (req, res) => {
  const products = await Product.find({ business: req.user._id });
  res.json({ success: true, products });
};

// ================= UPDATE =================
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Not found" });

    if (product.business.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Unauthorized" });

    // ✅ FIXED FIELD NAMES
    Object.assign(product, {
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      discount: req.body.discount,
      stockQuantity: req.body.stockQuantity,
      category: req.body.category,
      dealType: req.body.dealType,
      redirectUrl: req.body.redirectUrl,
      expiryDate: req.body.expiryDate,
    });

    if (req.files?.length) {
      product.images = req.files.map(
        (f) => `/uploads/products/${f.filename}`
      );
    }

    await product.save();

    res.json({ success: true, product });
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ================= DELETE =================
exports.deleteProduct = async (req, res) => {
  await Product.findOneAndDelete({
    _id: req.params.id,
    business: req.user._id,
  });

  res.json({ success: true });
};
