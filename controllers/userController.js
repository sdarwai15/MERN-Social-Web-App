const { validationResult } = require("express-validator");
const crypto = require("crypto");
const cloudinary = require("cloudinary");
const ApiError = require("../errors/handler");
const userModel = require("../models/UserModel");
const postModel = require("../models/PostModel");
const { sendEmail } = require("../middlewares/sendEmail");

module.exports = {
	async register(req, res, next) {
		const errors = validationResult(req);
		// check if there are any errors
		if (!errors.isEmpty()) {
			// if there are errors, return the first error
			return next(ApiError.expressValidationFailed(errors.errors));
		}

		try {
			const { name, username, email, avatar, password } = req.body;

			// check if user already exists
			const foundUser = await userModel.findOne({ email });
			if (foundUser) {
				res.status(409).json({
					success: false,
					errorCode: 409,
					field: "email",
					message: `User already exists with ${email} id`,
				});
			} else {
				// create new user if not found in db

				// uploading the avatar on cloudinary
				const myCloud = await cloudinary.v2.uploader.upload(avatar, {
					folder: "avatars",
				});

				const newUser = new userModel({
					name,
					username,
					email,
					password,
					avatar: { public_id: myCloud.public_id, url: myCloud.secure_url },
				});

				const ans = await newUser.save();

				// generate token
				const token = await ans.generateAuthToken();

				//setting options for token
				const options = {
					expires: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
					httpOnly: true,
				};

				// sending response with token and user data
				res
					.status(201)
					.cookie("token", token, options)
					.json({ success: true, ans, token });
			}
		} catch (error) {
			next(error);
		}
	},

	async login(req, res, next) {
		const errors = validationResult(req);
		// check if there are any errors
		if (!errors.isEmpty()) {
			// if there are errors, return the first error
			return next(ApiError.expressValidationFailed(errors.errors));
		}

		try {
			const { email, password } = req.body;

			// find user by email and select password
			const foundUser = await userModel
				.findOne({ email })
				.select("+password")
				.populate("posts followers followings");

			if (!foundUser) {
				res.status(404).json({
					success: false,
					errorCode: 404,
					field: "User does not exist",
				});
			}

			// check if password is correct
			const isMatch = await foundUser.comparePassword(password);

			if (!isMatch) {
				res.status(401).json({
					success: false,
					errorCode: 401,
					message: "Invalid email or password",
				});
			}

			// generate token
			const token = await foundUser.generateAuthToken();

			//setting options for token
			const options = {
				expires: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
				httpOnly: true,
			};

			// sending response with token and user data
			res
				.status(200)
				.cookie("token", token, options)
				.json({ success: true, foundUser, token });
		} catch (error) {
			next(error);
		}
	},

	async logout(req, res, next) {
		try {
			res
				.status(200)
				.cookie("token", null, {
					expires: new Date(Date.now()),
					httpOnly: true,
				})
				.json({ success: true, message: "Logged out successfully" });
		} catch (error) {
			next(error);
		}
	},

	async followUser(req, res, next) {
		try {
			const userToFollow = await userModel.findById(req.params.id);
			const loggedInUser = await userModel.findById(req.user._id);

			if (!userToFollow) {
				return next(ApiError.notFound("User not found"));
			} else {
				if (loggedInUser.followings.includes(userToFollow._id)) {
					// find indexes of ids
					const indexFollowing = loggedInUser.followings.indexOf(
						userToFollow._id
					);
					const indexFollowers = userToFollow.followers.indexOf(
						loggedInUser._id
					);

					// splicing the array
					loggedInUser.followings.splice(indexFollowing, 1);
					userToFollow.followers.splice(indexFollowers, 1);

					// save changes
					await loggedInUser.save();
					await userToFollow.save();

					// send response
					res.status(200).json({
						success: true,
						message: `${req.params.id} is successfully unfollowed by ${req.user._id}`,
					});
				} else {
					// push loggedInUser to userToFollow's followers array
					userToFollow.followers.push(loggedInUser);

					//push followed user to logged in user's following array
					loggedInUser.followings.push(userToFollow);

					// save both users
					await userToFollow.save();
					await loggedInUser.save();

					// send response
					res.status(200).json({
						success: true,
						message: `${req.params.id} is successfully followed by ${req.user._id}`,
					});
				}
			}
		} catch (error) {
			next(error);
		}
	},

	async updatePassword(req, res, next) {
		const errors = validationResult(req);
		// check if there are any errors, if yes then return the errors array
		if (!errors.isEmpty()) {
			res.status(422).json({
				success: false,
				errorCode: 422,
				error: errors.errors,
			});
			return;
		}

		try {
			const { oldPassword, newPassword } = req.body;

			// find user by id and select password
			const foundUser = await userModel
				.findById(req.user._id)
				.select("+password");

			const isMatch = await foundUser.comparePassword(oldPassword);

			if (!isMatch) {
				res.status(401).json({
					success: false,
					errorCode: 401,
					message: "Invalid old password",
				});
				return;
			}

			// set new password
			foundUser.password = newPassword;

			// save changes
			await foundUser.save();

			// send response
			res.status(200).json({
				success: true,
				message: "Password updated successfully",
			});
		} catch (error) {
			next(error);
		}
	},

	async updateProfile(req, res, next) {
		const errors = validationResult(req);
		// check if there are any errors
		if (!errors.isEmpty()) {
			// if there are errors, return the first error
			return next(ApiError.expressValidationFailed(errors.errors));
		}

		try {
			const { name, email, avatar } = req.body;

			// find user by id
			const loggedInUser = await userModel.findById(req.user._id);

			// creating blank object to store updated data
			let update = {};

			// set new values
			if (name) update.name = name;
			if (email) update.email = email;
			if (avatar) {
				// if avatar is not empty, then first remove the old avatar
				await cloudinary.v2.uploader.destroy(loggedInUser.avatar.public_id);

				// then upload the new avatar
				const uploadedAvatar = await cloudinary.v2.uploader.upload(avatar, {
					folder: "avatars",
				});

				update.avatar = {};
				update.avatar.public_id = uploadedAvatar.public_id;
				update.avatar.url = uploadedAvatar.secure_url;
			}

			// find user by id and update
			const foundUser = await userModel.findByIdAndUpdate(
				req.user._id,
				update,
				{ new: true }
			);

			// send response
			res.status(200).json({
				success: true,
				message: "Profile updated successfully",
				foundUser,
			});
		} catch (error) {
			next(error);
		}
	},

	async deleteProfile(req, res, next) {
		try {
			const loggedInUser = await userModel.findById(req.user._id);

			// storing all _id, posts and followers of user
			const posts = loggedInUser.posts;
			const followers = loggedInUser.followers;
			const followings = loggedInUser.followings;
			const userId = loggedInUser._id;

			// deleting avatar from cloudinary
			await cloudinary.v2.uploader.destroy(loggedInUser.avatar.public_id);

			// delete user
			await loggedInUser.remove();

			//logout user after deleting profile
			res.cookie("token", null, {
				expires: new Date(Date.now()),
				httpOnly: true,
			});

			// delete all posts of user
			posts.forEach(async (post) => {
				await cloudinary.v2.uploader.destroy(post.image.public_id);
				await postModel.findByIdAndRemove(post);
			});

			// Removing user from his/her followers' followings  array
			followers.forEach(async (follower) => {
				const foundFollower = await userModel.findById(follower);
				const index = foundFollower.followings.indexOf(userId);
				foundFollower.followings.splice(index, 1);
				await foundFollower.save();
			});

			// Removing user from his/her followings' followers  array
			followings.forEach(async (following) => {
				const foundFollowing = await userModel.findById(following);
				const index = foundFollowing.followers.indexOf(userId);
				foundFollowing.followers.splice(index, 1);
				await foundFollowing.save();
			});

			// Removing comments made by user
			const allPosts = await postModel.find();
			allPosts.forEach(async (post) => {
				post.comments.forEach(async (comment) => {
					if (comment.user === userId) {
						post.comments.splice(post.comments.indexOf(comment), 1);
					}
				});
				await post.save();
			});

			// Removing likes made by user
			allPosts.forEach(async (post) => {
				post.likes.forEach(async (like) => {
					if (like.user === userId) {
						post.likes.splice(post.likes.indexOf(like), 1);
					}
				});
				await post.save();
			});

			// deleting stored data of user
			delete loggedInUser;
			delete posts;
			delete followers;
			delete followings;
			delete userId;

			// send response
			res.status(200).json({
				success: true,
				message: "Profile deleted successfully",
			});
		} catch (error) {
			next(error);
		}
	},

	async myProfile(req, res, next) {
		try {
			const foundUser = await userModel
				.findById(req.user._id)
				.populate("posts followers followings");

			if (!foundUser) {
				return next(ApiError.notFound("User not found"));
			} else {
				// send response
				return res.status(200).json({
					success: true,
					user: foundUser,
				});
			}
		} catch (error) {
			next(error);
		}
	},

	async myPosts(req, res, next) {
		try {
			const foundUser = await userModel.findById(req.user._id);

			// empty array to store posts of user
			let posts = [];

			// push all posts of user to posts array
			for (let i = 0; i < foundUser.posts.length; i++) {
				const post = await postModel
					.findById(foundUser.posts[i])
					.populate("likes comments.user author");
				posts.push(post);
			}

			// send response
			res.status(200).json({
				success: true,
				posts,
			});
		} catch (error) {
			next(error);
		}
	},

	async userPosts(req, res, next) {
		try {
			const foundUser = await userModel.findById(req.params.id);

			// empty array to store posts of user
			let posts = [];

			// push all posts of user to posts array
			for (let i = 0; i < foundUser.posts.length; i++) {
				const post = await postModel
					.findById(foundUser.posts[i])
					.populate("likes comments.user author");
				posts.push(post);
			}

			// send response
			res.status(200).json({
				success: true,
				posts,
			});
		} catch (error) {
			next(error);
		}
	},

	async getUser(req, res, next) {
		try {
			const foundUser = await userModel
				.findById(req.params.id)
				.populate("posts")
				.populate("followers")
				.populate("followings");

			if (!foundUser) {
				return next(ApiError.notFound("User not found"));
			} else {
				// send response
				res.status(200).json({
					success: true,
					user: foundUser,
				});
			}
		} catch (error) {
			next(error);
		}
	},

	async getAllUsers(req, res, next) {
		try {
			const foundUsers = await userModel
				.find({ name: { $regex: req.query.name, $options: "i" } })
				.populate("posts")
				.populate("followers")
				.populate("followings");

			// send response
			res.status(200).json({
				success: true,
				users: foundUsers,
			});
		} catch (error) {
			next(error);
		}
	},

	async forgotPassword(req, res, next) {
		try {
			const user = await userModel.findOne({ email: req.body.email });

			if (!user) {
				return res.status(404).json({
					success: false,
					message: "Email Id not found",
				});
			}

			// generate random token for password reset link and store in database
			const resetPasswordToken = user.generateResetPasswordToken();

			await user.save();

			// setting up link to reset password
			const resetPasswordUrl = `${req.protocol}://${req.get(
				"host"
			)}/users/reset-password/${resetPasswordToken}`;

			// setting up email data
			const message = `You are receiving this email because you (or someone else) have requested the reset of the password for your account. If you did not request this, please ignore this email and your password will remain unchanged. Reset your password by accessing the below link:\n\n ${resetPasswordUrl}`;

			try {
				// sending email to user with reset password link and message
				await sendEmail({
					email: user.email,
					subject: "Reset Password",
					message,
				});

				res.status(200).json({
					success: true,
					message: `Email sent to ${user.email}`,
				});
			} catch (error) {
				// if email sending fails, delete the token from database and send error response
				user.resetPasswordToken = undefined;
				user.resetPasswordExpire = undefined;
				await user.save();

				return res.status(500).json({
					success: false,
					message: "Error sending email",
				});
			}
		} catch (error) {
			next(error);
		}
	},

	async resetPassword(req, res, next) {
		try {
			const resetPasswordToken = crypto
				.createHash("sha256")
				.update(req.params.token)
				.digest("hex");

			const user = await userModel.findOne({
				resetPasswordToken,
				resetPasswordExpire: { $gt: Date.now() },
			});

			if (!user) {
				return res.status(200).json({
					success: true,
					message: "Invalid Token or Token Expired",
				});
			}

			// set new password
			user.password = req.body.password;

			// remove reset password token and expiry date
			user.resetPasswordToken = undefined;
			user.resetPasswordExpire = undefined;

			await user.save();

			// send response
			res.status(200).json({
				success: true,
				message: "Password updated successfully",
			});
		} catch (error) {
			next(error);
		}
	},
};
