import { Application } from 'express';
import faker from 'faker';
import supertest from 'supertest';
import 'rate-limiter-flexible';
import 'ioredis';
import { Connection, createConnection } from 'typeorm';

import App from '../../../src/app';
import dbConfig from '../../../src/config/db';
import {
  DEFAULT_ADMIN_EMAIL,
  DEFAULT_ADMIN_PASSWORD,
} from '../../../src/config/env';
import Seeds from '../../../src/database/seeds';

let conn: Connection;
let adminToken: string;
const app: Application = new App().express;

jest.mock('rate-limiter-flexible');
jest.mock('ioredis');

beforeAll(async () => {
  conn = await createConnection({
    ...dbConfig,
    migrationsRun: true,
  });

  await Seeds();

  adminToken = (
    await supertest(app)
      .post('/login')
      .send({
        email: DEFAULT_ADMIN_EMAIL,
        password: DEFAULT_ADMIN_PASSWORD,
      })
      .expect(200)
  ).body.token;
});

afterAll(async () => {
  await conn.dropDatabase();
  await conn.close();
});

describe('UserValidateCredentials- #E2E', () => {
  it('When token is invalid, it should raise a error', async () => {
    const response = await supertest(app)
      .post('/users/validate-credentials')
      .set('Authorization', 'Bearer invalid-token')
      .expect(401);

    expect(response.body.status).toBe('error');
  });

  it('When the user exists, it should return false', async () => {
    const user = await supertest(app)
      .post('/register')
      .send({
        email: faker.internet.email(),
        password: faker.internet.password(),
        name: faker.name.findName(),
      })
      .expect(201);

    const { email } = user.body.user;

    const response = await supertest(app)
      .post('/users/validate-credentials')
      .send({
        email,
      })
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
    expect(response.body.emailAvailable).toBe(false);
  });

  it("When the user don't exists, it should return true", async () => {
    const response = await supertest(app)
      .post('/users/validate-credentials')
      .send({
        email: faker.internet.email(),
      })
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
    expect(response.body.emailAvailable).toBe(true);
  });
});
