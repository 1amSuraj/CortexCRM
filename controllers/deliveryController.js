const CommunicationLog = require("../models/CommunicationLog");

exports.deliveryReceipt = async (req, res) => {
  const { logId, status } = req.body;
  try {
    await CommunicationLog.findByIdAndUpdate(logId, { status });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
