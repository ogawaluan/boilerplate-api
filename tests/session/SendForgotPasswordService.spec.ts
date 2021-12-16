import faker from 'faker';
import 'rate-limiter-flexible';
import 'ioredis';
import { Connection, createConnection } from 'typeorm';

import '../../src/app';

import dbConfig from '../../src/config/db';
import Seeds from '../../src/database/seeds';
import { mailHelper } from '../../src/helpers';
import {
  CreateUserService,
  SendForgotPasswordService,
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

// TODO: FIX
describe('SessionController - forgot-password', () => {
  it('Should be able to receive an email and a temporaryPassword', async () => {
    const userData = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const { user } = await CreateUserService.execute(userData);

    const generateMailSpy = jest.spyOn(mailHelper, 'sendMailEthereal');

    const { email } = userData;

    await SendForgotPasswordService.execute(email);

    expect(user.temporaryPassword).toBeDefined();
    expect(generateMailSpy).toHaveBeenCalledTimes(1);
  });
});
