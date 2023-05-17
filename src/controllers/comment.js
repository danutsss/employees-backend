const { Comment } = require("../models/Comment");

/**
 * @route - GET /api/v1/comment
 * @desc - get all comments.
 * @access - Private (admin only)
 */
exports.getAllComments = async (request, response) => {
	try {
		const comments = Comment.find();

		// Check if user is admin.
		const hasPermission =
			request.employee.permissionLevel === "admin" ? true : false;

		if (!hasPermission) {
			console.log(
				`[api/v1/comment.js] - getAllComments() -> employee ${request.employee.id} does not have permission to view all comments`
			);
			return response.status(401).json({
				success: false,
				message: "you do not have permission to view all comments.",
			});
		}

		if (!comments) {
			console.log(
				"[api/v1/comment.js] - getAllComments() -> no comments found."
			);
			return response.status(404).json({
				success: false,
				message: "no comments found.",
			});
		}

		return response.status(200).json({
			success: true,
			message: "comments successfully retrieved.",
			comments,
		});
	} catch (error) {
		console.log(
			`[api/v1/comment.js] - getAllComments() -> error: ${error}`
		);
		return response.status(500).json({
			success: false,
			message:
				"an error occured while retrieving all comments from database.",
			error: error.message,
		});
	}
};

/**
 * @route - GET /api/v1/comment/:id
 * @desc - get comment by id.
 * @access - Public
 */
exports.getCommentById = async (request, response) => {
	try {
		const commentId = request.params.id;
		const comment = await Comment.findById(commentId);

		if (!comment) {
			console.log(
				`[api/v1/comment.js] - getCommentById() -> commentId: ${commentId} does not exist`
			);
			return response.status(404).json({
				success: false,
				message: `the comment with id: ${commentId} does not exist.`,
			});
		}

		return response.status(200).json({
			success: true,
			message: `comment with id: ${commentId} successfully retrieved`,
			comment,
		});
	} catch (error) {
		console.log(
			`[api/v1/comment.js] - getCommentById() -> error: ${error}`
		);
		return response.status(500).json({
			success: false,
			message: `an error occured while retrieving comment ${request.params.id} from database.`,
			error: error.message,
		});
	}
};

/**
 * @route - POST /api/v1/comment
 * @desc - create a new comment.
 * @access - Public
 */
exports.createComment = async (request, response) => {
	try {
		const newComment = new Comment({ ...request.body });

		await newComment.save();

		return response.status(200).json({
			success: true,
			message: "comment successfully created",
		});
	} catch (error) {
		console.log(`[api/v1/comment.js] - createComment() -> error: ${error}`);
		return response.status(500).json({
			success: false,
			message: `an error occured while creating a new comment.`,
			error: error.message,
		});
	}
};

/**
 * @route - PUT /api/v1/comment/:id
 * @desc - update comment by id.
 * @access - Public
 */
exports.updateCommentById = async (request, response) => {
	try {
		const commentId = request.params.id;
		const newCommentInfo = request.body;

		await Comment.findByIdAndUpdate(
			commentId,
			{ $set: newCommentInfo },
			{ new: true }
		);

		return response.status(200).json({
			success: true,
			message: `comment with id: ${commentId} was successfully updated.`,
		});
	} catch (error) {
		console.log(
			`[api/v1/comment.js] - updateCommentById() -> error: ${error}`
		);
		return response.status(500).json({
			success: false,
			message: `an error occured while updating the comment ${request.params.id}.`,
			error: error.message,
		});
	}
};

/**
 * @route - DELETE /api/v1/comment/:id
 * @desc - delete comment by id.
 * @access - Private (admin only)
 */
exports.deleteComment = async (request, response) => {
	try {
		const commentId = request.params.id;

		// Check if user is admin.
		const hasPermission =
			request.employee.permissionLevel === "admin" ? true : false;

		if (!hasPermission) {
			console.log(
				`[api/v1/comment.js] - getAllComments() -> employee ${request.employee.id} does not have permission to view all comments`
			);
			return response.status(401).json({
				success: false,
				message: "you do not have permission to view all comments.",
			});
		}

		// Make sure the comment exists.
		const existingComment = await Comment.findById(commentId);

		if (!existingComment) {
			console.log(
				"[api/v1/comment.js] - deleteComment() -> comment does not exist."
			);
			return response.status(404).json({
				success: false,
				message: `the comment with ${commentId} does not exist.`,
			});
		}

		await Comment.findByIdAndDelete(commentId);

		return response.status(200).json({
			success: true,
			message: `comment with id: ${commentId} successfully deleted.`,
		});
	} catch (error) {
		console.log(`[api/v1/comment.js] - deleteComment() -> error: ${error}`);
		return response.status(500).json({
			success: false,
			message: `an error occured while deleting the comment ${request.params.id}.`,
			error: error.message,
		});
	}
};

/**
 * @route - GET /api/v1/comment/user/:id
 * @desc - get all comments by user id.
 * @access - Public
 */
exports.getAllEmployeeComments = async (request, response) => {
	try {
		const employeeId = request.params.id;
		const comments = await Comment.find({ employeeId });

		if (!comments) {
			console.log(
				"[api/v1/comment.js] - getAllEmployeeComments() -> no comments found."
			);
			return response.status(404).json({
				success: false,
				message: "no comments found.",
			});
		}

		return response.status(200).json({
			success: true,
			message: "comments successfully retrieved.",
			comments,
		});
	} catch (error) {
		console.log(
			`[api/v1/comment.js] - getAllEmployeeComments() -> error: ${error}`
		);
		return response.status(500).json({
			success: false,
			message: `an error occured while retrieving all comments from database.`,
			error: error.message,
		});
	}
};
