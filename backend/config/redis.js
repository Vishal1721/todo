const { createClient } = require("redis");

const redisClient = createClient({
  url: "redis://localhost:6379",
});

redisClient.on("error", (err) => {
  console.log("Redis Error:", err);
});

redisClient
  .connect()
  .then(() => console.log("Connected to Redis Successfully"))
  .catch((err) => console.error("Could not connect to Redis", err));

module.exports = redisClient;