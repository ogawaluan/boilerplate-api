import { ConnectionOptions } from 'typeorm';

import {
  DB_TYPE,
  DB_URL,
  DB_HOST,
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_NAME,
  DB_LOGS,
  NODE_ENV,
} from './env';

const folderName = NODE_ENV === 'production' ? 'dist' : 'src';

const dbConfig: ConnectionOptions = {
  type: DB_TYPE,
  entities: [`${folderName}/models/*.*`],
  migrations: [`${folderName}/database/migrations/*.*`],
  cli: {
    migrationsDir: `${folderName}/database/migrations`,
  },
};

if (DB_URL) {
  Object.assign(dbConfig, { url: DB_URL });
} else {
  Object.assign(dbConfig, {
    host: DB_HOST,
    port: DB_PORT,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: NODE_ENV === 'test' ? `${DB_NAME}_test` : DB_NAME,
    logging: DB_LOGS,
  });
}

export default dbConfig;
