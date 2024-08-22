exports.up = function (knex) {
  return knex.schema.createTable("short-url", (table) => {
    table.increments("id").primary();
    table.string("shortUrl").notNullable().unique();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("short-url");
};
