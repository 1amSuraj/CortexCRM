const express = require("express");
const { createCampaign } = require("../controllers/campaignController");
const router = express.Router();
// const { createCampaign } = require("../controllers/campaignController");

router.post("/create", createCampaign);

module.exports = router;
