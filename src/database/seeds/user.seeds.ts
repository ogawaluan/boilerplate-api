import { getRepository } from 'typeorm';

import {
  DEFAULT_ADMIN_USER,
  DEFAULT_ADMIN_EMAIL,
  DEFAULT_ADMIN_PASSWORD,
} from '../../config/env';
import { User } from '../../models';
import { CachedConstants } from '../../utils';
import { RolesConstants } from '../../utils/constants';

const createAdminUser = async (): Promise<void> => {
  const usersRepo = getRepository(User);

  const adminRole = CachedConstants.ROLES.find(
    role => role.name === RolesConstants.ADMIN
  );

  const usersCount = await usersRepo.count({
    where: {
      role: adminRole,
    },
  });

  if (usersCount === 0) {
    const adminUser = usersRepo.create({
      role: adminRole,
      name: DEFAULT_ADMIN_USER,
      email: DEFAULT_ADMIN_EMAIL,
      password: DEFAULT_ADMIN_PASSWORD,
    });

    await usersRepo.save(adminUser);
  }
};

export default createAdminUser;
