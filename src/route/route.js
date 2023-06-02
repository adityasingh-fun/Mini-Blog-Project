const express = require('express');
const authorController = require('../controllers/authorController');
const blogController = require('../controllers/blogController');
const authorMiddleware = require('../middlewares/authorMiddleware');

const router = express.Router();

// Author Routes
router.post('/authors',authorController.registerAuthor);
router.post('/login',authorController.loginAuthor);

// Blog Routes
router.post('/blogs',authorMiddleware.authorAuthentication,blogController.createBlog);
router.get('/blogs',authorMiddleware.authorAuthentication,blogController.listBlog);
router.put('/blogs/:blogId',authorMiddleware.authorAuthentication,blogController.updateBlog);
router.delete('/blogs/:blogId',authorMiddleware.authorAuthentication,blogController.deleteBlogById);
router.delete('/blogs',authorMiddleware.authorAuthentication,blogController.deleteBlogByParams);

module.exports = router;