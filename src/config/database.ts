import { createPool, PoolOptions } from 'mysql2';
import { PoolConnection as PromisePoolConnection } from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const config: PoolOptions = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
};
const pool = createPool(config);

const database: PromisePoolConnection = pool.promise();

export default database;
