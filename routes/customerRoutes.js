const express = require("express");
const router = express.Router();
const { ingestCustomers } = require("../controllers/customerController");
const authenticateJWT = require("../middleware/auth");

router.post("/bulk", authenticateJWT, ingestCustomers);

module.exports = router;
