import { getRepository } from 'typeorm';

import { Role } from '../../models';
import { CachedConstants } from '../../utils';
import { RolesConstants } from '../../utils/constants';

const createRoles = async (): Promise<void> => {
  const rolesRepo = getRepository(Role);

  CachedConstants.ROLES = await rolesRepo.find();

  if (CachedConstants.ROLES.length === 0) {
    CachedConstants.ROLES = Object.values(RolesConstants).map(role =>
      rolesRepo.create({ name: role })
    );

    await rolesRepo.save(CachedConstants.ROLES);
  }
};

export default createRoles;
