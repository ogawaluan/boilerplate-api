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

describe('UserShowLogged - #E2E', () => {
  it('When token is invalid, it should raise a error', async () => {
    const response = await supertest(app)
      .get('/users/me')
      .set('Authorization', `Bearer ${faker.datatype.uuid()}`)
      .expect(401);

    expect(response.body.status).toBe('error');
  });

  it('Should be able to see himself', async () => {
    const user = await supertest(app)
      .get('/users/me')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(user.body.id).toBeDefined();
    expect(user.body.name).toBeDefined();
    expect(user.body.email).toBeDefined();
    expect(user.body.password).toBeUndefined();
    expect(user.body.createdAt).toBeDefined();
  });
});
