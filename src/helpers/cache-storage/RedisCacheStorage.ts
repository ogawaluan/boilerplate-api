/* eslint-disable no-console */
import IORedis, { Redis } from 'ioredis';

import { REDIS_URL } from '../../config/env';

interface ICacheResultRequest<T> {
  key: string;
  keyExpirationSeconds: number;
  functionToCache: () => T | Promise<T>;
}

class RedisStorage {
  public readonly client: Redis;

  constructor() {
    this.client = new IORedis(REDIS_URL);

    this.client.on('error', err => {
      console.log(`Redis Error: ${err}`);
    });
  }

  deleteKey = async (key: string): Promise<void> => {
    await this.client.del(key);
  };

  cacheResult = async <T>({
    key,
    keyExpirationSeconds,
    functionToCache,
  }: ICacheResultRequest<T>): Promise<T> => {
    const cachedData = await this.client.get(key);

    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const functionResult = await functionToCache();

    this.client.setex(
      key,
      keyExpirationSeconds,
      JSON.stringify(functionResult)
    );

    return functionResult;
  };
}

export default RedisStorage;
