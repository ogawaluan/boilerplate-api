import { getRepository } from 'typeorm';

import { User } from '../../models';
import { AppError } from '../../utils';
import { RolesConstants } from '../../utils/constants';
import { AppErrorType } from '../../utils/translations';

class DeleteUserService {
  static execute = async (userId: string): Promise<void> => {
    const usersRepo = getRepository(User);
    const user = await usersRepo.findOneOrFail(userId, {
      relations: ['role'],
    });

    if (user.role.name === RolesConstants.ADMIN) {
      throw new AppError({
        type: AppErrorType.CANT_DELETE_ADMIN_USER,
        statusCode: 403,
      });
    }

    await usersRepo.delete(user.id);
  };
}

export default DeleteUserService;
