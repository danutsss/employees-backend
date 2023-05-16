const passport = require("passport");

module.exports = (request, response, next) => {
	passport.authenticate("jwt", (error, employee) => {
		if (error) return next(error);

		if (!employee)
			return response.status(401).json({
				success: false,
				message: "unauthorized access - no token provided...",
			});

		request.employee = employee;

		next();
	})(request, response, next);
};
