const express = require("express");
const { check } = require("express-validator");

const Auth = require("../controllers/authentication");
const validate = require("../middleware/validate");

const apiRouter = express.Router();

apiRouter.get("/", (request, response) => {
	return response.status(200).json({
		success: true,
		message:
			"you are in the authentication endpoint. login or register to test authentication.",
	});
});

// Register employee.
apiRouter.post(
	"/register",
	[
		check("firstName")
			.not()
			.isEmpty()
			.withMessage("first name is required."),
		check("lastName").not().isEmpty().withMessage("last name is required."),
		check("email").isEmail().withMessage("email is required."),
		check("password").not().isEmpty().withMessage("password is required."),
	],
	validate,
	Auth.registerEmployee
);

// Login employee.
apiRouter.post(
	"/login",
	[
		check("email").isEmail().withMessage("email is required."),
		check("password").not().isEmpty().withMessage("password is required."),
	],
	validate,
	Auth.loginEmployee
);

module.exports = apiRouter;
