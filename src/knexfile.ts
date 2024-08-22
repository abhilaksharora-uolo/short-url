// src/knexfile.ts
import { Knex } from 'knex';

const config: Knex.Config = {
  client: 'pg',
  connection: {
    host: 'ep-cool-cherry-a52bxbr5.us-east-2.aws.neon.tech',
    user: 'user-db_owner',
    password: 'QPmbRr60tKjU',
    database: 'user-db',
    ssl: { rejectUnauthorized: false }
  },
  migrations: {
    directory: './migrations'
  },
  seeds: {
    directory: './seeds'
  }
};

export default config;
