const express = require("express");
const router = express.Router();
const {
  createSegment,
  getUsersBySegment,
} = require("../controllers/segmentController");

router.post("/create", createSegment);
router.get("/:id/users", getUsersBySegment);

module.exports = router;
