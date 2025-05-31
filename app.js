const express = require("express");
const cors = require("cors");
const customerRoutes = require("./routes/customerRoutes");
// const campaignRoutes = require("./routes/campaignRoutes");
const segmentRoutes = require("./routes/segmentRoutes");
const campaignRoutes = require("./routes/campaignRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const deliveryRoutes = require("./routes/deliveryRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/customers", customerRoutes);

app.get("/", (req, res) => res.send("Mini CRM Backend is running"));

app.use("/api/segments", segmentRoutes);

app.use("/api/campaigns", campaignRoutes);

app.use("/api/vendor", vendorRoutes);

app.use("/api/delivery-receipt", deliveryRoutes);

module.exports = app;
