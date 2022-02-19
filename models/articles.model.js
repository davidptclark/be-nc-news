const db = require('../db/connection');

exports.fetchArticleById = async (id) => {
  const { rows: article } = await db.query(
    'SELECT articles.*, COUNT(comments) AS comment_count FROM comments LEFT JOIN articles ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;',
    [id]
  );

  if (article.length === 0) {
    return Promise.reject({ status: 404, msg: 'article not found' });
  }

  return article[0];
};

exports.updateVotesById = async (id, votes) => {
  const { rows: article } = await db.query(
    'UPDATE articles SET votes = votes + $2 WHERE article_id = $1 RETURNING *;',
    [id, votes]
  );

  if (article.length === 0) {
    return Promise.reject({ status: 404, msg: 'article not found' });
  }

  return article[0];
};

exports.fetchArticles = async (
  sort_by = 'created_at',
  order = 'desc',
  topic
) => {
  //Checking green list conformity
  const validSortBys = [
    'article_id',
    'title',
    'author',
    'body',
    'created_at',
    'votes',
  ];

  const validOrders = ['asc', 'desc'];

  if (!validSortBys.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: 'invalid sort query' });
  }

  if (!validOrders.includes(order)) {
    return Promise.reject({ status: 400, msg: 'invalid order query' });
  }

  let queryStr = `SELECT articles.*, COUNT(comments) AS comment_count FROM comments RIGHT JOIN articles ON articles.article_id = comments.article_id `; // right join needed to include articles that have no comments with count of 0

  const queryValues = [];
  //Checking to see if topic exists if passed by user
  if (topic) {
    const { rows: topics } = await db.query(
      'SELECT * FROM topics WHERE slug = $1;',
      [topic]
    );

    if (topics.length === 0) {
      return Promise.reject({ status: 404, msg: 'topic not found' });
    }

    queryStr += `WHERE topic = $1 `;
    queryValues.push(topic);
  }

  queryStr += `GROUP BY articles.article_id ORDER BY ${sort_by} ${order};`;
  const { rows: articles } = await db.query(queryStr, queryValues);
  return articles;
};

exports.checkArticleExists = async (id) => {
  const { rows } = await db.query(
    'SELECT * FROM articles WHERE article_id = $1;',
    [id]
  );

  if (rows.length === 0) {
    return Promise.reject({ status: 404, msg: 'article not found' });
  }
};
