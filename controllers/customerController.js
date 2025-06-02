const { publishCustomerToStream } = require("../services/redisPublisher");
const csv = require("csvtojson");
const fs = require("fs");

exports.ingestCustomers = async (req, res) => {
  const customers = req.body.customers;

  if (!Array.isArray(customers) || customers.length === 0) {
    return res.status(400).json({ message: "No customers provided" });
  }

  try {
    for (const customer of customers) {
      await publishCustomerToStream(customer);
    }

    return res.status(200).json({ message: "Customers submitted to stream" });
  } catch (err) {
    console.error("Error publishing to Redis Stream:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.ingestCustomersCSV = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const customers = await csv().fromFile(req.file.path);

    if (!Array.isArray(customers) || customers.length === 0) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "CSV file is empty or invalid" });
    }

    for (const customer of customers) {
      await publishCustomerToStream(customer);
    }

    fs.unlinkSync(req.file.path); // Clean up uploaded file
    return res
      .status(200)
      .json({ message: "Customers submitted to stream from CSV" });
  } catch (err) {
    if (req.file) fs.unlinkSync(req.file.path);
    console.error("Error processing CSV:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
