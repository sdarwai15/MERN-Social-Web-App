const { check } = require("express-validator");

let updatePassword = [
	check("oldPassword").notEmpty().isString(),
	check("newPassword").isLength({ min: 6 }).notEmpty().isString(),
];

module.exports = updatePassword;
