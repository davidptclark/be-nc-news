const db = require('../db/connection');

exports.fetchCommentsByArticleId = async (id) => {
  const { rows: comments } = await db.query(
    'SELECT comment_id, votes, created_at, author, body FROM comments WHERE article_id = $1;',
    [id]
  );

  return comments;
};

exports.addCommentsbyArticleId = async (id, reqBody) => {
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
    const { rows: comment } = await db.query(
      'INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *;',
      [id, username, body]
    );

    return comment;
  }
};

exports.removeCommentById = async (id) => {
  const { rows } = await db.query(
    'DELETE FROM comments WHERE comment_id = $1 RETURNING *;',
    [id]
  );

  if (rows.length === 0) {
    return Promise.reject({ status: 404, msg: 'comment does not exist' });
  }
};
