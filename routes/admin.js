var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/set', function(req, res, next) {
  res.cookie('admin', 'true')
  res.render('admin/set')
});
router.get('/remove', function(req, res, next) {
  res.clearCookie('admin')
  res.render('admin/remove')
});

module.exports = router;
