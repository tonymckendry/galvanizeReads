
exports.up = function(knex, Promise) {
  return knex.schema.createTable('bookAuthor', function(table){
    table.string('bookId');
    table.string('authorId');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('bookAuthor')
};
