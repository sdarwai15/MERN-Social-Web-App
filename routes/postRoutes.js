const express = require("express");
const router = express.Router();
const { api_version } = require("../config/config");
const createPostValidator = require("../validators/postsValidators/createPostValidator");
const {
	createPost,
	likeAndUnlike,
	deletePost,
	getPostsOfFollowings,
	updatePost,
	addUpdateComment,
	deleteComment,
} = require("../controllers/postController");
const { isAuthenticated } = require("../middlewares/auth");

/**
 * @desc Opens the api documentation page
 * @route GET /posts/api_version
 * @access Public
 **/

router.route(`/${api_version}`).get(async (req, res) => {
	res.send(`here is response for you Api version ${api_version}`);
});

/**
 * @desc Opens the create post page
 * @route POST /posts/createpost
 * @access Public (only for loggedIn users)
 **/

router
	.route("/createpost", createPostValidator)
	.post(isAuthenticated, createPost);

/**
 * @desc Like and unlike a post and delete the post
 * @route GET, PATCH and DELETE /posts/:postId
 * @access Public (only for loggedIn users)
 **/

router
	.route("/:postId")
	.get(isAuthenticated, likeAndUnlike)
	.patch(isAuthenticated, updatePost)
	.delete(isAuthenticated, deletePost);

/**
 * @desc get posts of users being followed
 * @route GET /posts
 * @access Private
 **/

router.route("/").get(isAuthenticated, getPostsOfFollowings);

/**
 * @desc add / update / delete comment
 * @route PATCH and DELETE /posts/:postId/comment
 * @access Private
 **/

router
	.route("/:postId/comment")
	.patch(isAuthenticated, addUpdateComment)
	.delete(isAuthenticated, deleteComment);

module.exports = router;
