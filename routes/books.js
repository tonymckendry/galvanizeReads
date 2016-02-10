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
  books().select().then(function(results){
    knex.from('authors').innerJoin('bookauthor', 'authors.id', 'bookauthor.authorId').then(function(joined){
      res.render('books/index', {books: results, authors: joined});
    })
  })
})

router.get('/new', function(req,res,next){
  if(req.cookies.admin){
    authors().then(function(results){
      res.render('books/new', {authors: results})
    })
  }
  else{
    res.render('admin/error')
  }
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
  if(req.cookies.admin){
    books().where('id', req.params.id).first().then(function(result){
      knex.from('authors').innerJoin('bookauthor', 'authors.id', 'bookauthor.authorId').then(function(joined){
        authors().then(function(writers){
          var arr = [];
          for (var i = 0; i < joined.length; i++) {
            if (joined[i].bookId == req.params.id){
              arr.push(joined[i].authorId)
            }
          }
          console.log(arr)
          res.render('books/edit', {books: result, authors: joined, writers: writers, arr: arr})
        })
      })
    })
  }
  else{
    res.render('admin/error')
  }
})

router.get('/:id/delete', function(req, res, next){
  if(req.cookies.admin){
    books().where('id', req.params.id).del().then(function(result){
      bookAuthor().where('bookId', req.params.id).del().then(function(results){
        res.redirect('/books')
      })
    })
  }
  else{
    res.render('admin/error')
  }
})

router.post('/', function(req, res, next){
  var booksObj = {}
  booksObj.title = req.body.title
  booksObj.genre = req.body.genre
  booksObj.description = req.body.description
  booksObj.cover = req.body.cover
  var count = req.body.authCount
  var newId
  books().insert(booksObj).returning('id').then(function(result){
    newId = result[0]
    for (var i = 0; i < count; i++) {
      if(req.body['author' + (i + 1)] !== undefined){
        var bookAuth = {}
        bookAuth.bookId = newId
        bookAuth.authorId = req.body['author' + (i + 1)]
        bookAuthor().insert(bookAuth).then(function(done){})
      }
    }
    res.redirect('/books')
  })
})

router.post('/:id', function(req, res, next){
  var booksObj = {}
  booksObj.title = req.body.title
  booksObj.genre = req.body.genre
  booksObj.description = req.body.description
  booksObj.cover = req.body.cover
  var count = req.body.authCount
  bookAuthor().where('bookId', req.params.id).del().then(function(results){
  })
  for (var i = 0; i < count; i++) {
    if(req.body['author' + (i + 1)] !== undefined){
      var bookAuth = {}
      bookAuth.bookId = req.params.id
      bookAuth.authorId = req.body['author' + (i + 1)]
      bookAuthor().insert(bookAuth).then(function(result){

      })
    }
  }
  books().where('id', req.params.id).first().update(booksObj).then(function(results){
    res.redirect('/books/' + req.params.id)
  })
})




module.exports = router;
