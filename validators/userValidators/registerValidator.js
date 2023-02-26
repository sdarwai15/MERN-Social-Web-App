const { check } = require("express-validator");

let registerUserValidator = [
	check("name").isString(),
	check("username").isString().notEmpty(),
	check("email").isEmail().notEmpty(),
	check("password").isLength({ min: 6 }).notEmpty(),
];

module.exports = registerUserValidator;
