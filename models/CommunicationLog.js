// const mongoose = require("mongoose");

// const communicationLogSchema = new mongoose.Schema({
//   campaignId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Campaign",
//     required: true,
//   },
//   customerId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Customer",
//     required: true,
//   },
//   message: { type: String, required: true },
//   status: {
//     type: String,
//     enum: ["PENDING", "SENT", "FAILED"],
//     default: "PENDING",
//   },
//   vendorResponseTime: { type: Date },
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("CommunicationLog", communicationLogSchema);
const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign" },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  message: String,
  status: {
    type: String,
    enum: ["PENDING", "SENT", "FAILED"],
    default: "PENDING",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("CommunicationLog", logSchema);
