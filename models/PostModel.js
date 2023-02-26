const mongoose = require("mongoose");
const Config = require("../config/config");

const postSchema = new mongoose.Schema({
	caption: String, // caption of the post
	image: {
		public_id: String, // public_id of the image
		url: String, // url of the image
	},
	author: {
		// author of the post
		type: mongoose.Schema.Types.ObjectId,
		ref: Config.collection_names.User,
	},
	createdAt: {
		// date of the post
		type: Date,
		default: Date.now,
	},
	likes: [
		// likes array of the post
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: Config.collection_names.User,
		},
	],
	comments: [
		// comments array of the post
		{
			user: {
				type: mongoose.Schema.Types.ObjectId,
				ref: Config.collection_names.User,
			},
			comment: {
				type: String,
				required: true,
			},
		},
	],
});

const PostModel = mongoose.model(Config.collection_names.Post, postSchema);

module.exports = PostModel;
