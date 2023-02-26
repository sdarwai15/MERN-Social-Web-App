const mongoose = require("mongoose");
const Config = require("../config/config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
	name: String, // name of the user
	avatar: {
		// avatar of the user
		public_id: String,
		url: String,
	},
	username: {
		// username of the user
		type: String,
		required: [true, "Username is required"],
		unique: [true, "Username is already taken"],
	},
	email: {
		// email of the user
		type: String,
		required: [true, "Email is required"],
		unique: [true, "Email is already in use"],
	},
	password: {
		// password of the user
		type: String,
		required: [true, "Password is required"],
		minlength: [6, "Password must be at least 6 characters"],
		select: false,
	},
	posts: [
		// posts array of the user
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: Config.collection_names.Post,
		},
	],
	followers: [
		// followers array of the user
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: Config.collection_names.User,
		},
	],
	followings: [
		// followings array of the user
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: Config.collection_names.User,
		},
	],
	resetPasswordToken: String,
	resetPasswordExpire: Date,
});

userSchema.pre("save", async function (next) {
	// if password is not modified, skip this function
	if (this.isModified("password")) {
		// hash the password before saving
		this.password = await bcrypt.hash(this.password, 10);
	}
	next();
});

userSchema.methods.comparePassword = async function (password) {
	// compare the password with the hashed password
	return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAuthToken = function () {
	// generate a token for the user
	return jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
};

userSchema.methods.generateResetPasswordToken = function () {
	// generate a token for the user
	const resetToken = crypto.randomBytes(20).toString("hex");
	this.resetPasswordToken = crypto
		.createHash("sha256")
		.update(resetToken)
		.digest("hex");

	// setting expiry to 10 minutes
	this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

	return resetToken;
};

const userModel = mongoose.model(Config.collection_names.User, userSchema);

module.exports = userModel;
