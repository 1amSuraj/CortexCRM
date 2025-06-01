const express = require("express");
const cors = require("cors");
const passport = require("passport");
require("./config/passport");

const customerRoutes = require("./routes/customerRoutes");
const segmentRoutes = require("./routes/segmentRoutes");
const campaignRoutes = require("./routes/campaignRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const deliveryRoutes = require("./routes/deliveryRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(passport.initialize());

app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/segments", segmentRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/vendor", vendorRoutes);
app.use("/api/delivery-receipt", deliveryRoutes);

app.get("/", (req, res) => res.send("Mini CRM Backend is running"));

module.exports = app;
