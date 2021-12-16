import { RequestHandler } from 'express';

import { jwtHelper } from '../helpers';
import { AppError } from '../utils';
import { AppErrorType } from '../utils/translations';

const ensureUserIsAuthenticated: RequestHandler = (request, _, next) => {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError({ type: AppErrorType.MISSING_TOKEN, statusCode: 401 });
  }

  try {
    const [, token] = authHeader.split(' ');
    const validToken = jwtHelper.verifyToken(token);

    const { sub, role } = validToken;

    request.user = {
      id: sub,
      role,
    };

    next();
  } catch {
    throw new AppError({ type: AppErrorType.INVALID_TOKEN, statusCode: 401 });
  }
};

export default ensureUserIsAuthenticated;
