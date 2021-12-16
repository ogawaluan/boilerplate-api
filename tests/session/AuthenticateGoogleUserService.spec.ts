import faker from 'faker';
import { Connection, createConnection } from 'typeorm';
import 'rate-limiter-flexible';
import 'ioredis';

import '../../src/app';

import dbConfig from '../../src/config/db';
import Seeds from '../../src/database/seeds';
import { jwtHelper } from '../../src/helpers';
import { AuthenticateGoogleUserService } from '../../src/services/session';

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

describe('SessionController - login-google', () => {
  it('should be able to login with google', async () => {
    const generateTokenSpy = jest.spyOn(jwtHelper, 'generateToken');

    const userData = {
      googleId: faker.random.alphaNumeric(),
      googleImage: faker.image.animals(),
      name: faker.name.findName(),
      email: faker.internet.email(),
    };

    const { googleId, googleImage, email, name } = userData;

    const authenticateUserResponse =
      await AuthenticateGoogleUserService.execute({
        googleId,
        googleImage,
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
