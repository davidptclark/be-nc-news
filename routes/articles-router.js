const articlesRouter = require('express').Router();
const {
  getArticleById,
  getArticles,
  patchVotesByID,
} = require('../controllers/articles.controller.js');

const {
  getCommentsByArticleId,
  postCommentsByArticleId,
} = require('../controllers/comments.controller.js');

articlesRouter.get('/', getArticles);

articlesRouter.route('/:article_id').get(getArticleById).patch(patchVotesByID);

articlesRouter
  .route('/:article_id/comments')
  .get(getCommentsByArticleId)
  .post(postCommentsByArticleId);

module.exports = articlesRouter;
