import { Application } from 'express';
import faker from 'faker';
import supertest from 'supertest';
import 'rate-limiter-flexible';
import 'ioredis';
import { Connection, createConnection } from 'typeorm';

import App from '../../../src/app';
import dbConfig from '../../../src/config/db';
import Seeds from '../../../src/database/seeds';
import { mailHelper } from '../../../src/helpers';

let conn: Connection;
const app: Application = new App().express;

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

describe('ForgotPassword - E2E', () => {
  it('Should be able request a new password', async () => {
    jest.setTimeout(20000);
    const generateMailSpy = jest.spyOn(mailHelper, 'sendMailEthereal');

    const { body } = await supertest(app)
      .post('/register')
      .send({
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      })
      .expect(201); // create a user

    await supertest(app)
      .post('/forgot-password')
      .send({
        email: body.user.email,
      })
      .expect(204);

    const { temporaryPassword } =
      generateMailSpy.mock.calls[0][0].templateData.variables;

    expect(temporaryPassword).toBeDefined();
    expect(generateMailSpy).toHaveBeenCalledTimes(1);
  });

  it('Should not be able to request a password with invalid email', async () => {
    const fakeUserData = {
      name: faker.name.findName(),
      email: 'aloalo',
      password: faker.internet.password(),
    };

    const userResponse = await supertest(app)
      .post('/forgot-password')
      .send({
        email: fakeUserData.email,
      })
      .expect(422);

    expect(userResponse.body.status).toBe('error');
  });

  it('Should not be able to request a password with a nonexistent email', async () => {
    const userResponse = await supertest(app)
      .post('/forgot-password')
      .send({
        email: 'aloalo@alo.com',
      })
      .expect(404);

    expect(userResponse.body.status).toBe('error');
  });
});
