const axios = require("axios");
const Wallet = require("../models/Wallet");
const WalletTransaction = require("../models/WalletTransaction");

exports.initiatePayment = async (req, res) => {
  const { amount } = req.body;

  const response = await axios.post(
    "https://a.khalti.com/api/v2/epayment/initiate/",
    {
      return_url: "http://localhost:5173/khalti-success",
      website_url: "http://localhost:5173",
      amount: amount * 100,
      purchase_order_id: Date.now(),
      purchase_order_name: "Wallet Topup",
    },
    {
      headers: {
        Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
      },
    }
  );

  res.json({ success: true, payment_url: response.data.payment_url });
};

exports.verifyPayment = async (req, res) => {
  const { amount } = req.body;

  let wallet = await Wallet.findOne({ business: req.user._id });
  if (!wallet) wallet = await Wallet.create({ business: req.user._id });

  wallet.balance += Number(amount);
  await wallet.save();

  await WalletTransaction.create({
    wallet: wallet._id,
    amount,
    type: "credit",
    description: "Khalti top-up",
  });

  res.json({ success: true });
};