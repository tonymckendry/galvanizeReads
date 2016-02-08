
exports.up = function(knex, Promise) {
  return knex.schema.createTable('authors', function(table){
    table.increments();
    table.string('firstName');
    table.string('lastName');
    table.text('biography');
    table.text('portrait');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('authors')
};
