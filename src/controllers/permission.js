const { Permission } = require("../models/Permission");

/**
 * @route - GET /api/v1/permission
 * @description - Get all permissions.
 * @access - Public
 */
exports.getAllPermissions = async (request, response) => {
	try {
		const permissions = await Permission.find();

		if (!permissions) {
			console.log(
				"[api/v1/permission.js] - getAllPermissions() -> no permissions found."
			);
			return response.status(404).json({
				success: false,
				message: "no permissions found.",
			});
		}

		return response.status(200).json({
			success: true,
			message: "permissions successfully retrieved.",
			permissions,
		});
	} catch (error) {
		console.log(
			`[api/v1/permission.js] - getAllPermissions() -> error: ${error}`
		);
		return response.status(500).json({
			success: false,
			message:
				"an error occured while retrieving all permissions from database.",
			error: error.message,
		});
	}
};

/**
 * @route - POST /api/v1/permission
 * @description - Create a new permission.
 * @access - Public
 */
exports.addPermission = async (request, response) => {
	try {
		const newPermission = new Permission({ ...request.body });

		await newPermission.save();

		return response.status(200).json({
			success: true,
			message: "permission successfully created.",
		});
	} catch (error) {
		console.log(
			`[api/v1/permission.js] - addPermission() -> error: ${error}`
		);
		return response.status(500).json({
			success: false,
			message: `an error occured while creating a new permission.`,
			error: error.message,
		});
	}
};
