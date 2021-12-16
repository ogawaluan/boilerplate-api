import { RequestHandler } from 'express';
import Joi, { Schema, ValidationError } from 'joi';

import { getTranslatedJoiMessage } from '../utils/translations';

interface IRequest {
  body?: Schema;
  params?: Schema;
  query?: Schema;
}

const applyValidation = async (
  data: Record<string, unknown>,
  schema: Schema = Joi.object({})
) => {
  const validationResult = schema.validate(data, {
    abortEarly: false,
  });

  if (validationResult.error) {
    throw new ValidationError(
      validationResult.error.message,
      validationResult.error.details.map(getTranslatedJoiMessage),
      data
    );
  }
};

const validateRouteData =
  (data?: IRequest): RequestHandler =>
  async (request, _, next) => {
    await Promise.all([
      applyValidation(request.body, data?.body),
      applyValidation(request.params, data?.params),
      applyValidation(request.query, data?.query),
    ]);

    next();
  };

export default validateRouteData;
