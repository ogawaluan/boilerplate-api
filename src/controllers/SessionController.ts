import { Response, RequestHandler } from 'express';

import {
  AuthenticateUserService,
  AuthenticateFacebookUserService,
  AuthenticateGoogleUserService,
  AuthenticateAppleUserService,
  CreateUserService,
  SendForgotPasswordService,
} from '../services/session';
import { user_views } from '../views';

class SessionController {
  login: RequestHandler = async (request, response): Promise<Response> => {
    const { user, token } = await AuthenticateUserService.execute(request.body);

    return response.status(200).json({
      user: user_views.renderOne(user, { withRole: true }),
      token,
    });
  };

  facebookLogin: RequestHandler = async (
    request,
    response
  ): Promise<Response> => {
    const { user, token } = await AuthenticateFacebookUserService.execute(
      request.body
    );

    return response.status(200).json({
      user: user_views.renderOne(user),
      token,
    });
  };

  googleLogin: RequestHandler = async (
    request,
    response
  ): Promise<Response> => {
    const { user, token } = await AuthenticateGoogleUserService.execute(
      request.body
    );

    return response.status(200).json({
      user: user_views.renderOne(user),
      token,
    });
  };

  appleLogin: RequestHandler = async (request, response): Promise<Response> => {
    const { user, token } = await AuthenticateAppleUserService.execute(
      request.body
    );

    return response.status(200).json({
      user: user_views.renderOne(user),
      token,
    });
  };

  sendForgotPassword: RequestHandler = async (
    request,
    response
  ): Promise<Response> => {
    await SendForgotPasswordService.execute(request.body.email);
    return response.status(204).send();
  };

  register: RequestHandler = async (request, response): Promise<Response> => {
    const { user, token } = await CreateUserService.execute({
      ...request.body,
      image: request.file,
    });

    return response.status(201).json({
      user: user_views.renderOne(user),
      token,
    });
  };
}

export default SessionController;
