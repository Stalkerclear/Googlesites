import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL, {
  password: process.env.REDIS_TOKEN,
  tls: {},
});

redis.on('error', (err) => console.error('Redis error:', err));

export default redis;
