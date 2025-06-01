const express = require("express");
const router = express.Router();
const {
  createSegment,
  getUsersBySegment,
} = require("../controllers/segmentController");
const authenticateJWT = require("../middleware/auth");

router.post("/create", authenticateJWT, createSegment);
router.get("/:id/users", authenticateJWT, getUsersBySegment);

module.exports = router;
