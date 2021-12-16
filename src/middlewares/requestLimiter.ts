import { RequestHandler } from 'express';
import { RateLimiterRedis } from 'rate-limiter-flexible';

import { redisCacheStorage } from '../helpers/cache-storage';
import { AppError } from '../utils';
import { AppErrorType } from '../utils/translations';

const maxNumberOfRequests = 5;
const secondsToResetConsumedPoints = 1;
const blockRequestsInSeconds = 10;

const limiter = new RateLimiterRedis({
  storeClient: redisCacheStorage.client,
  keyPrefix: 'rate-limit',
  points: maxNumberOfRequests,
  duration: secondsToResetConsumedPoints,
  blockDuration: blockRequestsInSeconds,
});

const requestLimiter: RequestHandler = async (request, _, next) => {
  try {
    await limiter.consume(request.ip);

    next();
  } catch {
    throw new AppError({
      type: AppErrorType.TOO_MANY_REQUESTS,
      statusCode: 429,
    });
  }
};

export default requestLimiter;
