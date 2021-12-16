import 'rate-limiter-flexible';
import 'ioredis';

import { NextFunction } from 'express';

import { ensureUserHasAdminRole } from '../../../src/middlewares';
import { AppError } from '../../../src/utils';
import { RolesConstants } from '../../../src/utils/constants';
import { AppErrorType } from '../../../src/utils/translations';

const mockRequest: any = { user: {} };
const mockResponse: any = {};
const nextFunction: NextFunction = jest.fn();

jest.mock('rate-limiter-flexible');
jest.mock('ioredis');

describe('EnsureUserHasAdminRole - #Unit', () => {
  it('When user is admin, it should be able to work properly', async () => {
    mockRequest.user.role = RolesConstants.ADMIN;

    ensureUserHasAdminRole(mockRequest, mockResponse, nextFunction);

    expect(nextFunction).toHaveBeenCalledTimes(1);
  });

  it("When user isn't admin, it should throw a error", async () => {
    mockRequest.user.role = RolesConstants.USER;
    const funcWrap = () => {
      ensureUserHasAdminRole(mockRequest, mockResponse, nextFunction);
    };

    expect(funcWrap).toThrowError(
      new AppError({ type: AppErrorType.UNAUTHORIZED_ROUTE_ACCESS }) as any
    );
    expect(nextFunction).toHaveBeenCalledTimes(0);
  });
});
