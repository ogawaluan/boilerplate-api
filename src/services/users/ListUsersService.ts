import { getRepository } from 'typeorm';

import {
  IQueryFilters,
  paginateIt,
  PaginationObject,
} from '../../helpers/pagination';
import { User } from '../../models';
import { RolesConstants } from '../../utils/constants';

class ListUsersService {
  static execute = async (
    filters: IQueryFilters
  ): Promise<PaginationObject> => {
    const usersRepo = getRepository(User);

    const customFilters = {
      filters,
      tableName: 'users',
    };

    if (filters.sort === 'roleName') {
      Object.assign(customFilters, {
        filters: {
          ...filters,
          sort: 'name',
        },
        tableName: 'roles',
      });
    }

    return paginateIt({
      ...customFilters,
      query: usersRepo
        .createQueryBuilder('users')
        .leftJoinAndSelect('users.role', 'roles')
        .where('roles.name != :roleName', {
          roleName: RolesConstants.ADMIN,
        }),
    });
  };
}

export default ListUsersService;
