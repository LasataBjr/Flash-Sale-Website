

const Business = require("../models/Business");
const sendEmail = require("../utils/email");


exports.getBusinesses = async (req, res) => {
  const data = await Business.find().sort({ createdAt: -1 });
  res.json(data);
};

exports.approveBusiness = async (req, res) => {
  const { id } = req.params;
  const { notes } = req.body;

  const biz = await Business.findByIdAndUpdate(
    id,
    { status: "approved", notes },
    { new: true }
  );

  await sendEmail(biz.email, "Business Approved", `Congratulations, ${biz.name} has been approved!`);

  res.json({ success: true, biz });
};

exports.rejectBusiness = async (req, res) => {
  const { id } = req.params;
  const { notes } = req.body;

  const biz = await Business.findByIdAndUpdate(
    id,
    { status: "rejected", notes },
    { new: true }
  );

  await sendEmail(biz.email, "Business Rejected", `Sorry, ${biz.name} has been rejected: ${notes}`);

  res.json({ success: true, biz });
};
