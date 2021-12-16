import { getRepository } from 'typeorm';

import { User } from '../../models';

interface IRequest {
  email: string;
}

interface IResponse {
  emailAvailable: boolean;
}

class ValidateCredentialsService {
  static execute = async ({ email }: IRequest): Promise<IResponse> => {
    const usersRepo = getRepository(User);

    const userEmail = await usersRepo.findOne({
      where: { email },
    });

    return {
      emailAvailable: !userEmail,
    };
  };
}

export default ValidateCredentialsService;
