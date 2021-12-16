import createRoles from './role.seeds';
import createAdminUser from './user.seeds';

const createSeeds = async (): Promise<void> => {
  await createRoles();
  await createAdminUser();
};

export default createSeeds;
