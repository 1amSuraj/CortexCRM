const express = require("express");
const cors = require("cors");
const customerRoutes = require("./routes/customerRoutes");
// const campaignRoutes = require("./routes/campaignRoutes");
const segmentRoutes = require("./routes/segmentRoutes");
const campaignRoutes = require("./routes/campaignRoutes");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/customers", customerRoutes);

app.get("/", (req, res) => res.send("Mini CRM Backend is running"));

app.use("/api/segments", segmentRoutes);

app.use("/api/campaigns", campaignRoutes);

module.exports = app;
