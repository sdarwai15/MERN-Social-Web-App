const { check } = require("express-validator");

let updateProfile = [
	check("name").isString().optional(),
	check("email").isEmail().optional(),
];

module.exports = updateProfile;
