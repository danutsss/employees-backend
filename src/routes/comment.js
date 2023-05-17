const express = require("express");

const Comment = require("../controllers/comment");

const apiRouter = express.Router();

// Get all comments.
apiRouter.get("/", Comment.getAllComments);

// Get comment by id.
apiRouter.get("/:id", Comment.getCommentById);

// Update comment by id.
apiRouter.put("/:id", Comment.updateCommentById);

// Delete comment by id.
apiRouter.delete("/:id", Comment.deleteComment);

// Create comment.
apiRouter.post("/", Comment.createComment);

module.exports = apiRouter;
