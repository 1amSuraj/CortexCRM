const redis = require("../config/redis");

const redisPublisher = async (stream, data) => {
  await redis.xadd(stream, "*", ...Object.entries(data).flat());
};

module.exports = redisPublisher;
