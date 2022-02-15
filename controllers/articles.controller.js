const {
  fetchArticleById,
  updateVotesById,
  fetchArticles,
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

exports.getArticles = (req, res, next) => {
  fetchArticles()
    .then((articles) => {
      res.status(200).send(articles);
    })
    .catch((err) => {
      next(err);
    });
};
