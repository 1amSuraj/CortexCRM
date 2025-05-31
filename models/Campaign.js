const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema({
  name: String,
  messageTemplate: String,
  segmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Segment" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Campaign", campaignSchema);
