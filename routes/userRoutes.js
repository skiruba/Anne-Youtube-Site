const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');
const {isGuest, isLoggedIn} = require('../middleware/auth');


//GET /users/new: send html form for creating a new user account
router.get('/signUp', isGuest, controller.signUp);

//POST /users: create a new user account
router.post('/', isGuest, controller.create);

//GET /users/login: send html for logging in
router.get('/login', isGuest, controller.loginPage);

//POST /users/login: authenticate user's login
router.post('/login', isGuest, controller.login);

//GET /users/profile: send user's profile page
router.get('/profile', isLoggedIn, controller.profile);

//POST /users/logout: logout a user
router.get('/logout', isLoggedIn, controller.logout);

module.exports = router;