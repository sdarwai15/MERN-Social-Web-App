const { check } = require("express-validator");

let loginValidator = [
	check("email").isEmail().notEmpty(),
	check("password").notEmpty(),
];

module.exports = loginValidator;
