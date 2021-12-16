import 'rate-limiter-flexible';
import 'ioredis';
import { AlreadyHasActiveConnectionError } from 'typeorm';

import createConnection from '../../../src/database';

jest.mock('rate-limiter-flexible');
jest.mock('ioredis');

describe('CreateConnection - #Unit', () => {
  it('It should connect when everything is correct', async () => {
    const connection = await createConnection('default');

    expect(connection).toBeDefined();
    expect(connection.isConnected).toBeTruthy();

    await connection.close();
    expect(connection.isConnected).toBeFalsy();
  });
  it("When there's already a connection with the same name, it should not be able to connect", async () => {
    const connection = await createConnection('test');

    expect(connection).toBeDefined();
    expect(connection.isConnected).toBeTruthy();

    try {
      await createConnection('test');
    } catch (error) {
      expect(error).toBeInstanceOf(AlreadyHasActiveConnectionError);
    }

    await connection.close();

    expect(connection.isConnected).toBeFalsy();
  });
  it("It should work when there's 2 connections with different names", async () => {
    const connection1 = await createConnection('default');
    const connection2 = await createConnection('test');

    expect(connection1).toBeDefined();
    expect(connection1.isConnected).toBeTruthy();
    expect(connection2).toBeDefined();
    expect(connection2.isConnected).toBeTruthy();

    await connection1.close();
    await connection2.close();

    expect(connection1.isConnected).toBeFalsy();
    expect(connection2.isConnected).toBeFalsy();
  });
});
