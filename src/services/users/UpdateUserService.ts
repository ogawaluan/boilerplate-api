import { getRepository } from 'typeorm';

import { storageHelper } from '../../helpers';
import { userResizes } from '../../helpers/storage/constants';
import { User } from '../../models';

interface IRequest {
  name?: string;
  email?: string;
  image?: Express.Multer.File;
  password?: string;
}

class UpdateUserService {
  static execute = async (
    userId: string,
    { image, ...updatedUserData }: IRequest
  ): Promise<User> => {
    const usersRepo = getRepository(User);
    const user = await usersRepo.findOneOrFail(userId);

    if (image) {
      user.image = image.filename;
      await storageHelper.save(image, { resizes: userResizes });
    }

    return usersRepo.save({
      ...user,
      ...updatedUserData,
    });
  };
}

export default UpdateUserService;
