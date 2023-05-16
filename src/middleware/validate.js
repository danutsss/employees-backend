const { validationResult } = require("express-validator");

module.exports = (request, response, next) => {
	const errors = validationResult(request);

	if (!errors.isEmpty()) {
		let error = {};

		errors.array().map((error) => (error[error.param] = error.msg));

		return response.status(422).json({
			success: false,
			message: "invalid request...",
			error: error,
		});
	}

	next();
};
