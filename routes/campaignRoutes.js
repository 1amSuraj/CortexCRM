const express = require("express");
const { createCampaign } = require("../controllers/campaignController");
const authenticateJWT = require("../middleware/auth");

const router = express.Router();

router.post("/create", authenticateJWT, createCampaign);

module.exports = router;
