const router = require("express").Router();
const auth = require("../middleware/auth");
const trackClick = require("../middleware/trackClick");

router.post("/:productId", auth(["user"]), trackClick, (req, res) => {
  res.json({ success: true });
});

module.exports = router;