const mongoose = require("mongoose");
const categoryMap = require("../config/categoryMap");

const ProductSchema = new mongoose.Schema(
  {
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },

    title: { type: String, required: true },
    description: { type: String, required: true },

    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    stockQuantity: { type: Number, required: true },

    category: {
      type: String,
      enum: Object.keys(categoryMap),
      required: true,
    },

    subCategory: {
      type: String,
      required: true,
      validate: {
        validator(value) {
          return categoryMap[this.category]?.includes(value);
        },
        message: "Invalid subcategory for selected category",
      },
    },

    dealType: {
      type: String,
      enum: [
        "Flash Deal",
        "Discount Offer",
        "Limited Time Offer",
        "Buy One Get One",
        "Seasonal Offer",
      ],
      required: true,
    },

    images: [{ type: String }],

    redirectUrl: {
      type: String,
      required: true,
      match: [/^https?:\/\/.+/, "Invalid URL"],
    },

    expiryDate: { type: Date, required: true },

    status: {
      type: String,
      enum: ["active", "expired"],
      default: "active",
    },
  },
  { timestamps: true }
);

// * Auto-expire before save
//  */
ProductSchema.pre("save", function (next) {
  if (this.expiryDate && this.expiryDate < new Date()) {
    this.status = "expired";
  }
  next();
});

// /**
//  * Auto-expire on update queries
//  */
ProductSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.expiryDate && update.expiryDate < new Date()) {
    update.status = "expired";
  }
  next();
});

module.exports = mongoose.model("Product", ProductSchema);
