const mongoose = require("mongoose");

const BusinessSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      required: [true, "Business name is required"],
      trim: true,
      minlength: 2,
      maxlength: 80
    },

    ownerName: {
      type: String,
      required: [true, "Owner name is required"],
      trim: true,
      minlength: 2,
      maxlength: 60
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^[0-9]{7,15}$/, "Invalid phone number"]
    },

    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"]
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6
    },

    businessType: {
      type: String,
      required: [true, "Business type is required"],
      trim: true
    },

    address: {
      type: String,
      required: [true, "Business address is required"],
      minlength: 5,
      maxlength: 200
    },

    businessDetail: {
      type: String,
      minlength: 10,
      maxlength: 500
    },

    websiteURL: {
      type: String,
      match: [/^https?:\/\/.+/, "Invalid website URL"],
    },

    facebookURL: {
      type: String,
      match: [/^https?:\/\/.+/, "Invalid Facebook URL"],
    },

    instagramURL: {
      type: String,
      match: [/^https?:\/\/.+/, "Invalid Instagram URL"],
    },

    verificationDocument: {
      type: String,
      required: [true, "Verification document required"],
      trim: true
    },

    // ⭐ NEW FIELD: Business Logo
    businessLogo: {
      type: String, // store: "/uploads/logo/abc.png"
      required: [true, "Business logo is required"]
    },

    // Approval Status
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },

    // System Role
    role: {
      type: String,
      default: "business"
    },

    // ⭐ NEW FIELD: Total Products vendor has added
    totalProducts: {
      type: Number,
      default: 0,
      min: 0
    },

    // ⭐ NEW FIELD: Wallet balance for CPC
    walletBalance: {
      type: Number,
      default: 0,
      min: 0
    },

    // ⭐ NEW FIELD: Total clicks received
    totalClicks: {
      type: Number,
      default: 0,
      min: 0
    },

    // ⭐ NEW FIELD: Number of purchased clients (conversions)
    purchasedClients: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Business", BusinessSchema);
