// src/knex.ts
import knex from "knex";
import knexConfig from "./knexfile"; // Adjust path if needed

const db = knex(knexConfig);

export default db;
