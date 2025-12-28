const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Business = require("../models/Business");

module.exports = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized: No Token Provided" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const account =
        decoded.role === "business"
          ? await Business.findById(decoded.id)
          : await User.findById(decoded.id);

      if (!account) {
        return res.status(404).json({ success: false, message: "Account Not Found" });
      }

      if (allowedRoles.length > 0 && !allowedRoles.includes(account.role)) {
        return res.status(403).json({ success: false, message: "Forbidden: Role Access Denied" });
      }

      if (account.role === "business") {
          if (account.status === "pending") {
          return res.status(403).json({
            success: false,
            status: "pending",
            message: "Your business approval is pending. Admin will review shortly.",
          });
        }
        if (account.status === "rejected") {
          return res.status(403).json({
            success: false,
            status: "rejected",
            message: "Your business account is rejected. Contact support.",
          });
        }
      }

      req.user = account;
      return next();
    } catch (err) {
      console.error("Auth error:", err);
      return res.status(401).json({ success: false, message: "Invalid or Expired Token" });
    }
  };
};
