const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASS,
  },
});

exports.sendMail = async (to, subject, html) => {
  return transporter.sendMail({
    from: `"Account Approval" <${process.env.SMTP_EMAIL}>`,
    to,
    subject,
    html,
  });
};
