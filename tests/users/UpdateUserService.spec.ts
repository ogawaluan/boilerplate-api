import faker from 'faker';
import 'rate-limiter-flexible';
import 'ioredis';
import { Connection, createConnection } from 'typeorm';

import '../../src/app';

import dbConfig from '../../src/config/db';
import Seeds from '../../src/database/seeds';
import { CreateUserService } from '../../src/services/session';
import { UpdateUserService } from '../../src/services/users';

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

describe('UsersController - update', () => {
  it('Should be able to update an user', async () => {
    const userData = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const updateUserData = {
      name: faker.name.findName(),
      email: faker.internet.email(),
    };

    const { user } = await CreateUserService.execute(userData);

    const UpdateUserResponse = await UpdateUserService.execute(
      user.id,
      updateUserData
    );

    expect(UpdateUserResponse).toHaveProperty('id');
    expect(UpdateUserResponse).toMatchObject(updateUserData);
  });
});
