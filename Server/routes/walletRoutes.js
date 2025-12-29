const router = require("express").Router();
const auth = require("../middleware/auth");
const walletController = require("../controller/walletController");
const khaltiController = require("../controller/khaltiController");

router.get("/statement", auth(["business"]), walletController.getStatement);
router.post("/cash-topup", auth(["business"]), walletController.cashTopup);

router.post("/khalti/initiate", auth(["business"]), khaltiController.initiatePayment);
router.post("/khalti/verify", auth(["business"]), khaltiController.verifyPayment);

module.exports = router;