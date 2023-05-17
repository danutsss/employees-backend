const express = require("express");
const { check } = require("express-validator");

const Employee = require("../controllers/employee");
const validate = require("../middleware/validate");

const apiRouter = express.Router();

// Create employee.
apiRouter.post(
	"/",
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
	Employee.createEmployee
);

// Update employee.
apiRouter.put("/:id", Employee.updateEmployeeById);

// Delete employee.
apiRouter.delete("/:id", Employee.deleteEmployee);

// Get all employees.
apiRouter.get("/", Employee.getAllEmployees);

// Get employee by id.
apiRouter.get("/:id", Employee.getEmployeeById);

// Check if employee is admin.
apiRouter.get("/is-admin", Employee.checkIfAdmin);

module.exports = apiRouter;
