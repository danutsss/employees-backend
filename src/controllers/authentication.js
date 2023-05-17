const { Employee } = require("../models/Employee");

/**
 * @route - POST /api/v1/auth/login
 * @desc - login an employee and return JWT token.
 * @access - Public
 */
exports.loginEmployee = async (request, response) => {
	try {
		const { emailAddress, password } = request.body;
		const employee = Employee.findOne({ emailAddress });

		if (!employee) {
			console.log(
				"[api/v1/authentication.js] - loginEmployee() -> employee not found."
			);
			return response.status(401).json({
				success: false,
				message:
					"the e-mail address is not associated with any employee, double-check your e-mail address and try again.",
			});
		}

		// Validate password and make sure it matches with the corresponding hash stored in the database.
		if (!employee.comparePassword(password)) {
			console.log(
				`[api/v1/authentication.js] - loginEmployee() -> invalid password for employee ${emailAddress}`
			);
			return response.status(401).json({
				success: false,
				message:
					"invalid password, double-check your password and try again.",
			});
		}

		// Login successful, write token and send back to user.
		return response.status(200).json({
			success: true,
			message: "you have successfully logged in.",
			token: employee.generateJWT(),
		});
	} catch (error) {
		console.log(
			`[api/v1/authentication.js] - loginEmployee() -> error: ${error}`
		);
		return response.status(500).json({
			success: false,
			message: "there was an error logging in the employee.",
			error: error.message,
		});
	}
};

/**
 * @route - POST /api/v1/auth/register
 * @desc - register an employee.
 * @access - Public
 */
exports.registerEmployee = async (request, response) => {
	try {
		const { emailAddress } = request.body;

		// Make sure this account doesn't already exist.
		const existingEmployee = await Employee.findOne({ emailAddress });

		if (existingEmployee) {
			console.log(
				`[api/v1/authentication.js] - registerEmployee() -> existingEmployee: ${existingEmployee}`
			);
			return response.status(401).json({
				success: false,
				message:
					"this e-mail address you have entered is already associated with another employee.",
			});
		}

		const newEmployee = new Employee({ ...request.body });

		await newEmployee.save();
	} catch (error) {
		console.log(
			`[api/v1/authentication.js] - registerEmployee() -> error: ${error}`
		);
		return response.status(500).json({
			success: false,
			message: "there was an error registering the employee.",
			error: error.message,
		});
	}
};
