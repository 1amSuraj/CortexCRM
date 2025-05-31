const Segment = require("../models/Segment");
const { getQueryFromPrompt } = require("../utils/geminiClient");

// Create Segment
exports.createSegment = async (req, res) => {
  const { name } = req.body; // This is the sentence from the user

  try {
    console.log(1);
    const query = await getQueryFromPrompt(name);
    console.log(2);

    const segment = new Segment({ name, query });
    console.log(3);

    await segment.save();
    console.log(4);

    res.status(201).json({ success: true, segment });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Segment creation failed",
      error: err.message,
    });
  }
};

// Get Users by Segment ID
exports.getUsersBySegment = async (req, res) => {
  const { id } = req.params;
  const Customer = require("../models/Customer");

  try {
    const segment = await Segment.findById(id);
    if (!segment) return res.status(404).json({ message: "Segment not found" });

    const users = await Customer.find(segment.query);
    res.json({ users });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch users", error: err.message });
  }
};
