// const Joi = require("joi");
// const redisPublisher = require("../services/redisPublisher");

// const customerSchema = Joi.object({
//   name: Joi.string().required(),
//   email: Joi.string().email().required(),
//   phone: Joi.string().required(),
//   totalSpend: Joi.number().required(),
//   visits: Joi.number().required(),
//   lastActive: Joi.date().required(),
// });

// const ingestCustomers = async (req, res) => {
//   try {
//     const customers = req.body;

//     if (!Array.isArray(customers)) {
//       return res.status(400).json({ error: "Expected an array of customers" });
//     }

//     for (const customer of customers) {
//       const { error } = customerSchema.validate(customer);
//       if (error) return res.status(400).json({ error: error.message });

//       await redisPublisher("customer_stream", customer);
//     }

//     return res.json({ message: "Customers submitted to Redis" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// module.exports = { ingestCustomers };

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
