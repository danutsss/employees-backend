const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	employeeId: {
		type: mongoose.Schema.Types.ObjectId,
		trim: true,
		ref: "Employee",
	},
	content: {
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

const Comment = mongoose.model("Comment", commentSchema);
module.exports = { Comment };
