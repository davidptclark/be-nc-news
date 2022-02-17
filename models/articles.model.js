const db = require('../db/connection');

exports.fetchArticleById = (id) => {
  return db
    .query(
      'SELECT articles.*, COUNT(comments) AS comment_count FROM comments LEFT JOIN articles ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;',
      [id]
    )
    .then(({ rows: article }) => {
      if (article.length === 0) {
        return Promise.reject({ status: 404, msg: 'article not found' });
      }
      return article[0];
    });
};

exports.updateVotesById = (id, votes) => {
  return db
    .query(
      'UPDATE articles SET votes = votes + $2 WHERE article_id = $1 RETURNING *;',
      [id, votes]
    )
    .then(({ rows: article }) => {
      if (article.length === 0) {
        return Promise.reject({ status: 404, msg: 'article not found' });
      }
      return article[0];
    });
};

exports.fetchArticles = () => {
  return db
    .query(
      // right join needed to include articles that have no comments with count of 0
      'SELECT articles.*, COUNT(comments) AS comment_count FROM comments RIGHT JOIN articles ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY created_at DESC;'
    )
    .then(({ rows: articles }) => {
      return articles;
    });
};

exports.checkArticleExists = (id) => {
  return db
    .query('SELECT * FROM articles WHERE article_id = $1;', [id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: 'article not found' });
      }
    });
};
