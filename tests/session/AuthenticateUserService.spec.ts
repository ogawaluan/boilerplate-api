import faker from 'faker';
import 'rate-limiter-flexible';
import 'ioredis';
import { Connection, createConnection } from 'typeorm';

import '../../src/app';

import dbConfig from '../../src/config/db';
import Seeds from '../../src/database/seeds';
import { jwtHelper, passwordsHelper } from '../../src/helpers';
import {
  AuthenticateUserService,
  CreateUserService,
} from '../../src/services/session';

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

describe('SessionController - login', () => {
  it('should be able to login', async () => {
    const generateTokenSpy = jest.spyOn(jwtHelper, 'generateToken');

    const userData = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    await CreateUserService.execute(userData);

    const { email, password } = userData;

    const authenticateUserResponse = await AuthenticateUserService.execute({
      email,
      password,
    });

    const { token, user } = authenticateUserResponse;

    expect(
      passwordsHelper.compareHashs(
        authenticateUserResponse.user.password,
        password
      )
    ).toBeTruthy();
    expect(generateTokenSpy).toHaveBeenCalledTimes(2);
    expect(authenticateUserResponse).toMatchObject({
      user,
      token,
    });
  });
});
