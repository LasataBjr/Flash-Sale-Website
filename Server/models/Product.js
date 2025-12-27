// models/Product.js
const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    // 🔗 Business who posted the deal
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
      index: true,
    },

    // 🏷️ Product Title
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // 📝 Product Description
    description: {
      type: String,
      required: true,
    },

    // 💰 Original Price
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    // 🔖 Discount (percentage or flat)
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // 📦 Stock Quantity
    stockQuantity: {
      type: Number,
      required: true,
      min: 0,
    },

    // 📂 Category (Dropdown – 12 predefined values)
    category: {
      type: String,
      required: true,
      enum: [
        "Food & Beverage",
        "Electronics",
        "Fashion",
        "Travel",
        "Health & Beauty",
        "Education",
        "Automobile",
        "Real Estate",
        "Home & Living",
        "Entertainment",
        "Services",
        "Others",
      ],
    },

    // 🎯 Deal Type (Dropdown)
    dealType: {
      type: String,
      required: true,
      enum: [
        "Flash Deal",
        "Discount Offer",
        "Limited Time Offer",
        "Buy One Get One",
        "Seasonal Offer",
      ],
    },

    // 🖼️ Multiple Images
    images: [
      {
        type: String, // stored as image URL or path
      },
    ],

    // 🔗 External Directory / Vendor Website Link
    redirectUrl: {
      type: String,
      required: true,
    },

    // ⏰ Deal Expiry Date (Flash Deal Limit)
    expiryDate: {
      type: Date,
      required: true,
    },

    // 📊 Product Status
    status: {
      type: String,
      default: "active",
      enum: ["active", "expired", "disabled"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
