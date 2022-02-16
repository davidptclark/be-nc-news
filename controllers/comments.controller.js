const { fetchCommentsByArticleId } = require('../models/comments.model');
const { checkArticleExists } = require('../models/articles.model');

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
