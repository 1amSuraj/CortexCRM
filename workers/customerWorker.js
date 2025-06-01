const { createClient } = require("redis");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Customer = require("../models/Customer");
const connectDB = require("../config/db");

dotenv.config();
connectDB();

const STREAM_KEY = "customer_ingest";
const CONSUMER_GROUP = "customer_group";
const CONSUMER_NAME = "customer_worker";

const redisClient = createClient();

redisClient.on("error", (err) => {
  console.error("Redis Error:", err);
});

async function init() {
  await redisClient.connect();
  console.log("Redis connected (Stream Consumer)");

  // Try to create consumer group (if not exists)
  try {
    await redisClient.xGroupCreate(STREAM_KEY, CONSUMER_GROUP, "0", {
      MKSTREAM: true,
    });
    console.log("✅ Consumer group created");
  } catch (err) {
    if (!err.message.includes("BUSYGROUP")) {
      console.error("Error creating consumer group:", err.message);
    } else {
      console.log("Consumer group already exists");
    }
  }

  // Poll for messages
  while (true) {
    try {
      const response = await redisClient.xReadGroup(
        CONSUMER_GROUP,
        CONSUMER_NAME,
        [{ key: STREAM_KEY, id: ">" }],
        { COUNT: 10, BLOCK: 5000 }
      );

      if (response) {
        for (const stream of response) {
          for (const msg of stream.messages) {
            const id = msg.id;
            const fields = msg.message;
            const data = JSON.parse(fields.data);
            console.log("📥 New data from Redis Stream:", data);

            try {
              if (Array.isArray(data)) {
                await Customer.insertMany(data);
              } else {
                const newCustomer = new Customer(data);
                await newCustomer.save();
              }

              // Acknowledge the message
              await redisClient.xAck(STREAM_KEY, CONSUMER_GROUP, id);
              console.log("Data saved & acknowledged");
            } catch (err) {
              console.error("MongoDB insert error:", err.message);
            }
          }
        }
      }
    } catch (err) {
      console.error("Redis read error:", err.message);
    }
  }
}

init();
