import { RequestHandler } from 'express';

import { AppError } from '../utils';
import { RolesConstants } from '../utils/constants';
import { AppErrorType } from '../utils/translations';

const ensureUserHasAdminRole: RequestHandler = (request, _, next) => {
  const { role } = request.user;

  if (role !== RolesConstants.ADMIN) {
    throw new AppError({
      type: AppErrorType.UNAUTHORIZED_ROUTE_ACCESS,
      statusCode: 401,
    });
  }

  next();
};

export default ensureUserHasAdminRole;
