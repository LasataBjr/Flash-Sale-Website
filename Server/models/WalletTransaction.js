const mongoose = require("mongoose");

const WalletTransactionSchema = new mongoose.Schema(
  {
    wallet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
      required: true,
    },
    amount: Number,
    type: {
      type: String,
      enum: ["credit", "debit"],
    },
    description: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("WalletTransaction", WalletTransactionSchema);