import faker from 'faker';
import 'rate-limiter-flexible';
import 'ioredis';
import { Connection, createConnection, EntityNotFoundError } from 'typeorm';

import '../../src/app';

import dbConfig from '../../src/config/db';
import Seeds from '../../src/database/seeds';
import { CreateUserService } from '../../src/services/session';
import { DeleteUserService, ShowUserService } from '../../src/services/users';

let conn: Connection;

jest.mock('rate-limiter-flexible');
jest.mock('ioredis');

beforeAll(async () => {
  conn = await createConnection({
    ...dbConfig,
    migrationsRun: true,
  });
  await Seeds();
});

afterAll(async () => {
  await conn.dropDatabase();
  await conn.close();
});

describe('UsersController - delete', () => {
  it('Should be able to delete an user', async () => {
    const userData = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const { user } = await CreateUserService.execute(userData);

    await DeleteUserService.execute(user.id);

    await expect(ShowUserService.execute(user.id)).rejects.toBeInstanceOf(
      EntityNotFoundError
    );
  });
});
