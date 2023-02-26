const { check } = require("express-validator");

let createPostValidator = [
	check("caption").isString().optional(),
	check("image").optional(),
	check("author").notEmpty(),
	check("createdAt").notEmpty(),
];

module.exports = createPostValidator;