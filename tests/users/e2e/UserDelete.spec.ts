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

describe('UserDelete - #E2E', () => {
  it('When token is invalid, it should raise a error', async () => {
    const response = await supertest(app)
      .delete(`/users/${faker.datatype.uuid}`)
      .set('Authorization', 'Bearer invalid-token')
      .expect(401);

    expect(response.body.status).toBe('error');
  });
  describe('Admin user', () => {
    it('Should be able to delete a user', async () => {
      const user = await supertest(app)
        .post('/register')
        .send({
          email: faker.internet.email(),
          password: faker.internet.password(),
          name: faker.name.findName(),
        })
        .expect(201);

      const { id } = user.body.user;

      const updatedUser = await supertest(app)
        .delete(`/users/${id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(204);

      expect(updatedUser.body).toStrictEqual({});
    });

    it("Shouldn't be able to delete a nonexistent user", async () => {
      const response = await supertest(app)
        .delete(`/users/${faker.datatype.uuid()}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(response.body.status).toBe('error');
    });

    it("Shouldn't be able to delete himself", async () => {
      const adminUser = await supertest(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const response = await supertest(app)
        .delete(`/users/${adminUser.body.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(403);

      expect(response.body.status).toBe('error');
    });
  });
  describe('Normal user', () => {
    it('Should be able to delete himself', async () => {
      const user = await supertest(app)
        .post('/register')
        .send({
          email: faker.internet.email(),
          password: faker.internet.password(),
          name: faker.name.findName(),
        })
        .expect(201);

      const { id } = user.body.user;

      const deletedUserResponse = await supertest(app)
        .delete(`/users/${id}`)
        .set('Authorization', `Bearer ${user.body.token}`)
        .expect(204);

      expect(deletedUserResponse.body).toStrictEqual({});
    });

    it("Shouldn't be able to delete another user", async () => {
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
        .delete(`/users/${user2Id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(401);

      expect(response.body.status).toBe('error');
    });
  });
  describe('Miscellaneous', () => {
    it("When a user is deleted, it shouldn't appear in the index endpoint", async () => {
      const user = await supertest(app)
        .post('/register')
        .send({
          email: faker.internet.email(),
          password: faker.internet.password(),
          name: faker.name.findName(),
        })
        .expect(201);

      const { id } = user.body.user;

      await supertest(app)
        .delete(`/users/${id}`)
        .set('Authorization', `Bearer ${user.body.token}`)
        .expect(204);

      const response = await supertest(app)
        .get('/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.data).toContainEqual(
        expect.not.objectContaining({
          id,
        })
      );
    });
  });
});
