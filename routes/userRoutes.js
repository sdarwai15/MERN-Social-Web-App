const express = require("express");
const router = express.Router();
const { api_version } = require("../config/config");
const { isAuthenticated } = require("../middlewares/auth");
const {
	register,
	login,
	logout,
	followUser,
	updatePassword,
	updateProfile,
	deleteProfile,
	myProfile,
	getUser,
	getAllUsers,
	forgotPassword,
	resetPassword,
	myPosts,
	userPosts,
} = require("../controllers/userController");
const registerUserValidator = require("../validators/userValidators/registerValidator");
const loginValidator = require("../validators/userValidators/loginValidator");
const updatePasswordValidator = require("../validators/userValidators/updatePassword");
const updateProfileValidator = require("../validators/userValidators/updateProfile");

/**
 * @desc Opens the api documentation page
 * @route GET /posts/api_version
 * @access Public
 **/

router.route("/api_ver").get(async (req, res) => {
	res.send(`here is response for you Api version ${api_version}`);
});

/**
 * @desc registers a new user
 * @route POST /users/register
 * @access Public
 **/

router.route("/register", registerUserValidator).post(register);

/**
 * @desc login a user
 * @route POST /users/login
 * @access Public
 **/

router.route("/login", loginValidator).post(login);

/**
 * @desc logout a user
 * @route GET /users/logout
 * @access Public
 **/

router.route("/logout").get(isAuthenticated, logout);

/**
 * @desc follow a user
 * @route GET /users/follow/:id
 * @access Private
 **/

router.route("/follow/:id").get(isAuthenticated, followUser);

/**
 * @desc update password
 * @route PATCH /users/update/password
 * @access Private
 **/

router
	.route("/update/password", updatePasswordValidator)
	.patch(isAuthenticated, updatePassword);

/**
 * @desc update profile
 * @route PATCH /users/update/profile
 * @access Private
 **/

router
	.route("/update/profile", updateProfileValidator)
	.patch(isAuthenticated, updateProfile);

/**
 * @desc delete profile
 * @route DELETE /users/delete/me
 * @access Private
 **/

router.route("/delete/me").delete(isAuthenticated, deleteProfile);

/**
 * @desc get profile details
 * @route GET /users/me
 * @access Private
 **/

router.route("/me").get(isAuthenticated, myProfile);

/**
 * @desc get your posts
 * @route GET /users/me/posts
 * @access Private
 **/

router.route("/me/posts").get(isAuthenticated, myPosts);

/**
 * @desc get posts of a user
 * @route GET /users/:id/posts
 * @access Private
 **/

router.route("/:id/posts").get(isAuthenticated, userPosts);

/**
 * @desc get profile of a user
 * @route GET /users/profile/:id
 * @access Private
 **/

router.route("/profile/:id").get(isAuthenticated, getUser);

/**
 * @desc fetch all users
 * @route GET /users
 * @access Private
 **/

router.route("/").get(isAuthenticated, getAllUsers);

/**
 * @desc generate a reset password link and send it to the user in email
 * @route POST /users/forgot-password
 * @access Private
 **/

router.route("/forgot-password").post(forgotPassword);

/**
 * @desc reset password
 * @route PATCH /users/reset-password/:token
 * @access Private
 **/

router.route("/reset-password/:token").patch(resetPassword);

module.exports = router;
