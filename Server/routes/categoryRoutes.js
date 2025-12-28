// server/routes/categoryRoutes.js
const express = require("express");
const router = express.Router();
const categoryMap = require("../config/categoryMap");

router.get("/", (req, res) => {
  res.json(categoryMap);
});

module.exports = router;
