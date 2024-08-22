import Redis from "ioredis";

const redis = new Redis({
  host: "localhost", // Redis server host
  port: 6379, // Redis server port
  // Add any other options if needed, e.g., password
});

export default redis;
