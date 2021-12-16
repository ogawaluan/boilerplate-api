import { getRepository } from 'typeorm';

import { jwtHelper, storageHelper } from '../../helpers';
import { userResizes } from '../../helpers/storage/constants';
import { User } from '../../models';
import { CachedConstants } from '../../utils';
import { RolesConstants } from '../../utils/constants';

interface IRequest {
  name: string;
  email: string;
  image?: Express.Multer.File;
  password: string;
}

interface IResponse {
  user: User;
  token: string;
}

class CreateUserService {
  static execute = async ({
    name,
    email,
    image,
    password,
  }: IRequest): Promise<IResponse> => {
    const usersRepo = getRepository(User);

    const user = usersRepo.create({
      role: CachedConstants.ROLES.find(
        role => role.name === RolesConstants.USER
      ),
      name,
      email,
      image: image?.filename,
      password,
    });

    await usersRepo.save(user);

    if (image) {
      await storageHelper.save(image, { resizes: userResizes });
    }

    return {
      user,
      token: jwtHelper.generateToken(user.id, user.role.name),
    };
  };
}

export default CreateUserService;
