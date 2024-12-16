exports.up = function (knex) {
    return knex.schema
      .createTable("persons", (table) => {
        table.increments("id").primary();
        table.string("name").notNullable();
        table.date("birthdate");
        table.string("email").unique();
      })
      .createTable("relationships", (table) => {
        table.increments("id").primary();
        table
          .integer("person1_id")
          .unsigned()
          .notNullable()
          .references("id")
          .inTable("persons")
          .onDelete("CASCADE");
        table
          .integer("person2_id")
          .unsigned()
          .notNullable()
          .references("id")
          .inTable("persons")
          .onDelete("CASCADE");
        table.string("relationship_type").notNullable();
      });
  };
  
  exports.down = function (knex) {
    return knex.schema
      .dropTableIfExists("relationships")
      .dropTableIfExists("persons");
  };
  