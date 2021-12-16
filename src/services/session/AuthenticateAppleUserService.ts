import { getRepository } from 'typeorm';

import { jwtHelper } from '../../helpers';
import { User } from '../../models';
import { AppError, CachedConstants } from '../../utils';
import { RolesConstants } from '../../utils/constants';
import { AppErrorType } from '../../utils/translations';

interface IRequest {
  appleToken: string;
  name?: string;
  email?: string;
}

interface IResponse {
  user: User;
  token: string;
}

interface IParsedAppleToken {
  sub: string;
}

class AuthenticateAppleUserService {
  private static getAppleUserId = async (
    token: string
  ): Promise<IParsedAppleToken> => {
    const parts = token.split('.');
    try {
      return JSON.parse(Buffer.from(parts[1], 'base64').toString('ascii'));
    } catch {
      throw new AppError({
        type: AppErrorType.APPLE_ID_NOT_FOUND,
        statusCode: 401,
      });
    }
  };

  static execute = async ({
    appleToken,
    name,
    email,
  }: IRequest): Promise<IResponse> => {
    const { sub: appleId } = await AuthenticateAppleUserService.getAppleUserId(
      appleToken
    );

    const usersRepo = getRepository(User);

    let findUser = await usersRepo.findOne({
      where: [{ appleId }, { email }],
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

    Object.assign(findUser, { appleId });

    await usersRepo.save(findUser);

    return {
      user: findUser,
      token: jwtHelper.generateToken(findUser.id, findUser.role.name),
    };
  };
}

export default AuthenticateAppleUserService;
