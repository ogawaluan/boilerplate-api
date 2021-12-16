import { RequestHandler } from 'express';

const clientErrorHandler: RequestHandler = (request, response, _) => {
  return response.status(400).json({
    status: 'error',
    message: `Could not [${request.method}] ${request.path}`,
  });
};

export default clientErrorHandler;
