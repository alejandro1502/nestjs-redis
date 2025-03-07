import { createClient } from 'redis';

export const redisClient = createClient({
  socket: {
    host: '127.0.0.1',
    port: 6379,
  },
});

redisClient.connect().catch(console.error);
