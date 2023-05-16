const { Employee } = require("../models/Employee");

/**
 * @route - POST /api/v1/employee
 * @desc - register a new employee.
 * @access - Public
 */
exports.createEmployee = async (request, response) => {
	try {
		const { emailAddress } = request.body;

		// Make sure this account doesn't already exist.
		const existingEmployee = await Employee.findOne({ emailAddress });

		if (existingEmployee) {
			console.log(
				`[api/v1/employee.js] - createEmployee() -> existingEmployee: ${existingEmployee}`
			);
			return response.status(401).json({
				success: false,
				message:
					"the e-mail address you have entered is already associated with another employee.",
			});
		}

		const newEmployee = new Employee({ ...request.body });

		await newEmployee.save();

		return response.status(200).json({
			success: true,
			message: "employee successfully created.",
		});
	} catch (error) {
		console.log(
			`[api/v1/employee.js] - createEmployee() -> error: ${error}`
		);
		return response.status(500).json({
			success: false,
			message: "an error occured while creating the employee.",
			error: error.message,
		});
	}
};

/**
 * @route - DELETE /api/v1/employee/:id
 * @desc - delete an employee by ID.
 * @access - Public
 */
exports.deleteEmployee = async (request, response) => {
	try {
		const id = request.params.id;
		const employeeId = request.employee.id;

		// Check if user is admin.
		const hasPermission =
			request.employee.permissionLevel === "admin" ? true : false;

		if (!hasPermission) {
			console.log(
				`[api/v1/employee.js] - deleteEmployee() -> employee ${request.employee.id} does not have permission delete employee`
			);
			return response.status(401).json({
				success: false,
				message: "you do not have permission to delete employee.",
			});
		}

		// Make sure the passed ID is the same as the logged in employee.
		if (employeeId.toString() !== id.toString()) {
			console.log(
				`[api/v1/employee.js] - deleteEmployee() -> employeeId: ${employeeId} not equal to id: ${id}`
			);
			return response.status(401).json({
				success: false,
				message: "you are not authorized to delete this employee.",
			});
		}

		// Make sure the employee exists.
		const existingEmployee = await Employee.findById(id);

		if (!existingEmployee) {
			console.log(
				`[api/v1/employee.js] - deleteEmployee() -> employeeId: ${id} does not exist`
			);
			return response.status(401).json({
				success: false,
				message:
					"the employee you are trying to delete does not exist.",
			});
		}

		await Employee.findByIdAndDelete(id);

		return response.status(200).json({
			success: true,
			message: "employee sucessfully deleted.",
		});
	} catch (error) {
		console.log(
			`[api/v1/employee.js] - deleteEmployee() -> error: ${error}`
		);
		return response.status(500).json({
			success: false,
			message: "an error occured while deleting the employee.",
			error: error.message,
		});
	}
};

/**
 * @route - GET /api/v1/employees
 * @desc - get all employees.
 * @access - Public
 */
exports.getAllEmployees = async (request, response) => {
	try {
		const employees = await Employee.find();

		// Check if user is admin.
		const hasPermission =
			request.employee.permissionLevel === "admin" ? true : false;

		if (!hasPermission) {
			console.log(
				`[api/v1/employee.js] - getAllEmployees() -> employee ${request.employee.id} does not have permission to view all employees`
			);
			return response.status(401).json({
				success: false,
				message: "you do not have permission to view all employees.",
			});
		}

		if (!employees) {
			console.log(
				"[api/v1/employees.js] - getAllEmployees() -> no employees found."
			);
			return response.status(404).json({
				success: false,
				message: "no employees found.",
			});
		}

		return response.status(200).json({
			success: true,
			message: "employees successfully retrieved.",
			employees,
		});
	} catch (error) {
		console.log(
			`[api/v1/employee.js] - getAllEmployees() -> error: ${error}`
		);
		return response.status(500).json({
			success: false,
			message:
				"an error occured while retrieving all employees from database.",
			error: error.message,
		});
	}
};

/**
 * @route - GET /api/v1/employee/:id
 * @desc - get an employee by ID.
 * @access - Public
 */
exports.getEmployeeById = async (request, response) => {
	try {
		const id = request.params.id;

		const employee = await Employee.findById(id);

		if (!employee) {
			console.log(
				`[api/v1/employee.js] - getEmployeeById() -> employeeId: ${id} does not exist`
			);
			return response.status(404).json({
				success: false,
				message: `the employee with id: ${id} does not exist.`,
			});
		}

		return response.status(200).json({
			success: true,
			message: `employee with id: ${id} successfully retrieved.`,
			employee,
		});
	} catch (error) {
		console.log(
			`[api/v1/employee.js] - getEmployeeById() -> error: ${error}`
		);
		return response.status(500).json({
			success: false,
			message: `an error occured while retrieving the employee ${request.params.id}.`,
			error: error.message,
		});
	}
};

/**
 * @route - PUT /api/v1/employee/:id
 * @desc - update an employee by ID.
 * @access - Public
 */
exports.updateEmployeeById = async (request, response) => {
	try {
		const id = request.params.id;
		const newEmployeeInfo = request.body;

		await Employee.findByIdAndUpdate(
			id,
			{ $set: newEmployeeInfo },
			{ new: true }
		);

		return response.status(200).json({
			success: true,
			message: `employee with id: ${id} was successfully updated.`,
		});
	} catch (error) {
		console.log(
			`[api/v1/employee.js] - updateEmployee() -> error: ${error}}`
		);
		return response.status(500).json({
			success: false,
			message: `an error occured while updating the employee ${request.params.id}.`,
			error: error.message,
		});
	}
};

/**
 * @route - GET /api/v1/employee/is-admin
 * @desc - check if logged in employee is an admin.
 * @access - Public
 */
exports.checkIfAdmin = async (request, response) => {
	try {
		const id = request.employee.id;

		const employee = await Employee.findById(id);

		if (!employee) {
			console.log(
				"[api/v1/employee.js] - checkIfAdmin() -> employee not found."
			);
			return response.status(404).json({
				success: false,
				message: "employee not found.",
			});
		}

		return response.status(200).json({
			success: true,
			message: "employee permission level successfully retrieved.",
			isAdmin: employee.permissionLevel === "admin" ? true : false,
		});
	} catch (error) {
		console.log(`[api/v1/employee.js] - checkIfAdmin() -> error: ${error}`);
		return response.status(500).json({
			success: false,
			message: "an error occured while checking if employee is an admin.",
			error: error.message,
		});
	}
};
