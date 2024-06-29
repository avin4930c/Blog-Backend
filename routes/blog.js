const express = require('express');
const router = express.Router();
const authenticateJWT = require('../jwtAuth');
const blogController = require('../Controllers/blogController');

router.get('/', blogController.get_blogs);

router.get('/topic', blogController.get_blog_topic);

router.post('/addPost', authenticateJWT, blogController.add_post);

router.get('/published', blogController.get_published_blogs);

router.get('/:id', blogController.get_blog);

router.get('/:id/comments', blogController.get_comments);

router.post('/:id/comment', authenticateJWT, blogController.add_comment);

router.put('/updateBlog/:id', authenticateJWT, blogController.update_blog);

module.exports = router;