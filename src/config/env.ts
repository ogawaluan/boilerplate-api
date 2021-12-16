import 'dotenv/config';

declare let process: {
  env: {
    NODE_ENV: 'production' | 'dev' | 'test';
    PORT: number;
    DB_TYPE: 'mysql' | 'postgres' | 'oracle' | 'mongodb';
    DB_URL?: string;
    DB_HOST: string;
    DB_PORT: number;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_NAME: string;
    DB_LOGS: boolean;
    AWS_BUCKET?: string;
    STORAGE_DRIVER: 'disk' | 's3';
    MAIL_DRIVER: 'ethereal';
    JWT_SECRET: string;
    JWT_EXPIRES_IN?: string;
    SWAGGER: boolean;
    REDIS_URL: string;
    DEFAULT_ADMIN_USER: string;
    DEFAULT_ADMIN_EMAIL: string;
    DEFAULT_ADMIN_PASSWORD: string;
  };
};

export const {
  NODE_ENV = 'dev',
  PORT = 3000,
  DB_TYPE = 'mysql',
  DB_URL,
  DB_HOST = 'localhost',
  DB_PORT = 3306,
  DB_USERNAME = 'root',
  DB_PASSWORD = 'secret',
  DB_NAME = 'hox_boilerplate_api',
  DB_LOGS = true,
  AWS_BUCKET,
  STORAGE_DRIVER = 'disk',
  MAIL_DRIVER = 'ethereal',
  JWT_SECRET = 'hox_secret',
  JWT_EXPIRES_IN,
  SWAGGER = false,
  REDIS_URL = 'redis://localhost:6379',
  DEFAULT_ADMIN_USER = 'admin',
  DEFAULT_ADMIN_EMAIL = 'admin@hox.rs',
  DEFAULT_ADMIN_PASSWORD = 'H0x123',
} = process.env;
