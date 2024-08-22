exports.up = function (knex) {
  return knex.schema.createTable("url", (table) => {
    table.increments("id").primary();
    table.string("shortUrl").notNullable().unique();
    table.string("longUrl").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("url");
};
