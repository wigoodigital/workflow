var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET home page. */
router.get('/nossas-linhas', function(req, res, next) {
  res.render('nossas-linhas', { title: 'Express' });
});

module.exports = router;
