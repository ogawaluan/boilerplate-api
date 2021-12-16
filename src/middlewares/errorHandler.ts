/* eslint-disable no-console */
import { ErrorRequestHandler } from 'express';
import { ValidationError } from 'joi';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';

import { AppError } from '../utils';

const errorHandler: ErrorRequestHandler = (err, _request, response, _) => {
  if (err instanceof ValidationError) {
    return response.status(422).json({
      status: 'error',
      message: err.details,
    });
  }

  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  if (err instanceof EntityNotFoundError) {
    const tableName = err.message.split('"')[1];

    return response.status(404).json({
      status: 'error',
      message: `The requested ${tableName.toLowerCase()} could not be found`,
    });
  }

  if (err.code === 'ER_DUP_ENTRY' && err instanceof QueryFailedError) {
    const fieldValue = err.message.split("'")[1];

    return response.status(409).json({
      status: 'error',
      message: `The resource '${fieldValue}' is already registered`,
    });
  }

  console.error(err);

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
};

export default errorHandler;
