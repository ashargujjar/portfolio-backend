import IORedis from "ioredis";

const port = process.env.REDIS_PORT
  ? parseInt(process.env.REDIS_PORT, 10)
  : 6379;

export const connection = process.env.REDIS_URL
  ? new IORedis(process.env.REDIS_URL, { maxRetriesPerRequest: null })
  : new IORedis({
      host: process.env.REDIS_HOST || "127.0.0.1",
      port: port,
      maxRetriesPerRequest: null,
    });

connection.on("error", (err) => console.error("Redis Error:", err));
