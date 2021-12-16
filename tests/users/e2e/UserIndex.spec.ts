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

  await supertest(app)
    .post('/register')
    .send({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    })
    .expect(201); // create a user

  await supertest(app)
    .post('/register')
    .send({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    })
    .expect(201); // create a user

  await supertest(app)
    .post('/register')
    .send({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    })
    .expect(201); // create a user
});

afterAll(async () => {
  await conn.dropDatabase();
  await conn.close();
});

describe('UserIndex - #E2E', () => {
  it('When token is invalid, it should raise a error', async () => {
    const response = await supertest(app)
      .get('/users')
      .set('Authorization', 'Bearer invalid-token')
      .expect(401);

    expect(response.body.status).toBe('error');
  });
  describe('Pagination', () => {
    describe('Limit usage', () => {
      it('When limit is -1, it should raise a error', async () => {
        const response = await supertest(app)
          .get('/users')
          .query({ limit: -1 })
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(422);

        expect(response.body.status).toBe('error');
      });

      it('When no limit is provided, it should show three users', async () => {
        const response = await supertest(app)
          .get('/users')
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200);

        expect(response.body.data).toHaveLength(3);
      });

      it('When limit is 1, it should show one user', async () => {
        const response = await supertest(app)
          .get('/users')
          .query({ limit: 1 })
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200);

        expect(response.body.data).toHaveLength(1);
        expect(response.body.limit).toBe(1);
      });

      it('When limit is 2, it should show two users', async () => {
        const response = await supertest(app)
          .get('/users')
          .query({ limit: 2 })
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200);

        expect(response.body.data).toHaveLength(2);
        expect(response.body.limit).toBe(2);
      });
    });
    describe('Page with limit usage', () => {
      it('When page is -1, it should raise a error', async () => {
        const response = await supertest(app)
          .get('/users')
          .query({ page: -1 })
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(422);

        expect(response.body.status).toBe('error');
      });
      it('When page is 1 and limit is 1, it should have 3 pages', async () => {
        const response = await supertest(app)
          .get('/users')
          .query({ page: 1, limit: 1 })
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200);

        expect(response.body.current).toBe(1);
        expect(response.body.hasNext).toBe(true);
        expect(response.body.lastPage).toBe(3);
      });

      it('When page is 1 and limit is 2, it should have 2 pages', async () => {
        const response = await supertest(app)
          .get('/users')
          .query({ page: 1, limit: 2 })
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200);

        expect(response.body.current).toBe(1);
        expect(response.body.hasNext).toBe(true);
        expect(response.body.lastPage).toBe(2);
      });

      it('When page is 1 and limit 3, it should have 1 page', async () => {
        const response = await supertest(app)
          .get('/users')
          .query({ page: 1, limit: 3 })
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200);
        expect(response.body.current).toBe(1);
        expect(response.body.hasNext).toBe(false);
        expect(response.body.lastPage).toBe(1);
      });

      it('When page is 2 and limit 1, it should go to the second page', async () => {
        const response = await supertest(app)
          .get('/users')
          .query({ page: 2, limit: 1 })
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200);
        expect(response.body.current).toBe(2);
        expect(response.body.hasNext).toBe(true);
        expect(response.body.lastPage).toBe(3);
      });

      it('When page is 3 and limit 1, it should go to the last page', async () => {
        const response = await supertest(app)
          .get('/users')
          .query({ page: 3, limit: 1 })
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200);
        expect(response.body.current).toBe(3);
        expect(response.body.hasNext).toBe(false);
        expect(response.body.lastPage).toBe(3);
      });

      it("When page is 3 and limit 3, it shouldn't return rows", async () => {
        const response = await supertest(app)
          .get('/users')
          .query({ page: 3, limit: 3 })
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200);

        expect(response.body.current).toBe(3);
        expect(response.body.hasNext).toBe(false);
        expect(response.body.lastPage).toBe(1);
        expect(response.body.data).toHaveLength(0);
      });
    });
    describe('Sort and direction usage', () => {
      it('It should return different values when sort is different', async () => {
        const ascSortResponse = await supertest(app)
          .get('/users')
          .query({ sort: 'name', direction: 'asc' })
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200);

        const descSortResponse = await supertest(app)
          .get('/users')
          .query({ sort: 'name', direction: 'desc' })
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200);

        expect(ascSortResponse.body.data).not.toBe(descSortResponse.body.data);
      });
    });
  });
});
