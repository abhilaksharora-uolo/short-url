import { Request, Response } from "express";
import knex from "../knex";
import redis from "../redis"; // Import the Redis client
import { populateRedisWithShortUrls } from "../redisService";

const SHORT_URL_BATCH_SIZE = 5;

export const shortenUrl = async (req: Request, res: Response) => {
  const { longUrl } = req.body;

  if (!longUrl) {
    return res.status(400).json({ error: "Long URL is required" });
  }

  try {
    // Fetch a short URL from Redis
    let shortUrl = await redis.rpop("shortUrls");

    // If no short URLs are available in Redis, repopulate
    if (!shortUrl) {
      await populateRedisWithShortUrls();
      shortUrl = await redis.rpop("shortUrls");
    }

    if (!shortUrl) {
      return res.status(500).json({ error: "No available short URLs" });
    }

    // Insert the longUrl and shortUrl into the url table
    await knex("url").insert({ longUrl, shortUrl });

    return res.status(201).json({ shortUrl });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const CACHE_LIMIT = 5; // Maximum number of URLs in Redis cache

export const getLongUrl = async (req: Request, res: Response) => {
  const { shortUrl } = req.params;

  if (!shortUrl) {
    return res.status(400).json({ error: "Short URL is required" });
  }

  try {
    // Check if the long URL is in Redis cache
    let longUrl = await redis.get(shortUrl);

    if (longUrl) {
      // Cache hit
      return res.status(200).json({ longUrl });
    }

    // Cache miss: Fetch from PostgreSQL
    const result = await knex("url").where({ shortUrl }).first();

    if (result) {
      longUrl = result.longUrl;

      // Add to Redis cache
      if (typeof shortUrl === "string" && typeof longUrl === "string") {
        // Add to Redis cache
        await redis.set(shortUrl, longUrl, "EX", 3600); // Cache for 1 hour
      } else {
        console.error("Invalid shortUrl or longUrl");
      }

      return res.status(200).json({ longUrl });
    }

    return res.status(404).json({ error: "URL not found" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
