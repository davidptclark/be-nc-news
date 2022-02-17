const db = require('../db/connection');

exports.fetchCommentsByArticleId = (id) => {
  return db
    .query(
      'SELECT comment_id, votes, created_at, author, body FROM comments WHERE article_id = $1;',
      [id]
    )
    .then(({ rows: comments }) => {
      return comments;
    });
};

exports.addCommentsbyArticleId = (id, reqBody) => {
  const { username, body } = reqBody;
  const reqKeys = Object.keys(reqBody);
  //check if object keys are well-formed
  if (reqKeys.length < 2) {
    return Promise.reject({
      status: 400,
      msg: 'missing fields in request',
    });
  } else if (!reqKeys.includes('username') || !reqKeys.includes('body')) {
    return Promise.reject({
      status: 400,
      msg: 'invalid key',
    });
  } else {
    return db
      .query(
        'INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *;',
        [id, username, body]
      )
      .then(({ rows: comment }) => {
        return comment;
      });
  }
};
