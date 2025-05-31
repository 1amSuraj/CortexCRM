const { createClient } = require("redis");
const axios = require("axios");

const STREAM_KEY = "campaign_delivery";
const CONSUMER_GROUP = "campaign_group";
const CONSUMER_NAME = "campaign_worker";

const redisClient = createClient();

async function init() {
  await redisClient.connect();

  try {
    await redisClient.xGroupCreate(STREAM_KEY, CONSUMER_GROUP, "0", {
      MKSTREAM: true,
    });
  } catch (err) {
    if (!err.message.includes("BUSYGROUP")) {
      console.error("Error creating consumer group:", err.message);
    }
  }

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
            const fields = msg.message;
            const data = JSON.parse(fields.data);

            // Call dummy vendor API
            await axios.post("http://localhost:5000/api/vendor/send", data);
            await redisClient.xAck(STREAM_KEY, CONSUMER_GROUP, msg.id);
          }
        }
      }
    } catch (err) {
      console.error("Campaign delivery worker error:", err.message);
    }
  }
}

init();
