const mongoose = require("mongoose");

const Config = {
    api_version: "0.0.1",
	collection_names: {
		Post: "Posts",
		User: "Users",
	},
};

module.exports = Config;
