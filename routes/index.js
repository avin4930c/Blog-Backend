const express = require('express');
const router = express.Router();
const authenticateJWT = require('../jwtAuth');

/* GET home page. */
router.get('/', authenticateJWT, function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/posts', function(req, res, next) {
  res.send('posts');
});

router.get('/posts/:id', function(req, res, next) {
  res.send('posts/:id');
});

router.get('/posts/:id/comments', function(req, res, next) {
  res.send('posts/:id/comments');
});



module.exports = router;
