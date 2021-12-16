import 'rate-limiter-flexible';
import 'ioredis';

import { NextFunction } from 'express';
import faker from 'faker';

import { jwtHelper } from '../../../src/helpers';
import { ensureUserIsAuthenticated } from '../../../src/middlewares';
import { AppError } from '../../../src/utils';
import { RolesConstants } from '../../../src/utils/constants';
import { AppErrorType } from '../../../src/utils/translations';

let mockRequest: any;
const mockResponse: any = {};
const nextFunction: NextFunction = jest.fn();

jest.mock('rate-limiter-flexible');
jest.mock('ioredis');

beforeEach(() => {
  mockRequest = { headers: {} };
  jest.clearAllMocks();
});

describe('EnsureUserIsAuthenticated - #Unit', () => {
  it('When user is authenticated, and have a valid token it should be able to work properly', async () => {
    const jwtSpy = jest
      .spyOn(jwtHelper, 'verifyToken')
      .mockImplementation(_ => {
        return {
          sub: faker.datatype.uuid(),
          role: RolesConstants.USER,
        };
      });

    mockRequest.headers.authorization = faker.lorem.words(1);

    const funcWrap = () => {
      ensureUserIsAuthenticated(mockRequest, mockResponse, nextFunction);
    };

    expect(funcWrap).not.toThrow();
    expect(jwtSpy).toHaveBeenCalledTimes(1);
    expect(nextFunction).toHaveBeenCalledTimes(1);
  });

  it('When user is authenticated, and have a invalid token it should raise a error', async () => {
    const jwtSpy = jest
      .spyOn(jwtHelper, 'verifyToken')
      .mockImplementation(_ => {
        throw new Error();
      });

    mockRequest.headers.authorization = faker.lorem.words(1);

    const funcWrap = () => {
      ensureUserIsAuthenticated(mockRequest, mockResponse, nextFunction);
    };

    expect(funcWrap).toThrowError(
      new AppError({ type: AppErrorType.INVALID_TOKEN }) as any
    );
    expect(jwtSpy).toHaveBeenCalledTimes(1);
    expect(nextFunction).toHaveBeenCalledTimes(0);
  });

  it("When user isn't authenticated, it should raise a error", async () => {
    const jwtSpy = jest.spyOn(jwtHelper, 'verifyToken');

    const funcWrap = () => {
      ensureUserIsAuthenticated(mockRequest, mockResponse, nextFunction);
    };

    expect(funcWrap).toThrowError(
      new AppError({ type: AppErrorType.MISSING_TOKEN }) as any
    );
    expect(jwtSpy).toHaveBeenCalledTimes(0);
    expect(nextFunction).toHaveBeenCalledTimes(0);
  });
});
