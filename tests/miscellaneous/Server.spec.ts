import 'rate-limiter-flexible';
import 'ioredis';
import server from '../../src/server';

jest.mock('rate-limiter-flexible');
jest.mock('ioredis');

describe('Server - #Unit', () => {
  it('It should be able to create a server', async () => {
    expect(server.listening).toBeTruthy();

    server.close();

    expect(server.listening).toBeFalsy();
  });
});
