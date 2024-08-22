import express from 'express';
import urlRoutes from './routes/shortUrl';
import { populateRedisWithShortUrls } from './redisService';

const app = express();
app.use(express.json());

app.use('/api', urlRoutes);

const port = process.env.PORT || 3000;

app.listen(port, async () => {
  console.log(`Server is running on http://localhost:${port}`);

  // Populate Redis with initial short URLs on startup
  await populateRedisWithShortUrls();
});
