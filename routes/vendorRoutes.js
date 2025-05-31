const express = require("express");
const router = express.Router();
const axios = require("axios");

// Simulate vendor delivery
router.post("/send", async (req, res) => {
  const { logId, customerPhone, message } = req.body;
  // Simulate delivery status
  const status = Math.random() < 0.9 ? "SENT" : "FAILED";

  // Call delivery receipt API
  await axios.post("http://localhost:5000/api/delivery-receipt", {
    logId,
    status,
  });

  res.json({ status });
});

module.exports = router;
