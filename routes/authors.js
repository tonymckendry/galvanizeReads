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

router.get('/new', function(req, res, next){
  if(req.cookies.admin){
    books().then(function(results){
      res.render('authors/new', {books: results})
    })
  }
  else{
    res.render('admin/error')
  }
})

router.get('/:id', function(req, res, next){
  authors().where('id', req.params.id).then(function(results){
    // console.log(results)
    knex.from('books').innerJoin('bookauthor', 'books.id', 'bookauthor.bookId').then(function(joined){

      res.render('authors/index', {authors: results, books: joined});
    })
  })
})

router.get('/:id/edit', function(req, res, next){
  if (req.cookies.admin){
    authors().where('id', req.params.id).first().then(function(results){
      knex.from('books').innerJoin('bookauthor', 'books.id', 'bookauthor.bookId').then(function(joined){
        books().then(function(novels){
          var arr = []
          for (var i = 0; i < joined.length; i++) {
            if (joined[i].authorId == req.params.id){
              arr.push(joined[i].bookId)
            }
          }
          console.log(arr)
          res.render('authors/edit', {authors: results, books: joined, novels: novels, arr: arr});
        })
      })
    })
  }
  else{
    res.render('admin/error')
  }
})

router.get('/:id/delete', function(req, res, next){
  if (req.cookies.admin){
    authors().where('id', req.params.id).del().then(function(result){
      bookAuthor().where('authorId', req.params.id).del().then(function(results){
        res.redirect('/authors')
      })
    })
  }
  else{
    res.render('admin/error')
  }
})

router.post('/', function(req, res, next){
  var authorsObj = {}
  authorsObj.firstName = req.body.firstName
  authorsObj.lastName = req.body.lastName
  authorsObj.portrait = req.body.portrait
  authorsObj.biography = req.body.biography
  var count = req.body.bookCount
  var newId
  authors().insert(authorsObj).returning('id').then(function(results){
    newId = results[0]
    for (var i = 0; i < count; i++) {
      if(req.body['novel' + i] !== undefined){
        var bookAuth = {}
        bookAuth.authorId = newId
        bookAuth.bookId = req.body['novel' + i]
        bookAuthor().insert(bookAuth).then(function(done){})
      }
    }
    res.redirect('/authors')
  })
})

router.post('/:id', function(req, res, next){
  var authorsObj = {}
  authorsObj.firstName = req.body.firstName
  authorsObj.lastName = req.body.lastName
  authorsObj.portrait = req.body.portrait
  authorsObj.biography = req.body.biography
  var count = req.body.bookCount
  console.log(count);
  bookAuthor().where('authorId', req.params.id).del().then(function(result){
  })
  for (var i = 0; i < count; i++) {
    console.log(i);
    if(req.body['novel' + i] !== undefined){
      var bookAuth = {}
      bookAuth.authorId = req.params.id
      bookAuth.bookId = req.body['novel'+i]
      bookAuthor().insert(bookAuth).then(function(result){
      })
    }
  }
  authors().where('id', req.params.id).first().update(authorsObj).then(function(result){
    res.redirect('/authors/' + req.params.id)
  })
})



module.exports = router;
