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

// router.get('/', function(req, res, next) {
//   var arr = []
//   books().select().then(function(bookResults){
//     for (var i = 0; i < bookResults.length; i++) {
//       var obj = {}
//       obj.title = bookResults[i].title
//       obj.genre = bookResults[i].genre
//       obj.description = bookResults[i].description
//       obj.cover = bookResults[i].cover
//       bookAuthor().select().where('bookId', bookResults[i].id).then(function(bookAuthorResults){
//         for (var j = 0; j < bookAuthorResults.length; j++) {
//           console.log(bookAuthorResults);
//           authors().select().where('id', bookAuthorResults[j].authorId).first().then(function(authorResult){
//               obj['author' + j] = authorResult.firstName + " " + authorResult.lastName
//               console.log("j is: " + j + " and obj is: " + obj['author' + j]);
//               console.log(obj)
//           })
//         }
//       })
//       arr.push(obj)
//     }
//     // console.log(arr)
//     res.render('books/index', {books: arr});
//   })
// });
//
router.get('/', function(req, res, next){
  books().select().then(function(results){
    knex.from('authors').innerJoin('bookauthor', 'authors.id', 'bookauthor.authorId').then(function(joined){
      res.render('books/index', {books: results, authors: joined});
    })
  })
})

router.get('/new', function(req,res,next){
  authors().then(function(results){
    res.render('books/new', {authors: results})
  })
})

router.get('/:id', function(req, res, next){
  books().where('id', req.params.id).first().then(function(result){
    console.log(result)
    knex.from('authors').innerJoin('bookauthor', 'authors.id', 'bookauthor.authorId').then(function(joined){
      res.render('books/show', {books: result, authors: joined})
    })
  })
})

router.get('/:id/edit', function(req, res, next){
  books().where('id', req.params.id).first().then(function(result){
    knex.from('authors').innerJoin('bookauthor', 'authors.id', 'bookauthor.authorId').then(function(joined){
      authors().then(function(writers){
        console.log(joined)
        res.render('books/edit', {books: result, authors: joined, writers: writers})
      })
    })
  })
})



module.exports = router;
