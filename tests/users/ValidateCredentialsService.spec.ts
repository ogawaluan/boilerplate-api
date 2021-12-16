import faker from 'faker';
import 'rate-limiter-flexible';
import 'ioredis';
import { Connection, createConnection } from 'typeorm';

import '../../src/app';

import dbConfig from '../../src/config/db';
import Seeds from '../../src/database/seeds';
import { CreateUserService } from '../../src/services/session';
import { ValidateCredentialsService } from '../../src/services/users';

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

describe('UsersController - validateCredentials', () => {
  it('Should be able to validate users credentials', async () => {
    const userData = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    await CreateUserService.execute(userData);

    const { email } = userData;

    const validateCredentialsResponse =
      await ValidateCredentialsService.execute({ email });

    expect(validateCredentialsResponse).toMatchObject({
      emailAvailable: false,
    });
  });
});
