const { Shift } = require("../models/Shift");

/**
 * @route - GET /api/v1/shifts
 * @desc - get all shifts.
 * @access - Private (admin only)
 */
exports.getAllShifts = async (request, response) => {
	try {
		const shifts = await Shift.find();

		// Check if user is admin.
		const hasPermission =
			request.employee.permissionLevel === "admin" ? true : false;

		if (!hasPermission) {
			console.log(
				`[api/v1/shift.js] - getAllShifts() -> employee ${request.employee.id} does not have permission to view all shifts`
			);
			return response.status(401).json({
				success: false,
				message: "you do not have permission to view all shifts.",
			});
		}

		if (!shifts) {
			console.log(
				"[api/v1/shit.js] - getAllShifts() -> no shifts found."
			);
			return response.status(404).json({
				success: false,
				message: "no shifts found.",
			});
		}

		return response.status(200).json({
			success: true,
			message: "shifts successfully retrieved.",
			shifts,
		});
	} catch (error) {
		console.log(`[api/v1/shift.js] - getAllShifts() -> error: ${error}`);
		return response.status(500).json({
			success: false,
			message:
				"an error occured while retrieving all shifts from database.",
			error: error.message,
		});
	}
};

/**
 * @route - GET /api/v1/shifts/:id
 * @desc - get a shift by id.
 * @access - Public
 */
exports.getShiftById = async (request, response) => {
	try {
		const shiftId = request.params.id;

		const shift = await Shift.findById(id);

		if (!shift) {
			console.log(
				`[api/v1/shift.js] - getShiftById() -> shiftId: ${shiftId} does not exist`
			);
			return response.status(404).json({
				success: false,
				message: `the shift with id: ${shiftId} does not exist.`,
			});
		}

		return response.status(200).json({
			success: true,
			message: `shift with id: ${shiftId} successfully retrieved`,
			shift,
		});
	} catch (error) {
		console.log(`[api/v1/shift.js] - getShiftById() -> error: ${error}`);
		return response.status(500).json({
			success: false,
			message: `an error occured while retrieving shift ${request.params.id} from database.`,
			error: error.message,
		});
	}
};

/**
 * @route - PUT /api/v1/shifts/:id
 * @desc - update a shift by id.
 * @access - Public
 */
exports.updateShiftById = async (request, response) => {
	try {
		const shiftId = request.params.id;
		const newShiftInfo = request.body;

		await Shift.findByIdAndUpdate(
			id,
			{ $set: newShiftInfo },
			{ new: true }
		);

		return response.status(200).json({
			success: true,
			message: `shift with id: ${shiftId} was successfully updated.`,
		});
	} catch (error) {
		console.log(`[api/v1/shift.js] - updateShiftById() -> error: ${error}`);
		return response.status(500).json({
			success: false,
			message: `an error occured while updating the shift ${request.params.id}.`,
			error: error.message,
		});
	}
};

/**
 * @route - DELETE /api/v1/shifts/:id
 * @desc - delete a shift by id.
 * @access - Private (admin only)
 */
exports.deleteShift = async (request, response) => {
	try {
		const shiftId = request.params.id;

		// Check if user is admin.
		const hasPermission =
			request.employee.permissionLevel === "admin" ? true : false;

		if (!hasPermission) {
			console.log(
				`[api/v1/shift.js] - deleteShift() -> employee ${shiftId} does not have permission to delete shift`
			);
			return response.status(401).json({
				success: false,
				message: "you do not have permission to delete shift.",
			});
		}

		// Make sure the shift exists.
		const existingShift = await Shift.findById(shiftId);

		if (!existingShift) {
			console.log(
				"[api/v1/shift.js] - deleteShift() -> shift does not exist."
			);
			return response.status(404).json({
				success: false,
				message: `the shift with ${shiftId} does not exist.`,
			});
		}

		await Shift.findByIdAndDelete(shiftId);

		return response.status(200).json({
			success: true,
			message: `shift with id: ${shiftId} successfully deleted.`,
		});
	} catch (error) {
		console.log(`[api/v1/shift.js] - deleteShift() -> error: ${error}`);
		return response.status(500).json({
			success: false,
			message: `an error occured while deleting the shift ${request.params.id}.`,
			error: error.message,
		});
	}
};

/**
 * @route - POST /api/v1/shifts
 * @desc - create a new shift.
 * @access - Public
 */
exports.addShift = async (request, response) => {
	try {
		const newShift = new Shift({ ...request.body });

		await newShift.save();

		return response.status(200).json({
			success: true,
			message: "shift successfully created.",
		});
	} catch (error) {
		console.log(`[api/v1/shift.js] - addShift() -> error: ${error}`);
		return response.status(500).json({
			success: false,
			message: `an error occured while creating a new shift.`,
			error: error.message,
		});
	}
};
