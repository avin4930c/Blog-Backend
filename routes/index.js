const express = require('express');
const router = express.Router();
const authenticateJWT = require('../jwtAuth');

/* GET home page. */
router.get('/', authenticateJWT, function (req, res, next) {
  res.render('index', { title: 'Express' });
});



module.exports = router;
