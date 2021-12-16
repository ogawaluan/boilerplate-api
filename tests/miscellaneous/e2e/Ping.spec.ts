import 'rate-limiter-flexible';
import 'ioredis';
import { Application } from 'express';
import supertest from 'supertest';

import packageInfo from '../../../package.json';
import App from '../../../src/app';

const app: Application = new App().express;

jest.mock('rate-limiter-flexible');
jest.mock('ioredis');

describe('Ping - #E2E', () => {
  it('It should return package.json info', async () => {
    const { name, version, description } = packageInfo;
    const response = await supertest(app).get('/ping');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ name, version, description });
  });
});
