const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  city: String,
  gender: String,
  age: Number,
  totalSpend: Number,
  visits: Number,
  lastActive: Date,
  signupSource: String, // (e.g., "website", "app", "referral")
  loyaltyStatus: String, // (e.g., "gold", "silver", "new")
});

module.exports = mongoose.model("Customer", customerSchema);
