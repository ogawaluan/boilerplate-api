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

describe('AuthenticateGoogleUser - E2E', () => {
  it('Should be able to login in application with Google', async () => {
    const fakeUserData = {
      googleId: faker.datatype.uuid(),
      name: faker.name.findName(),
      email: faker.internet.email(),
      googleImage: faker.image.avatar(),
    };

    const userResponse = await supertest(app)
      .post('/login-google')
      .send(fakeUserData)
      .expect(200);
    const loggedUserResponse = await supertest(app)
      .get('/users/me')
      .set('Authorization', `Bearer ${userResponse.body.token}`)
      .expect(200);

    expect(userResponse.body).toHaveProperty('token');
    expect(loggedUserResponse.body).toHaveProperty('id');
    expect(loggedUserResponse.body.email).toEqual(fakeUserData.email);
  });

  it('Should not be able to login in application without googleId', async () => {
    const fakeUserData = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      googleImage: faker.image.avatar(),
    };

    const userResponse = await supertest(app)
      .post('/login-google')
      .send(fakeUserData)
      .expect(422);

    expect(userResponse.body.status).toBe('error');
  });
});
