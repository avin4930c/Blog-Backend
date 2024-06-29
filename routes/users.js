const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');
const authenticateJWT = require('../jwtAuth');

/* GET users listing. */
router.get('/login', userController.login_get);

router.post('/login', userController.login_post);

router.get('/register', userController.register_get);

router.post('/register', userController.register_post);

router.post('/fetchUser', authenticateJWT, userController.fetch_user);

router.post('/updateUser', authenticateJWT, userController.update_user);

router.post('/logout', userController.logout);

module.exports = router;
