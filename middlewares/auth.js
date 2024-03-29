const UserModel = require("../models/UserModel");
const ApiError = require("../errors/handler");
const jwt = require("jsonwebtoken");

module.exports = {
	async isAuthenticated(req, res, next) {
		try {
			const { token } = req.cookies;

			if (!token) {
				// if no token, return error
				return res.status(401).json({
					description: "Authorization token is required in headers",
					errors: [
						{
							errorCode: 401,
							field: "Authorization",
							message: "Please Login first",
						},
					],
				});
			} else {
				// verify token
				const decoded = jwt.verify(token, process.env.JWT_SECRET);
				// if token is valid, find user by id in db
				const user = await UserModel.findById(decoded._id);

				if (!user) {
					// if user not found, return error
					return next(ApiError.unauthorized("Please Login first"));
				} else {
					// if user found, set user to req.user
					// console.log(user);
					req.user = user;
					next();
				}
			}
		} catch (error) {
			// console.log(error);
			next(error);
		}
	},
};
