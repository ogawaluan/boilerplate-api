import { Response, RequestHandler } from 'express';

import {
  ShowUserService,
  ListUsersService,
  UpdateUserService,
  DeleteUserService,
  ValidateCredentialsService,
} from '../services/users';
import { user_views, pagination_views } from '../views';

class UsersController {
  showLoggedUser: RequestHandler = async (
    request,
    response
  ): Promise<Response> => {
    const user = await ShowUserService.execute(request.user.id);
    return response.status(200).json(user_views.renderOne(user));
  };

  index: RequestHandler = async (request, response): Promise<Response> => {
    const paginatedUsers = await ListUsersService.execute(request.query);
    return response
      .status(200)
      .json(
        pagination_views.render(
          paginatedUsers,
          user_views.renderMany(paginatedUsers.data, { withRole: true })
        )
      );
  };

  update: RequestHandler = async (request, response): Promise<Response> => {
    const user = await UpdateUserService.execute(request.params.userId, {
      ...request.body,
      image: request.file,
    });

    return response.status(200).json(user_views.renderOne(user));
  };

  delete: RequestHandler = async (request, response): Promise<Response> => {
    await DeleteUserService.execute(request.params.userId);
    return response.status(204).send();
  };

  validateCredentials: RequestHandler = async (
    request,
    response
  ): Promise<Response> => {
    const credentials = await ValidateCredentialsService.execute(request.body);
    return response.status(200).json(credentials);
  };
}

export default UsersController;
