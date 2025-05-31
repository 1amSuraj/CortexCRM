// const Campaign = require("../models/Campaign");
// const CommunicationLog = require("../models/CommunicationLog");
// const Segment = require("../models/Segment");
// const Customer = require("../models/Customer");

// // Simulate a delivery vendor
// function simulateVendorDelivery(customer, message) {
//   const status = Math.random() < 0.9 ? "SENT" : "FAILED"; // 90% success
//   return { status, message: message.replace("{{name}}", customer.name) };
// }

// exports.createCampaign = async (req, res) => {
//   const { name, messageTemplate, segmentId } = req.body;

//   try {
//     const segment = await Segment.findById(segmentId);
//     if (!segment) return res.status(404).json({ message: "Segment not found" });

//     const users = await Customer.find(segment.query);
//     const campaign = await Campaign.create({ name, messageTemplate, segmentId });

//     for (const user of users) {
//       const personalized = simulateVendorDelivery(user, messageTemplate);

//       await CommunicationLog.create({
//         campaignId: campaign._id,
//         customerId: user._id,
//         message: personalized.message,
//         status: personalized.status,
//       });

//       // In real delivery: vendor would hit Delivery Receipt API
//     }

//     res.status(201).json({ success: true, message: "Campaign delivered", totalUsers: users.length });
//   } catch (err) {
//     console.error("Campaign Error:", err);
//     res.status(500).json({ success: false, message: "Campaign delivery failed" });
//   }
// };

const Campaign = require("../models/Campaign");
const Customer = require("../models/Customer");
const CommunicationLog = require("../models/CommunicationLog");
const { createClient } = require("redis");

const redisClient = createClient();
redisClient.connect().then(() => {
  console.log("✅ Redis connected (CampaignController)");
});

exports.createCampaign = async (req, res) => {
  try {
    const { name, messageTemplate, segmentId } = req.body;

    // Find the segment and get its query
    const Segment = require("../models/Segment");
    const segment = await Segment.findById(segmentId);
    if (!segment) {
      return res.status(404).json({ error: "Segment not found" });
    }

    // Create campaign
    const campaign = new Campaign({
      name,
      messageTemplate,
      segmentId,
      createdAt: new Date(),
    });
    await campaign.save();

    // Fetch matching customers based on segment.query
    const customers = await Customer.find(segment.query);

    // For each customer, push message to Redis stream
    for (const customer of customers) {
      const personalizedMessage = messageTemplate.replace(
        "{{name}}",
        customer.name
      );

      const log = new CommunicationLog({
        campaignId: campaign._id,
        customerId: customer._id,
        message: personalizedMessage,
        status: "PENDING",
        createdAt: new Date(),
      });
      await log.save();

      await redisClient.xAdd("campaign_delivery", "*", {
        data: JSON.stringify({
          logId: log._id,
          customerPhone: customer.phone,
          message: personalizedMessage,
        }),
      });
    }

    res.status(200).json({ message: "Campaign created and dispatched." });
  } catch (err) {
    console.error("❌ Error creating campaign:", err);
    res.status(500).json({ error: "Failed to create campaign." });
  }
};
