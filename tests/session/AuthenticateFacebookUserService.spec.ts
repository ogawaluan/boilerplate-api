import faker from 'faker';
import 'rate-limiter-flexible';
import 'ioredis';
import { Connection, createConnection } from 'typeorm';

import '../../src/app';

import dbConfig from '../../src/config/db';
import Seeds from '../../src/database/seeds';
import { jwtHelper } from '../../src/helpers';
import { AuthenticateFacebookUserService } from '../../src/services/session';

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

describe('SessionController - login-facebook', () => {
  it('should be able to login with facebook', async () => {
    const generateTokenSpy = jest.spyOn(jwtHelper, 'generateToken');

    const userData = {
      facebookId: faker.random.alphaNumeric(),
      facebookImage: faker.image.animals(),
      name: faker.name.findName(),
      email: faker.internet.email(),
    };

    const { facebookId, facebookImage, email, name } = userData;

    const authenticateUserResponse =
      await AuthenticateFacebookUserService.execute({
        facebookId,
        facebookImage,
        email,
        name,
      });

    const { token, user } = authenticateUserResponse;

    expect(generateTokenSpy).toHaveBeenCalledTimes(1);
    expect(authenticateUserResponse).toMatchObject({
      user,
      token,
    });
  });
});
