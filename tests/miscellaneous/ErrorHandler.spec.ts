import 'rate-limiter-flexible';
import 'ioredis';
import { NextFunction } from 'express';
import faker from 'faker';
import { ValidationError } from 'joi';
import { EntityNotFoundError } from 'typeorm';

import { errorHandler } from '../../src/middlewares';
import { AppError } from '../../src/utils';
import { AppErrorType } from '../../src/utils/translations';

jest.mock('rate-limiter-flexible');
jest.mock('ioredis');

let mockRequest: any;
let mockResponse: any;
const nextFunction: NextFunction = jest.fn();

beforeEach(() => {
  mockRequest = {};
  mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
});

describe('ErrorHandler - #Unit', () => {
  describe('Validation error', () => {
    it('It should be able to return a properly error', async () => {
      const error = new ValidationError(
        'Validation Error',
        faker.lorem.words(8),
        ''
      );
      errorHandler(error, mockRequest, mockResponse, nextFunction);

      expect(mockResponse.json).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).toHaveBeenCalledTimes(1);
      expect(mockResponse.status.mock.calls[0][0]).toBe(422);
      expect(mockResponse.json.mock.calls[0][0].status).toBe('error');
      expect(mockResponse.json.mock.calls[0][0].message).toBe(error.details);
    });
  });

  describe('App error', () => {
    it('It should be able to return a properly error', async () => {
      const error = new AppError({
        type: AppErrorType.INVALID_TOKEN,
        statusCode: faker.datatype.number({ min: 300, max: 500 }),
      });

      errorHandler(error, mockRequest, mockResponse, nextFunction);

      expect(mockResponse.json).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).toHaveBeenCalledTimes(1);
      expect(mockResponse.status.mock.calls[0][0]).toBe(error.statusCode);
      expect(mockResponse.json.mock.calls[0][0].status).toBe('error');
      expect(mockResponse.json.mock.calls[0][0].message).toBe(error.message);
    });
  });

  describe('Entity Not Found Error', () => {
    it('It should be able to return a properly error', async () => {
      const fakeEntityClass = faker.lorem.words(1);
      const error = new EntityNotFoundError(
        fakeEntityClass,
        faker.lorem.words(8)
      );

      errorHandler(error, mockRequest, mockResponse, nextFunction);

      expect(mockResponse.json).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).toHaveBeenCalledTimes(1);
      expect(mockResponse.status.mock.calls[0][0]).toBe(404);
      expect(mockResponse.json.mock.calls[0][0].status).toBe('error');
      expect(mockResponse.json.mock.calls[0][0].message).toContain(
        fakeEntityClass
      );
    });
  });

  describe('Default error', () => {
    it('It should be able to return a properly error', async () => {
      errorHandler(new Error(), mockRequest, mockResponse, nextFunction);

      expect(mockResponse.json).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).toHaveBeenCalledTimes(1);
      expect(mockResponse.status.mock.calls[0][0]).toBe(500);
      expect(mockResponse.json.mock.calls[0][0]).toStrictEqual({
        status: 'error',
        message: 'Internal server error',
      });
    });
  });
});
