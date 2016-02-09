
exports.up = function(knex, Promise) {
  return knex.schema.createTable('bookauthor', function(table){
    table.integer('bookId');
    table.integer('authorId');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('bookauthor')
};
