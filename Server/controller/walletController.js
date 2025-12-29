const Wallet = require("../models/Wallet");
const WalletTransaction = require("../models/WalletTransaction");

exports.getStatement = async (req, res) => {
  try {
    let wallet = await Wallet.findOne({ business: req.user._id })
      .populate("business");

    if (!wallet) {
      wallet = await Wallet.create({ business: req.user._id });
      wallet = await Wallet.findOne({ business: req.user._id })
        .populate("business");
    }

    const transactions = await WalletTransaction.find({
      wallet: wallet._id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      business: wallet.business, // ✅ populated Business doc
      closingBalance: wallet.balance,
      transactions,
    });
  } catch (err) {
    console.error("Wallet error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.cashTopup = async (req, res) => {
  try {
    const { amount } = req.body;
    let wallet = await Wallet.findOne({ business: req.user._id });
    if (!wallet) wallet = await Wallet.create({ business: req.user._id });

    wallet.balance += Number(amount);
    await wallet.save();

    await WalletTransaction.create({
      wallet: wallet._id,
      amount,
      type: "credit",
      description: "Cash top-up",
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Cash top-up error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};


