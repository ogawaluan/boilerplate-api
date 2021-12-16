import { Application } from 'express';
import faker from 'faker';
import supertest from 'supertest';
import { Connection, createConnection } from 'typeorm';

import 'rate-limiter-flexible';
import 'ioredis';
import App from '../../../src/app';
import dbConfig from '../../../src/config/db';
import Seeds from '../../../src/database/seeds';

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

describe('CreateUser - E2E', () => {
  it('Should be able to create one user', async () => {
    const fakeUserData = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    await supertest(app).post('/register').send(fakeUserData).expect(201); // create a user

    const userResponse = await supertest(app)
      .post('/login')
      .send({
        email: fakeUserData.email,
        password: fakeUserData.password,
      })
      .expect(200);

    const loggedUserResponse = await supertest(app)
      .get('/users/me')
      .set('Authorization', `Bearer ${userResponse.body.token}`)
      .expect(200);

    expect(userResponse.body).toHaveProperty('token');
    expect(loggedUserResponse.body).toHaveProperty('id');
    expect(loggedUserResponse.body.email).toEqual(fakeUserData.email);
  });

  it('Should not be able to register with invalid email', async () => {
    const fakeUserData = {
      name: faker.name.findName(),
      email: 'aloalo',
      password: faker.internet.password(),
    };

    const userResponse = await supertest(app)
      .post('/register')
      .send({
        email: fakeUserData.email,
        password: fakeUserData.password,
      })
      .expect(422);

    expect(userResponse.body.status).toBe('error');
  });

  it('Should not be able to register with a password containing less than 6 words', async () => {
    const fakeUserData = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: '12345',
    };

    const userResponse = await supertest(app)
      .post('/register')
      .send(fakeUserData)
      .expect(422);

    expect(userResponse.body.status).toBe('error');
  });
});
