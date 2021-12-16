import { RequestHandler } from 'express';

import { AppError } from '../utils';
import { RolesConstants } from '../utils/constants';
import { AppErrorType } from '../utils/translations';

const ensureSameUserOrHasAdminRole: RequestHandler = (request, _, next) => {
  const { userId } = request.params;
  const { id, role } = request.user;

  if (userId !== id && role !== RolesConstants.ADMIN) {
    throw new AppError({
      type: AppErrorType.UNAUTHORIZED_ROUTE_ACCESS,
      statusCode: 401,
    });
  }

  next();
};

export default ensureSameUserOrHasAdminRole;
