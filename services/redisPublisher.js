// const { createClient } = require("../config/redis");

// const client = createClient();

// client.connect();

// const publishToCustomerStream = async (data) => {
//   await client.publish("customer_ingest", JSON.stringify(data));
// };

// module.exports = { publishToCustomerStream };

// const redis = require("../config/redis");

// // Publishes data to a given channel
// const publishToChannel = async (channel, data) => {
//   await redis.publish(channel, JSON.stringify(data));
// };

// module.exports = publishToChannel;

const { createClient } = require("redis");

const redisClient = createClient();

redisClient.on("error", (err) => console.error("Redis Error:", err));

async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}

async function publishCustomerToStream(customerData) {
  await connectRedis();

  await redisClient.xAdd(
    "customer_ingest", // stream name
    "*", // auto-generated ID
    {
      data: JSON.stringify(customerData),
    }
  );
  console.log("✅ Pushed to customer_ingest");
}

module.exports = {
  publishCustomerToStream,
};
