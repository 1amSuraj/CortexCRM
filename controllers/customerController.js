const { publishCustomerToStream } = require("../services/redisPublisher");

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
