const express = require("express");
const cors = require("cors");
const customerRoutes = require("./routes/customerRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/customers", customerRoutes);

app.get("/", (req, res) => res.send("Mini CRM Backend is running"));

module.exports = app;
