var express = require('express');
var router = express.Router();
var knex = require('../db/knex')

function books(){
  return knex('books')
}
function authors(){
  return knex('authors')
}
function bookAuthor(){
  return knex('bookauthor')
}

router.get('/', function(req, res, next){
  authors().select().then(function(results){
    // console.log(results)
    knex.from('books').innerJoin('bookauthor', 'books.id', 'bookauthor.bookId').then(function(joined){
      console.log(joined)
      res.render('authors/index', {authors: results, books: joined});
    })
  })
})

router.get('/:id', function(req, res, next){
  authors().where('id', req.params.id).then(function(results){
    // console.log(results)
    knex.from('books').innerJoin('bookauthor', 'books.id', 'bookauthor.bookId').then(function(joined){
      console.log(joined)
      res.render('authors/index', {authors: results, books: joined});
    })
  })
})

router.get('/:id/edit', function(req, res, next){
  authors().where('id', req.params.id).first().then(function(results){
    // console.log(results)
    knex.from('books').innerJoin('bookauthor', 'books.id', 'bookauthor.bookId').then(function(joined){
      books().then(function(novels){
        res.render('authors/edit', {authors: results, books: joined, novels: novels});
      })
    })
  })
})

module.exports = router;
