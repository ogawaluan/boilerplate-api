import faker from 'faker';
import 'rate-limiter-flexible';
import 'ioredis';
import { Connection, createConnection } from 'typeorm';

import '../../src/app';

import dbConfig from '../../src/config/db';
import Seeds from '../../src/database/seeds';
import { jwtHelper } from '../../src/helpers';
import { AuthenticateAppleUserService } from '../../src/services/session';

let conn: Connection;
const appleToken =
  'eyKraFQiOiI4NkQ4OCtmIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwczovL2FwcGxlaWQuYXBwbGUuY29tIiwiYXVkIjoiYnIuYXJ0LnZpc3RhLm1vbWVudGdhbWUiLCJleHAiOjE1OTEyMjkyOTMsImlhdCI6MTU5MTIyODY5Mywic3ViIjoiMDAxMzQ5LjRjYTgzYzgwOTg4NjRiZTZhY2ViMjlmMmI4YzU4OTE4LjIzNTgiLCJub25jZSI6IjFkOTdiZThjNjhlMzc0MDBhM2E2N2QwYmQ2MWZkMTU2ZDJjNDk3M2Q5ODQ2ZTZiOWZkNzk1MDVhN2M3OTE0MTciLCJjX2hhc2giOiI1TEphLWRrVHl0VmI5WmRSWGhLZF9BIiwiZW1haWwiOiJ2aW5pc2hpZnRAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOiJ0cnVlIiwiYXV0aF90aW1lIjoxNTkxMjI4NjkzLCJub25jZV9zdXBwb3J0ZWQiOnRydWV9.RZDaZBIhQitQ-HeBjnYIBVDJlmC0D7YjCGrV4O86trXUFcjRY-qZrFYVZrmuOQuMBjoW1bsVBF0dinAQzY732cwWNEDtWwLGsvjSwzpqCxzh7KEIOgk4UCHMiinqEuXvrSW4EARNQP9hRH5Zfqn4g0eJp7TBG6AXDaJrfr1vnuZz1lbSw2wcHSUM_D4DIStQyt2_RsPjxXolfgkShPfiNkA23qV-EXK9RDIDBqvJ5BN6pTAzfTPaIKHTIA8rbUAZbU-nCoZMts9YAqGSHB39-wGzVl2aD1oxTa8HRm1kuRKKyR2lrFGoQMlFNaNkQcD1cPNn1NzQbihD92z2ynYevA';

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

describe('SessionController - login-apple', () => {
  it('should be able to login with apple', async () => {
    const generateTokenSpy = jest.spyOn(jwtHelper, 'generateToken');

    const userData = {
      name: faker.name.findName(),
      email: faker.internet.email(),
    };

    const { email, name } = userData;

    const authenticateUserResponse = await AuthenticateAppleUserService.execute(
      {
        appleToken,
        email,
        name,
      }
    );

    const { token, user } = authenticateUserResponse;

    expect(generateTokenSpy).toHaveBeenCalledTimes(1);
    expect(authenticateUserResponse).toMatchObject({
      user,
      token,
    });
  });
});
