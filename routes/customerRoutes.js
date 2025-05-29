const express = require("express");
const router = express.Router();
const { ingestCustomers } = require("../controllers/customerController");

router.post("/bulk", ingestCustomers);

module.exports = router;
