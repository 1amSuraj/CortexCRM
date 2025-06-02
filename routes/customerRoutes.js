const express = require("express");
const router = express.Router();
const {
  ingestCustomers,
  ingestCustomersCSV,
} = require("../controllers/customerController");
const authenticateJWT = require("../middleware/auth");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post("/bulk", authenticateJWT, ingestCustomers);
router.post(
  "/bulk-csv",
  authenticateJWT,
  upload.single("file"),
  ingestCustomersCSV
);

module.exports = router;
