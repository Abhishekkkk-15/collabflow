import IORedis from 'ioredis';
export const redis = new IORedis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
});
export const redisSub = redis.duplicate();
