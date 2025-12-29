const Wallet = require("../models/Wallet");
const WalletTransaction = require("../models/WalletTransaction");
const ClickLog = require("../models/ClickLog");

module.exports = async function trackClick(req, res, next) {
  try {
    const productId = req.params.productId;
    const userId = req.user._id;

    let wallet = await Wallet.findOne({ business: req.product.business });
    if (!wallet || wallet.balance < 1) {
      return res.status(402).json({
        success: false,
        message: "Insufficient wallet balance",
      });
    }

    // Deduct 1 unit per click
    wallet.balance -= 1;
    await wallet.save();

    await WalletTransaction.create({
      wallet: wallet._id,
      amount: 1,
      type: "debit",
      description: "Product click charge",
    });

    await ClickLog.create({
      product: productId,
      user: userId,
      cost: 1,
    });

    next(); // ✅ THIS FIXES YOUR ERROR
  } catch (err) {
    console.error("CLICK TRACK ERROR:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};