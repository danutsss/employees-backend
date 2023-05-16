const mongoose = require("mongoose");

const shiftSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	employeeId: {
		type: mongoose.Schema.Types.ObjectId,
		trim: true,
		ref: "Employee",
	},
	startTime: {
		type: Date,
		required: true,
		trim: true,
	},
	endTime: {
		type: Date,
		required: true,
		trim: true,
	},
	perHour: {
		type: Number,
		required: true,
		trim: true,
	},
	workPlace: {
		type: String,
		required: true,
		trim: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
});

const Shift = mongoose.model("Shift", shiftSchema);
module.exports = { Shift };
