exports.up = function (knex) {
  //The return keyword is necessary because your migration functions must return a promise in order to work correctly.
  return knex.schema
    .createTable("papers", function (table) {
      table.increments("id").primary();
      table.string("title");
      table.string("author");

      table.timestamps(true, true);
    })
    .createTable("footnotes", function (table) {
      table.increments("id").primary();
      table.string("note");
      table.integer("paper_id").unsigned();
      table.foreign("paper_id").references("papers.id");

      table.timestamps(true, true);
    });
};

exports.down = function (knex) {
  return knex.schema.dropTable("footnotes").dropTable("papers");
};
