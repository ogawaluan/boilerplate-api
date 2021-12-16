import { getRepository } from 'typeorm';

import { User } from '../../models';

class ShowUserService {
  static execute = async (userId: string): Promise<User> => {
    const usersRepo = getRepository(User);
    return usersRepo.findOneOrFail(userId);
  };
}

export default ShowUserService;
