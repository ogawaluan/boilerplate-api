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

describe('UserUpdate - #E2E', () => {
  it('When token is invalid, it should raise a error', async () => {
    const response = await supertest(app)
      .put(`/users/${faker.datatype.uuid}`)
      .set('Authorization', 'Bearer invalid-token')
      .expect(401);

    expect(response.body.status).toBe('error');
  });
  describe('Admin user', () => {
    it('Should be able to update a user', async () => {
      const user = await supertest(app)
        .post('/register')
        .send({
          email: faker.internet.email(),
          password: faker.internet.password(),
          name: faker.name.findName(),
        })
        .expect(201);

      const { id, email } = user.body.user;
      const fakerName = faker.name.findName();

      const updatedUser = await supertest(app)
        .put(`/users/${id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: fakerName,
        })
        .expect(200);

      expect(updatedUser.body.name).toBe(fakerName);
      expect(updatedUser.body.email).toBe(email);
    });

    it("Shouldn't be able to update a nonexistent user", async () => {
      const response = await supertest(app)
        .put(`/users/${faker.datatype.uuid()}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: faker.name.findName(),
        })
        .expect(404);

      expect(response.body.status).toBe('error');
    });
  });
  describe('Normal user', () => {
    it('Should be able to update himself', async () => {
      const user = await supertest(app)
        .post('/register')
        .send({
          email: faker.internet.email(),
          password: faker.internet.password(),
          name: faker.name.findName(),
        })
        .expect(201);

      const { id, email } = user.body.user;
      const fakerName = faker.name.findName();

      const updatedUser = await supertest(app)
        .put(`/users/${id}`)
        .set('Authorization', `Bearer ${user.body.token}`)
        .send({
          name: fakerName,
        })
        .expect(200);

      expect(updatedUser.body.name).toBe(fakerName);
      expect(updatedUser.body.email).toBe(email);
    });

    it("Shouldn't be able to update another user", async () => {
      const user = await supertest(app)
        .post('/register')
        .send({
          email: faker.internet.email(),
          password: faker.internet.password(),
          name: faker.name.findName(),
        })
        .expect(201);

      const { token: userToken } = user.body;

      const user2 = await supertest(app)
        .post('/register')
        .send({
          email: faker.internet.email(),
          password: faker.internet.password(),
          name: faker.name.findName(),
        })
        .expect(201);

      const { id: user2Id } = user2.body.user;

      const response = await supertest(app)
        .put(`/users/${user2Id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: faker.name.findName(),
        })
        .expect(401);

      expect(response.body.status).toBe('error');
    });
  });
});
