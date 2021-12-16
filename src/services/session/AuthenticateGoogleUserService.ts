import { getRepository } from 'typeorm';

import { jwtHelper } from '../../helpers';
import { User } from '../../models';
import { CachedConstants } from '../../utils';
import { RolesConstants } from '../../utils/constants';

interface IRequest {
  googleId: string;
  name?: string;
  email?: string;
  googleImage?: string;
}

interface IResponse {
  user: User;
  token: string;
}

class AuthenticateGoogleUserService {
  static execute = async ({
    googleId,
    name,
    email,
    googleImage,
  }: IRequest): Promise<IResponse> => {
    const usersRepo = getRepository(User);

    let findUser = await usersRepo.findOne({
      where: [{ googleId }, { email }],
      relations: ['role'],
    });

    if (!findUser) {
      findUser = usersRepo.create({
        role: CachedConstants.ROLES.find(
          role => role.name === RolesConstants.USER
        ),
        name,
        email,
      });
    }

    Object.assign(findUser, {
      googleId,
      googleImage,
    });

    await usersRepo.save(findUser);

    return {
      user: findUser,
      token: jwtHelper.generateToken(findUser.id, findUser.role.name),
    };
  };
}

export default AuthenticateGoogleUserService;
