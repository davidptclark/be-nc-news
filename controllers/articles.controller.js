const {
  fetchArticleById,
  updateVotesById,
} = require('../models/articles.model');

exports.getArticleById = (req, res, next) => {
  const { article_id: id } = req.params;
  fetchArticleById(id)
    .then((article) => {
      res.status(200).send({ article: article });
    })
    .catch(next);
};

exports.patchVotesByID = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateVotesById(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article: article });
    })
    .catch(next);
};
