const { validationResult } = require("express-validator");
const ApiError = require("../errors/handler");
const postModel = require("../models/PostModel");
const userModel = require("../models/UserModel");
const cloudinary = require("cloudinary");

module.exports = {
	async createPost(req, res, next) {
		const errors = validationResult(req);
		// check if there are any errors
		if (!errors.isEmpty()) {
			// if there are errors, return the first error
			return next(ApiError.expressValidationFailed(errors.errors));
		}
		try {
			// creating cloudinary
			const myCloud = await cloudinary.v2.uploader.upload(req.body.image, {
				folder: "postsMedia",
			});

			const newPostData = {
				caption: req.body.caption,
				image: {
					public_id: myCloud.public_id,
					url: myCloud.secure_url,
				},
				author: req.user._id,
			};

			const post = await postModel.create(newPostData);

			// updating user's posts array
			const user = await userModel.findById(req.user._id);
			user.posts.unshift(post._id);
			await user.save();

			// sending response
			res.status(201).json({ success: true, post });
		} catch (error) {
			next(error);
		}
	},

	async deletePost(req, res, next) {
		try {
			const post = await postModel.findById(req.params.postId);
			if (!post) {
				res.status(404).json({
					success: false,
					description: "Cannot find the requested data",
					errors: [
						{
							errorCode: 404,
							field: "Post",
							message: "Post not found for requested ID",
						},
					],
				});
				return;
			} else {
				// checking if the user is same as the author of the post
				if (post.author.toString() !== req.user._id.toString()) {
					return next(ApiError.unauthorized());
				}

				// deleting the post from cloudinary and from the database
				await cloudinary.v2.uploader.destroy(post.image.public_id);
				await post.remove();

				// updating user's posts array
				const user = await userModel.findById(req.user._id);

				user.posts = user.posts.filter((postId) => {
					return postId.toString() !== req.params.postId.toString();
				});

				await user.save();

				// sending response
				res.status(200).json({ success: true, message: "Post Deleted" });
			}
		} catch (error) {
			next(error);
		}
	},

	async likeAndUnlike(req, res, next) {
		try {
			let message = "Post liked successfully";
			const post = await postModel.findById(req.params.postId);
			if (!post) {
				return next(ApiError.notFound());
			}

			const user = await userModel.findById(req.user._id);
			if (!user) {
				return next(ApiError.notFound());
			}

			// check if user already liked the post
			if (post.likes.includes(user._id)) {
				// if user already liked the post, unlike it
				const index = post.likes.indexOf(user._id);
				if (index > -1) {
					post.likes.splice(index, 1);
				}
				message = "Post unliked successfully";
			} else {
				// if user hasn't liked the post, like it
				post.likes.push(user._id);
			}

			await post.save();

			// sending response
			res.status(200).json({ success: true, message, post });
		} catch (error) {
			next(error);
		}
	},

	async getPostsOfFollowings(req, res, next) {
		try {
			const loggedInUser = await userModel.findById(req.user._id);
			if (!loggedInUser) {
				return next(ApiError.unauthorized());
			} else {
				const posts = await postModel
					.find({ author: { $in: loggedInUser.followings } })
					.populate("author likes comments.user");

				res.status(200).json({ success: true, posts: posts.reverse() });
			}
		} catch (error) {
			next(error);
		}
	},

	async updatePost(req, res, next) {
		try {
			const post = await postModel.findById(req.params.postId);

			if (!post) {
				return next(ApiError.notFound());
			}

			// checking if the user is same as the author of the post
			if (post.author.toString() !== req.user._id.toString()) {
				return next(ApiError.unauthorized());
			}

			// updating post
			post.caption = req.body.caption;

			await post.save();

			// sending response
			res.status(200).json({
				success: true,
				message: "Post updated successfully",
				post,
			});
		} catch (error) {
			next(error);
		}
	},

	async addUpdateComment(req, res, next) {
		try {
			const post = await postModel
				.findById(req.params.postId)
				.populate("author")
				.populate("comments")
				.populate("likes");

			if (!post) {
				return next(ApiError.notFound());
			}

			// checking if comment is already present by the same user
			let commentIndex = -1;

			post.comments.forEach((comment, index) => {
				if (comment.user.toString() === req.user._id.toString()) {
					commentIndex = index;
				}
			});

			if (commentIndex > -1) {
				// if comment is already present, update it
				post.comments[commentIndex].comment = req.body.comment;
			} else {
				// adding comment
				post.comments.push({
					user: req.user._id,
					comment: req.body.comment,
				});
			}

			await post.save();

			// sending response
			res.status(200).json({ success: true, post });
		} catch (error) {
			next(error);
		}
	},

	async deleteComment(req, res, next) {
		try {
			const post = await postModel.findById(req.params.postId);

			if (!post) {
				return res.status(404).json({
					success: false,
					message: "Post not found",
				});
			}

			// Checking If author wants to delete
			if (post.author.toString() === req.user._id.toString()) {
				if (req.body.commentId === undefined) {
					return res.status(400).json({
						success: false,
						message: "Comment Id is required",
					});
				}

				post.comments.forEach((item, index) => {
					if (item._id.toString() === req.body.commentId.toString()) {
						return post.comments.splice(index, 1);
					}
				});

				await post.save();

				return res.status(200).json({
					success: true,
					message: "Selected Comment has been Deleted",
				});
			} else {
				post.comments.forEach((item, index) => {
					if (item.user.toString() === req.user._id.toString()) {
						return post.comments.splice(index, 1);
					}
				});

				await post.save();

				return res.status(200).json({
					success: true,
					message: "Your Comment has been Deleted",
				});
			}
		} catch (error) {
			next(error);
		}
	},
};
