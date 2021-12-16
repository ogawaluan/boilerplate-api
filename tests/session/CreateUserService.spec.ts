import faker from 'faker';
import { Connection, createConnection } from 'typeorm';
import 'rate-limiter-flexible';
import 'ioredis';

import '../../src/app';

import dbConfig from '../../src/config/db';
import Seeds from '../../src/database/seeds';
import { jwtHelper, passwordsHelper } from '../../src/helpers';
import { CreateUserService } from '../../src/services/session';
import { RolesConstants } from '../../src/utils/constants';

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

describe('SessionController - register', () => {
  it('Should be able to create a user', async () => {
    const generateTokenSpy = jest.spyOn(jwtHelper, 'generateToken');
    const generateHashSpy = jest.spyOn(passwordsHelper, 'generateHash');

    const userData = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const createdUserResponse = await CreateUserService.execute(userData);

    const { name, email, password } = userData;

    expect(
      passwordsHelper.compareHashs(createdUserResponse.user.password, password)
    ).toBeTruthy();
    expect(generateTokenSpy).toHaveBeenCalledTimes(1);
    expect(generateHashSpy).toHaveBeenCalledTimes(1);
    expect(createdUserResponse).toMatchObject({
      user: {
        role: {
          ...createdUserResponse.user.role,
          name: RolesConstants.USER,
        },
        name,
        email,
      },
    });
  });
});
