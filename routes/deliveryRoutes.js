const express = require("express");
const router = express.Router();
const { deliveryReceipt } = require("../controllers/deliveryController");

router.post("/", deliveryReceipt);

module.exports = router;
