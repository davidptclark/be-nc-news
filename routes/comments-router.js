const commentsRouter = require("express").Router();
const {
  deleteCommentById,
  patchVotesByCommentId,
} = require("../controllers/comments.controller.js");

commentsRouter.delete("/:comment_id", deleteCommentById);
commentsRouter.patch("/:comment_id", patchVotesByCommentId);
module.exports = commentsRouter;
