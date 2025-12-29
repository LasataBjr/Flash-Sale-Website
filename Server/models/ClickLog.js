// models/ClickLog.js
const mongoose = require("mongoose");

const ClickLogSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },
    ip: String,
    userAgent: String,
    cost: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("ClickLog", ClickLogSchema);
