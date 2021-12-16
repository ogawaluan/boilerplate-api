import { getRepository } from 'typeorm';

import { jwtHelper } from '../../helpers';
import { User } from '../../models';
import { CachedConstants } from '../../utils';
import { RolesConstants } from '../../utils/constants';

interface IRequest {
  facebookId: string;
  name?: string;
  email?: string;
  facebookImage?: string;
}

interface IResponse {
  user: User;
  token: string;
}

class AuthenticateFacebookUserService {
  static execute = async ({
    facebookId,
    name,
    email,
    facebookImage,
  }: IRequest): Promise<IResponse> => {
    const usersRepo = getRepository(User);

    let findUser = await usersRepo.findOne({
      where: [{ facebookId }, { email }],
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
      facebookId,
      facebookImage,
    });

    await usersRepo.save(findUser);

    return {
      user: findUser,
      token: jwtHelper.generateToken(findUser.id, findUser.role.name),
    };
  };
}

export default AuthenticateFacebookUserService;
