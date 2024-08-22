import redis from './redis'; // Import the Redis client
import knex from './knex';

const SHORT_URL_BATCH_SIZE = 5;

export const populateRedisWithShortUrls = async () => {
  try {
    // Fetch a batch of short URLs from PostgreSQL
    const shortUrls = await knex('short-url').limit(SHORT_URL_BATCH_SIZE);

    // Check if there are short URLs to cache
    if (shortUrls.length > 0) {
      const multi = redis.multi();

      shortUrls.forEach(entry => {
        multi.rpush('shortUrls', entry.shortUrl);
      });

      await multi.exec();

      // Remove the used short URLs from the PostgreSQL table
      const shortUrlsToRemove = shortUrls.map(entry => entry.shortUrl);
      await knex('short-url').whereIn('shortUrl', shortUrlsToRemove).del();
    }
  } catch (error) {
    console.error('Error populating Redis with short URLs:', error);
  }
};
