const express = require('express');
const mainController = require('../controller/mainController');
const signUpController = require('../controller/signUpController');
const loginController = require('../controller/loginController');
const blogController = require('../controller/blogController')

const router = express.Router();
const app = express();

router.route('/').get(mainController.login)
router.route('/home').get(mainController.login)

router.route('/login').get(mainController.login);
router.route('/login').post(loginController.login);

router.route('/signup').get(mainController.login);
router.route('/signup').post(signUpController.signup);

router.route('/profile').get(mainController.profile);

router.route('/logout').get(mainController.logout);

router.route('/createBlog').get(mainController.createBlog);
router.route('/createBlog').post(blogController.createBlog);

router.route('/myBlogs').get(mainController.myBlogs);
router.route('/blog').get(mainController.blog);

router.route('/delete').post(mainController.deleteBlog);

router.route('/likePost').post(mainController.likePost);
router.route('/dislikePost').post(mainController.dislikePost);
router.route('/comment').post(mainController.createComment);

module.exports = router;