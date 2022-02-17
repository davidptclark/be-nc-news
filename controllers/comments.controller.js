const {
  fetchCommentsByArticleId,
  addCommentsbyArticleId,
} = require('../models/comments.model');
const { checkArticleExists } = require('../models/articles.model');
const { checkUserExists } = require('../models/users.model');

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id: id } = req.params;
  Promise.all([fetchCommentsByArticleId(id), checkArticleExists(id)])
    .then(([comments]) => {
      res.status(200).send(comments);
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentsByArticleId = (req, res, next) => {
  const { article_id: id } = req.params;
  const { username: user } = req.body;
  const body = req.body;
  Promise.all([
    checkArticleExists(id),
    checkUserExists(user),
    addCommentsbyArticleId(id, body),
  ])
    .then(({ 2: comment }) => {
      res.status(201).send({ comment: comment });
    })
    .catch((err) => {
      next(err);
    });
};
